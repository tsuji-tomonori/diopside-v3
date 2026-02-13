---
id: DD-API-014
title: ドキュメント公開実行API
doc_type: API詳細
phase: DD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-14'
up:
- '[[BD-API-002]]'
- '[[RQ-FR-024]]'
related:
- '[[BD-DEP-003]]'
- '[[DD-DEP-001]]'
- '[[UT-PLAN-003]]'
- '[[DD-DDL-012]]'
- '[[DD-DDL-013]]'
- '[[BD-ADR-027]]'
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

## ロールバック手順
1. `quartz_build` または `cdk_deploy` 失敗時は `switch` を実行しない。
2. `switch` 後に `invalidation` が失敗した場合は `rollback_pending` を設定する。
3. `rollback_prepare` で前回成功runの成果物参照を解決する。
4. `rollback_switch` で前回成果物へ切替える。
5. `rollback_verify` で `/docs` と `/openapi` の疎通を確認し、成功時に `rolled_back` へ遷移する。
6. ロールバック失敗時は `failed` のまま固定し、運用手順へエスカレーションする。

## publish_runs / publish_steps 追加状態
- `publish_runs.status`: `rollback_pending` を追加する。
- `publish_steps.step_name`: `rollback_prepare`, `rollback_switch`, `rollback_verify` を追加する。
- `publish_steps.status`: `queued|running|succeeded|failed|skipped` を維持し、ロールバックstepにも同一適用する。

## エラーマッピング
| エラーコード | HTTPステータス | 意味 |
| --- | --- | --- |
| `INVALID_TARGET_REF` | 400 | 指定 `targetRef` が存在しない、または解決不能なgit参照。 |
| `DOCS_PUBLISH_RUN_NOT_FOUND` | 404 | 指定 `docsPublishRunId` が存在せず進捗照会できない。 |
| `PUBLISH_ALREADY_ACTIVE` | 409 | 既存のドキュメント公開runが進行中で重複起動を拒否した。 |
| `DOCS_BUILD_FAILED` | 500 | `docs_link_check` または `quartz_build` で失敗し成果物を確定できない。 |
| `DOCS_DEPLOY_FAILED` | 500 | `cdk_deploy` で失敗し公開先切替を完了できない。 |
| `INVALIDATION_FAILED` | 500 | `invalidation` 失敗により配信面への反映保証を満たせない。 |

## 受入観点
- 単一操作でrunが作成され、ステップごとの進捗が確認できること。
- ビルド失敗時にデプロイへ進まず、失敗理由を返せること。

## 変更履歴
- 2026-02-14: エラーマッピングを表形式へ統一し、各エラーコードの意味を明記
- 2026-02-13: docs公開部分失敗時のロールバック状態遷移と `publish_runs/publish_steps` 拡張状態を追加 [[BD-ADR-027]]
- 2026-02-11: 公開ジョブの実行登録先を「同一Backend API内ジョブ実行モジュール」へ明確化 [[BD-ADR-021]]
- 2026-02-11: 新規作成 [[BD-ADR-021]]
