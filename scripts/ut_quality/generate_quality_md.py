#!/usr/bin/env python3
"""Generate UT quality aggregate docs from UT-STAT/UT-COV source files.

Inputs:
  - docs/4.単体テスト(UT)/42.静的解析(STAT)/UT-STAT-*.md (except UT-STAT-001)
    with ```ut-static YAML block
  - docs/4.単体テスト(UT)/41.カバレッジ(COV)/UT-COV-*.md (except UT-COV-001)
    with ```ut-cov YAML block

Outputs:
  - UT-STAT-001.md (aggregate)
  - UT-COV-001.md (aggregate)
  - UT-MET-001.md (aggregate)
"""

from __future__ import annotations

import argparse
import datetime as dt
import re
from pathlib import Path
from typing import Any

import yaml


COV_ROOT = Path("docs/4.単体テスト(UT)/41.カバレッジ(COV)")
STAT_ROOT = Path("docs/4.単体テスト(UT)/42.静的解析(STAT)")
MET_ROOT = Path("docs/4.単体テスト(UT)/43.品質メトリクス(MET)")

STAT_FENCE = re.compile(r"```ut-static\s*\n([\s\S]*?)\n```", re.MULTILINE)
COV_FENCE = re.compile(r"```ut-cov\s*\n([\s\S]*?)\n```", re.MULTILINE)


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


def parse_fence(path: Path, pattern: re.Pattern[str]) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    m = pattern.search(text)
    if not m:
        raise ValueError(f"fenced block not found: {path}")
    data = yaml.safe_load(m.group(1))
    if not isinstance(data, dict):
        raise ValueError(f"invalid fenced yaml in: {path}")
    return data


def collect_stat_sources() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for path in sorted(STAT_ROOT.glob("UT-STAT-*.md")):
        if path.stem == "UT-STAT-001":
            continue
        fm = split_frontmatter(path.read_text(encoding="utf-8"))
        block = parse_fence(path, STAT_FENCE)
        settings = block.get("settings", {})
        if not isinstance(settings, dict):
            settings = {}
        settings_text = ", ".join(f"{k}={v}" for k, v in settings.items())
        rows.append(
            {
                "doc_id": str(fm.get("id", path.stem)),
                "title": str(fm.get("title", "")),
                "domain": str(block.get("domain", "")),
                "tool": str(block.get("tool_name", "")),
                "target": str(block.get("target", "")),
                "command": str(block.get("command", "")),
                "gate": str(block.get("gate", "")),
                "settings_text": settings_text,
            }
        )
    return rows


def collect_cov_sources() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for path in sorted(COV_ROOT.glob("UT-COV-*.md")):
        if path.stem == "UT-COV-001":
            continue
        fm = split_frontmatter(path.read_text(encoding="utf-8"))
        block = parse_fence(path, COV_FENCE)
        domain = str(block.get("domain", ""))
        metrics = block.get("metrics", [])
        if not isinstance(metrics, list):
            continue
        for metric in metrics:
            if not isinstance(metric, dict):
                continue
            rows.append(
                {
                    "doc_id": str(fm.get("id", path.stem)),
                    "domain": domain,
                    "metric_id": str(metric.get("id", "")),
                    "name": str(metric.get("name", "")),
                    "target": str(metric.get("target", "")),
                    "threshold": str(metric.get("threshold", "")),
                    "source": str(metric.get("source", "")),
                    "action": str(metric.get("action", "")),
                }
            )
    return rows


def dump_frontmatter(data: dict[str, Any]) -> str:
    return yaml.safe_dump(data, allow_unicode=True, sort_keys=False).strip() + "\n"


def render_stat_aggregate(today: str, stat_rows: list[dict[str, Any]]) -> str:
    fm = {
        "id": "UT-STAT-001",
        "title": "静的解析方針 001",
        "doc_type": "静的解析方針",
        "phase": "UT",
        "version": "1.0.3",
        "status": "下書き",
        "owner": "RQ-SH-001",
        "created": "2026-01-31",
        "updated": today,
        "up": ["[[BD-DEV-TEST-001]]", "[[DD-APP-API-001]]"],
        "related": [
            "[[UT-PLAN-001]]",
            "[[UT-PLAN-002]]",
            "[[UT-PLAN-003]]",
            "[[UT-PLAN-004]]",
            "[[UT-PLAN-005]]",
            "[[UT-MET-001]]",
            "[[IT-PLAN-001]]",
        ],
        "tags": ["diopside", "UT", "STAT"],
    }
    lines = [
        "---",
        dump_frontmatter(fm).rstrip(),
        "---",
        "",
        "## テスト目的",
        "- 単体テストで利用する静的解析設定をツール単位で一元管理する。",
        "",
        "## 集約表（自動生成）",
        "| 文書 | 領域 | ツール | 対象 | 設定 | 実行コマンド | 失敗条件 |",
        "| --- | --- | --- | --- | --- | --- | --- |",
    ]
    for row in stat_rows:
        lines.append(
            "| "
            + " | ".join(
                [
                    f"[[{row['doc_id']}]]",
                    row["domain"],
                    row["tool"],
                    row["target"],
                    row["settings_text"],
                    f"`{row['command']}`",
                    row["gate"],
                ]
            )
            + " |"
        )

    lines.extend(
        [
            "",
            "## 注意",
            "- この文書は自動生成対象。手動編集せず、`UT-STAT-00x` を修正して再生成する。",
            "",
            "## 変更履歴",
            f"- {today}: `UT-STAT-00x` から集約表を自動再生成",
            "- 2026-02-11: 領域別静的解析観点（DOC/INF/FE/BE）を追加",
            "- 2026-02-10: 新規作成",
            "",
        ]
    )
    return "\n".join(lines)


