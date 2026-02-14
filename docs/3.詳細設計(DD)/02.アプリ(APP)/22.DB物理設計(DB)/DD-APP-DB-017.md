---
id: DD-APP-DB-017
title: publish_artifactsテーブル
doc_type: DDL
phase: DD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-13'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-DATA-001]]'
related:
- '[[RQ-DATA-001]]'
- '[[RQ-INT-001]]'
- '[[DD-APP-API-015]]'
- '[[DD-APP-DB-015]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DDL
---

## 詳細仕様
- `publish_artifacts` は配信成果物の生成結果と整合情報を保持する。
- 公開切替後の件数差分/チェックサム検証の基準として利用する。

## カラム定義
| カラム | 型 | NULL | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| `artifact_id` | uuid | No | PK | 成果物ID |
| `publish_run_id` | uuid | No | FK | `publish_runs.publish_run_id` |
| `artifact_type` | varchar(32) | No | CHECK | `bootstrap/tag_master/archive_index/highlights/wordcloud/docs/openapi` |
| `artifact_path` | text | No | NOT NULL | 配信パス |
| `checksum` | varchar(128) | No | NOT NULL | ハッシュ値 |
| `record_count` | integer | Yes | NULL許容 | レコード件数 |
| `generated_at` | timestamptz | No | NOT NULL | 生成時刻 |
| `validation_status` | varchar(16) | No | CHECK | `passed/failed/skipped` |
| `created_at` | timestamptz | No | DEFAULT now() | 作成時刻 |

## インデックス
- `idx_publish_artifacts_run_type` (`publish_run_id`, `artifact_type`)
- `idx_publish_artifacts_checksum` (`checksum`)
- `idx_publish_artifacts_generated_at` (`generated_at` desc)

## 検証ルール
- 同一 `publish_run_id` 内で同一 `artifact_type` は1件とする。
- `validation_status=failed` の成果物は公開切替対象から除外する。
- 公開切替後に `record_count` と `checksum` を前回公開版と比較し、差分を記録する。

## I/Oまたは責務
- 入力: 成果物生成結果、検証結果、配信パス情報。
- 出力: 配信成果物履歴、整合検証結果、公開監査情報。

## 変更履歴
- 2026-02-13: 成果物パス/ハッシュ/件数/生成時刻の制約を明記
- 2026-02-11: 新規作成
