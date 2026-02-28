---
id: UT-COV-002
title: カバレッジ方針 002（ドキュメント）
doc_type: カバレッジ方針
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-002]]'
  - '[[UT-STAT-002]]'
related:
  - '[[UT-COV-001]]'
  - '[[UT-MET-001]]'
tags:
  - diopside
  - UT
  - COV
  - DOC
---

## テスト目的
- ドキュメント運用の単体観点で、整合チェック漏れを防ぐための指標を固定する。

## 指標定義
| 指標 | 計測対象 | 閾値 | 算出元 | 未達時対応 |
| --- | --- | --- | --- | --- |
| docs_guard_success_rate | `task docs:guard` 実行結果 | 100% | Task実行ログ | 失敗要因を修正し再実行 |
| broken_links_count | `reports/doc_check.md` の `broken_links` | 0 | `validate_vault.py` レポート | 破断リンク修正までマージ禁止 |
| frontmatter_missing_count | `reports/doc_check.md` の `issues` 内frontmatter欠落 | 0 | `validate_vault.py` レポート | 欠落キー補完後に再検証 |

```ut-cov
domain: DOC
metrics:
  - id: docs_guard_success_rate
    name: docs_guard_success_rate
    target: task docs:guard
    threshold: "=100%"
    source: task execution log
    action: fix and rerun docs:guard
  - id: broken_links_count
    name: broken_links_count
    target: reports/doc_check.md broken_links
    threshold: "=0"
    source: validate_vault report
    action: block merge until links fixed
  - id: frontmatter_missing_count
    name: frontmatter_missing_count
    target: reports/doc_check.md frontmatter issues
    threshold: "=0"
    source: validate_vault report
    action: fill missing keys and rerun
```

## 変更履歴
- 2026-02-28: 新規作成
