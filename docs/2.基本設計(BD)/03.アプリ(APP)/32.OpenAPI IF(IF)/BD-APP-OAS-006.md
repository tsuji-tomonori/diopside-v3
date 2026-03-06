---
id: BD-APP-OAS-006
title: 運用ヘルス診断API契約
doc_type: API設計
phase: BD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-03-06
updated: '2026-03-06'
up:
- '[[BD-APP-OAS-000]]'
- '[[BD-APP-API-004]]'
related:
- '[[DD-APP-API-009]]'
- '[[BD-APP-API-004]]'
- '[[BD-SYS-ADR-025]]'
- '[[UT-PLAN-005]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- BD
- API
- OpenAPI
openapi_operation_id: getHealth
openapi_method: GET
openapi_path: /api/v1/ops/diagnostics/health
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `GET` |
| パス | `/api/v1/ops/diagnostics/health` |
| operationId | `getHealth` |
| タグ | `ops` |
| 認証/認可 | Cognito JWT |

## パラメータ
- なし

## リクエストボディ
- なし

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 200 | application/json | object | - | Diagnostics |

### 200 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| status | yes | string | - | enum: ok \| degraded \| critical | 現在の状態。 |
| checks | yes | object | - | - | 診断チェック結果の一覧。 |
| checks.data_freshness | yes | string | - | - | 配信データが所定の鮮度以内かどうかの判定結果。 |
| checks.tag_master_consistency | yes | string | - | - | [[RQ-GL-008\|タグマスター]]と配信データの整合判定結果。 |
| checks.archive_page_completeness | yes | string | - | - | archive_index のページ欠落や件数不整合を検知した結果。 |
| checks.distribution_availability | yes | string | - | - | 配信成果物が取得可能かどうかの判定結果。 |

## 変更履歴
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
