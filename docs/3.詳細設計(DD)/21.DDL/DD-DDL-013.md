---
id: DD-DDL-013
title: publish_stepsテーブル
doc_type: DDL
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[BD-ARCH-001]]'
- '[[BD-DATA-001]]'
related:
- '[[RQ-FR-024]]'
- '[[RQ-FR-025]]'
- '[[DD-API-014]]'
- '[[DD-API-015]]'
- '[[DD-DDL-012]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---

## 詳細仕様
- `publish_steps` は配信run内の個別ステップ進行を保持する。
- 失敗時に停止ステップを特定し、再試行またはロールバック判断へ利用する。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `publish_step_id` | uuid | No | PK | ステップID |
| `publish_run_id` | uuid | No | FK | `publish_runs.publish_run_id` |
| `step_name` | varchar(32) | No | CHECK | `generate/validate/switch/post_check/docs_link_check/quartz_build/cdk_deploy/invalidation` |
| `status` | varchar(16) | No | CHECK | `queued/running/succeeded/failed/skipped` |
| `started_at` | timestamptz | Yes |  | 開始時刻 |
| `finished_at` | timestamptz | Yes |  | 終了時刻 |
| `error_code` | varchar(64) | Yes |  | 失敗コード |
| `error_message` | text | Yes |  | 失敗理由 |
| `trace_id` | varchar(64) | No |  | 相関ID |
| `created_at` | timestamptz | No | DEFAULT now() | 作成時刻 |

## インデックス
- `idx_publish_steps_run_order` (`publish_run_id`, `created_at`)
- `idx_publish_steps_run_status` (`publish_run_id`, `status`)
- `idx_publish_steps_name_status` (`step_name`, `status`)

## 記録ルール
- 同一 `publish_run_id` 内で同一 `step_name` は1件とする。
- `status=failed` のとき `error_code` を必須とする。
- `skipped` は前段失敗時のみ設定し、`error_message` に理由を記録する。

## I/Oまたは責務
- 入力: ステップ実行開始/完了イベント、エラー情報。
- 出力: ステップ進捗、失敗位置、再試行判断情報。

## 変更履歴
- 2026-02-11: 新規作成
