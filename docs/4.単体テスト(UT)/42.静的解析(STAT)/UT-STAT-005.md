---
id: UT-STAT-005
title: '静的解析方針 005（INF: cdk-nag）'
doc_type: 静的解析方針
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-003]]'
  - '[[UT-LINT-001]]'
related:
  - '[[UT-STAT-001]]'
  - '[[UT-MET-001]]'
tags:
  - diopside
  - UT
  - STAT
  - INF
---

## ツール概要
- ツール: `cdk-nag`（`AwsSolutionsChecks`）
- 目的: CDK構成のセキュリティ/運用ベストプラクティス逸脱を静的に検出する。

## 設定
| 項目 | 値 |
| --- | --- |
| checks | `AwsSolutionsChecks({ verbose: true })` |
| test_entry | `infra/test/quartz-site-stack.test.ts` |
| suppression_policy | `NagSuppressions` は根拠付きで限定許可 |

## 対象
- `infra/lib/quartz-site-stack.ts`
- `infra/bin/quartz-site.ts`
- `infra/test/quartz-site-stack.test.ts`

## 実行コマンド
- `npm --prefix infra run test`

## 失敗条件
- 終了コード `!= 0`。
- `AwsSolutions` 系の未抑制違反が 1 件以上。

```ut-static
tool_id: UT-STAT-005
tool_name: cdk-nag AwsSolutionsChecks
domain: INF
target: infra stack and stack tests
command: npm --prefix infra run test
settings:
  checks: AwsSolutionsChecks verbose=true
  suppression: NagSuppressions with documented reason
  test_file: infra/test/quartz-site-stack.test.ts
gate: exit_code == 0 and unsuppressed_aws_solutions_findings == 0
```

## 変更履歴
- 2026-02-28: 新規作成
