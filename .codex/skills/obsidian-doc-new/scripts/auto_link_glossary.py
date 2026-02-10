#!/usr/bin/env python3
"""Auto-link glossary terms in Obsidian markdown documents.

Rules:
- Source glossary from docs/1.要求(RQ)/21.用語(GL)/RQ-GL-*.md
- Replace term occurrences in body text with [[RQ-GL-xxx|term]]
- Exclude frontmatter, existing wiki links, inline code, and code blocks
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


GLOSSARY_RELATIVE = Path("1.要求(RQ)") / "21.用語(GL)"


def load_glossary_terms(docs_root: Path) -> dict[str, str]:
    glossary_dir = docs_root / GLOSSARY_RELATIVE
    if not glossary_dir.exists():
        raise FileNotFoundError(f"glossary directory not found: {glossary_dir}")

    mapping: dict[str, str] = {}
    for path in sorted(glossary_dir.glob("RQ-GL-*.md")):
        text = path.read_text(encoding="utf-8")
        id_match = re.search(r"^id:\s*(.+)$", text, re.M)
        title_match = re.search(r"^title:\s*(.+)$", text, re.M)
        if not id_match or not title_match:
            continue
        doc_id = id_match.group(1).strip().strip("'")
        title = title_match.group(1).strip().strip("'")
        mapping[title] = doc_id

    if not mapping:
        raise RuntimeError("no glossary terms found from RQ-GL files")

    return mapping


def split_frontmatter(text: str) -> tuple[str, str]:
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            end += len("\n---\n")
            return text[:end], text[end:]
    return "", text


def link_body(body: str, mapping: dict[str, str]) -> str:
    protect_re = re.compile(r"(```[\s\S]*?```|`[^`\n]+`|\[\[[^\]]+\]\])", re.M)

    ascii_terms = sorted(
        [term for term in mapping if re.fullmatch(r"[A-Za-z0-9_]+", term)],
        key=len,
        reverse=True,
    )
    non_ascii_terms = sorted(
        [term for term in mapping if term not in ascii_terms],
        key=len,
        reverse=True,
    )

    parts = protect_re.split(body)
    for i in range(0, len(parts), 2):
        segment = parts[i]

        for term in non_ascii_terms:
            segment = segment.replace(term, f"[[{mapping[term]}|{term}]]")

        for term in ascii_terms:
            pattern = re.compile(
                rf"(?<![A-Za-z0-9_]){re.escape(term)}(?![A-Za-z0-9_])"
            )
            segment = pattern.sub(f"[[{mapping[term]}|{term}]]", segment)

        parts[i] = segment

    return "".join(parts)


def process_file(path: Path, mapping: dict[str, str], check_only: bool) -> bool:
    original = path.read_text(encoding="utf-8")
    frontmatter, body = split_frontmatter(original)
    linked_body = link_body(body, mapping)
    updated = frontmatter + linked_body

    if updated == original:
        return False

    if not check_only:
        path.write_text(updated, encoding="utf-8")
    return True


def collect_targets(docs_root: Path, raw_paths: list[str], all_docs: bool) -> list[Path]:
    if all_docs:
        return sorted(p for p in docs_root.rglob("*.md") if p.is_file())

    targets: list[Path] = []
    for raw in raw_paths:
        path = Path(raw).resolve()
        if not path.exists() or not path.is_file():
            raise FileNotFoundError(f"target not found: {raw}")
        if path.suffix.lower() != ".md":
            continue
        targets.append(path)
    return targets


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("paths", nargs="*", help="target markdown files")
    parser.add_argument("--docs-root", default="docs", help="docs directory")
    parser.add_argument("--all", action="store_true", help="process all docs markdown")
    parser.add_argument("--check", action="store_true", help="do not write files")
    args = parser.parse_args()

    if not args.all and not args.paths:
        print("ERROR: specify target markdown paths or use --all", file=sys.stderr)
        return 2

    docs_root = Path(args.docs_root).resolve()
    if not docs_root.exists():
        print(f"ERROR: docs root not found: {docs_root}", file=sys.stderr)
        return 2

    try:
        mapping = load_glossary_terms(docs_root)
        targets = collect_targets(docs_root, args.paths, args.all)
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    changed = 0
    for target in targets:
        if process_file(target, mapping, args.check):
            changed += 1

    mode = "check" if args.check else "write"
    print(f"mode={mode} targets={len(targets)} changed={changed}")
    if args.check and changed > 0:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
