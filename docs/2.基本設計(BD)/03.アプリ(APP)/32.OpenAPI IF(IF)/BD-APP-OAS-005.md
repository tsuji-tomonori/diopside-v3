---
id: BD-APP-OAS-005
title: 最新収集結果取得API契約
doc_type: API設計
phase: BD
version: 1.0.2
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
openapi_operation_id: getIngestionLatest
openapi_method: GET
openapi_path: /api/v1/ops/ingestion/latest
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `GET` |
| パス | `/api/v1/ops/ingestion/latest` |
| operationId | `getIngestionLatest` |
| タグ | `ops` |
| 認証/認可 | Cognito JWT |

## パラメータ
- なし

## リクエストボディ
- なし

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 200 | application/json | object | - | Latest summary |

### 200 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| last_success_at | yes | string | - | format: date-time; nullable | 直近成功日時。 |
| last_run_id | yes | string | - | format: uuid; nullable | 直近の実行 ID。 |
| target_counts | yes | object | - | - | 対象件数の集計。 |
| target_counts.official | yes | number | - | - | 公式動画の対象件数。 |
| target_counts.appearance | yes | number | - | - | [[RQ-GL-004\|出演動画]]の対象件数。 |
| target_counts.total | yes | number | - | - | 対象全体の件数。 |
| warnings | yes | array<string> | - | - | 警告一覧。 |

## 変更履歴
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
