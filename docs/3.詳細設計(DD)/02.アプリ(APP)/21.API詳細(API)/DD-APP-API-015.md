---
id: DD-APP-API-015
title: 配信反映ジョブ状態API
doc_type: API詳細
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-14'
up:
- '[[BD-APP-API-002]]'
- '[[RQ-FR-005]]'
- '[[RQ-FR-024]]'
related:
- '[[BD-APP-UI-001]]'
- '[[DD-APP-API-005]]'
- '[[DD-APP-API-014]]'
- '[[DD-APP-UI-010]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- タグ公開反映および公開runの状態を共通形式で照会し、[[DD-APP-UI-010|UI-A06]] で進行監視できるようにする。

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
| エラーコード | HTTPステータス | 意味 |
| --- | --- | --- |
| `UNAUTHORIZED` | 401 | JWTが未指定または無効で公開run状態を参照できない。 |
| `PUBLISH_RUN_NOT_FOUND` | 404 | 指定 `publishRunId` が存在せず進捗情報を返せない。 |
| `PUBLISH_STATE_UNAVAILABLE` | 503 | 公開runストアまたはステップ集約基盤が一時利用不可で状態判定できない。 |
| `INTERNAL_ERROR` | 500 | サーバ内部例外により公開状態取得処理が失敗した。 |

## 受入観点
- [[DD-APP-UI-010|UI-A06]] で `queued/running/succeeded/failed/rolled_back` を判別できること。
- 失敗時にロールバック有無と再試行可否を確認できること。

## 変更履歴
- 2026-02-14: 画面参照 `UI-A06` を [[DD-APP-UI-010]] へリンク化
- 2026-02-14: エラーマッピングを表形式へ統一し、各エラーコードの意味を明記
- 2026-02-11: 新規作成 [[BD-SYS-ADR-021]]
