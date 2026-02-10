#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Validate Obsidian docs conventions.

- Target: docs/**/*.md (excluding README.md / TEMPLATE.md)
- Checks:
  * YAML frontmatter exists and required keys are present
  * filename == id
  * up/related links refer to existing IDs
  * up links can be traversed in Backlink direction (reverse index)
  * banned body sections: "## 上位文書" / "## 下位文書" / "## 関連文書" (relations must live in frontmatter)
  * banned files under docs/: README.md / TEMPLATE.md

Usage:
  python validate_vault.py --docs-root docs --report reports/doc_check.md
"""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Tuple

import yaml


REQUIRED_KEYS = [
    "id",
    "title",
    "doc_type",
    "phase",
    "version",
    "status",
    "owner",
    "created",
    "updated",
    "up",
    "related",
    "tags",
]


LINK_RE = re.compile(r"\[\[([^\]]+)\]\]")


def extract_links(value: Any) -> List[str]:
    """Extract Obsidian link targets (IDs) from a YAML value."""
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
    # Obsidian links may include aliases like "ID|alias" or headings "ID#h2"
    if "|" in doc_id:
        doc_id = doc_id.split("|", 1)[0]
    if "#" in doc_id:
        doc_id = doc_id.split("#", 1)[0]
    return doc_id.strip()


@dataclass
class Doc:
    path: Path
    frontmatter: Dict[str, Any]
    body: str

    @property
    def id(self) -> str:
        return str(self.frontmatter.get("id", "")).strip()


def split_frontmatter(text: str) -> Tuple[Dict[str, Any], str, List[str]]:
    """Return (frontmatter_dict, body_text, errors)."""
    errors: List[str] = []
    if not text.startswith("---\n"):
        return ({}, text, ["frontmatter: missing opening ---"])
    # find closing ---
    end = text.find("\n---\n", 4)
    if end == -1:
        return ({}, text, ["frontmatter: missing closing ---"])
    fm_text = text[4:end]
    body = text[end + len("\n---\n") :]
    try:
        data = yaml.safe_load(fm_text) or {}
        if not isinstance(data, dict):
            return ({}, body, ["frontmatter: YAML is not a mapping"])
        return (data, body, [])
    except Exception as e:
        return ({}, body, [f"frontmatter: YAML parse error: {e}"])


def dump_frontmatter(data: Dict[str, Any]) -> str:
    # Keep key order; don't sort.
    return yaml.safe_dump(data, allow_unicode=True, sort_keys=False).strip() + "\n"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--docs-root", default="docs", help="docs root directory (default: docs)")
    ap.add_argument("--report", default="", help="write markdown report to this path (optional)")
    args = ap.parse_args()

    root = Path(".").resolve()
    docs_root = (root / args.docs_root).resolve()

    md_files = [
        p
        for p in docs_root.rglob("*.md")
        if p.name not in {"README.md", "TEMPLATE.md"}
    ]

    # Forbidden files under docs/**
    forbidden_files = list(docs_root.rglob("README.md")) + list(docs_root.rglob("TEMPLATE.md"))

    docs: List[Doc] = []
    parse_errors: List[str] = []

    for p in sorted(md_files):
        text = p.read_text(encoding="utf-8")
        fm, body, errs = split_frontmatter(text)
        if errs:
            parse_errors.append(f"- {p}: " + "; ".join(errs))
        docs.append(Doc(path=p, frontmatter=fm, body=body))

    id_to_doc: Dict[str, Doc] = {}
    for d in docs:
        if d.id:
            id_to_doc[d.id] = d

    # Checks
    issues: List[str] = []
    broken_links: List[str] = []
    backlink_issues: List[str] = []

    # Forbidden files are treated as issues.
    for p in forbidden_files:
        issues.append(f"- {p}: forbidden file under docs/ (README.md / TEMPLATE.md are not allowed)")

    date_re = re.compile(r"^\d{4}-\d{2}-\d{2}$")

    for d in docs:
        # Only validate docs that look like ID-based docs
        # (Exclude files without id in frontmatter)
        if not d.id:
            continue

        # filename == id
        if d.path.stem != d.id:
            issues.append(f"- {d.path}: filename '{d.path.stem}' != id '{d.id}'")

        # required keys
        for k in REQUIRED_KEYS:
            if k not in d.frontmatter:
                issues.append(f"- {d.path}: missing key '{k}'")

        # date format
        for k in ["created", "updated"]:
            v = d.frontmatter.get(k)
            if isinstance(v, str) and v and not date_re.match(v.strip()):
                issues.append(f"- {d.path}: '{k}' is not YYYY-MM-DD: {v}")

        # history section
        if "## 変更履歴" not in d.body:
            issues.append(f"- {d.path}: missing '## 変更履歴' section")

        # banned relation sections in body
        for banned in ["## 上位文書", "## 下位文書", "## 関連文書"]:
            if banned in d.body:
                issues.append(f"- {d.path}: contains banned section '{banned}' (use frontmatter up/related)")

        # link existence
        for rel_key in ["up", "related"]:
            targets = [normalize_link_id(t) for t in extract_links(d.frontmatter.get(rel_key))]
            for t in targets:
                if not t:
                    continue
                if t not in id_to_doc:
                    broken_links.append(f"- {d.id}: {rel_key} -> [[{t}]] (NOT FOUND)")

    # Backlink check: every A.up -> P must be visible as reverse-up backlink at P.
    reverse_up: Dict[str, List[str]] = {doc_id: [] for doc_id in id_to_doc}
    for d in docs:
        if not d.id:
            continue
        d_up = [normalize_link_id(t) for t in extract_links(d.frontmatter.get("up"))]
        for p_id in d_up:
            if p_id in id_to_doc:
                reverse_up[p_id].append(d.id)

    for p_id, children in reverse_up.items():
        if p_id not in id_to_doc:
            continue
        for child_id in children:
            if child_id not in id_to_doc:
                backlink_issues.append(f"- backlink: {p_id} has reverse-up from {child_id}, but child is missing")

    # Build report
    lines: List[str] = []
    lines.append("# Doc Check Report")
    lines.append("")
    lines.append(f"- docs_root: `{args.docs_root}`")
    lines.append(f"- total_markdown: {len(md_files)}")
    lines.append(f"- id_docs: {len([d for d in docs if d.id])}")
    lines.append(f"- parse_errors: {len(parse_errors)}")
    lines.append(f"- issues: {len(issues)}")
    lines.append(f"- broken_links: {len(broken_links)}")
    lines.append(f"- backlink_issues: {len(backlink_issues)}")
    lines.append("")

    if parse_errors:
        lines.append("## Parse errors")
        lines.extend(parse_errors)
        lines.append("")

    if issues:
        lines.append("## Issues")
        lines.extend(issues)
        lines.append("")

    if broken_links:
        lines.append("## Broken links (frontmatter)")
        lines.extend(broken_links)
        lines.append("")

    if backlink_issues:
        lines.append("## Backlink issues (reverse up)")
        lines.extend(backlink_issues)
        lines.append("")

    report_text = "\n".join(lines).rstrip() + "\n"

    if args.report:
        report_path = (root / args.report).resolve()
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(report_text, encoding="utf-8")

    print(report_text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
