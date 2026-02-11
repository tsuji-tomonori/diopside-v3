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
SNAKE_CASE_RE = re.compile(r"^[a-z][a-z0-9_]*$")
DOC_ID_CODE_REF_RE = re.compile(r"（`[A-Z]{2}-[A-Z]{2,4}-[0-9]{3}`）")
DOC_ID_RE = re.compile(r"\b(?:RQ|BD|DD|UT|IT|AT)-[A-Z]{2,8}-\d{3}\b")
BACKTICKED_WIKI_LINK_RE = re.compile(r"`\[\[([^\]]+)\]\]`")
CONCRETE_DOC_ID_RE = re.compile(r"^(?:RQ|BD|DD|UT|IT|AT)-[A-Z]{2,8}-\d{3}$")
WIKI_LINK_RE = re.compile(r"\[\[[^\]]+\]\]")
INLINE_CODE_RE = re.compile(r"`[^`\n]+`")
DOC_ID_ALLOWLIST_LINE_RE = [
    re.compile(r"\b要求ID\s*:\s*", re.IGNORECASE),
    re.compile(r"\b用語ID\s*[:|]\s*", re.IGNORECASE),
]


def _merge_spans(spans: List[Tuple[int, int]]) -> List[Tuple[int, int]]:
    if not spans:
        return []
    spans = sorted(spans)
    merged: List[Tuple[int, int]] = [spans[0]]
    for s, e in spans[1:]:
        ms, me = merged[-1]
        if s <= me:
            merged[-1] = (ms, max(me, e))
        else:
            merged.append((s, e))
    return merged


def _in_spans(start: int, end: int, spans: List[Tuple[int, int]]) -> bool:
    for s, e in spans:
        if s <= start and end <= e:
            return True
    return False


def _line_allows_unlinked_ids(line: str) -> bool:
    for pat in DOC_ID_ALLOWLIST_LINE_RE:
        if pat.search(line):
            return True
    return False


def find_nonlinked_doc_ids(body: str, self_id: str) -> List[Tuple[int, str, str]]:
    """Find non-linked document IDs in body text.

    Returns list of (line_number, doc_id, line_text).
    """
    out: List[Tuple[int, str, str]] = []
    in_fence = False
    lines = body.splitlines()

    for line_no, line in enumerate(lines, start=1):
        stripped = line.strip()

        if stripped.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue

        if _line_allows_unlinked_ids(line):
            continue

        protected_spans = _merge_spans(
            [m.span() for m in WIKI_LINK_RE.finditer(line)]
            + [m.span() for m in INLINE_CODE_RE.finditer(line)]
        )

        for m in DOC_ID_RE.finditer(line):
            doc_id = m.group(0)
            if doc_id == self_id:
                continue
            s, e = m.span()
            if _in_spans(s, e, protected_spans):
                continue
            out.append((line_no, doc_id, line.rstrip()))

    return out


def find_backticked_concrete_wikilinks(body: str) -> List[Tuple[int, str, str]]:
    """Find concrete Obsidian links wrapped in inline code.

    Returns list of (line_number, doc_id, line_text).
    """
    out: List[Tuple[int, str, str]] = []
    in_fence = False
    lines = body.splitlines()

    for line_no, line in enumerate(lines, start=1):
        stripped = line.strip()

        if stripped.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue

        for m in BACKTICKED_WIKI_LINK_RE.finditer(line):
            target = normalize_link_id(m.group(1))
            if CONCRETE_DOC_ID_RE.fullmatch(target):
                out.append((line_no, target, line.rstrip()))

    return out


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
    ap.add_argument(
        "--targets",
        nargs="*",
        default=[],
        help="validate only these markdown files (workspace-relative paths)",
    )
    args = ap.parse_args()

    root = Path(".").resolve()
    docs_root = (root / args.docs_root).resolve()
    target_paths = {(root / p).resolve() for p in args.targets}

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
    nonlinked_doc_ids: List[str] = []

    # Forbidden files are treated as issues.
    for p in forbidden_files:
        issues.append(f"- {p}: forbidden file under docs/ (README.md / TEMPLATE.md are not allowed)")

    date_re = re.compile(r"^\d{4}-\d{2}-\d{2}$")

    def in_scope(doc_path: Path) -> bool:
        if not target_paths:
            return True
        return doc_path.resolve() in target_paths

    for d in docs:
        # Only validate docs that look like ID-based docs
        # (Exclude files without id in frontmatter)
        if not d.id:
            continue
        if not in_scope(d.path):
            continue

        # filename == id
        if d.path.stem != d.id:
            issues.append(f"- {d.path}: filename '{d.path.stem}' != id '{d.id}'")

        # required keys
        for k in REQUIRED_KEYS:
            if k not in d.frontmatter:
                issues.append(f"- {d.path}: missing key '{k}'")

        # glossary-specific key
        if d.id.startswith("RQ-GL-"):
            term_en = d.frontmatter.get("term_en")
            if term_en is None or str(term_en).strip() == "":
                issues.append(f"- {d.path}: missing key 'term_en' for glossary doc")
            else:
                term_en_str = str(term_en).strip()
                if not SNAKE_CASE_RE.match(term_en_str):
                    issues.append(
                        f"- {d.path}: 'term_en' must be ASCII snake_case: {term_en_str}"
                    )

        # date format
        for k in ["created", "updated"]:
            v = d.frontmatter.get(k)
            if isinstance(v, str) and v and not date_re.match(v.strip()):
                issues.append(f"- {d.path}: '{k}' is not YYYY-MM-DD: {v}")

        # history section
        if "## 変更履歴" not in d.body:
            issues.append(f"- {d.path}: missing '## 変更履歴' section")

        # document ID references in body should be Obsidian links
        if DOC_ID_CODE_REF_RE.search(d.body):
            issues.append(
                f"- {d.path}: document ID reference in code style found (use [[ID]] instead of （`ID`）)"
            )

        for line_no, doc_id, line in find_backticked_concrete_wikilinks(d.body):
            issues.append(
                f"- {d.path}:{line_no}: concrete Obsidian link must not be code-styled (use [[{doc_id}]]) | {line}"
            )

        # document ID references should not remain plain text in body
        for line_no, doc_id, line in find_nonlinked_doc_ids(d.body, d.id):
            nonlinked_doc_ids.append(
                f"- {d.path}:{line_no}: plain document ID '{doc_id}' must be linked as [[{doc_id}]] | {line}"
            )

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
    lines.append(f"- nonlinked_doc_ids: {len(nonlinked_doc_ids)}")
    lines.append(f"- broken_links: {len(broken_links)}")
    lines.append(f"- backlink_issues: {len(backlink_issues)}")
    if target_paths:
        lines.append(f"- target_files: {len(target_paths)}")
    lines.append("")

    if parse_errors:
        lines.append("## Parse errors")
        lines.extend(parse_errors)
        lines.append("")

    if issues:
        lines.append("## Issues")
        lines.extend(issues)
        lines.append("")

    if nonlinked_doc_ids:
        lines.append("## Non-linked document ID references (body)")
        lines.extend(nonlinked_doc_ids)
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
    if parse_errors or issues or nonlinked_doc_ids or broken_links or backlink_issues:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
