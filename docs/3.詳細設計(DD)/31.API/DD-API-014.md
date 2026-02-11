---
id: DD-API-014
title: ドキュメント公開実行API
doc_type: API詳細
phase: DD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[BD-API-002]]'
- '[[RQ-FR-024]]'
related:
- '[[BD-DEP-003]]'
- '[[DD-DEP-001]]'
- '[[UT-PLAN-003]]'
tags:
- diopside
- DD
- API
---

## 目的
- 管理画面の単一操作でドキュメント公開runを起動し、ビルドから配信反映までを追跡可能にする。

## エンドポイント
- `POST /api/v1/admin/docs/publish`
- `GET /api/v1/admin/docs/publish/{docsPublishRunId}`

## `POST` リクエスト
- `targetRef`（必須）: 公開対象git ref
- `reason`（任意）: 手動実行理由
- `forceInvalidate`（任意）: キャッシュ無効化を強制するか

## `GET` レスポンス
- `docsPublishRunId`, `status`, `targetRef`, `startedAt`, `finishedAt?`
- `steps[]`: `docs_link_check`, `quartz_build`, `cdk_deploy`, `invalidation`
- `errorCode?`, `errorMessage?`, `retryable`

## 処理ロジック
### `POST /api/v1/admin/docs/publish`
1. 認証/権限を確認し、重複実行制約を評価する。
2. `targetRef` 存在を検証し、参照不能なら400を返す。
3. `docsPublishRunId` を採番して `queued` で作成する。
4. 同一Backend API内ジョブ実行モジュールへ公開ジョブを登録する。

### `GET /api/v1/admin/docs/publish/{docsPublishRunId}`
1. runの存在を確認する。
2. 各ステップの状態を集約し、全体 `status` を計算する。
3. 失敗時は失敗ステップと再試行可否を返す。

## 状態遷移
- `queued -> running -> succeeded|failed|rolled_back`

## エラーマッピング
- `PUBLISH_ALREADY_ACTIVE`: 409
- `INVALID_TARGET_REF`: 400
- `DOCS_PUBLISH_RUN_NOT_FOUND`: 404
- `DOCS_BUILD_FAILED`, `DOCS_DEPLOY_FAILED`, `INVALIDATION_FAILED`: 500

## 受入観点
- 単一操作でrunが作成され、ステップごとの進捗が確認できること。
- ビルド失敗時にデプロイへ進まず、失敗理由を返せること。

## 変更履歴
- 2026-02-11: 公開ジョブの実行登録先を「同一Backend API内ジョブ実行モジュール」へ明確化 [[BD-ADR-021]]
- 2026-02-11: 新規作成 [[BD-ADR-021]]
