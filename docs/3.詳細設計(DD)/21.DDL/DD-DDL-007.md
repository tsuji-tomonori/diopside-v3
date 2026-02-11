---
id: DD-DDL-007
title: ingestion_runsテーブル
doc_type: DDL
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-ARCH-001]]'
- '[[BD-DATA-001]]'
related:
- '[[RQ-FR-001]]'
- '[[RQ-OBY-001]]'
- '[[DD-LOG-001]]'
- '[[DD-DBCON-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---


## 詳細仕様
- `ingestion_runs` は収集実行単位の状態遷移と集計値を保持する。
- 管理画面の実行履歴表示と再実行判定の正本データとして利用する。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `run_id` | uuid | No | PK | 実行ID |
| `mode` | varchar(16) | No | CHECK | `manual` / `scheduled` |
| `status` | varchar(16) | No | CHECK | `queued/running/succeeded/failed/canceled` |
| `target_types` | text[] | No |  | `official` / `appearance` |
| `requested_by` | varchar(64) | Yes |  | 実行主体 |
| `started_at` | timestamptz | Yes |  | 実行開始 |
| `finished_at` | timestamptz | Yes |  | 実行終了 |
| `processed_count` | integer | No | DEFAULT 0 | 処理件数 |
| `failed_count` | integer | No | DEFAULT 0 | 失敗件数 |
| `trace_id` | varchar(64) | No |  | 相関ID |
| `created_at` | timestamptz | No | DEFAULT now() | 作成時刻 |

## インデックス
- `idx_ingestion_runs_status_created` (`status`, `created_at` desc)
- `idx_ingestion_runs_started_at` (`started_at` desc)
- `idx_ingestion_runs_trace_id` (`trace_id`)

## 状態遷移ルール
- `queued -> running -> succeeded/failed/canceled` の順序のみ許可する。
- `succeeded` 以外からの `retry` は新規 `run_id` を発行し、原runは更新しない。
- `finished_at` は終端状態遷移時にのみ設定する。

## I/Oまたは責務
- 入力: 収集起動API、実行状態更新イベント、再実行要求。
- 出力: run履歴、状態遷移監査情報、集計メトリクス。

## 変更履歴
- 2026-02-11: ingestion_runsのカラム、状態遷移、インデックスを追加
- 2026-02-10: 新規作成
