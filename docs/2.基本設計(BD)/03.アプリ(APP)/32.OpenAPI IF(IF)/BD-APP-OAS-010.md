---
id: BD-APP-OAS-010
title: タグ更新API契約
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
- '[[DD-APP-API-013]]'
- '[[BD-APP-API-004]]'
- '[[BD-SYS-ADR-025]]'
- '[[UT-PLAN-005]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- BD
- API
- OpenAPI
openapi_operation_id: patchTag
openapi_method: PATCH
openapi_path: /api/v1/admin/tags/{tagId}
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `PATCH` |
| パス | `/api/v1/admin/tags/{tagId}` |
| operationId | `patchTag` |
| タグ | `admin` |
| 認証/認可 | Cognito JWT + 管理者権限 |

## パラメータ
| 種別 | 名前 | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- | --- |
| path | tagId | yes | string | - | - | 対象タグの識別子。 |

## リクエストボディ
| メディアタイプ | 必須 | 型 | 制約 |
| --- | --- | --- | --- |
| application/json | no | object | - |

### application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| tag_name | no | string | - | - | タグ名称。 |
| synonyms | no | array<string> | - | - | 同義語一覧。 |
| is_active | no | boolean | - | - | 有効状態かどうか。 |
| merged_into | no | string | - | - | 統合先のタグ ID。 |

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 200 | application/json | object | - | Updated |

### 200 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| tag_id | yes | string | - | - | タグの識別子。 |
| propagation_state | yes | string | - | enum: pending_publish \| published | 公開反映の状態。 |
| updated_at | yes | string | - | format: date-time | 更新日時。 |

## 変更履歴
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
