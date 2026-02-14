---
id: DD-APP-DB-012
title: ingestion_itemsテーブル
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
- '[[RQ-FR-017]]'
- '[[RQ-FR-018]]'
- '[[DD-APP-API-011]]'
- '[[DD-APP-DB-010]]'
- '[[DD-APP-DB-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---

## 詳細仕様
- `ingestion_items` は run内の動画単位結果（成功/失敗/未処理/対象外）を保持する。
- 管理画面で失敗理由を動画単位に追跡し、[[RQ-GL-011|再収集]]対象抽出に利用する。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `item_id` | uuid | No | PK | 明細ID |
| `run_id` | uuid | No | FK | `ingestion_runs.run_id` |
| `video_id` | varchar(32) | No | FK | `videos.video_id` |
| `status` | varchar(16) | No | CHECK | `succeeded/failed/unprocessed/excluded` |
| `failure_reason_code` | varchar(64) | Yes | NULL許容 | 失敗理由コード |
| `failure_scope` | varchar(32) | Yes | NULL許容 | `fetch/normalize/validate/publish` |
| `update_type` | varchar(16) | No | CHECK | `new/existing/supplement/recheck` |
| `source_type` | varchar(16) | No | CHECK | `official/appearance/supplement/incremental` |
| `processed_at` | timestamptz | Yes | NULL許容 | 処理完了時刻 |
| `trace_id` | varchar(64) | No | NOT NULL | 相関ID |
| `created_at` | timestamptz | No | DEFAULT now() | 作成時刻 |

## インデックス
- `idx_ingestion_items_run_status` (`run_id`, `status`)
- `idx_ingestion_items_video` (`video_id`, `created_at` desc)
- `idx_ingestion_items_trace_id` (`trace_id`)

## 記録ルール
- `status=failed` のとき `failure_reason_code` を必須とする。
- 同一 `run_id` 内で同一 `video_id` は1件とし、再判定時は更新で扱う。
- `unprocessed` はrun終了時点で未処理確定した対象のみ設定する。

## I/Oまたは責務
- 入力: 収集処理結果、正規化結果、失敗理由。
- 出力: run明細、[[RQ-GL-011|再収集]]対象抽出、運用追跡情報。

## 変更履歴
- 2026-02-13: 失敗理由/処理時刻/trace系カラムの制約を明記
- 2026-02-11: 新規作成