def render_cov_aggregate(today: str, cov_rows: list[dict[str, Any]]) -> str:
    fm = {
        "id": "UT-COV-001",
        "title": "カバレッジ方針 001",
        "doc_type": "カバレッジ方針",
        "phase": "UT",
        "version": "1.0.3",
        "status": "下書き",
        "owner": "RQ-SH-001",
        "created": "2026-01-31",
        "updated": today,
        "up": ["[[BD-DEV-TEST-001]]", "[[DD-APP-API-001]]"],
        "related": [
            "[[UT-PLAN-001]]",
            "[[UT-PLAN-002]]",
            "[[UT-PLAN-003]]",
            "[[UT-PLAN-004]]",
            "[[UT-PLAN-005]]",
            "[[UT-MET-001]]",
            "[[IT-PLAN-001]]",
        ],
        "tags": ["diopside", "UT", "COV"],
    }
    lines = [
        "---",
        dump_frontmatter(fm).rstrip(),
        "---",
        "",
        "## テスト目的",
        "- 単体テストで使用するカバレッジ指標と閾値を領域別に一元管理する。",
        "",
        "## 集約表（自動生成）",
        "| 文書 | 領域 | 指標 | 計測対象 | 閾値 | 算出元 | 未達時対応 |",
        "| --- | --- | --- | --- | --- | --- | --- |",
    ]
    for row in cov_rows:
        lines.append(
            "| "
            + " | ".join(
                [
                    f"[[{row['doc_id']}]]",
                    row["domain"],
                    row["name"],
                    row["target"],
                    row["threshold"],
                    row["source"],
                    row["action"],
                ]
            )
            + " |"
        )

    lines.extend(
        [
            "",
            "## 注意",
            "- この文書は自動生成対象。手動編集せず、`UT-COV-00x` を修正して再生成する。",
            "",
            "## 変更履歴",
            f"- {today}: `UT-COV-00x` から集約表を自動再生成",
            "- 2026-02-11: 領域別カバレッジ観点（DOC/INF/FE/BE）を追加",
            "- 2026-02-10: 新規作成",
            "",
        ]
    )
    return "\n".join(lines)


def render_met_aggregate(
    today: str,
    cov_rows: list[dict[str, Any]],
    stat_rows: list[dict[str, Any]],
) -> str:
    fm = {
        "id": "UT-MET-001",
        "title": "品質メトリクス 001",
        "doc_type": "品質メトリクス",
        "phase": "UT",
        "version": "1.0.3",
        "status": "下書き",
        "owner": "RQ-SH-001",
        "created": "2026-01-31",
        "updated": today,
        "up": ["[[BD-DEV-TEST-001]]", "[[DD-APP-API-001]]"],
        "related": [
            "[[UT-PLAN-001]]",
            "[[UT-COV-001]]",
            "[[UT-STAT-001]]",
            "[[IT-PLAN-001]]",
        ],
        "tags": ["diopside", "UT", "MET"],
    }

    lines = [
        "---",
        dump_frontmatter(fm).rstrip(),
        "---",
        "",
        "## テスト目的",
        "- 静的解析とカバレッジの閾値を単一表で可視化し、単体品質の判定入力を統一する。",
        "",
        "## カバレッジKPI（自動生成）",
        "| 領域 | 指標 | 目標値 | データソース | 判定 |",
        "| --- | --- | --- | --- | --- |",
    ]

    for row in cov_rows:
        lines.append(
            f"| {row['domain']} | {row['name']} | {row['threshold']} | [[{row['doc_id']}]] / {row['source']} | threshold check |"
        )

    lines.extend(
        [
            "",
            "## 静的解析KPI（自動生成）",
            "| 領域 | ツール | 目標値 | データソース | 判定 |",
            "| --- | --- | --- | --- | --- |",
        ]
    )
    for row in stat_rows:
        lines.append(
            f"| {row['domain']} | {row['tool']} | PASS（違反0） | [[{row['doc_id']}]] | {row['gate']} |"
        )

    lines.extend(
        [
            "",
            "## 注意",
            "- この文書は自動生成対象。手動編集せず、`UT-STAT-00x` と `UT-COV-00x` を修正して再生成する。",
            "",
            "## 変更履歴",
            f"- {today}: `UT-STAT-00x` / `UT-COV-00x` から品質メトリクス表を自動再生成",
            "- 2026-02-11: 領域別品質メトリクス観点（DOC/INF/FE/BE）を追加",
            "- 2026-02-10: 新規作成",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="check mode (no write)")
    args = parser.parse_args()

    today = dt.date.today().isoformat()
    stat_rows = collect_stat_sources()
    cov_rows = collect_cov_sources()

    outputs = {
        STAT_ROOT / "UT-STAT-001.md": render_stat_aggregate(today, stat_rows),
        COV_ROOT / "UT-COV-001.md": render_cov_aggregate(today, cov_rows),
        MET_ROOT / "UT-MET-001.md": render_met_aggregate(today, cov_rows, stat_rows),
    }

    changed: list[Path] = []
    for path, content in outputs.items():
        before = path.read_text(encoding="utf-8") if path.exists() else ""
        if before != content:
            changed.append(path)
            if not args.check:
                path.write_text(content, encoding="utf-8")

    if args.check and changed:
        print("Outdated generated files:")
        for path in changed:
            print(f"- {path.as_posix()}")
        return 1

    print(f"Processed stat={len(stat_rows)} cov={len(cov_rows)} changed={len(changed)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
