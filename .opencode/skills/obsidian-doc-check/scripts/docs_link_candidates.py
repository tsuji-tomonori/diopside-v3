#!/usr/bin/env python3
"""Extract link candidates from a markdown document as JSONL.

The script reports "not linked yet but should be linked" candidates.
It classifies each candidate and explicitly marks missing targets.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

import yaml


DOC_ID_RE = re.compile(r"\b(?:RQ|BD|DD|UT|IT|AT)-[A-Z]{2,8}-\d{3}\b")
WIKI_LINK_RE = re.compile(r"\[\[[^\]]+\]\]")
INLINE_CODE_RE = re.compile(r"`[^`\n]+`")


@dataclass
class DocMeta:
    doc_id: str
    title: str
    doc_type: str
    phase: str
    path: Path
    term_en: str


def split_frontmatter(text: str) -> Tuple[Dict[str, Any], str]:
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}, text
    body = text[end + len("\n---\n") :]
    try:
        parsed = yaml.safe_load(text[4:end]) or {}
    except yaml.YAMLError:
        return {}, body
    if not isinstance(parsed, dict):
        return {}, body
    return parsed, body


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


def normalize_link_id(doc_id: str) -> str:
    if "|" in doc_id:
        doc_id = doc_id.split("|", 1)[0]
    if "#" in doc_id:
        doc_id = doc_id.split("#", 1)[0]
    return doc_id.strip()


def classify_from_doc(meta: Optional[DocMeta], fallback_id: str = "") -> str:
    if meta is not None:
        doc_id = meta.doc_id
        doc_type = meta.doc_type
        phase = meta.phase
        title = meta.title
    else:
        doc_id = fallback_id
        doc_type = ""
        phase = ""
        title = ""

    if doc_id.startswith("RQ-GL-"):
        return "term"
    if doc_id.startswith("RQ-UC-"):
        return "usecase"
    if doc_id.startswith("RQ-SH-"):
        return "stakeholder"
    if doc_id.startswith("RQ-DM-"):
        return "domain"
    if doc_id.startswith("RQ-FR-"):
        return "requirement"
    if doc_id.startswith("RQ-RDR-") or doc_id.startswith("BD-ADR-"):
        return "decision"
    if "API" in doc_type or "-API-" in doc_id:
        return "api"
    if "UI" in doc_type or "-UI-" in doc_id or "画面" in title:
        return "screen"
    if phase in {"UT", "IT", "AT"} or "テスト" in doc_type:
        return "test"
    if doc_id.startswith("AT-") or "運用" in doc_type or "配信" in doc_type or "障害" in doc_type:
        return "ops"
    if doc_id.startswith("RQ-") and ("要求" in doc_type or "プロジェクト" in doc_type):
        return "requirement"
    return "other"


def is_ascii_word(value: str) -> bool:
    return bool(re.fullmatch(r"[A-Za-z0-9_./-]+", value))


def load_docs_index(docs_root: Path) -> Tuple[Dict[str, DocMeta], Dict[str, List[DocMeta]]]:
    by_id: Dict[str, DocMeta] = {}
    by_label: Dict[str, List[DocMeta]] = {}

    for path in sorted(docs_root.rglob("*.md")):
        if path.name in {"README.md", "TEMPLATE.md"}:
            continue
        text = path.read_text(encoding="utf-8")
        frontmatter, _ = split_frontmatter(text)
        doc_id = str(frontmatter.get("id", "")).strip()
        title = str(frontmatter.get("title", "")).strip()
        doc_type = str(frontmatter.get("doc_type", "")).strip()
        phase = str(frontmatter.get("phase", "")).strip()
        term_en = str(frontmatter.get("term_en", "")).strip()
        if not doc_id:
            continue

        meta = DocMeta(
            doc_id=doc_id,
            title=title,
            doc_type=doc_type,
            phase=phase,
            path=path,
            term_en=term_en,
        )
        by_id[doc_id] = meta

        labels: List[str] = []
        if title and len(title) >= 2:
            labels.append(title)
        if term_en and len(term_en) >= 2:
            labels.append(term_en)

        for label in labels:
            by_label.setdefault(label, []).append(meta)

    return by_id, by_label


def iter_unprotected_segments(line: str) -> Iterable[Tuple[int, str, List[Tuple[int, int]]]]:
    protected = _merge_spans(
        [m.span() for m in WIKI_LINK_RE.finditer(line)]
        + [m.span() for m in INLINE_CODE_RE.finditer(line)]
    )
    if not protected:
        yield 0, line, protected
        return

    cursor = 0
    for s, e in protected:
        if cursor < s:
            yield cursor, line[cursor:s], protected
        cursor = e
    if cursor < len(line):
        yield cursor, line[cursor:], protected


def find_candidates(
    body: str,
    source_meta: Optional[DocMeta],
    by_id: Dict[str, DocMeta],
    by_label: Dict[str, List[DocMeta]],
    docs_root: Path,
) -> List[Dict[str, Any]]:
    source_id = source_meta.doc_id if source_meta else ""
    source_path = source_meta.path if source_meta else None

    labels_sorted = sorted(
        [k for k in by_label if len(k) >= 2],
        key=len,
        reverse=True,
    )

    out: List[Dict[str, Any]] = []
    seen: set[Tuple[int, str, str, str]] = set()
    in_fence = False

    for line_no, line in enumerate(body.splitlines(), start=1):
        stripped = line.strip()

        if stripped.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue

        protected_spans = _merge_spans(
            [m.span() for m in WIKI_LINK_RE.finditer(line)]
            + [m.span() for m in INLINE_CODE_RE.finditer(line)]
        )

        # 1) Plain document IDs.
        for m in DOC_ID_RE.finditer(line):
            mention = m.group(0)
            if mention == source_id:
                continue
            s, e = m.span()
            if _in_spans(s, e, protected_spans):
                continue

            target = by_id.get(mention)
            if target is None:
                item = {
                    "source_path": str(source_path.relative_to(docs_root)) if source_path else "",
                    "line": line_no,
                    "text": mention,
                    "kind": "doc_id",
                    "category": classify_from_doc(None, fallback_id=mention),
                    "should_link": True,
                    "status": "missing_target",
                    "target_id": None,
                    "target_path": None,
                    "candidate_target_ids": [],
                    "reason": "document ID was referenced but target document does not exist",
                }
            else:
                item = {
                    "source_path": str(source_path.relative_to(docs_root)) if source_path else "",
                    "line": line_no,
                    "text": mention,
                    "kind": "doc_id",
                    "category": classify_from_doc(target),
                    "should_link": True,
                    "status": "resolvable",
                    "target_id": target.doc_id,
                    "target_path": str(target.path.relative_to(docs_root)),
                    "candidate_target_ids": [target.doc_id],
                    "reason": "plain document ID reference should use wiki link",
                }

            dedupe_key = (line_no, mention, item["status"], item["target_id"] or "")
            if dedupe_key not in seen:
                seen.add(dedupe_key)
                out.append(item)

        # 2) Title/term mentions.
        for segment_offset, segment, _ in iter_unprotected_segments(line):
            if not segment.strip():
                continue
            for label in labels_sorted:
                search_pos = 0
                while True:
                    idx = segment.find(label, search_pos)
                    if idx == -1:
                        break
                    abs_start = segment_offset + idx
                    abs_end = abs_start + len(label)

                    if _in_spans(abs_start, abs_end, protected_spans):
                        search_pos = idx + len(label)
                        continue

                    # For ASCII labels, enforce token boundary.
                    if is_ascii_word(label):
                        left = line[abs_start - 1] if abs_start > 0 else " "
                        right = line[abs_end] if abs_end < len(line) else " "
                        if re.fullmatch(r"[A-Za-z0-9_./-]", left) or re.fullmatch(
                            r"[A-Za-z0-9_./-]", right
                        ):
                            search_pos = idx + len(label)
                            continue

                    targets = [t for t in by_label.get(label, []) if t.doc_id != source_id]
                    if not targets:
                        search_pos = idx + len(label)
                        continue

                    unique_ids = sorted({t.doc_id for t in targets})
                    if len(unique_ids) == 1:
                        t = targets[0]
                        item = {
                            "source_path": str(source_path.relative_to(docs_root)) if source_path else "",
                            "line": line_no,
                            "text": label,
                            "kind": "term",
                            "category": classify_from_doc(t),
                            "should_link": True,
                            "status": "resolvable",
                            "target_id": t.doc_id,
                            "target_path": str(t.path.relative_to(docs_root)),
                            "candidate_target_ids": unique_ids,
                            "reason": "known title/term mention should use wiki link",
                        }
                    else:
                        category = "other"
                        categories = {classify_from_doc(by_id[x]) for x in unique_ids if x in by_id}
                        if len(categories) == 1:
                            category = next(iter(categories))
                        item = {
                            "source_path": str(source_path.relative_to(docs_root)) if source_path else "",
                            "line": line_no,
                            "text": label,
                            "kind": "term",
                            "category": category,
                            "should_link": True,
                            "status": "ambiguous",
                            "target_id": None,
                            "target_path": None,
                            "candidate_target_ids": unique_ids,
                            "reason": "multiple link targets found for same mention",
                        }

                    dedupe_key = (line_no, label, item["status"], item["target_id"] or "")
                    if dedupe_key not in seen:
                        seen.add(dedupe_key)
                        out.append(item)

                    search_pos = idx + len(label)

    out.sort(key=lambda x: (x["line"], x["text"], x["status"]))
    return out


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Extract non-linked link candidates as JSONL")
    parser.add_argument("--doc", required=True, help="target markdown path")
    parser.add_argument("--docs-root", default="docs", help="docs root path")
    parser.add_argument(
        "--out",
        default="",
        help="output jsonl file path (default: stdout)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    docs_root = Path(args.docs_root).resolve()
    doc_path = Path(args.doc).resolve()

    if not docs_root.exists():
        raise SystemExit(f"ERROR: docs root not found: {docs_root}")
    if not doc_path.exists() or doc_path.suffix.lower() != ".md":
        raise SystemExit(f"ERROR: markdown file not found: {doc_path}")

    text = doc_path.read_text(encoding="utf-8")
    frontmatter, body = split_frontmatter(text)

    source_id = str(frontmatter.get("id", "")).strip()
    source_meta = None

    by_id, by_label = load_docs_index(docs_root)
    if source_id and source_id in by_id:
        source_meta = by_id[source_id]
    else:
        source_meta = DocMeta(
            doc_id=source_id,
            title=str(frontmatter.get("title", "")).strip(),
            doc_type=str(frontmatter.get("doc_type", "")).strip(),
            phase=str(frontmatter.get("phase", "")).strip(),
            path=doc_path,
            term_en=str(frontmatter.get("term_en", "")).strip(),
        )

    candidates = find_candidates(body, source_meta, by_id, by_label, docs_root)

    if args.out:
        out_path = Path(args.out).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        with out_path.open("w", encoding="utf-8") as fh:
            for item in candidates:
                fh.write(json.dumps(item, ensure_ascii=False) + "\n")
    else:
        for item in candidates:
            print(json.dumps(item, ensure_ascii=False))

    try:
        src_display = str(doc_path.relative_to(Path.cwd()))
    except ValueError:
        src_display = str(doc_path)
    print(f"candidates={len(candidates)} source={src_display}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
