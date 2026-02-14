---
id: DD-APP-DB-015
title: publish_runsテーブル
doc_type: DDL
phase: DD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-13'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-DATA-001]]'
related:
- '[[RQ-FR-005]]'
- '[[RQ-FR-024]]'
- '[[RQ-FR-025]]'
- '[[DD-APP-API-014]]'
- '[[DD-APP-API-015]]'
- '[[DD-APP-DB-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---

## 詳細仕様
- `publish_runs` は[[RQ-GL-018|配信反映実行]]単位を保持し、成果物生成から公開切替までの全体状態を管理する。
- タグ公開、一覧公開、ドキュメント公開を `publish_type` で共通管理する。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `publish_run_id` | uuid | No | PK | 配信run ID |
| `source_run_id` | uuid | Yes | FK | `ingestion_runs.run_id` |
| `publish_type` | varchar(16) | No | CHECK | `tag_master/archive/all/docs` |
| `trigger_type` | varchar(16) | No | CHECK | `manual/scheduled` |
| `status` | varchar(16) | No | CHECK | `queued/running/rollback_pending/succeeded/failed/rolled_back/cancelled` |
| `triggered_by` | varchar(64) | Yes | NULL許容 | 実行主体 |
| `started_at` | timestamptz | Yes | NULL許容 | 開始時刻 |
| `finished_at` | timestamptz | Yes | NULL許容 | 終了時刻 |
| `published_at` | timestamptz | Yes | NULL許容 | 公開時刻 |
| `rollback_executed` | boolean | No | DEFAULT false | ロールバック有無 |
| `rollback_to_version` | varchar(64) | Yes | NULL許容 | 切戻し先バージョン |
| `error_code` | varchar(64) | Yes | NULL許容 | 失敗コード |
| `error_message` | text | Yes | NULL許容 | 失敗理由 |
| `retryable` | boolean | No | DEFAULT false | 再試行可否 |
| `trace_id` | varchar(64) | No | NOT NULL | 相関ID |
| `created_at` | timestamptz | No | DEFAULT now() | 作成時刻 |

## インデックス
- `idx_publish_runs_status_created` (`status`, `created_at` desc)
- `idx_publish_runs_type_created` (`publish_type`, `created_at` desc)
- `idx_publish_runs_source_run` (`source_run_id`)
- `idx_publish_runs_trace_id` (`trace_id`)

## 状態遷移ルール
- `queued -> running -> succeeded/failed/rolled_back/cancelled` の順序のみ許可する。
- `rollback_executed=true` の場合は `status=rolled_back` を必須とする。

## I/Oまたは責務
- 入力: 配信反映要求、成果物検証結果、公開切替結果。
- 出力: 配信run履歴、公開状態、ロールバック判定情報。

## 変更履歴
- 2026-02-13: [[RQ-GL-018|publish_run]]の主体/時刻/エラー系カラム制約を補完
- 2026-02-11: 新規作成
