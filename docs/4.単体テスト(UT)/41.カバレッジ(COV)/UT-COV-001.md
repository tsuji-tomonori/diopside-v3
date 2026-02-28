---
id: UT-COV-001
title: カバレッジ方針 001
doc_type: カバレッジ方針
phase: UT
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: '2026-01-31'
updated: '2026-02-28'
up:
- '[[BD-DEV-TEST-001]]'
- '[[DD-APP-API-001]]'
related:
- '[[UT-PLAN-001]]'
- '[[UT-PLAN-002]]'
- '[[UT-PLAN-003]]'
- '[[UT-PLAN-004]]'
- '[[UT-PLAN-005]]'
- '[[UT-MET-001]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- UT
- COV
---

## テスト目的
- 単体テストで使用するカバレッジ指標と閾値を領域別に一元管理する。

## 集約表（自動生成）
| 文書 | 領域 | 指標 | 計測対象 | 閾値 | 算出元 | 未達時対応 |
| --- | --- | --- | --- | --- | --- | --- |
| [[UT-COV-002]] | DOC | docs_guard_success_rate | task docs:guard | =100% | task execution log | fix and rerun docs:guard |
| [[UT-COV-002]] | DOC | broken_links_count | reports/doc_check.md broken_links | =0 | validate_vault report | block merge until links fixed |
| [[UT-COV-002]] | DOC | frontmatter_missing_count | reports/doc_check.md frontmatter issues | =0 | validate_vault report | fill missing keys and rerun |
| [[UT-COV-003]] | INF | infra_jest_line_coverage | infra test line coverage | >=75% | npm --prefix infra run test -- --coverage | add tests for uncovered branches |
| [[UT-COV-003]] | INF | rewrite_route_case_pass_rate | UT-CASE-INF-015 core routes | =100% | unit test execution report | fix rewrite logic and rerun |
| [[UT-COV-003]] | INF | cdk_nag_violation_count | AwsSolutions critical/high findings | =0 | infra jest cdk-nag test | fix violations and update suppressions |
| [[UT-COV-004]] | FE | fe_branches_coverage | web src branch coverage | >=70% | npm --prefix web run test:coverage | add branch test cases |
| [[UT-COV-004]] | FE | fe_lines_coverage | web src line coverage | >=75% | npm --prefix web run test:coverage | add tests for uncovered lines |
| [[UT-COV-004]] | FE | fe_state_transition_pass_rate | loading/success/empty/error transitions | =100% | UT-CASE-FE-016 execution report | fix state transition implementation |
| [[UT-COV-005]] | BE | be_api_case_pass_rate | UT-CASE-BE-001 to UT-CASE-BE-013 | =100% | backend unit execution report | fix API contract regressions |
| [[UT-COV-005]] | BE | be_reject_code_match_rate | reject code mapping accuracy | =100% | case expected vs actual comparison | update error handling and contract mapping |
| [[UT-COV-005]] | BE | be_pairwise_coverage_rate | UT-PW-BE pairwise coverage | =100% | task docs:ut:pairwise:check | revise factors and excludes |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-COV-00x` を修正して再生成する。

## 変更履歴
- 2026-02-28: `UT-COV-00x` から集約表を自動再生成
- 2026-02-11: 領域別カバレッジ観点（DOC/INF/FE/BE）を追加
- 2026-02-10: 新規作成
