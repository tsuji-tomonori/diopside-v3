#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Compute next document ID and suggested path.

This helper supports the naming rule:
  {PREFIX}-{NNN}.md
where PREFIX looks like:
  RQ-FR, RQ-UC, BD-ADR, DD-API, UT-CASE, IT-PLAN, AT-SCN, ...

It tries:
  1) Find existing files under docs/ that match PREFIX-\d\d\d.md and reuse that directory.
  2) If not found, fallback to assets/doc_path_map.yaml (prefix -> directory).

Output:
  - default: prints "<NEW_ID>\n<PATH>"
  - --json: prints {"id": "...", "path": "..."} to stdout

Expected usage from repo root.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

try:
    import yaml  # type: ignore
except Exception:  # pragma: no cover
    yaml = None  # type: ignore


def load_map(map_path: Path) -> dict[str, str]:
    if not map_path.exists():
        return {}
    if yaml is None:
        raise RuntimeError("PyYAML is required to read doc_path_map.yaml")
    data = yaml.safe_load(map_path.read_text(encoding="utf-8")) or {}
    if not isinstance(data, dict):
        return {}
    # ensure str->str
    out: dict[str, str] = {}
    for k, v in data.items():
        if isinstance(k, str) and isinstance(v, str):
            out[k.strip()] = v.strip().rstrip("/")

    return out


def find_existing(prefix: str, docs_root: Path) -> tuple[int, Path | None]:
    """Return (max_nnn, directory) for existing PREFIX docs."""
    pat = re.compile(rf"^{re.escape(prefix)}-(\d{{3}})\.md$")
    max_n = 0
    dir_counts: dict[Path, int] = {}
    for p in docs_root.rglob("*.md"):
        if p.name in {"README.md", "TEMPLATE.md"}:
            continue
        m = pat.match(p.name)
        if not m:
            continue
        n = int(m.group(1))
        if n > max_n:
            max_n = n
        dir_counts[p.parent] = dir_counts.get(p.parent, 0) + 1

    if not dir_counts:
        return (0, None)

    # choose most common directory for this prefix
    target_dir = sorted(dir_counts.items(), key=lambda kv: (-kv[1], str(kv[0])))[0][0]
    return (max_n, target_dir)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("prefix", help="e.g., RQ-FR, BD-ADR, DD-API, UT-CASE")
    ap.add_argument("--root", default=".", help="repo root (default: current dir)")
    ap.add_argument("--docs-root", default="docs", help="docs directory (default: docs)")
    ap.add_argument("--json", action="store_true", help="output JSON")
    args = ap.parse_args()

    prefix = args.prefix.strip()
    if not prefix or not re.match(r"^[A-Z]{2,3}-[A-Z0-9]+(?:-[A-Z0-9]+)?$", prefix):
        print(f"ERROR: invalid prefix: {prefix}", file=sys.stderr)
        return 2

    root = Path(args.root).resolve()
    docs_root = (root / args.docs_root).resolve()

    max_n, found_dir = find_existing(prefix, docs_root) if docs_root.exists() else (0, None)

    if found_dir is None:
        # fallback to map
        map_path = Path(__file__).resolve().parent.parent / "assets" / "doc_path_map.yaml"
        mapping = load_map(map_path)
        mapped_dir = mapping.get(prefix)
        if mapped_dir:
            found_dir = root / mapped_dir
        else:
            print(f"ERROR: could not determine directory for prefix {prefix}", file=sys.stderr)
            print("Hint: add mapping in .codex/skills/obsidian-doc-new/assets/doc_path_map.yaml", file=sys.stderr)
            return 3

    new_id = f"{prefix}-{max_n + 1:03d}"
    out_path = found_dir / f"{new_id}.md"

    if args.json:
        print(json.dumps({"id": new_id, "path": str(out_path)}, ensure_ascii=False))
    else:
        print(new_id)
        print(out_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
