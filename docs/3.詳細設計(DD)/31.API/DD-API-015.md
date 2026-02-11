---
id: DD-API-015
title: 配信反映ジョブ状態API
doc_type: API詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[BD-API-002]]'
- '[[RQ-FR-005]]'
- '[[RQ-FR-024]]'
related:
- '[[BD-UI-001]]'
- '[[DD-API-005]]'
- '[[DD-API-014]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- タグ公開反映および公開runの状態を共通形式で照会し、UI-A06で進行監視できるようにする。

## エンドポイント
- `GET /api/v1/admin/publish/{publishRunId}`

## レスポンス
- `publishRunId`, `publishType(tag_master|archive|all|docs)`, `status`
- `startedAt`, `finishedAt?`, `triggeredBy`
- `steps[]`: `generate`, `validate`, `switch`, `post_check`
- `rollback`: `executed`, `rollbackToVersion?`
- `errorCode?`, `errorMessage?`, `retryable`

## 処理ロジック
1. JWTを検証し、`publishRunId` 形式を検証する。
2. runストアから対象公開runを取得する。
3. 進行中の場合は最新ステップ状態を再取得し、`status` を更新する。
4. 失敗時はロールバック実行有無を判定し、必要なら `rollback` 情報を付与する。
5. 応答に `traceId` を付与する。

## 状態遷移
- `queued -> running -> succeeded|failed|rolled_back`

## エラーマッピング
- `PUBLISH_RUN_NOT_FOUND`: 404
- `PUBLISH_STATE_UNAVAILABLE`: 503
- `UNAUTHORIZED`: 401
- `INTERNAL_ERROR`: 500

## 受入観点
- UI-A06で `queued/running/succeeded/failed/rolled_back` を判別できること。
- 失敗時にロールバック有無と再試行可否を確認できること。

## 変更履歴
- 2026-02-11: 新規作成 [[BD-ADR-021]]
