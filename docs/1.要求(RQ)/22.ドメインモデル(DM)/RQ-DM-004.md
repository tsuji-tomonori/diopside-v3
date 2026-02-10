---
id: RQ-DM-004
title: タグ種別エンティティ
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
- タグ種別エンティティは、タグ表示カテゴリと検索UI制約を定義する。

## 属性
- 主キー: `tag_type_id`
- 論理識別子: `tag_type_code`
- 主要属性: `display_name`, `sort_order`, `single_select`, `required`
- 監査属性: `created_run_id`, `updated_run_id`, `created_at`, `updated_at`

## 関連
- タグエンティティ（`RQ-DM-003`）と一対多で関連する。
- `created_run_id` / `updated_run_id` で収集実行エンティティ（`RQ-DM-005`）へ参照する。

## 整合条件
- 主キー/外部キーと論理識別子を明示する。
- [[RQ-GL-002|収集ジョブ]]実行履歴と追跡可能にする。
- `sort_order` は同一時点で重複不可とし、UI表示順を一意に決定する。
- `required=true` の種別は `tag_master` 生成時に欠落を許容しない。

## 変更履歴
- 2026-02-10: モデル定義を具体化（属性、UI制約、整合条件を追加）
- 2026-02-10: 新規作成
