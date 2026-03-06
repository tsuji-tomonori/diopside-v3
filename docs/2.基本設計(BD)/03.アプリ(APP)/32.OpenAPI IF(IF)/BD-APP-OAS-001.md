---
id: BD-APP-OAS-001
title: 収集実行起動API契約
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
- '[[DD-APP-API-002]]'
- '[[BD-APP-API-004]]'
- '[[BD-SYS-ADR-025]]'
- '[[UT-PLAN-005]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- BD
- API
- OpenAPI
openapi_operation_id: createIngestionRun
openapi_method: POST
openapi_path: /api/v1/ops/ingestion/runs
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `POST` |
| パス | `/api/v1/ops/ingestion/runs` |
| operationId | `createIngestionRun` |
| タグ | `ops` |
| 認証/認可 | Cognito JWT |

## パラメータ
| 種別 | 名前 | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- | --- |
| header | authorization | yes | string | - | - | Cognito JWT を渡す Authorization ヘッダー。 |
| header | idempotency-key | yes | string | - | - | 重複実行を防ぐための冪等キー。 |

## リクエストボディ
| メディアタイプ | 必須 | 型 | 制約 |
| --- | --- | --- | --- |
| application/json | no | object | schema: CreateIngestionRunRequest |

### application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| trigger_mode | yes | string | - | schema: TriggerMode; enum: manual \| scheduled | 起動元のモード。 |
| run_kind | yes | string | - | schema: RunKind; enum: official_ingestion \| appearance_supplement \| incremental_update | 実行種別。 |
| target_types | yes | array<string> | - | items: string (schema: TargetType; enum: official \| appearance) | 収集対象の区分一覧。 |
| from_published_at | no | string | - | format: date-time | 収集開始基準とする公開日時。 |
| dry_run | no | boolean | - | - | 副作用を発生させない試行実行かどうか。 |

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 202 | application/json | object | - | Accepted |
| 400 | application/problem+json | object | schema: ProblemDetails | Bad request |
| 409 | application/problem+json | object | schema: ProblemDetails | Conflict |

### 202 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| run_id | yes | string | - | format: uuid | 実行の識別子。 |
| accepted_at | yes | string | - | format: date-time | 要求を受理した日時。 |
| trigger_mode | yes | string | - | schema: TriggerMode; enum: manual \| scheduled | 起動元のモード。 |
| run_kind | yes | string | - | schema: RunKind; enum: official_ingestion \| appearance_supplement \| incremental_update | 実行種別。 |
| target_types | yes | array<string> | - | items: string (schema: TargetType; enum: official \| appearance) | 収集対象の区分一覧。 |

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

### 409 application/problem+json フィールド
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
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
