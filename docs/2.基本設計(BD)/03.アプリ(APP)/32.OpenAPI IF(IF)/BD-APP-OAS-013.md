---
id: BD-APP-OAS-013
title: タグ提案JSON取込API契約
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
openapi_operation_id: importTaggingJson
openapi_method: POST
openapi_path: /api/v1/admin/tagging/imports
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `POST` |
| パス | `/api/v1/admin/tagging/imports` |
| operationId | `importTaggingJson` |
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
| schema_version | yes | string | - | enum: v1 | 契約スキーマのバージョン。 |
| items | yes | array<object> | - | - | 返却対象の一覧。 |
| items[].video_id | yes | string | - | - | 対象動画の識別子。 |
| items[].set | yes | array<string> | - | - | 付与するタグ ID 一覧。 |
| items[].unset | yes | array<string> | - | - | 解除するタグ ID 一覧。 |
| items[].reason | yes | string | - | - | タグ更新や取込に使う理由。 |

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 200 | application/json | object | - | Imported |

### 200 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| import_run_id | yes | string | - | format: uuid | 取込実行の識別子。 |
| validated_count | yes | number | - | - | 検証対象件数。 |
| applied_count | yes | number | - | - | 実際に適用した件数。 |
| rejected_count | yes | number | - | - | 却下件数。 |
| errors | yes | array<object> | - | - | エラー詳細の一覧。 |
| errors[].index | yes | number | - | - | items 配列内の対象インデックス。 |
| errors[].code | yes | string | - | - | エラーの機械判定用コード。 |
| errors[].message | yes | string | - | - | エラー内容を示すメッセージ。 |
| errors[].field | no | string | - | - | エラーが発生した入力フィールド名。 |
| next_action | yes | string | - | enum: publish_required \| no_change | 次に取るべき運用アクション。 |
| publish_scope | no | string | - | - | 公開対象の範囲。 |

## 変更履歴
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
