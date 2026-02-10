---
id: RQ-DM-007
title: 検索条件モデル
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
- 検索条件モデルは、一覧検索・絞り込み・並び順の入力条件と評価結果を表す。

## 属性
- 主キー: `search_condition_id`（保存時）
- 論理識別子: `condition_hash`（同一条件判定用）
- 主要属性: `keyword`, `tag_ids`, `tag_operator`, `published_from`, `published_to`, `duration_min`, `duration_max`, `sort`
- 評価属性: `page`, `page_size`, `result_count`, `evaluated_at`, `evaluated_run_id`

## 関連
- `evaluated_run_id` を外部キーとして収集実行エンティティ（`RQ-DM-005`）へ参照する。
- タグ条件はタグエンティティ（`RQ-DM-003`）集合を参照して評価する。

## 整合条件
- 主キー/外部キーと論理識別子を明示する。
- [[RQ-GL-002|収集ジョブ]]実行履歴と追跡可能にする。
- `published_from <= published_to`、`duration_min <= duration_max` を満たす。
- 同一 `condition_hash` と `evaluated_run_id` の組は再計算時に同一結果を返せること。

## 変更履歴
- 2026-02-10: モデル定義を具体化（検索属性、評価属性、再現性条件を追加）
- 2026-02-10: 新規作成
