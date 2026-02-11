---
id: DD-LOG-001
title: ログ設計
doc_type: ログ設計
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-MON-001]]'
- '[[BD-MON-002]]'
related:
- '[[RQ-OBY-001]]'
- '[[RQ-AV-001]]'
- '[[RQ-PS-001]]'
- '[[AT-OPS-001]]'
- '[[AT-RPT-001]]'
tags:
- diopside
- DD
- LOG
---


## 目的
- [[RQ-OBY-001]] の必須記録項目を、収集・配信・検索・運用操作の全導線で欠落なく記録する。
- 監視指標の算出元データを統一し、SLO判定と障害切り分けを同一証跡で実施可能にする。

## ログカテゴリ
| カテゴリ | 発生源 | 主用途 | 必須相関キー |
| --- | --- | --- | --- |
| ingestion_run | [[RQ-GL-002|収集ジョブ]] | run成否、件数追跡、[[RQ-GL-011|再収集]]判断 | `run_id`, `trace_id` |
| search_request | 検索API | p95算出、[[RQ-GL-014|検索条件]]分析 | `request_id`, `trace_id` |
| delivery_edge | 配信経路 | 配信エラー率算出、最新更新監視 | `request_id`, `trace_id` |
| admin_operation | 管理画面操作 | 運用監査、誤操作分析 | `operator_id`, `trace_id` |
| alert_event | 監視通知 | 発報遅延判定、対応履歴 | `alert_id`, `trace_id` |

## 共通ログスキーマ
| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| timestamp | RFC3339 string | Yes | 発生時刻（UTC） |
| trace_id | string | Yes | 監視・ログ相関用ID |
| source | enum | Yes | `ingestion/api/delivery/admin/monitor` |
| event_type | string | Yes | イベント種別 |
| severity | enum | Yes | `INFO/WARN/ERROR/CRITICAL` |
| result | enum | Yes | `success/partial/failure` |
| message | string | Yes | 人間可読メッセージ |
| attributes | object | Yes | 種別固有の追加属性 |

## 種別ごとの必須属性
| カテゴリ | 必須属性 |
| --- | --- |
| ingestion_run | `run_id`, `started_at`, `finished_at`, `target_count`, `success_count`, `failed_count` |
| search_request | `status_code`, `latency_ms`, `query_type`, `result_count` |
| delivery_edge | `status_code`, `edge_path`, `latency_ms`, `cache_status` |
| admin_operation | `operator_id`, `operation_name`, `target_id`, `operation_result` |
| alert_event | `alert_id`, `metric_id`, `threshold`, `detected_at`, `notified_at` |

## ログ品質要件
- 必須属性を満たすログ記録率は 99%以上を維持する。
- 記録失敗時は `log_drop_count` メトリクスを増分し、1時間窓で欠測率を算出する。
- 欠測率が 1% を超えた場合は `WARN`、5% を超えた場合は `CRITICAL` を発報する。

## 保持・検索方針
- 0-30日: 即時検索層（運用調査とAT証跡確認に使用）。
- 31-90日: 低コスト保管層（監査・傾向分析に使用）。
- 90日超: 要約メトリクスのみ残し、詳細ログは削除する。

## 出力と連携
- 監視ダッシュボード向けに `SLI-ING-SUCCESS`, `SLI-API-LATENCY`, `SLI-LOG-COVERAGE` の集計値を出力する。
- 受入運用向けに日次サマリ（閾値超過件数、欠測率、通知遅延）を [[AT-OPS-001]] の証跡として保存する。
- リリース判定時は [[AT-RPT-001]] へ月次可用率・p95・通知遅延を転記する。

## 変更履歴
- 2026-02-11: ログカテゴリ、必須スキーマ、欠測率判定、保持方針、AT連携を具体化
- 2026-02-10: 新規作成
