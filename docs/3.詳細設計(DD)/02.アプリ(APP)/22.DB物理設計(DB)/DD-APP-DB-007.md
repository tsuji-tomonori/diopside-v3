---
id: DD-APP-DB-007
title: video_tagsテーブル
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
- '[[RQ-FR-009]]'
- '[[RQ-DATA-001]]'
- '[[DD-APP-DB-004]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---


## 詳細仕様
- `video_tags` は動画とタグの多対多関係を管理する中間テーブルとする。
- タグ適用の起点（自動/手動）と確信度を保持し、再評価時の判断材料とする。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `video_id` | varchar(32) | No | PK/FK | `videos.video_id` |
| `tag_id` | varchar(64) | No | PK/FK | `tags.tag_id` |
| `applied_by` | varchar(16) | No | CHECK | `system` / `operator` |
| `confidence` | numeric(5,4) | Yes | CHECK | 自動付与時の信頼度（0-1） |
| `applied_at` | timestamptz | No | DEFAULT now() | 付与時刻 |
| `removed_at` | timestamptz | Yes | NULL許容 | 解除時刻 |

## インデックス
- `idx_video_tags_tag_id` (`tag_id`)
- `idx_video_tags_applied_at` (`applied_at` desc)
- `idx_video_tags_active` (`video_id`, `removed_at`)

## 運用ルール
- 1動画に同一タグを重複登録しない（複合PKで抑止）。
- 論理解除は `removed_at` を設定し、監査目的で履歴行を保持する。
- 手動付与は `applied_by=operator` を必須にし、操作主体を監査ログへ記録する。

## I/Oまたは責務
- 入力: 自動タグ付与結果、管理画面タグ操作。
- 出力: 動画別タグ関連、検索フィルタの評価入力。

## 変更履歴
- 2026-02-13: `removed_at` の制約（NULL許容）を明記
- 2026-02-11: video_tagsのカラム、制約、運用ルールを追加
- 2026-02-10: 新規作成
