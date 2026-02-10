---
id: RQ-DM-003
title: タグエンティティ
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
- タグエンティティは、動画検索と分類に用いる語彙単位を管理する。

## 属性
- 主キー: `tag_id`（内部一意ID）
- 論理識別子: `tag_key`（正規化済み文字列）
- 主要属性: `tag_name`, `aliases`, `deprecated`, `merged_into_tag_id`
- 監査属性: `created_run_id`, `deprecated_run_id`, `created_at`, `updated_at`

## 関連
- `tag_type_id` を外部キーとしてタグ種別エンティティ（`RQ-DM-004`）へ参照する。
- 動画エンティティ（`RQ-DM-001`）とは中間関連で多対多を構成する。
- `created_run_id` / `deprecated_run_id` で収集実行エンティティ（`RQ-DM-005`）へ参照する。

## 整合条件
- 主キー/外部キーと論理識別子を明示する。
- [[RQ-GL-002|収集ジョブ]]実行履歴と追跡可能にする。
- `tag_key` は一意とし、同義語は `aliases` または `merged_into_tag_id` で管理する。
- `deprecated=true` の場合、`merged_into_tag_id` または廃止理由のいずれかを必須とする。

## 変更履歴
- 2026-02-10: モデル定義を具体化（識別子、関連、廃止整合条件を追加）
- 2026-02-10: 新規作成
