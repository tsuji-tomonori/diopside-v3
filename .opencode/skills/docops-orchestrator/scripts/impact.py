#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Impact analysis for Obsidian vault docs.

- Target: docs/**/*.md
- Source of truth: YAML frontmatter `up/related` (Obsidian links)

Examples:
  python impact.py --ids RQ-FR-004 --direction both --max-depth 3
  python impact.py --ids RQ-SC-001,RQ-PP-001 --direction down --format md --out reports/impact.md
"""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Set, Tuple

import yaml

LINK_RE = re.compile(r"\[\[([^\]]+)\]\]")


def extract_links(value: Any) -> List[str]:
    out: List[str] = []
    if value is None:
        return out
    if isinstance(value, list):
        for item in value:
            out.extend(extract_links(item))
        return out
    if isinstance(value, str):
        for m in LINK_RE.finditer(value):
            out.append(m.group(1).strip())
        return out
    return out


def normalize_link_id(doc_id: str) -> str:
    # Allow aliases like "ID|alias" or headings "ID#h2"
    if "|" in doc_id:
        doc_id = doc_id.split("|", 1)[0]
    if "#" in doc_id:
        doc_id = doc_id.split("#", 1)[0]
    return doc_id.strip()


def split_frontmatter(text: str) -> Tuple[Dict[str, Any], str]:
    if not text.startswith("---\n"):
        return ({}, text)
    end = text.find("\n---\n", 4)
    if end == -1:
        return ({}, text)
    fm_text = text[4:end]
    body = text[end + len("\n---\n") :]
    try:
        data = yaml.safe_load(fm_text) or {}
        if not isinstance(data, dict):
            data = {}
    except Exception:
        data = {}
    return (data, body)


@dataclass
class Doc:
    id: str
    path: Path
    fm: Dict[str, Any]

    def rel_ids(self, key: str) -> List[str]:
        return [normalize_link_id(x) for x in extract_links(self.fm.get(key))]


def load_docs(docs_root: Path) -> Dict[str, Doc]:
    id_to_doc: Dict[str, Doc] = {}
    for p in sorted(docs_root.rglob("*.md")):
        text = p.read_text(encoding="utf-8")
        fm, _ = split_frontmatter(text)
        doc_id = str(fm.get("id", "")).strip()
        if not doc_id:
            continue
        id_to_doc[doc_id] = Doc(id=doc_id, path=p, fm=fm)
    return id_to_doc


def traverse(
    id_to_doc: Dict[str, Doc],
    start_ids: List[str],
    direction: str,
    max_depth: int,
) -> List[Tuple[int, str]]:
    """Return list of (depth, doc_id) excluding start nodes? include? We'll include start at depth 0."""

    reverse_up: Dict[str, Set[str]] = {doc_id: set() for doc_id in id_to_doc}
    for child_id, doc in id_to_doc.items():
        for parent_id in doc.rel_ids("up"):
            if parent_id in reverse_up:
                reverse_up[parent_id].add(child_id)

    q: List[Tuple[int, str]] = [(0, s) for s in start_ids]
    seen: Set[str] = set()
    out: List[Tuple[int, str]] = []

    while q:
        depth, cur = q.pop(0)
        if cur in seen:
            continue
        seen.add(cur)
        out.append((depth, cur))
        if depth >= max_depth:
            continue
        doc = id_to_doc.get(cur)
        if not doc:
            continue

        nxt: List[str] = []
        if direction in {"up", "both"}:
            nxt.extend(doc.rel_ids("up"))
        if direction in {"down", "both"}:
            nxt.extend(sorted(reverse_up.get(cur, set())))
        if direction in {"related", "both"}:
            # related is treated as same-depth neighbors
            nxt.extend(doc.rel_ids("related"))

        for n in nxt:
            if n and n not in seen:
                q.append((depth + 1, n))

    return out


def render_md(rows: List[Tuple[int, str]], id_to_doc: Dict[str, Doc], title: str) -> str:
    lines: List[str] = [f"# {title}", "", "|Depth|ID|Path|", "|---:|---|---|"]
    for depth, doc_id in rows:
        doc = id_to_doc.get(doc_id)
        p = doc.path.as_posix() if doc else "(NOT FOUND)"
        lines.append(f"|{depth}|{doc_id}|`{p}`|")
    return "\n".join(lines) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--docs-root", default="docs")
    ap.add_argument("--ids", required=True, help="comma-separated doc IDs")
    ap.add_argument(
        "--direction",
        default="both",
        choices=["up", "down", "related", "both"],
        help="traverse direction",
    )
    ap.add_argument("--max-depth", type=int, default=2)
    ap.add_argument("--format", default="md", choices=["md", "json"])
    ap.add_argument("--out", default="")
    args = ap.parse_args()

    root = Path(".").resolve()
    docs_root = (root / args.docs_root).resolve()
    id_to_doc = load_docs(docs_root)

    start = [s.strip() for s in args.ids.split(",") if s.strip()]
    rows = traverse(id_to_doc, start, args.direction, args.max_depth)

    if args.format == "json":
        import json

        payload = [
            {
                "depth": depth,
                "id": doc_id,
                "path": id_to_doc[doc_id].path.as_posix() if doc_id in id_to_doc else None,
            }
            for depth, doc_id in rows
        ]
        text = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    else:
        title = f"Impact Report ({args.direction}, depth<= {args.max_depth})"
        text = render_md(rows, id_to_doc, title)

    if args.out:
        out_path = (root / args.out).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(text, encoding="utf-8")

    print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
