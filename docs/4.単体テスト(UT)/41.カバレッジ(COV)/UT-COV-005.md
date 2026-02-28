---
id: UT-COV-005
title: カバレッジ方針 005（バックエンド）
doc_type: カバレッジ方針
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[UT-STAT-007]]'
  - '[[UT-STAT-008]]'
related:
  - '[[UT-COV-001]]'
  - '[[UT-MET-001]]'
tags:
  - diopside
  - UT
  - COV
  - BE
---

## テスト目的
- API契約の正常系/異常系/境界値を定量管理し、バックエンド契約破壊の持ち越しを防止する。

## 指標定義
| 指標 | 計測対象 | 閾値 | 算出元 | 未達時対応 |
| --- | --- | --- | --- | --- |
| be_api_case_pass_rate | `UT-CASE-BE-001`〜`UT-CASE-BE-013` | 100% | 単体テスト実行結果 | 契約不整合の修正 |
| be_reject_code_match_rate | 拒否コード一致率（403/404/409等） | 100% | UTケース期待値比較 | 例外マッピング修正 |
| be_pairwise_coverage_rate | `UT-PW-BE-*` の2-wise被覆率 | 100% | `task docs:ut:pairwise:check` | 因子/除外条件再設計 |

```ut-cov
domain: BE
metrics:
  - id: be_api_case_pass_rate
    name: be_api_case_pass_rate
    target: UT-CASE-BE-001 to UT-CASE-BE-013
    threshold: "=100%"
    source: backend unit execution report
    action: fix API contract regressions
  - id: be_reject_code_match_rate
    name: be_reject_code_match_rate
    target: reject code mapping accuracy
    threshold: "=100%"
    source: case expected vs actual comparison
    action: update error handling and contract mapping
  - id: be_pairwise_coverage_rate
    name: be_pairwise_coverage_rate
    target: UT-PW-BE pairwise coverage
    threshold: "=100%"
    source: task docs:ut:pairwise:check
    action: revise factors and excludes
```

## 変更履歴
- 2026-02-28: 新規作成
