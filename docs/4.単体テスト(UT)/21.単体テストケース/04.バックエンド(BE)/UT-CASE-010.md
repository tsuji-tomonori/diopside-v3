---
id: UT-CASE-010
title: 配信前後再確認API 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-12
updated: '2026-02-12'
up:
- '[[UT-PLAN-005]]'
- '[[DD-APP-API-012]]'
related:
- '[[IT-CASE-010]]'
- '[[RQ-UC-009]]'
tags:
- diopside
- UT
- CASE
---


## 対象API
- `POST /api/v1/ops/rechecks`（[[DD-APP-API-012]]）
- `GET /api/v1/ops/rechecks/{recheckRunId}`（[[DD-APP-API-012]]）

## テスト目的
- 配信前後のメタデータ差分確認runの作成と結果取得を単体で検証する。

## 前提
- YouTube APIはモック化し、固定レスポンスを返す。
- recheck_runs / recheck_items テーブルはテストデータで初期化する。

## 手順（POST /api/v1/ops/rechecks）
1. `mode=before_delivery`, 有効な `targetVideoIds[]` で起動する。
2. `mode=after_delivery`, 有効な `targetVideoIds[]` で起動する。
3. 空の `targetVideoIds[]` で起動する。
4. 無効な `mode` 値で起動する。
5. 存在しない `videoId` を含む `targetVideoIds[]` で起動する。

## 期待結果（POST）
- 手順1-2: `202` と `recheckRunId` を返し、`status=queued` で作成される。
- 手順3: `400 INVALID_TARGET_VIDEOS` を返す。
- 手順4: `400 INVALID_RECHECK_MODE` を返す。
- 手順5: `202` を返すが、対象外動画は `excluded` ステータスで記録される。

## 手順（GET /api/v1/ops/rechecks/{recheckRunId}）
1. 完了済み `recheckRunId` で結果を取得する。
2. 実行中 `recheckRunId` で結果を取得する。
3. 存在しない `recheckRunId` で結果を取得する。

## 期待結果（GET）
- 手順1: `200` と完全な `diffSummary`（`changedCount`, `unchangedCount`, `failedCount`）を返す。
- 手順2: `200` と中間状態（`status=running`、部分的な `diffSummary`）を返す。
- 手順3: `404 RECHECK_RUN_NOT_FOUND` を返す。

## レスポンススキーマ検証（GET）
```json
{
  "recheckRunId": "string (UUID)",
  "status": "queued | running | succeeded | failed | partial",
  "mode": "before_delivery | after_delivery",
  "totalCount": "number",
  "diffSummary": {
    "changedCount": "number",
    "unchangedCount": "number",
    "failedCount": "number"
  },
  "items": [
    {
      "videoId": "string",
      "diffStatus": "changed | unchanged | failed | excluded",
      "diffFields": ["string"],
      "reason": "string (optional)"
    }
  ]
}
```

## [[RQ-GL-012|受入判定]]との対応
- [[RQ-FR-019]] の配信前後確認機能を検証する。

## 変更履歴
- 2026-02-12: 新規作成（分析レポートに基づく追加）
