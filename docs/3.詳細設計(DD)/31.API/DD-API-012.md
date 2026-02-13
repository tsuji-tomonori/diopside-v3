---
id: DD-API-012
title: 配信前後再確認API
doc_type: API詳細
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-14'
up:
- '[[BD-API-002]]'
- '[[RQ-FR-019]]'
related:
- '[[RQ-UC-009]]'
- '[[DD-API-011]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- 配信前メタデータと配信後メタデータの差分確認をrun単位で実行し、差分有無を記録する。

## エンドポイント
- `POST /api/v1/ops/rechecks`
- `GET /api/v1/ops/rechecks/{recheckRunId}`

## `POST /api/v1/ops/rechecks` リクエスト
- `targetVideoIds[]`（必須）
- `mode`（必須）: `before_delivery | after_delivery`
- `baseRunId`（任意）: 収集runとの関連ID

## `GET /api/v1/ops/rechecks/{recheckRunId}` レスポンス
- `recheckRunId`, `status`, `mode`, `totalCount`
- `diffSummary`: `changedCount`, `unchangedCount`, `failedCount`
- `items[]`: `videoId`, `diffStatus(changed|unchanged|failed|excluded)`, `diffFields[]`, `reason?`

## 処理ロジック
### `POST /api/v1/ops/rechecks`
1. JWT検証後、入力動画ID集合と `mode` を検証する。
2. 対象動画ごとに基準メタデータ（before）を解決する。
3. `recheckRunId` を採番し `queued` で保存する。
4. 再確認ジョブを同一Backend API内ジョブ実行モジュールへ登録し受理応答する。

### `GET /api/v1/ops/rechecks/{recheckRunId}`
1. run存在確認後、再確認結果を集約する。
2. 差分判定は `title/scheduledStartTime/description` を必須比較軸とする。
3. 失敗・対象外を区別して返却する。

## 状態遷移
- `queued -> running -> succeeded|failed|partial`

## エラーマッピング
| エラーコード | HTTPステータス | 意味 |
| --- | --- | --- |
| `INVALID_RECHECK_MODE` | 400 | `mode` が許可値（`before_delivery`/`after_delivery`）に一致しない。 |
| `INVALID_TARGET_VIDEOS` | 400 | `targetVideoIds[]` が空・重複過多・形式不正で受付条件を満たさない。 |
| `UNAUTHORIZED` | 401 | JWTが未指定または無効で再確認runを操作できない。 |
| `RECHECK_RUN_NOT_FOUND` | 404 | 指定 `recheckRunId` が存在せず結果を取得できない。 |
| `RECHECK_SOURCE_UNAVAILABLE` | 503 | 比較元メタデータを取得できず差分判定を実行できない。 |

## 受入観点
- 差分あり/差分なし/失敗が同一runで識別できること。
- 差分なしでも `unchanged` として記録されること。

## 変更履歴
- 2026-02-14: エラーマッピングを表形式へ統一し、各エラーコードの意味を明記
- 2026-02-11: 再確認ジョブの実行登録先を「同一Backend API内ジョブ実行モジュール」へ明確化 [[BD-ADR-021]]
- 2026-02-11: 新規作成 [[BD-ADR-021]]
