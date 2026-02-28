---
id: UT-STAT-007
title: '静的解析方針 007（BE: API契約文書整合）'
doc_type: 静的解析方針
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-001]]'
related:
  - '[[UT-STAT-001]]'
  - '[[UT-MET-001]]'
tags:
  - diopside
  - UT
  - STAT
  - BE
---

## ツール概要
- ツール: `validate_vault.py --targets`
- 目的: バックエンドAPI契約文書のリンク/構造整合を静的に検証する。

## 設定
| 項目 | 値 |
| --- | --- |
| docs_root | `docs` |
| report | `reports/doc_check.md` |
| targets | `docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-*.md` |

## 対象
- `DD-APP-API-002`〜`DD-APP-API-015` を含む API詳細設計文書。

## 実行コマンド
- `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md --targets docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-001.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-002.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-003.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-004.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-005.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-006.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-007.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-008.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-009.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-010.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-011.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-012.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-013.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-014.md docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-015.md`

## 失敗条件
- 終了コード `!= 0`。
- 対象API文書で `broken_links` または `issues` が 1 件以上。

```ut-static
tool_id: UT-STAT-007
tool_name: validate_vault.py --targets (DD-APP-API)
domain: BE
target: DD-APP-API-001 to DD-APP-API-015
command: python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md --targets <DD-APP-API files>
settings:
  docs_root: docs
  report: reports/doc_check.md
  target_scope: docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-*.md
gate: exit_code == 0 and target_issues == 0 and target_broken_links == 0
```

## 変更履歴
- 2026-02-28: 新規作成
