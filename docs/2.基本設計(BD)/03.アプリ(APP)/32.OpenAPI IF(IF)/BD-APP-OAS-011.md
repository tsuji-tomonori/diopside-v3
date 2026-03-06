---
id: BD-APP-OAS-011
title: 動画タグ更新API契約
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
openapi_operation_id: patchVideoTags
openapi_method: PATCH
openapi_path: /api/v1/admin/videos/{videoId}/tags
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `PATCH` |
| パス | `/api/v1/admin/videos/{videoId}/tags` |
| operationId | `patchVideoTags` |
| タグ | `admin` |
| 認証/認可 | Cognito JWT + 管理者権限 |

## パラメータ
| 種別 | 名前 | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- | --- |
| path | videoId | yes | string | - | - | 対象動画の識別子。 |

## リクエストボディ
| メディアタイプ | 必須 | 型 | 制約 |
| --- | --- | --- | --- |
| application/json | no | object | - |

### application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| set | yes | array<string> | - | - | 付与する値の一覧。 |
| unset | yes | array<string> | - | - | 解除する値の一覧。 |
| reason | yes | string | - | minLength: 1 | 処理や操作の理由。 |

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 200 | application/json | object | - | Updated |

### 200 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| video_id | yes | string | - | - | 動画の識別子。 |
| tag_ids | yes | array<string> | - | - | タグ ID 一覧。 |
| updated_at | yes | string | - | - | 更新日時。 |

## 変更履歴
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
