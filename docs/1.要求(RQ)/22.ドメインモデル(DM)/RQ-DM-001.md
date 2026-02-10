---
id: RQ-DM-001
title: 動画エンティティ
doc_type: ドメインモデル
phase: RQ
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[RQ-SC-001]]'
related: []
tags:
- diopside
- RQ
- DM
---


## モデル定義
- 動画エンティティは、公開YouTubeアーカイブ1件を表す中核モデルである。

## 属性
- 主キー: `video_id`（YouTube動画ID）
- 論理識別子: `video_id`
- 主要属性: `title`, `published_at`, `duration_sec`, `video_type`, `url`, `is_public`, `availability_status`
- 監査属性: `first_seen_run_id`, `last_seen_run_id`, `created_at`, `updated_at`

## 関連
- `channel_id` を外部キーとしてチャンネルエンティティ（`RQ-DM-002`）に所属する（多対一）。
- タグエンティティ（`RQ-DM-003`）とは中間関連で多対多を構成する。
- `first_seen_run_id` / `last_seen_run_id` で収集実行エンティティ（`RQ-DM-005`）へ参照する。

## 整合条件
- 主キー/外部キーと論理識別子を明示する。
- [[RQ-GL-002|収集ジョブ]]実行履歴と追跡可能にする。
- `video_id` は一意であり、同一動画の重複登録を禁止する。
- `channel_id` は必須とし、孤立した動画レコードを許容しない。

## 変更履歴
- 2026-02-10: モデル定義を具体化（属性、関連、整合条件を追加）
- 2026-02-10: 新規作成
