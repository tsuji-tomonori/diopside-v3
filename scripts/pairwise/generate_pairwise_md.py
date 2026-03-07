#!/usr/bin/env python3
"""Generate UT pairwise case markdown from UT-PW model files.

Input:
  docs/4.単体テスト(UT)/12.ペアワイズ(PW)/**/UT-PW-*.md
  (reads ```pairwise fenced YAML)

Output:
  model.meta.output markdown files
"""

from __future__ import annotations

import argparse
import datetime as dt
import itertools
import re
from pathlib import Path
from typing import Any

import yaml


PAIRWISE_ROOT = Path("docs/4.単体テスト(UT)/12.ペアワイズ(PW)")
PAIRWISE_FENCE = re.compile(r"```pairwise\s*\n([\s\S]*?)\n```", re.MULTILINE)


def normalize_link(value: str) -> str:
    value = value.strip()
    if value.startswith("[[") and value.endswith("]]"):
        return value
    return f"[[{value}]]"


def stringify(value: Any) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    return str(value)


def split_frontmatter(text: str) -> dict[str, Any]:
    if not text.startswith("---\n"):
        raise ValueError("frontmatter opening not found")
    end = text.find("\n---\n", 4)
    if end == -1:
        raise ValueError("frontmatter closing not found")
    fm_text = text[4:end]
    data = yaml.safe_load(fm_text)
    if not isinstance(data, dict):
        raise ValueError("frontmatter is not mapping")
    return data


def extract_history_lines(text: str) -> list[str]:
    marker = "\n## 変更履歴\n"
    start = text.find(marker)
    if start == -1:
        return []
    lines = text[start + len(marker) :].splitlines()
    history: list[str] = []
    for line in lines:
        if not line.startswith("- "):
            break
        history.append(line)
    return history


def load_existing_output(path: Path) -> tuple[str | None, str | None, list[str], str]:
    if not path.exists():
        return None, None, [], ""

    text = path.read_text(encoding="utf-8")
    try:
        fm = split_frontmatter(text)
    except ValueError:
        return None, None, [], text

    created = fm.get("created")
    updated = fm.get("updated")
    return (
        stringify(created) if created is not None else None,
        stringify(updated) if updated is not None else None,
        extract_history_lines(text),
        text,
    )


def merge_history(history_lines: list[str], today: str) -> list[str]:
    entry = f"- {today}: 自動生成"
    if history_lines and history_lines[0] == entry:
        return history_lines
    return [entry, *[line for line in history_lines if line != entry]]


def is_excluded(assignment: dict[str, str], excludes: list[dict[str, str]]) -> bool:
    for ex in excludes:
        ok = True
        for key, expected in ex.items():
            if key not in assignment or assignment[key] != expected:
                ok = False
                break
        if ok:
            return True
    return False


def row_pairs(row: list[str], names: list[str]) -> set[tuple[int, int, str, str]]:
    pairs: set[tuple[int, int, str, str]] = set()
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            pairs.add((i, j, row[i], row[j]))
    return pairs


def build_valid_rows(
    names: list[str], levels: dict[str, list[str]], excludes: list[dict[str, str]]
) -> list[list[str]]:
    domains = [levels[n] for n in names]
    rows: list[list[str]] = []
    for values in itertools.product(*domains):
        assignment = {names[i]: values[i] for i in range(len(names))}
        if is_excluded(assignment, excludes):
            continue
        rows.append(list(values))
    return rows


def coverage_of_rows(names: list[str], rows: list[list[str]]) -> set[tuple[int, int, str, str]]:
    covered: set[tuple[int, int, str, str]] = set()
    for row in rows:
        for i in range(len(names)):
            for j in range(i + 1, len(names)):
                covered.add((i, j, row[i], row[j]))
    return covered


def generate_pairwise_rows(
    names: list[str], levels: dict[str, list[str]], excludes: list[dict[str, str]]
) -> tuple[list[list[str]], set[tuple[int, int, str, str]], set[tuple[int, int, str, str]]]:
    if len(names) < 2:
        raise ValueError("factors must include at least 2 items")

    valid_rows = build_valid_rows(names, levels, excludes)
    if not valid_rows:
        raise ValueError("no valid row after excludes")

    targets: set[tuple[int, int, str, str]] = set()
    candidate_pairs: list[set[tuple[int, int, str, str]]] = []
    for row in valid_rows:
        pairs = row_pairs(row, names)
        candidate_pairs.append(pairs)
        targets |= pairs

    selected: list[list[str]] = []
    covered: set[tuple[int, int, str, str]] = set()
    available = list(range(len(valid_rows)))

    while covered != targets:
        uncovered = targets - covered
        best_idx = None
        best_gain = -1
        for idx in available:
            gain = len(candidate_pairs[idx] & uncovered)
            if gain > best_gain:
                best_gain = gain
                best_idx = idx
        if best_idx is None or best_gain <= 0:
            raise ValueError("cannot improve pairwise coverage")

        selected.append(valid_rows[best_idx])
        covered |= candidate_pairs[best_idx]
        available.remove(best_idx)

    return selected, targets, covered


