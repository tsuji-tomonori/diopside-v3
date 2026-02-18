---
id: DD-APP-DB-010
title: ingestion_runsテーブル
doc_type: DDL
phase: DD
version: 1.0.5
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-19'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-DATA-001]]'
related:
- '[[RQ-FR-001]]'
- '[[RQ-OBY-001]]'
- '[[DD-APP-LOG-001]]'
- '[[DD-APP-DB-001]]'
- '[[BD-SYS-ADR-034]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---


## 詳細仕様
- `ingestion_runs` は[[RQ-GL-002|収集実行]]単位の状態遷移と集計値を保持する。
- 管理画面の実行履歴表示と再実行判定の正本データとして利用する。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `run_id` | uuid | No | PK | 実行ID |
| `run_kind` | varchar(32) | No | CHECK | `official_ingestion/appearance_supplement/incremental_update` |
| `mode` | varchar(16) | No | CHECK | `manual` / `scheduled` |
| `status` | varchar(16) | No | CHECK | `queued/running/succeeded/failed/partial/cancelled` |
| `target_types` | text[] | No | NOT NULL | `official` / `appearance` |
| `parent_run_id` | uuid | Yes | FK | 再実行元run |
| `requested_by` | varchar(64) | Yes | NULL許容 | 実行主体 |
| `started_at` | timestamptz | Yes | NULL許容 | 実行開始 |
| `finished_at` | timestamptz | Yes | NULL許容 | 実行終了 |
| `target_count` | integer | No | DEFAULT 0 | 対象件数 |
| `processed_count` | integer | No | DEFAULT 0 | 処理件数 |
| `success_count` | integer | No | DEFAULT 0 | 成功件数 |
| `failed_count` | integer | No | DEFAULT 0 | 失敗件数 |
| `unprocessed_count` | integer | No | DEFAULT 0 | 未処理件数 |
| `trace_id` | varchar(64) | No | NOT NULL | 相関ID |
| `created_at` | timestamptz | No | DEFAULT now() | 作成時刻 |

## インデックス
- `idx_ingestion_runs_status_created` (`status`, `created_at` desc)
- `idx_ingestion_runs_started_at` (`started_at` desc)
- `idx_ingestion_runs_trace_id` (`trace_id`)

## 状態遷移ルール
- `queued -> running -> succeeded/failed/partial/cancelled` の順序のみ許可する。
- `succeeded` 以外からの再実行は新規 `run_id` を発行し、`parent_run_id` で原runへ連結する。
- `finished_at` は終端状態遷移時にのみ設定する。

## I/Oまたは責務
- 入力: 収集起動API、実行状態更新イベント、再実行要求。
- 出力: run履歴、状態遷移監査情報、集計メトリクス。

## 変更履歴
- 2026-02-19: `run_kind` 語彙を収集runの3値へ統一し、BD契約との整合を修正 [[BD-SYS-ADR-034]]
- 2026-02-13: 実行主体/時刻/trace系カラムの制約を明記
- 2026-02-11: run種別、再実行連結、partial/cancelled対応と件数列を追加
- 2026-02-11: ingestion_runsのカラム、状態遷移、インデックスを追加
- 2026-02-10: 新規作成
