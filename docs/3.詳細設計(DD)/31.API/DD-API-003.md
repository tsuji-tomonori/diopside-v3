---
id: DD-API-003
title: 収集ジョブ状態API
doc_type: API詳細
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[BD-ARCH-001]]'
- '[[BD-API-001]]'
related:
- '[[RQ-FR-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- [[RQ-GL-002|収集ジョブ]]の進捗と結果を運用者が追跡できるようにする。

## エンドポイント
- `GET /ops/ingestion/runs/{runId}`

## パスパラメータ
- `runId`: 収集実行ID

## レスポンス
- `200 OK`
  - `runId`
  - `status`: `queued | running | succeeded | failed | cancelled`
  - `targetTypes`
  - `processedCount`
  - `succeededCount`
  - `failedCount`
  - `startedAt` / `finishedAt`
  - `errorSummary`（失敗時のみ）
- `404 Not Found`
  - 未知のrunId

## 状態遷移
- `queued -> running -> succeeded|failed|cancelled`
- `failed` からは `DD-API-008` で[[RQ-GL-011|再収集]]runを作成する。

## エラーモデル
- `RUN_NOT_FOUND`
- `RUN_STATE_UNAVAILABLE`

## 受入観点
- 実行中ジョブの件数が増加し、完了時に`finishedAt`が埋まること。
- 失敗時は`errorSummary`と`traceId`で障害調査へ遷移できること。

## 変更履歴
- 2026-02-10: 新規作成
- 2026-02-10: [[RQ-GL-002|収集ジョブ]]状態APIの状態遷移と応答契約を追加

