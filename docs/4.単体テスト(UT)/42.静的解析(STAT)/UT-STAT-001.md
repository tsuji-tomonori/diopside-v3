---
id: UT-STAT-001
title: 静的解析方針 001
doc_type: 静的解析方針
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
- STAT
---

## テスト目的
- 単体テストで利用する静的解析設定をツール単位で一元管理する。

## 集約表（自動生成）
| 文書 | 領域 | ツール | 対象 | 設定 | 実行コマンド | 失敗条件 |
| --- | --- | --- | --- | --- | --- | --- |
| [[UT-STAT-002]] | DOC | validate_vault.py | docs/**/*.md (excluding README.md and TEMPLATE.md) | docs_root=docs, report=reports/doc_check.md, require_history_links=False | `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` | exit_code == 0 and issues == 0 and broken_links == 0 and unresolved_body_links == 0 |
| [[UT-STAT-003]] | DOC | auto_link_glossary.py --check | changed docs markdown files | docs_root=docs, mode=check, glossary_source=docs/1.要求(RQ)/21.用語(GL)/RQ-GL-*.md, exclude_targets=docs/4.単体テスト(UT)/21.単体テストケース(CASE)/**/*-PW.md | `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py --docs-root docs --check <targets...>` | exit_code == 0 and changed == 0 |
| [[UT-STAT-004]] | INF | TypeScript (infra) | infra/bin/**/*.ts, infra/lib/**/*.ts | tsconfig=infra/tsconfig.json, strict=True, module=CommonJS | `npm --prefix infra run build` | exit_code == 0 and tsc_errors == 0 |
| [[UT-STAT-005]] | INF | cdk-nag AwsSolutionsChecks | infra stack and stack tests | checks=AwsSolutionsChecks verbose=true, suppression=NagSuppressions with documented reason, test_file=infra/test/quartz-site-stack.test.ts | `npm --prefix infra run test` | exit_code == 0 and unsuppressed_aws_solutions_findings == 0 |
| [[UT-STAT-006]] | FE | TypeScript (web) | web/src/**/*.{ts,tsx} | tsconfig=web/tsconfig.json, strict=True, noEmit=True, noFallthroughCasesInSwitch=True | `npm --prefix web run typecheck` | exit_code == 0 and tsc_errors == 0 |
| [[UT-STAT-007]] | BE | validate_vault.py --targets (DD-APP-API) | DD-APP-API-001 to DD-APP-API-015 | docs_root=docs, report=reports/doc_check.md, target_scope=docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)/DD-APP-API-*.md | `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md --targets <DD-APP-API files>` | exit_code == 0 and target_issues == 0 and target_broken_links == 0 |
| [[UT-STAT-008]] | BE | pairwise generator check (BE) | UT-PW-BE-* models and generated UT-CASE-BE-*-PW | strict=True, check_mode=True, model_root=docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE) | `task docs:ut:pairwise:check` | exit_code == 0 and generated_diff == 0 and pairwise_coverage == 100% |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-STAT-00x` を修正して再生成する。

## 変更履歴
- 2026-02-28: `UT-STAT-00x` から集約表を自動再生成
- 2026-02-11: 領域別静的解析観点（DOC/INF/FE/BE）を追加
- 2026-02-10: 新規作成
