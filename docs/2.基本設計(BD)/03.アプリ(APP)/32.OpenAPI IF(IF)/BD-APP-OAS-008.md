---
id: BD-APP-OAS-008
title: 再確認状態取得API契約
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
openapi_operation_id: getRecheckRun
openapi_method: GET
openapi_path: /api/v1/ops/rechecks/{recheckRunId}
---

## API概要
| 項目 | 値 |
| --- | --- |
| メソッド | `GET` |
| パス | `/api/v1/ops/rechecks/{recheckRunId}` |
| operationId | `getRecheckRun` |
| タグ | `ops` |
| 認証/認可 | Cognito JWT |

## パラメータ
| 種別 | 名前 | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- | --- |
| path | recheckRunId | yes | string | - | format: uuid | 対象[[RQ-GL-019\|再確認実行]]の識別子。 |

## リクエストボディ
- なし

## 戻り値
| ステータス | メディアタイプ | 型 | 制約 | 説明 |
| --- | --- | --- | --- | --- |
| 200 | application/json | object | - | Recheck detail |

### 200 application/json フィールド
| フィールド | 必須 | 型 | 既定値 | 制約 | 説明 |
| --- | --- | --- | --- | --- | --- |
| recheck_run_id | yes | string | - | format: uuid | [[RQ-GL-019\|再確認実行]]の識別子。 |
| run_id | yes | string | - | format: uuid | 実行の識別子。 |
| status | yes | string | - | schema: RunStatus; enum: queued \| running \| succeeded \| failed \| partial \| cancelled | 現在の状態。 |
| started_at | yes | string | - | format: date-time | 処理開始日時。 |
| finished_at | yes | string | - | format: date-time; nullable | 処理が完了した日時。 |
| diff_summary | yes | object | - | - | 差分件数の集計結果。 |
| diff_summary.changed_count | yes | number | - | - | 差分ありと判定した件数。 |
| diff_summary.unchanged_count | yes | number | - | - | 差分なしと判定した件数。 |

## 変更履歴
- 2026-03-06: OpenAPI 正本から表形式のI/F文書を自動生成 [[BD-SYS-ADR-023]]
