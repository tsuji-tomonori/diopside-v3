---
id: DD-APP-API-003
title: 収集実行状態API
doc_type: API詳細
phase: DD
version: 1.0.6
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-14'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-API-002]]'
related:
- '[[RQ-FR-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- [[RQ-GL-002|収集実行]]の進捗と結果を管理者が追跡できるようにする。

## エンドポイント
- `GET /api/v1/ops/ingestion/runs/{runId}`

## パスパラメータ
- `runId`: [[RQ-GL-002|収集実行]]ID

## レスポンス
- `200 OK`
  - `runId`
  - `status`: `queued | running | succeeded | failed | partial | cancelled`
  - `targetTypes`
  - `processedCount`
  - `succeededCount`
  - `failedCount`
  - `startedAt` / `finishedAt`
  - `errorSummary`（失敗時のみ）
- `404 Not Found`
  - 未知のrunId

## 状態遷移
- `queued -> running -> succeeded|failed|partial|cancelled`
- `failed` からは `DD-APP-API-008` で[[RQ-GL-011|再収集]]runを作成する。

## 処理ロジック
1. JWT検証後、`runId` 形式を検証する。
2. runストアから対象runを取得する。
3. runが存在しない場合は `404 RUN_NOT_FOUND` を返す。
4. 実行中runは進捗メトリクスを更新し、`processed/succeeded/failed` を再計算する。
5. 完了runは `finishedAt` と `errorSummary` を確定値で返す。
6. 応答時に `traceId` と `retryable` を付与する。

## エラーマッピング
| エラーコード | HTTPステータス | 意味 |
| --- | --- | --- |
| `UNAUTHORIZED` | 401 | JWTが未指定または無効でrun状態を照会できない。 |
| `RUN_NOT_FOUND` | 404 | 指定 `runId` が存在せず、状態を返せない。 |
| `RUN_STATE_UNAVAILABLE` | 503 | runストアまたは進捗集計基盤の一時障害で状態を算出できない。 |
| `INTERNAL_ERROR` | 500 | サーバ内部例外により状態取得処理が中断した。 |

## エラーモデル
- `RUN_NOT_FOUND`
- `RUN_STATE_UNAVAILABLE`

## 受入観点
- 実行中ジョブの件数が増加し、完了時に`finishedAt`が埋まること。
- 失敗時は`errorSummary`と`traceId`で障害調査へ遷移できること。

## 変更履歴
- 2026-02-14: エラーマッピングを表形式へ統一し、各エラーコードの意味を明記
- 2026-02-13: run状態語彙を `queued/running/succeeded/failed/partial/cancelled` に統一 [[BD-SYS-ADR-027]]
- 2026-02-11: `/api/v1` 統一と処理ロジック/エラーマッピングを追加 [[BD-SYS-ADR-021]]
- 2026-02-10: 新規作成
- 2026-02-10: [[RQ-GL-002|収集実行]]状態APIの状態遷移と応答契約を追加
- 2026-02-10: ステークホルダー2者（管理者/利用者）に合わせて主体表現を修正
