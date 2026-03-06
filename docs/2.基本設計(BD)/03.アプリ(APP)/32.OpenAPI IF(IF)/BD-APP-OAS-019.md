---
id: BD-APP-OAS-019
title: bootstrap契約取得API
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
- '[[DD-APP-API-004]]'
- '[[BD-APP-API-004]]'
- '[[BD-SYS-ADR-025]]'
- '[[UT-PLAN-005]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- BD
- API
- OpenAPI
openapi_operation_id: getBootstrapContract
openapi_method: GET
openapi_path: /api/v1/public/bootstrap
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `GET` |
| パス | `/api/v1/public/bootstrap` |
| operationId | `getBootstrapContract` |
| タグ | `public-contract` |
| 認証/認可 | Cognito JWT |

## パラメータ
- なし

## リクエストボディ
- なし

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 200 | application/json | object | - | Bootstrap contract |

### 200 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| schema_version | yes | string | - | - | 契約スキーマのバージョン。 |
| bootstrap_version | yes | string | - | - | [[RQ-GL-007\|bootstrap]] 成果物のバージョン。 |
| generated_at | yes | string | - | format: date-time | 成果物を生成した日時。 |
| tag_master_version | yes | string | - | - | [[RQ-GL-008\|タグマスター]]成果物のバージョン。 |
| archive_version | yes | string | - | - | archive_index 成果物のバージョン。 |
| tag_types | yes | array<object> | - | - | [[RQ-GL-013\|タグ種別]]一覧。 |
| tag_types[].id | yes | number | - | - | [[RQ-GL-013\|タグ種別]]の識別子。 |
| tag_types[].key | yes | string | - | - | [[RQ-GL-013\|タグ種別]]の内部キー。 |
| tag_types[].name | yes | string | - | - | [[RQ-GL-013\|タグ種別]]の表示名。 |
| tag_preview | yes | array<array<anyOf<string \| number>>> | - | items: array<anyOf<string \| number>> (items: anyOf<string \| number> (anyOf: 2 patterns)) | 初期表示で使うタグのプレビュー一覧。 |
| latest | yes | array<array<anyOf<string \| number \| array<number>>>> | - | items: array<anyOf<string \| number \| array<number>>> (items: anyOf<string \| number \| array<number>> (anyOf: 3 patterns)) | 最新動画一覧。 |
| next | yes | object | - | - | 次取得先の情報。 |
| next.tag_master | yes | object | - | - | [[RQ-GL-008\|タグマスター]]の取得先情報。 |
| next.tag_master.url | yes | string | - | - | [[RQ-GL-008\|タグマスター]]を取得する URL。 |
| next.archive_index | yes | object | - | - | archive_index の取得先情報。 |
| next.archive_index.url_pattern | yes | string | - | - | archive_index を取得する URL パターン。 |
| next.archive_index.page_size | yes | number | - | - | archive_index 取得時の既定ページ件数。 |

## 変更履歴
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
