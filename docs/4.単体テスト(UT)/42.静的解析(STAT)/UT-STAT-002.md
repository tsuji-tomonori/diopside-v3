---
id: UT-STAT-002
title: '静的解析方針 002（DOC: validate_vault）'
doc_type: 静的解析方針
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-002]]'
related:
  - '[[UT-STAT-001]]'
  - '[[UT-MET-001]]'
tags:
  - diopside
  - UT
  - STAT
  - DOC
---

## ツール概要
- ツール: `validate_vault.py`
- 目的: frontmatter必須キー、リンク整合、禁止構造を静的に検証する。

## 設定
| 項目 | 値 |
| --- | --- |
| docs_root | `docs` |
| report | `reports/doc_check.md` |
| validate_target | `docs/**/*.md`（README/TEMPLATE除外） |
| require_history_links | `false`（RQ/BD強制は未適用） |

## 対象
- `docs/**/*.md`（README/TEMPLATE除外）

## 実行コマンド
- `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md`

## 失敗条件
- 終了コード `!= 0`。
- `reports/doc_check.md` の `issues`, `broken_links`, `unresolved_body_links` のいずれかが 1 以上。

```ut-static
tool_id: UT-STAT-002
tool_name: validate_vault.py
domain: DOC
target: docs/**/*.md (excluding README.md and TEMPLATE.md)
command: python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md
settings:
  docs_root: docs
  report: reports/doc_check.md
  require_history_links: false
gate: exit_code == 0 and issues == 0 and broken_links == 0 and unresolved_body_links == 0
```

## 変更履歴
- 2026-02-28: 新規作成
