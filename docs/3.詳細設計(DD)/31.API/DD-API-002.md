---
id: DD-API-002
title: 収集ジョブ起動API
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
- 手動またはスケジュール起点で[[RQ-GL-002|収集ジョブ]]を開始し、実行単位（run）を採番する。
- 収集対象区分（公式投稿/[[RQ-GL-004|出演動画]]）をジョブ起動時に明示できるようにする。

## エンドポイント
- `POST /api/v1/ops/ingestion/runs`

## リクエスト
- ヘッダー: `Content-Type: application/json`
- Body:
  - `mode`: `manual` | `scheduled`
  - `targetTypes`: `official` / `appearance` の配列
  - `fromPublishedAt`（任意）: ISO8601
  - `dryRun`（任意）: true/false

## レスポンス
- `202 Accepted`
  - `runId`: 実行ID
  - `acceptedAt`: 受理時刻
  - `mode`: 実行モード
  - `targetTypes`: 対象区分
- `409 Conflict`
  - 同種ジョブが実行中で重複起動を拒否した場合

## バリデーション
- `targetTypes` が空の場合は `400 INVALID_TARGET`。
- `fromPublishedAt` が不正形式の場合は `400 INVALID_TIMESTAMP`。

## 処理ロジック
1. 認証済みJWTを検証し、`operator` を解決する。
2. 入力構文を検証し、`mode/targetTypes/fromPublishedAt` の型不整合を拒否する。
3. 同時実行制約を評価し、同種run実行中なら `409 RUN_ALREADY_ACTIVE` を返す。
4. `Idempotency-Key` が既存要求と一致する場合は既存 `runId` を再返却する。
5. runレコードを `queued` で作成し、実行要求イベントをキューへ発行する。
6. 応答として `runId/acceptedAt/mode/targetTypes` を返却する。

## 状態遷移
- 受付直後: `queued`
- ワーカー取得後: `running`
- 終了時: `succeeded|failed|partial|cancelled`

## エラーマッピング
- `INVALID_TARGET`, `INVALID_TIMESTAMP`, `INVALID_MODE`: 400
- `RUN_ALREADY_ACTIVE`: 409
- `UNAUTHORIZED`: 401
- `INTERNAL_ERROR`: 500

## 冪等性
- `Idempotency-Key` が同一の場合は同一`runId`を返す。
- 同一キーの有効期限は24時間とする。

## 監査・ログ
- 起動操作は監査ログへ記録する（`runId`, `operator`, `targetTypes`, `traceId`）。

## 受入観点
- `AT-SCN-004` で manual 実行開始から runId 取得まで再現できること。
- 重複起動時に 409 応答となり、既存runの状態確認へ誘導できること。

## 変更履歴
- 2026-02-11: `/api/v1` 統一、処理ロジック/状態遷移/エラーマッピングを追加 [[BD-ADR-021]]
- 2026-02-10: 新規作成
- 2026-02-10: [[RQ-GL-002|収集ジョブ]]起動APIの入出力、冪等性、監査仕様を追加
