---
id: DD-DDL-001
title: DDL一覧
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
- '[[RQ-DATA-001]]'
- '[[DD-MIG-001]]'
- '[[DD-DBCON-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---


## 詳細仕様
- 本文書はDB正本の全テーブルと依存順序を定義し、移行順序の基準とする。
- DDL変更は `DD-MIG-001` の段階移行（expand/backfill/switch/contract）に従って適用する。

## テーブル一覧
| テーブル | 主キー | 役割 | 更新主体 |
| --- | --- | --- | --- |
| `channels` | `channel_id` | チャンネル正本 | 収集処理 |
| `videos` | `video_id` | 動画メタデータ正本 | 収集処理 |
| `tag_types` | `tag_type_id` | タグ分類辞書 | 管理画面 |
| `tags` | `tag_id` | [[RQ-GL-005|タグ辞書]]正本 | 管理画面 |
| `video_tags` | `video_id`,`tag_id` | 動画とタグの関連 | 収集/管理画面 |
| `ingestion_runs` | `run_id` | 収集実行単位 | 運用API |
| `ingestion_events` | `event_id` | run内イベント | 収集処理 |

## 依存順序
1. `channels`
2. `videos`（`channels` 参照）
3. `tag_types`
4. `tags`（`tag_types` 参照）
5. `video_tags`（`videos`,`tags` 参照）
6. `ingestion_runs`
7. `ingestion_events`（`ingestion_runs` 参照）

## 共通DDL方針
- 文字列は原則 `varchar`、長文は `text` を使用する。
- 監査用に `created_at` と `updated_at` を全更新系テーブルへ持つ。
- 論理削除が必要なテーブルのみ `deleted_at` を追加し、物理削除は運用承認時に限定する。
- 外部キーは `ON UPDATE RESTRICT` を基本とし、削除挙動はテーブル別に明示する。

## I/Oまたは責務
- 入力: 要求変更、移行計画、データ整合条件、運用制約。
- 出力: テーブル定義一覧、依存順序、DDL適用基準。

## 変更履歴
- 2026-02-11: DDL一覧、依存順序、共通DDL方針を追加
- 2026-02-10: 新規作成
