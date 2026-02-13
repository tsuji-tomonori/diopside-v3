---
id: DD-DDL-010
title: recheck_runsテーブル
doc_type: DDL
phase: DD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-13'
up:
- '[[BD-ARCH-001]]'
- '[[BD-DATA-001]]'
related:
- '[[RQ-FR-019]]'
- '[[DD-API-012]]'
- '[[DD-DDL-007]]'
- '[[DD-DBCON-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---

## 詳細仕様
- `recheck_runs` は配信前後再確認の実行単位を保持する。
- 差分判定の集計値をrun単位で保持し、運用画面の比較結果表示に利用する。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `recheck_run_id` | uuid | No | PK | 再確認run ID |
| `base_run_id` | uuid | Yes | FK | `ingestion_runs.run_id` |
| `mode` | varchar(32) | No | CHECK | `before_delivery/after_delivery` |
| `status` | varchar(16) | No | CHECK | `queued/running/succeeded/failed/partial/cancelled` |
| `requested_by` | varchar(64) | Yes | NULL許容 | 実行主体 |
| `total_count` | integer | No | DEFAULT 0 | 対象件数 |
| `changed_count` | integer | No | DEFAULT 0 | 差分あり件数 |
| `unchanged_count` | integer | No | DEFAULT 0 | 差分なし件数 |
| `failed_count` | integer | No | DEFAULT 0 | 失敗件数 |
| `started_at` | timestamptz | Yes | NULL許容 | 開始時刻 |
| `finished_at` | timestamptz | Yes | NULL許容 | 終了時刻 |
| `trace_id` | varchar(64) | No | NOT NULL | 相関ID |
| `created_at` | timestamptz | No | DEFAULT now() | 作成時刻 |

## インデックス
- `idx_recheck_runs_status_created` (`status`, `created_at` desc)
- `idx_recheck_runs_mode_created` (`mode`, `created_at` desc)
- `idx_recheck_runs_base_run` (`base_run_id`)

## 状態遷移ルール
- `queued -> running -> succeeded/failed/partial/cancelled` の順序のみ許可する。
- 終端状態への遷移時のみ `finished_at` を設定する。

## I/Oまたは責務
- 入力: 再確認要求、比較対象メタデータ、実行結果集計。
- 出力: 再確認run状態、差分集計、失敗監査情報。

## 変更履歴
- 2026-02-13: 実行主体/時刻/trace系カラムの制約を明記
- 2026-02-11: 新規作成
