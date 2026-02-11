#!/usr/bin/env python3
"""Generate static RTM views for Quartz.

This script reads docs markdown files, parses frontmatter/body links, and
updates the following documents with static tables:

- docs/1.要求(RQ)/71.要求トレーサビリティマトリックス(RTM)/RQ-RTM-001.md
  (requirement-centric view)
- docs/1.要求(RQ)/71.要求トレーサビリティマトリックス(RTM)/RQ-RTM-002.md
  (design-centric view)
"""

from __future__ import annotations

import argparse
import datetime as dt
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml

LINK_RE = re.compile(r"\[\[([^\]]+)\]\]")

REQ_BEGIN = "<!-- BEGIN AUTO-GENERATED: REQUIREMENT_VIEW -->"
REQ_END = "<!-- END AUTO-GENERATED: REQUIREMENT_VIEW -->"
DES_BEGIN = "<!-- BEGIN AUTO-GENERATED: DESIGN_VIEW -->"
DES_END = "<!-- END AUTO-GENERATED: DESIGN_VIEW -->"


@dataclass
class Doc:
    doc_id: str
    title: str
    phase: str
    path: Path
    up: set[str]
    related: set[str]
    body_links: set[str]


def normalize_link_id(raw: str) -> str:
    value = raw.strip()
    if "|" in value:
        value = value.split("|", 1)[0]
    if "#" in value:
        value = value.split("#", 1)[0]
    return value.strip()


def extract_links(value: Any) -> set[str]:
    out: set[str] = set()
    if value is None:
        return out
    if isinstance(value, list):
        for item in value:
            out |= extract_links(item)
        return out
    if isinstance(value, str):
        for m in LINK_RE.finditer(value):
            norm = normalize_link_id(m.group(1))
            if norm:
                out.add(norm)
    return out


def split_frontmatter(text: str) -> tuple[dict[str, Any], str]:
    if not text.startswith("---\n"):
        return ({}, text)
    end = text.find("\n---\n", 4)
    if end == -1:
        return ({}, text)
    fm_text = text[4:end]
    body = text[end + len("\n---\n") :]
    try:
        data = yaml.safe_load(fm_text) or {}
        if isinstance(data, dict):
            return (data, body)
    except Exception:
        pass
    return ({}, body)


def load_docs(docs_root: Path) -> dict[str, Doc]:
    docs: dict[str, Doc] = {}
    for path in docs_root.rglob("*.md"):
        if path.name in {"README.md", "TEMPLATE.md"}:
            continue
        text = path.read_text(encoding="utf-8")
        fm, body = split_frontmatter(text)
        doc_id = str(fm.get("id", "")).strip()
        if not doc_id:
            continue
        up = extract_links(fm.get("up"))
        related = extract_links(fm.get("related"))
        body_links = extract_links(body)
        docs[doc_id] = Doc(
            doc_id=doc_id,
            title=str(fm.get("title", "")).strip(),
            phase=str(fm.get("phase", "")).strip(),
            path=path,
            up=up,
            related=related,
            body_links=body_links,
        )
    return docs


def is_rq(doc_id: str) -> bool:
    return doc_id.startswith("RQ-")


def is_fr_nfr_requirement(doc: Doc) -> bool:
    path = str(doc.path)
    return "/51.機能要求(FR)/" in path or "/61.非機能要求(NFR)/" in path


def is_rdr(doc_id: str) -> bool:
    return doc_id.startswith("RQ-RDR-")


def is_adr(doc_id: str) -> bool:
    return doc_id.startswith("BD-ADR-")


def is_design(doc_id: str) -> bool:
    return doc_id.startswith("BD-") or doc_id.startswith("DD-")


def is_test(doc_id: str) -> bool:
    return doc_id.startswith("UT-") or doc_id.startswith("IT-") or doc_id.startswith("AT-")


def has_edge(src: Doc, dst_id: str) -> bool:
    return dst_id in src.up or dst_id in src.related or dst_id in src.body_links


def linked_docs(target_id: str, docs: dict[str, Doc], pred) -> list[str]:
    out: set[str] = set()
    target = docs.get(target_id)
    if target is None:
        return []

    # outbound from target
    for linked in target.up | target.related | target.body_links:
        if linked in docs and pred(linked):
            out.add(linked)

    # inbound to target
    for doc_id, doc in docs.items():
        if doc_id == target_id:
            continue
        if pred(doc_id) and has_edge(doc, target_id):
            out.add(doc_id)

    return sorted(out)


