---
id: UT-CASE-009
title: 収集結果明細API 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-12
updated: '2026-02-12'
up:
- '[[UT-PLAN-005]]'
- '[[DD-APP-API-011]]'
related:
- '[[IT-CASE-009]]'
- '[[DD-APP-API-003]]'
tags:
- diopside
- UT
- CASE
---


## 対象API
- `GET /api/v1/ops/ingestion/runs/{runId}/items`（[[DD-APP-API-011]]）

## テスト目的
- run単位の動画単位成功/失敗/未処理の追跡と、失敗理由の取得を単体で検証する。

## 前提
- ingestion_items テーブルはテストデータで初期化する。
- JWT検証はモック化する。

## 手順
1. 存在する `runId` で `status` 指定なしのリクエストを実行する。
2. `status=failed` を指定してフィルタリングを実行する。
3. `status=succeeded` を指定して成功レコードのみ取得する。
4. `limit=10` と `cursor` を指定してページングを実行する。
5. 存在しない `runId` でリクエストを実行する。
6. 不正な `limit`（0, 201, 負数）でリクエストを実行する。
7. 不正な `cursor` 形式でリクエストを実行する。

## 期待結果
- 手順1: `200` と全明細を含む `items[]` を返す。各itemに `videoId`, `status`, `updateType`, `sourceType` が含まれる。
- 手順2: `200` と `status=failed` のレコードのみを返し、`failureReasonCode` が付与されている。
- 手順3: `200` と `status=succeeded` のレコードのみを返す。
- 手順4: `200` と `limit` 件数の `items[]`、次ページがあれば `nextCursor` を返す。
- 手順5: `404 RUN_NOT_FOUND` を返す。
- 手順6: `400 INVALID_LIMIT` を返す。
- 手順7: `400 INVALID_CURSOR` を返す。

## レスポンススキーマ検証
```json
{
  "runId": "string (UUID)",
  "items": [
    {
      "videoId": "string",
      "status": "succeeded | failed | unprocessed",
      "failureReasonCode": "string (optional)",
      "failureScope": "string (optional)",
      "updateType": "string",
      "sourceType": "string",
      "processedAt": "ISO8601 (optional)"
    }
  ],
  "nextCursor": "string (optional)"
}
```

## [[AT-GO-001|リリース判定]]との対応
- Must FR（結果確認）の前提品質を満たす。
- [[RQ-GL-011|再収集]]可否判断に必要な情報が取得できる。

## 変更履歴
- 2026-02-12: 新規作成（分析レポートに基づく追加）
