---
id: BD-APP-OAS-016
title: タグマスター公開起動API契約
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
- '[[DD-APP-API-015]]'
- '[[BD-APP-API-004]]'
- '[[BD-SYS-ADR-025]]'
- '[[UT-PLAN-005]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- BD
- API
- OpenAPI
openapi_operation_id: createTagMasterPublishRun
openapi_method: POST
openapi_path: /api/v1/admin/publish/tag-master
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `POST` |
| パス | `/api/v1/admin/publish/tag-master` |
| operationId | `createTagMasterPublishRun` |
| タグ | `admin` |
| 認証/認可 | Cognito JWT + 管理者権限 |

## パラメータ
- なし

## リクエストボディ
| メディアタイプ | 必須 | 型 | 制約 |
| --- | --- | --- | --- |
| application/json | no | object | - |

### application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| scope | no | string | all | enum: tag_master \| archive \| all | 処理対象の範囲。 |

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 202 | application/json | object | - | Accepted |

### 202 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| publish_run_id | yes | string | - | format: uuid | 公開実行の識別子。 |
| status | yes | string | - | schema: RunStatus; enum: queued \| running \| succeeded \| failed \| partial \| cancelled | 現在の状態。 |

## 変更履歴
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
