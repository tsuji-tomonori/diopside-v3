---
id: BD-APP-OAS-012
title: タグ提案プロンプト生成API契約
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
openapi_operation_id: createTaggingPrompt
openapi_method: POST
openapi_path: /api/v1/admin/tagging/prompts
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `POST` |
| パス | `/api/v1/admin/tagging/prompts` |
| operationId | `createTaggingPrompt` |
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
| run_id | yes | string | - | format: uuid | 実行の識別子。 |
| video_ids | yes | array<string> | - | - | 動画 ID 一覧。 |
| include_fields | yes | array<string> | - | - | プロンプトへ含める項目一覧。 |

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 200 | application/json | object | - | Prompt |

### 200 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| prompt_text | yes | string | - | - | LLM へ渡すプロンプト本文。 |
| prompt_version | yes | string | - | - | プロンプト定義のバージョン。 |
| video_count | yes | number | - | - | 動画件数。 |
| generated_at | yes | string | - | format: date-time | 成果物を生成した日時。 |

## 変更履歴
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
