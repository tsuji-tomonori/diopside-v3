---
id: RQ-DM-002
title: チャンネルエンティティ
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
- チャンネルエンティティは、動画の投稿元を管理し、公式/非公式の区分判定を保持する。

## 属性
- 主キー: `channel_id`（YouTubeチャンネルID）
- 論理識別子: `channel_id`
- 主要属性: `channel_name`, `channel_handle`, `channel_url`, `channel_class`（`official`/`other`）
- 監査属性: `first_seen_run_id`, `last_seen_run_id`, `created_at`, `updated_at`

## 関連
- 動画エンティティ（`RQ-DM-001`）と一対多で関連する。
- `first_seen_run_id` / `last_seen_run_id` で収集実行エンティティ（`RQ-DM-005`）へ参照する。

## 整合条件
- 主キー/外部キーと論理識別子を明示する。
- [[RQ-GL-002|収集ジョブ]]実行履歴と追跡可能にする。
- `channel_class=official` は `白雪 巴/Shirayuki Tomoe` の公式チャンネルにのみ設定する。
- `channel_id` は不変キーとし、表示名変更時は `channel_name` のみ更新する。

## 変更履歴
- 2026-02-10: モデル定義を具体化（属性、関連、区分整合条件を追加）
- 2026-02-10: 新規作成
