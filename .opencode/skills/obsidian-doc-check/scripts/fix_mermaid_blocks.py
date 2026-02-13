#!/usr/bin/env python3
"""Detect and auto-fix common Mermaid label parse errors in docs.

Current auto-fix target:
- In ```mermaid blocks, convert path-like node labels from `ID[/path/*]`
  to `ID["/path/*"]`.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


MERMAID_OPEN_RE = re.compile(r"^```mermaid\s*$")
FENCE_CLOSE_RE = re.compile(r"^```\s*$")
ROUTE_LABEL_RE = re.compile(r'\b([A-Za-z][A-Za-z0-9_]*)\[(/[^\]\n"]*)\]')


def split_frontmatter(text: str) -> tuple[str, str]:
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            end += len("\n---\n")
            return text[:end], text[end:]
    return "", text


def fix_mermaid_body(body: str) -> tuple[str, int]:
    lines = body.splitlines(keepends=True)
    in_mermaid = False
    changes = 0

    for idx, line in enumerate(lines):
        stripped = line.strip()
        if not in_mermaid and MERMAID_OPEN_RE.match(stripped):
            in_mermaid = True
            continue
        if in_mermaid and FENCE_CLOSE_RE.match(stripped):
            in_mermaid = False
            continue
        if not in_mermaid:
            continue

        def _replace(m: re.Match[str]) -> str:
            nonlocal changes
            changes += 1
            node_id = m.group(1)
            label = m.group(2)
            return f'{node_id}["{label}"]'

        lines[idx] = ROUTE_LABEL_RE.sub(_replace, line)

    return "".join(lines), changes


def process_file(path: Path, check_only: bool) -> tuple[bool, int]:
    original = path.read_text(encoding="utf-8")
    frontmatter, body = split_frontmatter(original)
    fixed_body, changes = fix_mermaid_body(body)
    updated = frontmatter + fixed_body

    changed = updated != original
    if changed and not check_only:
        path.write_text(updated, encoding="utf-8")
    return changed, changes


def collect_targets(docs_root: Path, raw_paths: list[str], all_docs: bool) -> list[Path]:
    if all_docs:
        return sorted(
            p
            for p in docs_root.rglob("*.md")
            if p.is_file() and p.name not in {"README.md", "TEMPLATE.md"}
        )

    targets: list[Path] = []
    for raw in raw_paths:
        p = Path(raw).resolve()
        if not p.exists() or not p.is_file() or p.suffix.lower() != ".md":
            continue
        if p.name in {"README.md", "TEMPLATE.md"}:
            continue
        targets.append(p)
    return sorted(set(targets))


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

    targets = collect_targets(docs_root, args.paths, args.all)

    changed_files = 0
    changed_tokens = 0
    for target in targets:
        changed, token_count = process_file(target, args.check)
        if changed:
            changed_files += 1
        changed_tokens += token_count

    mode = "check" if args.check else "write"
    print(
        f"mode={mode} targets={len(targets)} changed_files={changed_files} changed_tokens={changed_tokens}"
    )

    if args.check and changed_files > 0:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
