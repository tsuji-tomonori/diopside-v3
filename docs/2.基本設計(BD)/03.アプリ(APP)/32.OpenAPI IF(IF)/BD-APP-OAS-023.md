---
id: BD-APP-OAS-023
title: 動画詳細API契約
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
- '[[DD-APP-API-007]]'
- '[[BD-APP-API-004]]'
- '[[BD-SYS-ADR-025]]'
- '[[UT-PLAN-005]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- BD
- API
- OpenAPI
openapi_operation_id: getVideoDetail
openapi_method: GET
openapi_path: /api/v1/videos/{videoId}
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `GET` |
| パス | `/api/v1/videos/{videoId}` |
| operationId | `getVideoDetail` |
| タグ | `public-query` |
| 認証/認可 | Cognito JWT |

## パラメータ
| 種別 | 名前 | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- | --- |
| path | videoId | yes | string | - | - | 対象動画の識別子。 |

## リクエストボディ
- なし

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 200 | application/json | object | - | Video detail |

### 200 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| video_id | yes | string | - | - | 動画の識別子。 |
| title | yes | string | - | - | 表示タイトル。 |
| published_at | yes | string | - | format: date-time | 動画の公開日時。 |
| duration_sec | yes | number | - | - | 動画の再生時間（秒）。 |
| tag_ids | yes | array<string> | - | - | タグ ID 一覧。 |

## 変更履歴
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
