---
id: DD-API-008
title: 再収集API
doc_type: API詳細
phase: DD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[BD-ARCH-001]]'
- '[[BD-API-002]]'
related:
- '[[RQ-FR-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- 失敗または欠損が判定された収集runを再実行し、データ整合を回復する。

## エンドポイント
- `POST /api/v1/ops/ingestion/runs/{runId}/retry`

## リクエスト
- `reason`: 再実行理由（必須）
- `scope`（任意）: `full | failedOnly | range`
- `range`（scope=range時）: `fromPublishedAt`, `toPublishedAt`

## レスポンス
- `202 Accepted`
  - `retryRunId`
  - `sourceRunId`
  - `acceptedAt`
- `409 Conflict`
  - 元runが再実行不可状態

## 再実行ポリシー
- 同一`runId`への再実行回数上限は3回。
- 失敗理由が外部制限（rate limit等）の場合は待機推奨時間を返す。

## 処理ロジック
1. JWTを検証し、`runId` の存在と再実行可能状態を確認する。
2. `reason/scope/range` を検証し、`scope=range` 時は期間逆転を拒否する。
3. 既存再実行数を確認し、上限超過時は `409 RETRY_LIMIT_EXCEEDED` を返す。
4. 重複再実行を検知した場合は `409 RETRY_ALREADY_ACTIVE` を返す。
5. 新規 `retryRunId` を `queued` で作成し、`sourceRunId` を関連付ける。
6. 監査ログに `operator/reason/scope` を記録し応答する。

## エラーマッピング
- `RUN_NOT_FOUND`: 404
- `RUN_NOT_RETRYABLE`: 409
- `RETRY_LIMIT_EXCEEDED`: 409
- `INVALID_RETRY_SCOPE`, `INVALID_RETRY_RANGE`: 400

## 監査要件
- 再実行は必ず実行者と理由を記録する。
- 重大障害起因の再実行は`AT-RUN-001`の手順番号を紐付ける。

## 受入観点
- 失敗runから`retryRunId`が発行され、状態追跡APIで追えること。
- 上限超過時に明確な拒否理由が返ること。

## 変更履歴
- 2026-02-11: `/api/v1` 統一と[[RQ-GL-011|再収集]]処理ロジック/エラーマッピングを追加 [[BD-ADR-021]]
- 2026-02-10: 新規作成
- 2026-02-10: [[RQ-GL-011|再収集]]ポリシー、監査要件、入出力契約を追加
