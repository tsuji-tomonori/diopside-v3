---
id: UT-CASE-012
title: ドキュメント公開実行API 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-12
updated: '2026-02-12'
up:
- '[[UT-PLAN-005]]'
- '[[DD-APP-API-014]]'
related:
- '[[IT-CASE-012]]'
- '[[RQ-FR-024]]'
tags:
- diopside
- UT
- CASE
---


## 対象API
- `POST /api/v1/admin/docs/publish`（[[DD-APP-API-014]]）
- `GET /api/v1/admin/docs/publish/{docsPublishRunId}`（[[DD-APP-API-014]]）

## テスト目的
- ドキュメント公開runの起動とステップ追跡を単体で検証する。

## 前提
- git操作、Quartzビルド、CDKデプロイはモック化する。
- publish_runsテーブルはテストデータで初期化する。

## 手順（POST /api/v1/admin/docs/publish）
1. 有効な `targetRef`（mainブランチ）で公開を起動する。
2. 存在しない `targetRef` で公開を起動する。
3. 既に実行中の公開runがある状態で重複起動を試みる。
4. `forceInvalidate=true` を指定して公開を起動する。
5. `reason` を指定して公開を起動する。

## 期待結果（POST）
- 手順1: `202` と `docsPublishRunId` を返し、`status=queued` で作成される。
- 手順2: `400 INVALID_TARGET_REF` を返す。
- 手順3: `409 PUBLISH_ALREADY_ACTIVE` を返す。
- 手順4: `202` と `docsPublishRunId` を返す。
- 手順5: `202` と `docsPublishRunId` を返し、`reason` が記録される。

## 手順（GET /api/v1/admin/docs/publish/{docsPublishRunId}）
1. `queued` 状態のrunを取得する。
2. `running` 状態のrunを取得し、各ステップの状態を確認する。
3. `succeeded` 状態のrunを取得する。
4. `failed` 状態のrunを取得し、失敗ステップと再試行可否を確認する。
5. `rolled_back` 状態のrunを取得する。
6. 存在しない `docsPublishRunId` を取得する。

## 期待結果（GET）
- 手順1: `200` と `status=queued`, 空の `steps[]` を返す。
- 手順2: `200` と `status=running`, 進行中ステップを含む `steps[]` を返す。
- 手順3: `200` と `status=succeeded`, 全ステップ完了を返す。
- 手順4: `200` と `status=failed`, `errorCode`, `errorMessage`, `retryable` を返す。
- 手順5: `200` と `status=rolled_back` を返す。
- 手順6: `404 DOCS_PUBLISH_RUN_NOT_FOUND` を返す。

## ステップ状態検証
```json
{
  "steps": [
    { "name": "docs_link_check", "status": "succeeded | failed | pending | running" },
    { "name": "quartz_build", "status": "..." },
    { "name": "cdk_deploy", "status": "..." },
    { "name": "invalidation", "status": "..." }
  ]
}
```

## [[AT-GO-001|リリース判定]]との対応
- [[RQ-FR-024]] ドキュメント公開機能を検証する。
- ビルド失敗時にデプロイに進まないことを確認する。

## 変更履歴
- 2026-02-12: 新規作成（分析レポートに基づく追加）
