---
id: DD-APP-LOG-001
title: ログ設計
doc_type: ログ設計
phase: DD
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-14'
up:
- '[[BD-INF-MON-001]]'
- '[[BD-INF-MON-002]]'
- '[[BD-SYS-ADR-022]]'
related:
- '[[RQ-OBY-001]]'
- '[[RQ-RDR-035]]'
- '[[RQ-AV-001]]'
- '[[RQ-PS-001]]'
- '[[RQ-SEC-001]]'
- '[[RQ-PRC-001]]'
- '[[RQ-COST-001]]'
- '[[AT-OPS-001]]'
- '[[AT-RPT-001]]'
- '[[BD-SYS-ADR-027]]'
tags:
- diopside
- DD
- LOG
---


## 目的
- [[RQ-OBY-001]] の可観測性要求を、AWS Lambda + CloudWatch Logs前提で再現可能な運用仕様へ落とし込む。
- 収集・検索・配信・管理操作の運用調査、セキュリティ検知、監査証跡を同一スキーマで相関可能にする。

## 適用範囲
- 出力対象は Backend API（Lambda）、運用Lambda、配信関連Lambdaとする。
- ログはCloudWatch Logsに集約し、保持期間は30日固定とする。
- 31日目以降の詳細ログは自動削除し、復元や再取得を前提にしない。

## ログ分類
| category | 用途 | 代表イベント | サンプリング |
| --- | --- | --- | --- |
| operational | 障害調査、性能分析、SLO算出 | `ingestion.run_completed`, `search.request_completed` | 許可（高頻度INFOのみ） |
| security | 認証/認可/検証失敗の検知 | `authn.failed`, `authz.denied`, `input.validation_failed` | 不可 |
| audit | 管理操作の証跡 | `admin.operation_succeeded`, `admin.operation_failed` | 不可 |

## 共通JSONスキーマ
| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `timestamp` | RFC3339 string | Yes | 発生時刻（UTC） |
| `severity` | enum | Yes | `DEBUG/INFO/WARN/ERROR/CRITICAL` |
| `service.name` | string | Yes | サービス識別子 |
| `service.version` | string | Yes | デプロイ版 |
| `deployment.environment` | enum | Yes | `production/development` |
| `event.name` | string | Yes | 事前定義イベント名 |
| `event.category` | enum | Yes | `operational/security/audit` |
| `event.outcome` | enum | Yes | `success/failure/partial` |
| `correlation_id` | string | Yes | 導線単位の相関ID |
| `trace_id` | string | Yes | 分散追跡ID |
| `request_id` | string | Yes | APIまたは処理要求ID |
| `aws.lambda.request_id` | string | Yes | Lambda実行ID |
| `message` | string | Yes | 人間可読メッセージ |

## 条件付き必須フィールド
| 条件 | 追加必須フィールド |
| --- | --- |
| 収集runイベント | `run_id`, `started_at`, `finished_at`, `target_count`, `success_count`, `failed_count` |
| API応答イベント | `http.method`, `http.route`, `http.status_code`, `duration_ms` |
| 検索イベント | `query_type`, `result_count` |
| 管理操作イベント | `actor.id`, `actor.role`, `operation_name`, `target_id` |
| エラーイベント | `error.code`, `error.type` |

## イベント語彙
| event.name | category | severity既定 | 説明 |
| --- | --- | --- | --- |
| `ingestion.run_started` | operational | INFO | [[RQ-GL-002|収集実行]]開始 |
| `ingestion.run_completed` | operational | INFO | 収集完了（件数付き） |
| `ingestion.run_failed` | operational | ERROR | 収集失敗 |
| `search.request_completed` | operational | INFO | 検索API正常応答 |
| `delivery.edge_error` | operational | ERROR | 配信経路エラー |
| `authn.failed` | security | WARN | 認証失敗 |
| `authz.denied` | security | WARN | 認可拒否 |
| `input.validation_failed` | security | WARN | 入力検証失敗 |
| `admin.operation_succeeded` | audit | INFO | 管理操作成功 |
| `admin.operation_failed` | audit | ERROR | 管理操作失敗 |
| `config.changed` | audit | INFO | 設定変更 |
| `log.pipeline_drop_detected` | operational | CRITICAL | ログ欠測異常 |

## ログレベル運用
- `DEBUG`: 開発環境のみ。production常時有効化は禁止。
- `INFO`: 状態遷移、正常完了、監査対象の成功操作。
- `WARN`: 継続可能な異常、認証失敗、入力不備。
- `ERROR`: 処理失敗、外部依存失敗、管理操作失敗。
- `CRITICAL`: 継続運用困難、欠測率5%超、重大通知遅延。

## セキュリティ/プライバシー制約
- ログにパスワード、アクセストークン、セッションID、秘密鍵、接続文字列、PIIを平文で記録しない。
- 受信入力文字列はログ注入対策として改行と制御文字を無害化して記録する。
- エラーメッセージは利用者入力をそのまま連結せず、`error.code` と要約メッセージを使用する。

## 出力・収集方式
- LambdaはJSON文字列を `stdout` へ出力し、CloudWatch Logsに自動収集する。
- 構造化フィールドを維持できない自由文ログの単独出力は禁止する。
- `correlation_id` はAPI入口で生成し、下流処理へ引き回す。

## trace_id 生成・伝播
- 受信ヘッダ `traceparent` がある場合はその `trace_id` を採用する。
- 受信ヘッダがない場合は `X-Request-Id` を種にUUIDv7を生成し、`trace_id` として採用する。
- 同一run内の全ログで同一 `trace_id` を維持し、外部API呼び出し時は `traceparent` を再送する。
- 例外ログは `trace_id` と `error.code` を必須とし、相関不可ログを禁止する。

## 品質ゲート
- 必須フィールド充足率は99%以上。
- 欠測率は1時間窓で算出し、1%超でWARN、5%超でCRITICALを発報。
- セキュリティ/監査イベントの記録漏れは0件（サンプリング禁止）。

## 保持・削除方針
- CloudWatch Logs保持期間は30日。
- 31日目以降はCloudWatch保持ポリシーで自動削除する。
- 長期アーカイブは実施しない（コスト優先）。
- 30日を超える詳細ログ調査要求は対象外とし、月次要約メトリクスで代替する。

## 30日制限の補完
- 月次SLO再計算に必要な最小メトリクス（可用率、失敗件数、欠測率、再試行上限到達件数）は日次でS3へエクスポートする。
- エクスポート失敗時は `log.pipeline_drop_detected` を発行し、翌日0時に再試行する。
- S3エクスポートデータ保持期間は13か月とし、詳細ログ本文は保持しない。

## AT連携
- 日次サマリ（欠測率、通知遅延、主要失敗件数）を [[AT-OPS-001]] に記録する。
- 受入報告では [[AT-RPT-001]] に可用率、性能p95、ログ品質指標を転記する。

## I/Oまたは責務
- 入力: APIリクエスト、[[RQ-GL-002|収集実行]]結果、管理操作イベント、依存先応答、監視アラート。
- 出力: CloudWatch構造化ログ、ログ品質メトリクス、運用日次サマリ。

## 変更履歴
- 2026-02-13: `trace_id` の生成/伝播ルールと30日保持制限を補完する日次S3エクスポート仕様を追加 [[BD-SYS-ADR-027]]
- 2026-02-11: AWS Lambda/CloudWatch前提の用途別ログ分類、構造化スキーマ、30日保持/自動削除、禁止記録項目を追加
- 2026-02-11: ログカテゴリ、必須スキーマ、欠測率判定、保持方針、AT連携を具体化
- 2026-02-10: 新規作成
