---
id: BD-APP-OAS-021
title: archive index契約取得API
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
openapi_operation_id: getArchiveIndexContract
openapi_method: GET
openapi_path: /api/v1/public/archive-index
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `GET` |
| パス | `/api/v1/public/archive-index` |
| operationId | `getArchiveIndexContract` |
| タグ | `public-contract` |
| 認証/認可 | Cognito JWT |

## パラメータ
| 種別 | 名前 | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- | --- |
| query | page | no | integer | 0 | nullable; minimum: 0 | 取得対象ページ番号。 |

## リクエストボディ
- なし

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 200 | application/json | object | - | Archive index contract |

### 200 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| schema_version | yes | string | - | - | 契約スキーマのバージョン。 |
| archive_version | yes | string | - | - | archive_index 成果物のバージョン。 |
| tag_master_version | yes | string | - | - | [[RQ-GL-008\|タグマスター]]成果物のバージョン。 |
| generated_at | yes | string | - | format: date-time | 成果物を生成した日時。 |
| page | yes | number | - | - | 取得対象ページ番号。 |
| page_size | yes | number | - | - | 1ページあたりの件数。 |
| total | yes | number | - | - | 総件数。 |
| items | yes | array<array<anyOf<string \| number \| array<number>>>> | - | items: array<anyOf<string \| number \| array<number>>> (items: anyOf<string \| number \| array<number>> (anyOf: 3 patterns)) | 返却対象の一覧。 |

## 変更履歴
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
