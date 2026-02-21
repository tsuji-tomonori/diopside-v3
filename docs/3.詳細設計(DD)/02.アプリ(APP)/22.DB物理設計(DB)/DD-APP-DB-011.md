---
id: DD-APP-DB-011
title: ingestion_eventsテーブル
doc_type: DDL
phase: DD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-13'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-DATA-001]]'
related:
- '[[RQ-OBY-001-01]]'
- '[[DD-APP-LOG-001]]'
- '[[DD-APP-DB-010]]'
- '[[DD-APP-DB-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---


## 詳細仕様
- `ingestion_events` はrun内の処理イベントを時系列で保持し、障害切り分けの一次証跡とする。
- 収集対象単位（動画/チャネル）の処理結果を正規化して記録する。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `event_id` | uuid | No | PK | イベントID |
| `run_id` | uuid | No | FK | `ingestion_runs.run_id` |
| `event_type` | varchar(32) | No | NOT NULL | `fetch/normalize/publish/retry` |
| `event_status` | varchar(16) | No | CHECK | `success/warn/failure` |
| `target_id` | varchar(64) | Yes | NULL許容 | 動画IDなど対象識別子 |
| `error_code` | varchar(64) | Yes | NULL許容 | 失敗時コード |
| `message` | text | No | NOT NULL | 説明 |
| `occurred_at` | timestamptz | No | NOT NULL | 発生時刻 |
| `trace_id` | varchar(64) | No | NOT NULL | 相関ID |

## インデックス
- `idx_ingestion_events_run_time` (`run_id`, `occurred_at`)
- `idx_ingestion_events_status` (`event_status`, `occurred_at` desc)
- `idx_ingestion_events_trace_id` (`trace_id`)

## 記録ルール
- run開始・終了イベントは必須記録とする。
- `failure` イベントは `error_code` と `trace_id` を必須とする。
- 同一 `trace_id` の連続失敗3件で運用アラートへ連携する。

## I/Oまたは責務
- 入力: 収集処理イベント、エラー情報、相関ID。
- 出力: 実行イベント履歴、障害解析用証跡、監視連携データ。

## 変更履歴
- 2026-02-13: イベント列の未記載制約（NOT NULL/NULL許容）を補完
- 2026-02-11: ingestion_eventsのカラム、インデックス、記録ルールを追加
- 2026-02-10: 新規作成
