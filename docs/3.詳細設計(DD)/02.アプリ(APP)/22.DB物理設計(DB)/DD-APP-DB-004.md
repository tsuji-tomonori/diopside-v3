---
id: DD-APP-DB-004
title: 一意制約・チェック制約
doc_type: DB制約
phase: DD
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-19'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-DATA-001]]'
related:
- '[[RQ-DATA-001-01]]'
- '[[DD-APP-DB-002]]'
- '[[DD-APP-DB-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- DBCON
---


## 詳細仕様
- 一意制約は重複登録防止、チェック制約は状態値の不正混入防止を目的とする。
- 制約はアプリ検証と二重化し、DB側を最終防波堤とする。

## 一意制約
| テーブル | 制約名 | 対象 | 目的 |
| --- | --- | --- | --- |
| `channels` | `pk_channels` | `channel_id` | チャンネル重複防止 |
| `videos` | `pk_videos` | `video_id` | 動画重複防止 |
| `tags` | `uq_tags_slug` | `tag_slug` | 検索辞書の一意性 |
| `tag_types` | `uq_tag_types_display_name` | `display_name` | 種別名重複防止 |
| `video_tags` | `pk_video_tags` | `video_id`,`tag_id` | 同一タグ多重付与防止 |
| `ingestion_items` | `uq_ingestion_items_run_video` | `run_id`,`video_id` | run内重複明細防止 |
| `recheck_items` | `uq_recheck_items_run_video` | `recheck_run_id`,`video_id` | 再確認run内重複明細防止 |
| `publish_steps` | `uq_publish_steps_run_name` | `publish_run_id`,`step_name` | 同一run内ステップ重複防止 |
| `publish_artifacts` | `uq_publish_artifacts_run_type` | `publish_run_id`,`artifact_type` | 同一run内成果物重複防止 |

## チェック制約
| テーブル | 対象 | 条件 |
| --- | --- | --- |
| `channels.channel_type` | 種別 | `official` または `appearance` |
| `videos.source_type` | 取得元区分 | `official/appearance/supplement/incremental` |
| `videos.validation_status` | 品質状態 | `valid/invalid/needs_review` |
| `videos.update_type` | 更新種別 | `new/existing/supplement/recheck` |
| `ingestion_items.status` | 明細状態 | `succeeded/failed/unprocessed/excluded` |
| `ingestion_items.source_type` | 取得元区分 | `official/appearance/supplement/incremental` |
| `video_tags.applied_by` | 付与主体 | `system` または `operator` |
| `video_tags.confidence` | 信頼度 | `0 <= confidence <= 1` |
| `ingestion_runs.run_kind` | run種別 | `official_ingestion/appearance_supplement/incremental_update` |
| `ingestion_runs.status` | run状態 | `queued/running/succeeded/failed/partial/cancelled` |
| `ingestion_events.event_status` | イベント状態 | `success/warn/failure` |
| `recheck_runs.mode` | 再確認モード | `before_delivery/after_delivery` |
| `recheck_runs.status` | 再確認run状態 | `queued/running/succeeded/failed/partial/cancelled` |
| `recheck_items.diff_status` | 差分状態 | `changed/unchanged/failed/excluded` |
| `publish_runs.publish_type` | 公開種別 | `tag_master/archive/all/docs` |
| `publish_runs.status` | 公開run状態 | `queued/running/succeeded/failed/rolled_back/cancelled` |
| `publish_steps.status` | ステップ状態 | `queued/running/succeeded/failed/skipped` |
| `publish_artifacts.validation_status` | 成果物検証状態 | `passed/failed/skipped` |

## 例外処理
- 既存データが新制約に違反する場合は `backfill` で是正してから制約を有効化する。
- 制約追加は段階適用し、旧データ互換が確認できるまで `NOT VALID` 適用を許可する。
- 制約違反件数は移行レポートへ記録し、0件化を `contract` 開始条件とする。

## I/Oまたは責務
- 入力: テーブル定義、値域仕様、移行時検証結果。
- 出力: 一意制約/チェック制約セット、例外時の是正手順。

## 変更履歴
- 2026-02-19: `ingestion_runs.run_kind` の値域を収集runの3値へ統一 [[BD-SYS-ADR-034]]
- 2026-02-11: 再確認/公開反映の一意制約とチェック制約、run状態語彙統一を追加
- 2026-02-11: 一意制約、チェック制約、段階有効化ルールを追加
- 2026-02-10: 新規作成
