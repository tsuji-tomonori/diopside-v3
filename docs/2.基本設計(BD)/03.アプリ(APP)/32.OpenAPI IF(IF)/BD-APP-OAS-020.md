---
id: BD-APP-OAS-020
title: タグマスター契約取得API
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
- '[[DD-APP-API-005]]'
- '[[BD-APP-API-004]]'
- '[[BD-SYS-ADR-025]]'
- '[[UT-PLAN-005]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- BD
- API
- OpenAPI
openapi_operation_id: getTagMasterContract
openapi_method: GET
openapi_path: /api/v1/public/tag-master
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `GET` |
| パス | `/api/v1/public/tag-master` |
| operationId | `getTagMasterContract` |
| タグ | `public-contract` |
| 認証/認可 | Cognito JWT |

## パラメータ
- なし

## リクエストボディ
- なし

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 200 | application/json | object | - | Tag master contract |

### 200 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| schema_version | yes | string | - | - | 契約スキーマのバージョン。 |
| tag_master_version | yes | string | - | - | [[RQ-GL-008\|タグマスター]]成果物のバージョン。 |
| generated_at | yes | string | - | format: date-time | 成果物を生成した日時。 |
| tag_types | yes | array<object> | - | - | [[RQ-GL-013\|タグ種別]]一覧。 |
| tag_types[].id | yes | number | - | - | [[RQ-GL-013\|タグ種別]]の識別子。 |
| tag_types[].key | yes | string | - | - | [[RQ-GL-013\|タグ種別]]の内部キー。 |
| tag_types[].name | yes | string | - | - | [[RQ-GL-013\|タグ種別]]の表示名。 |
| tags | yes | array<array<anyOf<number \| string>>> | - | items: array<anyOf<number \| string>> (items: anyOf<number \| string> (anyOf: 2 patterns)) | タグ一覧。 |

## 変更履歴
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
