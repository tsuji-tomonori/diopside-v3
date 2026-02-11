---
id: DD-DBCON-001
title: DB制約方針
doc_type: DB制約
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
- '[[RQ-DATA-001]]'
- '[[DD-DDL-001]]'
- '[[DD-MIG-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DBCON
---


## 詳細仕様
- DB制約は「参照整合性」「値整合性」「運用整合性」の3層で定義する。
- 参照整合性違反は書き込み時点で拒否し、後段補正に依存しない。

## 外部キー方針
| 子テーブル | 親テーブル | 更新時 | 削除時 | 理由 |
| --- | --- | --- | --- | --- |
| `videos.channel_id` | `channels.channel_id` | RESTRICT | RESTRICT | 動画正本の孤児化を防ぐ |
| `tags.tag_type_id` | `tag_types.tag_type_id` | RESTRICT | RESTRICT | 種別辞書の整合維持 |
| `video_tags.video_id` | `videos.video_id` | RESTRICT | CASCADE | 動画削除時の関連掃除 |
| `video_tags.tag_id` | `tags.tag_id` | RESTRICT | RESTRICT | 履歴互換維持 |
| `ingestion_events.run_id` | `ingestion_runs.run_id` | RESTRICT | CASCADE | run削除時のイベント掃除 |

## NULL制約方針
- 識別子・状態・時刻の基幹属性は `NOT NULL` を必須とする。
- 外部依存で未取得になり得る属性のみ `NULL` を許可し、理由を運用ログへ残す。
- `NULL` 許可属性の増加は性能/判定影響を伴うため、レビュー必須項目とする。

## 制約違反時の扱い
- アプリ側で事前検証してもDB制約違反時はトランザクションを即時ロールバックする。
- 制約違反は `DD-ERR-001` の `VALIDATION` または `CONFLICT` で応答する。
- 失敗イベントは `trace_id` 付きで記録し、再試行可否を運用判定する。

## I/Oまたは責務
- 入力: DDL定義、データ更新要求、移行実行計画。
- 出力: 制約セット、違反時応答ルール、ロールバック判定条件。

## 変更履歴
- 2026-02-11: 外部キー/NULL方針、制約違反時の扱いを追加
- 2026-02-10: 新規作成
