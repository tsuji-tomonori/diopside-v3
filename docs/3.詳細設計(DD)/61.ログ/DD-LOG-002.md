---
id: DD-LOG-002
title: インフラ監視ログ詳細
doc_type: ログ設計
phase: DD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
  - '[[BD-MON-003]]'
  - '[[BD-ADR-022]]'
related:
  - '[[DD-DEP-003]]'
  - '[[DD-SEC-002]]'
  - '[[AT-OPS-001]]'
  - '[[AT-RPT-001]]'
tags:
  - diopside
  - DD
  - LOG
---

## 詳細仕様
- インフラ監視ログは経路別イベントを最小スキーマで統一し、運用判定へ直接利用する。
- 出力先はCloudWatch Logsとし、保持期間は30日固定とする。

## ログイベント
| event.name | category | 必須キー |
|---|---|---|
| `infra.deploy.started` | operational | `trace_id`, `deployment_unit`, `version` |
| `infra.deploy.finished` | operational | `trace_id`, `deployment_unit`, `result`, `duration_ms` |
| `infra.route.error_rate_high` | operational | `trace_id`, `route`, `error_rate` |
| `infra.auth.failed` | security | `trace_id`, `route`, `status_code` |
| `infra.invalidation.slow` | operational | `trace_id`, `path_group`, `elapsed_ms` |

## 品質基準
- 必須キー充足率99%以上。
- 欠測率1%超でWarning、5%超でCritical。
- securityカテゴリはサンプリング禁止。

## 運用連携
- 日次で欠測率、経路別エラー率、認証失敗率を集計し [[AT-OPS-001]] へ記録する。
- 月次で可用性判定に必要なログ要約を [[AT-RPT-001]] へ転記する。

## 障害時ハンドリング
- 収集停止または欠測急増時は、監視系障害として一次復旧を優先する。
- ログ品質未達時は可用性/性能の判定を保留し、再集計後に確定する。

## 変更履歴
- 2026-02-11: 新規作成（インフラ監視ログイベントと品質基準） [[BD-ADR-022]]
- 2026-02-11: ADR参照をCloudWatch保持と構造化ログ方針へ整理 [[BD-ADR-022]]
