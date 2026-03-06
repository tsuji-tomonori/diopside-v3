---
id: BD-APP-OAS-003
title: 収集結果明細取得API契約
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
- '[[DD-APP-API-011]]'
- '[[BD-APP-API-004]]'
- '[[BD-SYS-ADR-025]]'
- '[[UT-PLAN-005]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- BD
- API
- OpenAPI
openapi_operation_id: getIngestionItems
openapi_method: GET
openapi_path: /api/v1/ops/ingestion/runs/{runId}/items
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `GET` |
| パス | `/api/v1/ops/ingestion/runs/{runId}/items` |
| operationId | `getIngestionItems` |
| タグ | `ops` |
| 認証/認可 | Cognito JWT |

## パラメータ
| 種別 | 名前 | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- | --- |
| path | runId | yes | string | - | format: uuid | 対象実行の識別子。 |
| query | status | no | string | - | enum: succeeded \| failed \| unprocessed | 絞り込み対象の状態。 |
| query | limit | no | integer | - | nullable | 1回の取得件数上限。 |
| query | cursor | no | string | - | - | 次ページ取得に使うカーソル。 |

## リクエストボディ
- なし

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 200 | application/json | object | - | Run items |

### 200 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| run_id | yes | string | - | format: uuid | 実行の識別子。 |
| items | yes | array<object> | - | - | 返却対象の一覧。 |
| items[].video_id | yes | string | - | - | 対象動画の識別子。 |
| items[].source_type | yes | string | - | schema: TargetType; enum: official \| appearance | 動画の取得元区分。 |
| items[].update_type | yes | string | - | enum: new \| existing \| backfill \| recheck | 更新処理の種別。 |
| items[].status | yes | string | - | enum: succeeded \| failed | 対象項目の状態。 |
| items[].error_code | yes | string | - | nullable | 対象動画に対するエラーコード。 |

## 変更履歴
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
