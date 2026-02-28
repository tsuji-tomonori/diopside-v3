---
id: UT-COV-004
title: カバレッジ方針 004（フロントエンド）
doc_type: カバレッジ方針
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-004]]'
  - '[[UT-STAT-006]]'
related:
  - '[[UT-COV-001]]'
  - '[[UT-MET-001]]'
tags:
  - diopside
  - UT
  - COV
  - FE
---

## テスト目的
- フロントエンドの表示状態遷移と[[RQ-GL-014|検索条件]]分岐を閾値管理し、UI回帰を早期検知する。

## 指標定義
| 指標 | 計測対象 | 閾値 | 算出元 | 未達時対応 |
| --- | --- | --- | --- | --- |
| fe_branches_coverage | `web/src/**/*.{ts,tsx}` の分岐 | >=70% | `npm --prefix web run test:coverage` | 分岐ケース追加 |
| fe_lines_coverage | `web/src/**/*.{ts,tsx}` の行 | >=75% | `npm --prefix web run test:coverage` | 未達領域のケース追加 |
| fe_state_transition_pass_rate | loading/success/empty/error 遷移ケース | 100% | `UT-CASE-FE-016` 実行結果 | 状態遷移ロジック修正 |

```ut-cov
domain: FE
metrics:
  - id: fe_branches_coverage
    name: fe_branches_coverage
    target: web src branch coverage
    threshold: ">=70%"
    source: npm --prefix web run test:coverage
    action: add branch test cases
  - id: fe_lines_coverage
    name: fe_lines_coverage
    target: web src line coverage
    threshold: ">=75%"
    source: npm --prefix web run test:coverage
    action: add tests for uncovered lines
  - id: fe_state_transition_pass_rate
    name: fe_state_transition_pass_rate
    target: loading/success/empty/error transitions
    threshold: "=100%"
    source: UT-CASE-FE-016 execution report
    action: fix state transition implementation
```

## 変更履歴
- 2026-02-28: 新規作成
