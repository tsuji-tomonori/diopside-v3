---
id: DD-APP-DB-005
title: channelsテーブル
doc_type: DDL
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-DATA-001]]'
related:
- '[[RQ-DATA-001]]'
- '[[DD-APP-DB-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---


## 詳細仕様
- `channels` は動画の所属チャネル情報を正本管理するマスタテーブルとする。
- 公式/出演の区分判定に必要な識別子を保持し、収集処理の参照元とする。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `channel_id` | varchar(64) | No | PK | YouTubeチャンネルID |
| `channel_name` | varchar(255) | No |  | 表示名 |
| `channel_type` | varchar(16) | No | CHECK | `official` / `appearance` |
| `is_active` | boolean | No | DEFAULT true | 有効フラグ |
| `last_seen_at` | timestamptz | Yes |  | 最終検知時刻 |
| `created_at` | timestamptz | No | DEFAULT now() | 作成時刻 |
| `updated_at` | timestamptz | No | DEFAULT now() | 更新時刻 |

## インデックス
- `idx_channels_type_active` (`channel_type`, `is_active`)
- `idx_channels_last_seen_at` (`last_seen_at` desc)

## 更新ルール
- `channel_id` は不変とし、表示名変更は `channel_name` のみ更新する。
- `channel_type` 変更は監査対象操作として記録し、運用承認を必須とする。
- 未検知期間が長いチャネルは `is_active=false` へ移行するが、参照整合のため物理削除しない。

## I/Oまたは責務
- 入力: 収集結果のチャンネル情報、管理者による区分補正。
- 出力: 正規化済みチャンネルマスタ、動画テーブル参照先。

## 変更履歴
- 2026-02-11: channelsのカラム、インデックス、更新ルールを追加
- 2026-02-10: 新規作成
