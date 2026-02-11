---
id: DD-API-011
title: 収集結果明細API
doc_type: API詳細
phase: DD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
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
- `RUN_NOT_FOUND`: 404
- `INVALID_CURSOR`, `INVALID_LIMIT`: 400
- `UNAUTHORIZED`: 401
- `INTERNAL_ERROR`: 500

## 受入観点
- 失敗動画に対して理由コードと[[RQ-GL-011|再収集]]可否判断に必要な情報が取得できること。
- `status=failed` 指定で失敗対象のみを抽出できること。

## 変更履歴
- 2026-02-11: 実装正本を `ingestion_events` 集約から `ingestion_items` 参照へ変更
- 2026-02-11: 新規作成 [[BD-ADR-021]]
