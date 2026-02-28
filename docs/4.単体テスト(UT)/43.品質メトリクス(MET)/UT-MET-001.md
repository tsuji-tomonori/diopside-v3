---
id: UT-MET-001
title: 品質メトリクス 001
doc_type: 品質メトリクス
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
- '[[UT-COV-001]]'
- '[[UT-STAT-001]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- UT
- MET
---

## テスト目的
- 静的解析とカバレッジの閾値を単一表で可視化し、単体品質の判定入力を統一する。

## カバレッジKPI（自動生成）
| 領域 | 指標 | 目標値 | データソース | 判定 |
| --- | --- | --- | --- | --- |
| DOC | docs_guard_success_rate | =100% | [[UT-COV-002]] / task execution log | threshold check |
| DOC | broken_links_count | =0 | [[UT-COV-002]] / validate_vault report | threshold check |
| DOC | frontmatter_missing_count | =0 | [[UT-COV-002]] / validate_vault report | threshold check |
| INF | infra_jest_line_coverage | >=75% | [[UT-COV-003]] / npm --prefix infra run test -- --coverage | threshold check |
| INF | rewrite_route_case_pass_rate | =100% | [[UT-COV-003]] / unit test execution report | threshold check |
| INF | cdk_nag_violation_count | =0 | [[UT-COV-003]] / infra jest cdk-nag test | threshold check |
| FE | fe_branches_coverage | >=70% | [[UT-COV-004]] / npm --prefix web run test:coverage | threshold check |
| FE | fe_lines_coverage | >=75% | [[UT-COV-004]] / npm --prefix web run test:coverage | threshold check |
| FE | fe_state_transition_pass_rate | =100% | [[UT-COV-004]] / UT-CASE-FE-016 execution report | threshold check |
| BE | be_api_case_pass_rate | =100% | [[UT-COV-005]] / api unit execution report | threshold check |
| BE | be_reject_code_match_rate | =100% | [[UT-COV-005]] / case expected vs actual comparison | threshold check |
| BE | be_pairwise_coverage_rate | =100% | [[UT-COV-005]] / task docs:ut:pairwise:check | threshold check |

## 静的解析KPI（自動生成）
| 領域 | ツール | 目標値 | データソース | 判定 |
| --- | --- | --- | --- | --- |
| DOC | validate_vault.py | PASS（違反0） | [[UT-STAT-002]] | exit_code == 0 and issues == 0 and broken_links == 0 and unresolved_body_links == 0 |
| DOC | auto_link_glossary.py --check | PASS（違反0） | [[UT-STAT-003]] | exit_code == 0 and changed == 0 |
| INF | TypeScript (infra) | PASS（違反0） | [[UT-STAT-004]] | exit_code == 0 and tsc_errors == 0 |
| INF | cdk-nag AwsSolutionsChecks | PASS（違反0） | [[UT-STAT-005]] | exit_code == 0 and unsuppressed_aws_solutions_findings == 0 |
| FE | TypeScript (web) | PASS（違反0） | [[UT-STAT-006]] | exit_code == 0 and tsc_errors == 0 |
| BE | validate_vault.py --targets (DD-APP-API) | PASS（違反0） | [[UT-STAT-007]] | exit_code == 0 and target_issues == 0 and target_broken_links == 0 |
| BE | pairwise generator check (BE) | PASS（違反0） | [[UT-STAT-008]] | exit_code == 0 and generated_diff == 0 and pairwise_coverage == 100% |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-STAT-00x` と `UT-COV-00x` を修正して再生成する。

## 変更履歴
- 2026-02-28: `UT-STAT-00x` / `UT-COV-00x` から品質メトリクス表を自動再生成
- 2026-02-11: 領域別品質メトリクス観点（DOC/INF/FE/BE）を追加
- 2026-02-10: 新規作成
