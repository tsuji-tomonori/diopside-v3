---
id: DD-API-011
title: 収集結果明細API
doc_type: API詳細
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-14'
up:
- '[[BD-API-002]]'
- '[[RQ-FR-017]]'
related:
- '[[DD-API-003]]'
- '[[DD-API-008]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- run単位の集計結果だけでなく、動画単位の成功/失敗/未処理と失敗理由を追跡できるようにする。

## エンドポイント
- `GET /api/v1/ops/ingestion/runs/{runId}/items`

## クエリパラメータ
- `status`（任意）: `succeeded | failed | unprocessed`
- `cursor`（任意）: 継続取得カーソル
- `limit`（任意）: 1..200（既定100）

## レスポンス
- `200 OK`
  - `runId`
  - `items[]`: `videoId`, `status`, `failureReasonCode?`, `failureScope?`, `updateType`, `sourceType`, `processedAt?`
  - `nextCursor`
- `404 Not Found`: run不在

## 処理ロジック
1. JWT検証後、`runId` の存在を確認する。
2. `status/limit/cursor` を検証する。
3. ingestion_items から run関連明細を取得する。
4. `status` 指定時はフィルタ適用し、`failureReasonCode` を付与する。
5. `limit` 件でページングし、`nextCursor` を生成する。
6. 応答に `traceId` を付与する。

## エラーマッピング
| エラーコード | HTTPステータス | 意味 |
| --- | --- | --- |
| `INVALID_CURSOR` | 400 | `cursor` が不正形式または改ざんされ、継続取得位置を解決できない。 |
| `INVALID_LIMIT` | 400 | `limit` が許容範囲（1..200）外でページング条件が不正。 |
| `UNAUTHORIZED` | 401 | JWTが未指定または無効でrun明細を照会できない。 |
| `RUN_NOT_FOUND` | 404 | 指定 `runId` が存在せず明細を返却できない。 |
| `INTERNAL_ERROR` | 500 | サーバ内部例外により明細取得または整形処理に失敗した。 |

## 受入観点
- 失敗動画に対して理由コードと[[RQ-GL-011|再収集]]可否判断に必要な情報が取得できること。
- `status=failed` 指定で失敗対象のみを抽出できること。

## 変更履歴
- 2026-02-14: エラーマッピングを表形式へ統一し、各エラーコードの意味を明記
- 2026-02-11: 実装正本を `ingestion_events` 集約から `ingestion_items` 参照へ変更
- 2026-02-11: 新規作成 [[BD-ADR-021]]
