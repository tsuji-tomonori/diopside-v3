---
id: DD-APP-DB-008
title: tagsテーブル
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
- '[[RQ-FR-005]]'
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
- `tags` は[[RQ-GL-005|タグ辞書]]の正本を保持し、配信用 `tag_master.json` 生成元データとして扱う。
- タグ名変更はID不変で実施し、表示名と別名を分離して管理する。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `tag_id` | varchar(64) | No | PK | タグ識別子 |
| `tag_type_id` | varchar(32) | No | FK | `tag_types.tag_type_id` |
| `tag_name` | varchar(128) | No | NOT NULL | 表示名 |
| `tag_slug` | varchar(128) | No | UNIQUE | 検索用正規化名 |
| `synonyms` | text[] | Yes | NULL許容 | 別名配列 |
| `sort_order` | integer | No | DEFAULT 0 | 表示順 |
| `is_active` | boolean | No | DEFAULT true | 有効フラグ |
| `created_at` | timestamptz | No | DEFAULT now() | 作成時刻 |
| `updated_at` | timestamptz | No | DEFAULT now() | 更新時刻 |

## インデックス
- `idx_tags_type_active_order` (`tag_type_id`, `is_active`, `sort_order`)
- `idx_tags_name` (`tag_name`)

## 更新ルール
- `tag_id` は永続IDとして再利用禁止。
- 無効化は `is_active=false` を使用し、過去データ互換のため物理削除しない。
- `synonyms` 更新時は既存 `tag_slug` との衝突検証を実施する。

## I/Oまたは責務
- 入力: 管理画面のタグ更新操作、タグ分類マスタ。
- 出力: [[RQ-GL-005|タグ辞書]]正本、配信用[[RQ-GL-005|タグ辞書]]生成入力。

## 変更履歴
- 2026-02-13: `tag_name` と `synonyms` の制約を明記
- 2026-02-11: tagsのカラム、辞書運用ルール、生成元責務を追加
- 2026-02-10: 新規作成
