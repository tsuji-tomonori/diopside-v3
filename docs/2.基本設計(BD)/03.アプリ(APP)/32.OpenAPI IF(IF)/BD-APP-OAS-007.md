---
id: BD-APP-OAS-007
title: 再確認起動API契約
doc_type: API設計
phase: BD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-03-06
updated: '2026-03-07'
up:
- '[[BD-APP-OAS-000]]'
- '[[BD-APP-API-004]]'
related:
- '[[DD-APP-API-012]]'
- '[[BD-APP-API-004]]'
- '[[BD-SYS-ADR-025]]'
- '[[UT-PLAN-005]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- BD
- API
- OpenAPI
openapi_operation_id: createRecheckRun
openapi_method: POST
openapi_path: /api/v1/ops/rechecks
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `POST` |
| パス | `/api/v1/ops/rechecks` |
| operationId | `createRecheckRun` |
| タグ | `ops` |
| 認証/認可 | Cognito JWT |

## パラメータ
- なし

## リクエストボディ
| メディアタイプ | 必須 | 型 | 制約 |
| --- | --- | --- | --- |
| application/json | no | anyOf<object \| object> | anyOf: 2 patterns |

### application/json フィールド
#### application/json パターン1
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| run_id | yes | string | - | format: uuid | 実行の識別子。 |

#### application/json パターン2
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| mode | yes | string | - | enum: before_delivery \| after_delivery | 実行モード。 |
| targetVideoIds | yes | array<string> | - | - | 再確認対象の動画 ID 一覧。 |

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 202 | application/json | object | - | Recheck accepted |
| 400 | application/problem+json | object | schema: ProblemDetails | Bad request |
| 401 | application/problem+json | object | schema: ProblemDetails | Unauthorized |
| 404 | application/problem+json | object | schema: ProblemDetails | Not found |
| 500 | application/problem+json | object | schema: ProblemDetails | Internal server error |

### 202 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| recheck_run_id | yes | string | - | format: uuid | [[RQ-GL-019\|再確認実行]]の識別子。 |
| run_id | yes | string | - | format: uuid | 実行の識別子。 |
| status | yes | string | - | schema: RunStatus; enum: queued \| running \| succeeded \| failed \| partial \| cancelled | 現在の状態。 |
| started_at | yes | string | - | format: date-time | 処理開始日時。 |

### 400 application/problem+json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| type | yes | string | - | - | Problem Details の型 URI または契約種別。 |
| title | yes | string | - | - | 表示タイトル。 |
| status | yes | number | - | - | 現在の状態。 |
| detail | yes | string | - | - | 詳細内容。 |
| instance | yes | string | - | - | 問題が発生した対象 URI または識別子。 |
| code | yes | string | - | - | 機械判定用のコード。 |
| retryable | no | boolean | - | - | 再試行可能かどうか。 |
| trace_id | yes | string | - | - | 追跡用トレース ID。 |
| errors | no | array<object> | - | - | エラー詳細の一覧。 |
| errors[].field | no | string | - | - | エラーが発生した入力フィールド名。 |
| errors[].message | yes | string | - | - | エラー内容を示すメッセージ。 |
| errors[].code | no | string | - | - | エラーの機械判定用コード。 |

### 401 application/problem+json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| type | yes | string | - | - | Problem Details の型 URI または契約種別。 |
| title | yes | string | - | - | 表示タイトル。 |
| status | yes | number | - | - | 現在の状態。 |
| detail | yes | string | - | - | 詳細内容。 |
| instance | yes | string | - | - | 問題が発生した対象 URI または識別子。 |
| code | yes | string | - | - | 機械判定用のコード。 |
| retryable | no | boolean | - | - | 再試行可能かどうか。 |
| trace_id | yes | string | - | - | 追跡用トレース ID。 |
| errors | no | array<object> | - | - | エラー詳細の一覧。 |
| errors[].field | no | string | - | - | エラーが発生した入力フィールド名。 |
| errors[].message | yes | string | - | - | エラー内容を示すメッセージ。 |
| errors[].code | no | string | - | - | エラーの機械判定用コード。 |

### 404 application/problem+json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| type | yes | string | - | - | Problem Details の型 URI または契約種別。 |
| title | yes | string | - | - | 表示タイトル。 |
| status | yes | number | - | - | 現在の状態。 |
| detail | yes | string | - | - | 詳細内容。 |
| instance | yes | string | - | - | 問題が発生した対象 URI または識別子。 |
| code | yes | string | - | - | 機械判定用のコード。 |
| retryable | no | boolean | - | - | 再試行可能かどうか。 |
| trace_id | yes | string | - | - | 追跡用トレース ID。 |
| errors | no | array<object> | - | - | エラー詳細の一覧。 |
| errors[].field | no | string | - | - | エラーが発生した入力フィールド名。 |
| errors[].message | yes | string | - | - | エラー内容を示すメッセージ。 |
| errors[].code | no | string | - | - | エラーの機械判定用コード。 |

### 500 application/problem+json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| type | yes | string | - | - | Problem Details の型 URI または契約種別。 |
| title | yes | string | - | - | 表示タイトル。 |
| status | yes | number | - | - | 現在の状態。 |
| detail | yes | string | - | - | 詳細内容。 |
| instance | yes | string | - | - | 問題が発生した対象 URI または識別子。 |
| code | yes | string | - | - | 機械判定用のコード。 |
| retryable | no | boolean | - | - | 再試行可能かどうか。 |
| trace_id | yes | string | - | - | 追跡用トレース ID。 |
| errors | no | array<object> | - | - | エラー詳細の一覧。 |
| errors[].field | no | string | - | - | エラーが発生した入力フィールド名。 |
| errors[].message | yes | string | - | - | エラー内容を示すメッセージ。 |
| errors[].code | no | string | - | - | エラーの機械判定用コード。 |

## 変更履歴
- 2026-03-07: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
