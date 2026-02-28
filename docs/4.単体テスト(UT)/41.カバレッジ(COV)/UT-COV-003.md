---
id: UT-COV-003
title: カバレッジ方針 003（インフラ）
doc_type: カバレッジ方針
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-003]]'
  - '[[UT-STAT-004]]'
  - '[[UT-STAT-005]]'
related:
  - '[[UT-COV-001]]'
  - '[[UT-MET-001]]'
tags:
  - diopside
  - UT
  - COV
  - INF
---

## テスト目的
- インフラの単体検証で、rewrite経路・構成検証・静的品質の未検証を可視化する。

## 指標定義
| 指標 | 計測対象 | 閾値 | 算出元 | 未達時対応 |
| --- | --- | --- | --- | --- |
| infra_jest_line_coverage | `infra/test/**` の行カバレッジ | >=75% | `npm --prefix infra run test -- --coverage` | 欠落分岐を追加 |
| rewrite_route_case_pass_rate | `UT-CASE-INF-015` の主要経路ケース | 100% | UT実行結果 | rewriteロジック修正と再実行 |
| cdk_nag_violation_count | `AwsSolutions` 重大違反件数 | 0 | `npm --prefix infra run test` | suppressions見直しと設定修正 |

```ut-cov
domain: INF
metrics:
  - id: infra_jest_line_coverage
    name: infra_jest_line_coverage
    target: infra test line coverage
    threshold: ">=75%"
    source: npm --prefix infra run test -- --coverage
    action: add tests for uncovered branches
  - id: rewrite_route_case_pass_rate
    name: rewrite_route_case_pass_rate
    target: UT-CASE-INF-015 core routes
    threshold: "=100%"
    source: unit test execution report
    action: fix rewrite logic and rerun
  - id: cdk_nag_violation_count
    name: cdk_nag_violation_count
    target: AwsSolutions critical/high findings
    threshold: "=0"
    source: infra jest cdk-nag test
    action: fix violations and update suppressions
```

## 変更履歴
- 2026-02-28: 新規作成
