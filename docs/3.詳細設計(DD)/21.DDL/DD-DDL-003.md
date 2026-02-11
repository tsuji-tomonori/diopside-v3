---
id: DD-DDL-003
title: videosテーブル
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
- '[[DD-DBCON-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---


## 詳細仕様
- `videos` は公開アーカイブの検索・一覧・詳細表示で利用する主データを保持する。
- 収集由来の追跡属性（source/update種別）を保持し、[[RQ-GL-011|再収集]]時の差分判定に使用する。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `video_id` | varchar(32) | No | PK | YouTube動画ID |
| `channel_id` | varchar(64) | No | FK | `channels.channel_id` |
| `title` | varchar(255) | No |  | 動画タイトル |
| `published_at` | timestamptz | No |  | 公開日時 |
| `duration_sec` | integer | Yes | CHECK | 再生時間（秒） |
| `description` | text | Yes |  | 説明文 |
| `thumbnail_url` | text | Yes |  | サムネイルURL |
| `source_type` | varchar(16) | No | CHECK | `official` / `appearance` |
| `update_type` | varchar(16) | No | CHECK | `new` / `existing` / `supplement` / `recheck` |
| `normalized_at` | timestamptz | No |  | 正規化時刻 |
| `created_at` | timestamptz | No | DEFAULT now() | 作成時刻 |
| `updated_at` | timestamptz | No | DEFAULT now() | 更新時刻 |

## インデックス
- `idx_videos_published_at` (`published_at` desc)
- `idx_videos_channel_published` (`channel_id`, `published_at` desc)
- `idx_videos_source_update` (`source_type`, `update_type`)

## 更新ルール
- `video_id` の重複は許可しない。重複受信時は更新扱いで `updated_at` を更新する。
- `published_at` は取得時の正規化値を保持し、後続更新で巻き戻しを許可しない。
- `source_type` と `update_type` の欠落レコードは配信対象から除外する。

## I/Oまたは責務
- 入力: 収集API結果、チャンネル正本、正規化処理結果。
- 出力: 検索・一覧・詳細表示で参照する動画正本データ。

## 変更履歴
- 2026-02-11: videosのカラム、インデックス、更新ルールを追加
- 2026-02-10: 新規作成
