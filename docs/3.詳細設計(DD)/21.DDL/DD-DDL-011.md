---
id: DD-DDL-011
title: recheck_itemsテーブル
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
- '[[RQ-FR-019]]'
- '[[DD-API-012]]'
- '[[DD-DDL-010]]'
- '[[DD-DBCON-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---

## 詳細仕様
- `recheck_items` は再確認run内の動画単位差分結果を保持する。
- 差分有無と対象外理由を区別し、差分確認運用の判断材料を提供する。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `recheck_item_id` | uuid | No | PK | 明細ID |
| `recheck_run_id` | uuid | No | FK | `recheck_runs.recheck_run_id` |
| `video_id` | varchar(32) | No | FK | `videos.video_id` |
| `diff_status` | varchar(16) | No | CHECK | `changed/unchanged/failed/excluded` |
| `diff_fields` | text[] | Yes |  | 差分項目一覧 |
| `reason` | text | Yes |  | 失敗/対象外理由 |
| `compared_at` | timestamptz | Yes |  | 比較完了時刻 |
| `trace_id` | varchar(64) | No |  | 相関ID |
| `created_at` | timestamptz | No | DEFAULT now() | 作成時刻 |

## インデックス
- `idx_recheck_items_run_status` (`recheck_run_id`, `diff_status`)
- `idx_recheck_items_video` (`video_id`, `created_at` desc)
- `idx_recheck_items_compared_at` (`compared_at` desc)

## 記録ルール
- `diff_status=changed` のとき `diff_fields` を1件以上設定する。
- `diff_status=failed` または `excluded` のとき `reason` を必須とする。
- 同一 `recheck_run_id` 内で同一 `video_id` は1件とし、再判定時は更新で扱う。

## I/Oまたは責務
- 入力: 配信前後メタデータ比較結果、例外理由。
- 出力: 動画単位差分結果、運用差分確認用データ。

## 変更履歴
- 2026-02-11: 新規作成