def fmt_links(ids: list[str]) -> str:
    if not ids:
        return "-"
    return ", ".join(f"[[{doc_id}]]" for doc_id in ids)


def replace_block(text: str, begin: str, end: str, body: str) -> str:
    pattern = re.compile(re.escape(begin) + r".*?" + re.escape(end), re.S)
    replacement = f"{begin}\n{body}\n{end}"
    if pattern.search(text):
        return pattern.sub(replacement, text)
    if text.endswith("\n"):
        return text + "\n" + replacement + "\n"
    return text + "\n\n" + replacement + "\n"


def build_requirement_table(docs: dict[str, Doc]) -> str:
    lines: list[str] = []
    lines.append(f"- generated_at: {dt.date.today().isoformat()}")
    lines.append("")
    lines.append("| 要求ID(FR/NFR) | タイトル | RDR | ADR | 設計(BD/DD) | 検証(UT/IT/AT) |")
    lines.append("| --- | --- | --- | --- | --- | --- |")
    target_ids = [doc.doc_id for doc in docs.values() if is_rq(doc.doc_id) and is_fr_nfr_requirement(doc)]
    for doc_id in sorted(target_ids):
        d = docs[doc_id]
        rdr = linked_docs(doc_id, docs, is_rdr)
        adr = linked_docs(doc_id, docs, is_adr)
        design = linked_docs(doc_id, docs, is_design)
        tests = linked_docs(doc_id, docs, is_test)
        title = d.title.replace("|", "\\|") if d.title else "-"
        lines.append(
            "| [["
            + doc_id
            + "]]"
            + " | "
            + title
            + " | "
            + fmt_links(rdr)
            + " | "
            + fmt_links(adr)
            + " | "
            + fmt_links(design)
            + " | "
            + fmt_links(tests)
            + " |"
        )
    return "\n".join(lines)


def build_design_table(docs: dict[str, Doc]) -> str:
    lines: list[str] = []
    lines.append(f"- generated_at: {dt.date.today().isoformat()}")
    lines.append("")
    lines.append("| 設計ID | タイトル | 根拠要件(FR/NFR) | RDR | ADR | 検証(UT/IT/AT) |")
    lines.append("| --- | --- | --- | --- | --- | --- |")
    for doc_id in sorted([d for d in docs if is_design(d)]):
        d = docs[doc_id]
        rq = linked_docs(doc_id, docs, lambda x: is_rq(x) and is_fr_nfr_requirement(docs[x]))
        rdr = linked_docs(doc_id, docs, is_rdr)
        adr = linked_docs(doc_id, docs, is_adr)
        tests = linked_docs(doc_id, docs, is_test)
        title = d.title.replace("|", "\\|") if d.title else "-"
        lines.append(
            "| [["
            + doc_id
            + "]]"
            + " | "
            + title
            + " | "
            + fmt_links(rq)
            + " | "
            + fmt_links(rdr)
            + " | "
            + fmt_links(adr)
            + " | "
            + fmt_links(tests)
            + " |"
        )
    return "\n".join(lines)


def update_rtm_file(path: Path, begin: str, end: str, table: str) -> None:
    text = path.read_text(encoding="utf-8")
    next_text = replace_block(text, begin, end, table)
    if next_text != text:
        path.write_text(next_text, encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--docs-root", default="docs")
    ap.add_argument(
        "--rtm-rq-path",
        default="docs/1.要求(RQ)/71.要求トレーサビリティマトリックス(RTM)/RQ-RTM-001.md",
    )
    ap.add_argument(
        "--rtm-design-path",
        default="docs/1.要求(RQ)/71.要求トレーサビリティマトリックス(RTM)/RQ-RTM-002.md",
    )
    args = ap.parse_args()

    root = Path(".").resolve()
    docs = load_docs((root / args.docs_root).resolve())

    req_table = build_requirement_table(docs)
    des_table = build_design_table(docs)

    update_rtm_file((root / args.rtm_rq_path).resolve(), REQ_BEGIN, REQ_END, req_table)
    update_rtm_file((root / args.rtm_design_path).resolve(), DES_BEGIN, DES_END, des_table)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
