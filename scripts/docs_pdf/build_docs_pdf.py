#!/usr/bin/env python3
"""Build a single PDF from docs/ (Obsidian-flavored Markdown) via CLI.

Pipeline (deterministic):
  1) (Optional) Run obsidian-export to normalize Obsidian Markdown to CommonMark
  2) Concatenate markdown files under docs/ (or exported output) into one combined.md
     - Each note becomes a top-level section with a stable anchor
     - YAML frontmatter is rendered as a visible "Metadata" section
     - Obsidian [[wikilinks]] are converted to PDF-internal links
     - If obsidian-export already converted links to .md paths, those are rewritten to internal anchors too
     - Long inline code tokens that tend to overflow are converted to \path{...} to allow line breaks
  3) Pandoc -> XeLaTeX -> PDF
     - Mermaid blocks are rendered to images via a Pandoc filter (mermaid_filter.py)
     - Japanese line breaking and English/URL wrapping are improved via header.tex

Outputs:
  - Combined markdown: .build/docs-pdf/combined.md
  - PDF: reports/diopside-docs.pdf (default)

Usage:
  python3 scripts/docs_pdf/build_docs_pdf.py

Env vars:
  MMDC: mermaid-cli command used by mermaid_filter.py
  MERMAID_SCALE: scale factor (default 2)
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

import yaml


@dataclass(frozen=True)
class NoteInfo:
    src_path: Path
    rel_path: Path
    note_id: str
    title: str
    anchor: str
    dir_parts: Tuple[str, ...]
    meta: Dict[str, Any]
    body: str


WIKILINK_RE = re.compile(r"\[\[([^\]|#]+?)(?:\|([^\]]+))?\]\]")
# Markdown link to an .md file (post obsidian-export), e.g. [text](path/to/RQ-PP-001.md)
MD_LINK_MD_RE = re.compile(r"\]\(([^\)\s]+?\.md)(?:#[^\)\s]+)?\)")
# Inline code spans: `...`
INLINE_CODE_RE = re.compile(r"`([^`]+)`")
ATX_HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")


def sh(cmd: List[str], *, cwd: Optional[Path] = None, env: Optional[Dict[str, str]] = None) -> None:
    print("+", " ".join(cmd))
    subprocess.run(cmd, check=True, cwd=str(cwd) if cwd else None, env=env)


def which(cmd: str) -> Optional[str]:
    return shutil.which(cmd)


def split_frontmatter(text: str) -> Tuple[Dict[str, Any], str]:
    """Return (frontmatter_dict, body_text)."""
    if not text.startswith("---"):
        return {}, text
    # Frontmatter must start with '---\n'
    if not text.startswith("---\n"):
        return {}, text

    end = text.find("\n---\n", 4)
    if end == -1:
        return {}, text

    fm_raw = text[4:end]
    body = text[end + len("\n---\n") :]
    try:
        meta = yaml.safe_load(fm_raw) or {}
        if not isinstance(meta, dict):
            meta = {}
    except Exception:
        meta = {}
    return meta, body


def slugify(s: str) -> str:
    s = s.strip().lower()
    # Keep ascii letters/digits and '-'
    s = re.sub(r"[^a-z0-9\-]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    if not s:
        s = "doc"
    return s


def is_fence(line: str) -> Optional[str]:
    stripped = line.lstrip()
    if stripped.startswith("```"):
        return "```"
    if stripped.startswith("~~~"):
        return "~~~"
    return None


def convert_wikilinks(text: str, id_to_anchor: Dict[str, str]) -> str:
    def repl(m: re.Match[str]) -> str:
        target = m.group(1).strip()
        alias = (m.group(2) or target).strip()
        # If a path-like target is used, keep last segment
        key = target.split("/")[-1]
        anchor = id_to_anchor.get(key)
        if not anchor:
            return alias
        return f"[{alias}](#{anchor})"

    return WIKILINK_RE.sub(repl, text)


def rewrite_md_links_to_internal(text: str, stem_to_anchor: Dict[str, str]) -> str:
    """Rewrite markdown links that point to other .md files into internal anchors.

    Example:
      [公式投稿動画](../21.../RQ-GL-003.md) -> [公式投稿動画](#doc-rq-gl-003)

    This is mainly needed when the source markdown has already been normalized by obsidian-export.
    """

    # We do a conservative rewrite: only link targets ending with .md
    def repl(m: re.Match[str]) -> str:
        md_target = m.group(1)
        stem = Path(md_target).name
        if stem.lower().endswith(".md"):
            stem = stem[:-3]
        anchor = stem_to_anchor.get(stem)
        if not anchor:
            return m.group(0)
        return f"](#{anchor})"

    return MD_LINK_MD_RE.sub(repl, text)


def convert_inline_code_paths(text: str) -> str:
    """Convert some long inline code spans to \path{...} to enable line breaks in LaTeX.

    This helps for tokens like `bootstrap/tag_master/archive_index` that would otherwise overflow.
    """

    def should_convert(code: str) -> bool:
        if " " in code:
            return False
        if "\\" in code or "{" in code or "}" in code:
            return False
        if len(code) < 20:
            return False
        # Path/URL-ish tokens
        return any(ch in code for ch in ("/", "_", "-", ".", ":"))

    def repl(m: re.Match[str]) -> str:
        code = m.group(1)
        if should_convert(code):
            return f"\\path{{{code}}}"
        return m.group(0)

    return INLINE_CODE_RE.sub(repl, text)


def _rewrite_heading_line(line: str, heading_offset: int) -> str:
    m = ATX_HEADING_RE.match(line)
    if not m:
        return line

    level = len(m.group(1))
    rest = m.group(2).strip()
    new_level = min(6, max(1, level + heading_offset))

    # Exclude note-body headings from the global TOC.
    if "{.unlisted" not in rest and "{#" not in rest and not rest.endswith("}"):
        rest = f"{rest} {{.unlisted}}"

    return f"{'#' * new_level} {rest}"


def process_markdown_body(
    body: str,
    id_to_anchor: Dict[str, str],
    stem_to_anchor: Dict[str, str],
    heading_offset: int,
) -> str:
    lines = body.splitlines()
    out: List[str] = []

    in_fence = False
    fence_marker = ""

    for line in lines:
        marker = is_fence(line)
        if marker:
            if not in_fence:
                in_fence = True
                fence_marker = marker
            elif marker == fence_marker:
                in_fence = False
                fence_marker = ""
            out.append(line)
            continue

        if in_fence:
            out.append(line)
            continue

        # Outside code fences: rewrite links and improve wrapping
        line2 = convert_wikilinks(line, id_to_anchor)
        line2 = rewrite_md_links_to_internal(line2, stem_to_anchor)
        line2 = convert_inline_code_paths(line2)
        line2 = _rewrite_heading_line(line2, heading_offset=heading_offset)
        out.append(line2)

    # Normalize trailing whitespace
    return "\n".join(out).strip() + "\n"


def render_metadata(meta: Dict[str, Any], id_to_anchor: Dict[str, str]) -> str:
    """Render YAML frontmatter as a visible Metadata block."""

    def fmt_value(v: Any) -> str:
        if v is None:
            return "[]"
        if isinstance(v, bool):
            return "true" if v else "false"
        if isinstance(v, (int, float)):
            return str(v)
        if isinstance(v, str):
            # Convert wikilinks inside metadata strings
            return convert_wikilinks(v, id_to_anchor)
        if isinstance(v, list):
            parts = []
            for item in v:
                if isinstance(item, str):
                    parts.append(convert_wikilinks(item, id_to_anchor))
                else:
                    parts.append(str(item))
            return ", ".join(parts) if parts else "[]"
        if isinstance(v, dict):
            # Keep compact
            return str(v)
        return str(v)

    # Prefer a stable key order (frontmatter may vary)
    preferred = [
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

    keys = []
    for k in preferred:
        if k in meta:
            keys.append(k)
    for k in sorted(meta.keys()):
        if k not in keys and k not in ("id", "title"):
            keys.append(k)

    lines = ["### Metadata {.unlisted .unnumbered}"]
    for k in keys:
        lines.append(f"- {k}: {fmt_value(meta.get(k))}")

    return "\n".join(lines).strip() + "\n"


def collect_notes(docs_root: Path, exclude_subdirs: Iterable[str]) -> List[NoteInfo]:
    paths: List[Path] = []
    for p in docs_root.rglob("*.md"):
        rel = p.relative_to(docs_root)
        # Exclude patterns
        if any(part in exclude_subdirs for part in rel.parts):
            continue
        paths.append(p)

    # Deterministic ordering: index.md first (if exists), then lexicographic by rel path
    def sort_key(p: Path) -> Tuple[int, str]:
        rel = p.relative_to(docs_root).as_posix()
        return (0 if rel == "index.md" else 1, rel)

    paths = sorted(paths, key=sort_key)

    # First pass: build ID->anchor mapping
    tmp_meta: List[Tuple[Path, Path, Dict[str, Any], str]] = []
    id_to_anchor: Dict[str, str] = {}
    stem_to_anchor: Dict[str, str] = {}

    for p in paths:
        raw = p.read_text(encoding="utf-8")
        meta, body = split_frontmatter(raw)
        note_id = str(meta.get("id") or p.stem)
        title = str(meta.get("title") or p.stem)
        anchor = f"doc-{slugify(note_id)}"

        tmp_meta.append((p, p.relative_to(docs_root), meta, body))
        id_to_anchor[note_id] = anchor
        # Some vaults link by filename-stem rather than explicit frontmatter id.
        id_to_anchor[p.stem] = anchor
        stem_to_anchor[p.stem] = anchor

    # Second pass: build NoteInfo with processed body
    notes: List[NoteInfo] = []
    for p, rel, meta, body in tmp_meta:
        note_id = str(meta.get("id") or p.stem)
        title = str(meta.get("title") or p.stem)
        anchor = id_to_anchor[note_id]
        dir_parts = tuple(rel.parts[:-1])
        note_level = min(6, len(dir_parts) + 1)
        heading_offset = max(0, note_level - 1)
        processed = process_markdown_body(
            body,
            id_to_anchor=id_to_anchor,
            stem_to_anchor=stem_to_anchor,
            heading_offset=heading_offset,
        )
        notes.append(
            NoteInfo(
                src_path=p,
                rel_path=rel,
                note_id=note_id,
                title=title,
                anchor=anchor,
                dir_parts=dir_parts,
                meta=meta,
                body=processed,
            )
        )

    return notes


def build_combined_markdown(notes: List[NoteInfo], out_path: Path) -> None:
    # Pandoc document metadata
    header = """---
title: diopside docs
lang: ja-JP
---

"""

    parts: List[str] = [header]

    # Build a single mapping for metadata rendering.
    id_to_anchor = {n.note_id: n.anchor for n in notes}
    for n in notes:
        id_to_anchor[n.src_path.stem] = n.anchor

    current_dirs: Tuple[str, ...] = tuple()

    for note in notes:
        common = 0
        while common < len(current_dirs) and common < len(note.dir_parts) and current_dirs[common] == note.dir_parts[common]:
            common += 1

        for idx in range(common, len(note.dir_parts)):
            level = min(6, idx + 1)
            parts.append(f"{'#' * level} {note.dir_parts[idx]}\n")

        current_dirs = note.dir_parts

        # Note heading with stable anchor. Level follows directory depth.
        note_level = min(6, len(note.dir_parts) + 1)
        parts.append(f"{'#' * note_level} {note.note_id} {note.title} {{#{note.anchor}}}\n")

        # Visible metadata
        parts.append(render_metadata(note.meta, id_to_anchor=id_to_anchor))
        parts.append("\n")

        # Body
        parts.append(note.body)
        parts.append("\n")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(parts), encoding="utf-8")


def run_obsidian_export(vault_root: Path, docs_root: Path, export_dir: Path) -> Path:
    """Run obsidian-export if available.

    Returns the directory that should be used as the markdown input root.
    """

    cmd = which("obsidian-export")
    if not cmd:
        print("[docs_pdf] obsidian-export not found. Skipping normalization step.", file=sys.stderr)
        return docs_root

    export_dir.mkdir(parents=True, exist_ok=True)

    # Destination must exist.
    # Usage per upstream README:
    #   obsidian-export <vault_root> --start-at <vault_root/subdir> <dest>
    sh([cmd, str(vault_root), "--start-at", str(docs_root), str(export_dir)])

    # obsidian-export exports the subtree rooted at docs_root into export_dir.
    return export_dir


def build_pdf(
    combined_md: Path,
    out_pdf: Path,
    header_tex: Path,
    mermaid_filter: Path,
    mainfont: str,
    monofont: str,
    toc_depth: int,
) -> None:
    out_pdf.parent.mkdir(parents=True, exist_ok=True)

    env = os.environ.copy()
    # Ensure Mermaid output goes into our build dir (relative paths preserved)
    env.setdefault("MERMAID_OUTPUT_DIR", ".build/docs-pdf/mermaid")

    # Mermaid CLI resolution:
    # - Prefer a locally installed `mmdc`
    # - Otherwise fall back to `npx --package ... mmdc` with a pinned version
    if "MMDC" not in env and which("mmdc") is None:
        # Pinned for reproducibility. Update when needed.
        env["MMDC"] = "npx --yes --package @mermaid-js/mermaid-cli@11.12.0 mmdc"

    cmd = [
        "pandoc",
        str(combined_md),
        "--from",
        "markdown",
        "--toc",
        f"--toc-depth={toc_depth}",
        "--pdf-engine=xelatex",
        "-V",
        f"mainfont={mainfont}",
        "-V",
        f"monofont={monofont}",
        "-H",
        str(header_tex),
        "--filter",
        str(mermaid_filter),
        "-o",
        str(out_pdf),
    ]

    sh(cmd, env=env)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--docs-root", default="docs", help="Docs directory (default: docs)")
    ap.add_argument("--vault-root", default=".", help="Vault root (default: .)")
    ap.add_argument("--out", default="reports/diopside-docs.pdf", help="Output PDF path")
    ap.add_argument("--build-dir", default=".build/docs-pdf", help="Build workdir")
    ap.add_argument("--toc-depth", type=int, default=6, help="TOC depth")
    ap.add_argument("--mainfont", default="Noto Sans CJK JP", help="Main font for PDF")
    ap.add_argument("--monofont", default="Noto Sans Mono CJK JP", help="Monospace font for code")
    ap.add_argument(
        "--no-obsidian-export",
        action="store_true",
        help="Skip obsidian-export normalization even if installed",
    )
    ap.add_argument(
        "--exclude-subdir",
        action="append",
        default=["reviews"],
        help="Exclude subdir name under docs-root (repeatable). Default: reviews",
    )

    args = ap.parse_args()

    vault_root = Path(args.vault_root).resolve()
    docs_root = (vault_root / args.docs_root).resolve()
    build_dir = (vault_root / args.build_dir).resolve()
    out_pdf = (vault_root / args.out).resolve()

    header_tex = vault_root / "scripts" / "docs_pdf" / "pandoc" / "header.tex"
    mermaid_filter = vault_root / "scripts" / "docs_pdf" / "filters" / "mermaid_filter.py"

    if not docs_root.exists():
        raise SystemExit(f"docs root not found: {docs_root}")

    # Step 1: optional obsidian-export normalization
    input_root = docs_root
    if not args.no_obsidian_export:
        input_root = run_obsidian_export(vault_root=vault_root, docs_root=docs_root, export_dir=build_dir / "export")

    # Step 2: collect and combine
    notes = collect_notes(input_root, exclude_subdirs=args.exclude_subdir)
    combined_md = build_dir / "combined.md"
    build_combined_markdown(notes, combined_md)

    # Step 3: build PDF
    build_pdf(
        combined_md=combined_md,
        out_pdf=out_pdf,
        header_tex=header_tex,
        mermaid_filter=mermaid_filter,
        mainfont=args.mainfont,
        monofont=args.monofont,
        toc_depth=args.toc_depth,
    )

    print(f"[docs_pdf] Wrote: {out_pdf}")


if __name__ == "__main__":
    main()
