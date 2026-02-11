---
id: DD-DDL-006
title: tag_typesテーブル
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
- '[[RQ-FR-005]]'
- '[[RQ-GL-013]]'
- '[[DD-DBCON-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---


## 詳細仕様
- `tag_types` は[[RQ-GL-013|タグ種別]]辞書の正本を保持し、タグ管理画面と配信辞書で共通参照する。
- 種別の追加は後方互換を維持し、既存種別の削除は論理無効化で扱う。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `tag_type_id` | varchar(32) | No | PK | 種別識別子 |
| `display_name` | varchar(128) | No |  | 画面表示名 |
| `description` | text | Yes |  | 種別説明 |
| `sort_order` | integer | No | DEFAULT 0 | 表示順 |
| `is_active` | boolean | No | DEFAULT true | 有効フラグ |
| `created_at` | timestamptz | No | DEFAULT now() | 作成時刻 |
| `updated_at` | timestamptz | No | DEFAULT now() | 更新時刻 |

## インデックス
- `idx_tag_types_active_order` (`is_active`, `sort_order`)
- `uq_tag_types_display_name` (`display_name`)

## 更新ルール
- `tag_type_id` は固定値として運用し、名称変更は `display_name` で吸収する。
- 利用中種別を直接削除せず `is_active=false` で運用する。
- 種別並び順変更は公開順序へ影響するため、更新時に差分レビューを必須とする。

## I/Oまたは責務
- 入力: 管理者による種別設定、[[RQ-GL-005|タグ辞書]]更新要求。
- 出力: [[RQ-GL-013|タグ種別]]辞書、タグ表示順の基準情報。

## 変更履歴
- 2026-02-11: tag_typesのカラム、制約、更新ルールを追加
- 2026-02-10: 新規作成