def parse_model(model_path: Path) -> dict[str, Any]:
    text = model_path.read_text(encoding="utf-8")
    m = PAIRWISE_FENCE.search(text)
    if not m:
        raise ValueError(f"pairwise block not found: {model_path}")
    data = yaml.safe_load(m.group(1))
    if not isinstance(data, dict):
        raise ValueError(f"invalid pairwise block: {model_path}")
    return data


def render_output(
    model_path: Path,
    model: dict[str, Any],
    names: list[str],
    rows: list[list[str]],
    coverage_rate: float,
    created: str,
    updated: str,
    history_lines: list[str],
) -> str:
    meta = model["meta"]
    out_stem = Path(meta["output"]).stem
    target = meta.get("target", "BE")
    up_links = [normalize_link(x) for x in meta.get("up", [])]
    related_links = [normalize_link(x) for x in meta.get("related", [])]

    lines: list[str] = [
        "---",
        f"id: {out_stem}",
        f"title: {meta['title']} 単体テストケース（ペアワイズ）",
        "doc_type: 単体テストケース",
        "phase: UT",
        "version: 1.0.0",
        "status: 下書き",
        "owner: RQ-SH-001",
        f"created: {created}",
        f"updated: '{updated}'",
        "up:",
    ]

    for link in up_links:
        lines.append(f"  - '{link}'")

    lines.append("related:")
    for link in related_links:
        lines.append(f"  - '{link}'")

    lines.extend(
        [
            "tags:",
            "  - diopside",
            "  - UT",
            "  - CASE",
            "  - PW",
            f"  - {target}",
            "---",
            "",
            "## 対象",
            f"- 生成元モデル: `[{meta['id']}]({model_path.as_posix()})`",
            f"- 生成方式: 2-wise（pairwise）、被覆率 {coverage_rate:.2%}",
            "",
            "## テストケース一覧",
            f"| case_id | {' | '.join(names)} |",
            f"| {' | '.join(['---'] * (len(names) + 1))} |",
        ]
    )

    for idx, row in enumerate(rows, start=1):
        cid = f"{meta['id']}-C{idx:03d}"
        lines.append(f"| {cid} | {' | '.join(row)} |")

    lines.extend(
        [
            "",
            "## 注意",
            "- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。",
            "- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。",
            "",
            "## 変更履歴",
            *history_lines,
            "",
        ]
    )
    return "\n".join(lines)


def collect_models(root: Path) -> list[Path]:
    models = sorted(root.glob("**/UT-PW-*.md"))
    return [m for m in models if m.stem != "UT-PW-001"]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="check mode (no write)")
    parser.add_argument("--strict", action="store_true", help="fail if coverage < 100%")
    args = parser.parse_args()
    today = dt.date.today().isoformat()

    models = collect_models(PAIRWISE_ROOT)
    if not models:
        raise SystemExit("no UT-PW model files found")

    changed: list[Path] = []
    for model_path in models:
        model = parse_model(model_path)
        factors = model.get("factors", {})
        raw_excludes = model.get("excludes", [])
        excludes = [{str(k): stringify(v) for k, v in ex.items()} for ex in raw_excludes]
        if not isinstance(factors, dict) or len(factors) < 2:
            raise ValueError(f"invalid factors in {model_path}")
        names = list(factors.keys())
        levels = {k: [stringify(x) for x in list(v)] for k, v in factors.items()}

        rows, targets, covered = generate_pairwise_rows(names, levels, excludes)
        coverage_rate = len(covered & targets) / len(targets) if targets else 1.0
        if args.strict and coverage_rate < 1.0:
            raise ValueError(f"coverage is not 100%: {model_path} ({coverage_rate:.2%})")

        output_path = Path(model["meta"]["output"])
        output_path.parent.mkdir(parents=True, exist_ok=True)
        existing_created, existing_updated, existing_history, before = load_existing_output(output_path)
        created = existing_created or today
        stable_updated = existing_updated or today
        stable_history = existing_history or [f"- {created}: 自動生成"]
        rendered = render_output(
            model_path,
            model,
            names,
            rows,
            coverage_rate,
            created,
            stable_updated,
            stable_history,
        )

        if before != rendered:
            rendered = render_output(
                model_path,
                model,
                names,
                rows,
                coverage_rate,
                created,
                today,
                merge_history(existing_history, today) if before else [f"- {today}: 自動生成"],
            )

        if before != rendered:
            changed.append(output_path)
            if not args.check:
                output_path.write_text(rendered, encoding="utf-8")

    if args.check and changed:
        print("Outdated generated files:")
        for p in changed:
            print(f"- {p.as_posix()}")
        return 1

    print(f"Processed {len(models)} model files; changed {len(changed)} outputs")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
