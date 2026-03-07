---
id: BD-APP-OAS-022
title: 動画検索API契約
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
- '[[DD-APP-API-006]]'
- '[[BD-APP-API-004]]'
- '[[BD-SYS-ADR-025]]'
- '[[UT-PLAN-005]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- BD
- API
- OpenAPI
openapi_operation_id: searchVideos
openapi_method: GET
openapi_path: /api/v1/search
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `GET` |
| パス | `/api/v1/search` |
| operationId | `searchVideos` |
| タグ | `public-query` |
| 認証/認可 | Cognito JWT |

## パラメータ
| 種別 | 名前 | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- | --- |
| query | q | no | string | "" | - | [[RQ-GL-014\|検索条件]]として使うキーワード。 |

## リクエストボディ
- なし

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 200 | application/json | object | - | Search result |
| 400 | application/problem+json | object | schema: ProblemDetails | Bad request |
| 401 | application/problem+json | object | schema: ProblemDetails | Unauthorized |
| 500 | application/problem+json | object | schema: ProblemDetails | Internal server error |

### 200 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| items | yes | array<object> | - | - | 返却対象の一覧。 |
| items[].video_id | yes | string | - | - | 対象動画の識別子。 |
| items[].title | yes | string | - | - | 動画タイトル。 |
| items[].published_at | yes | string | - | format: date-time | 動画の公開日時。 |
| items[].duration_sec | yes | number | - | - | 動画の再生時間（秒）。 |
| items[].tag_ids | yes | array<string> | - | - | 対象動画に紐づくタグ ID 一覧。 |

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
