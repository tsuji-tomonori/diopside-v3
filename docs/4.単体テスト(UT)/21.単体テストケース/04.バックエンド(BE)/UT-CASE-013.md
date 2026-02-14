---
id: UT-CASE-013
title: 配信反映ジョブ状態API 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-12
updated: '2026-02-12'
up:
- '[[UT-PLAN-005]]'
- '[[DD-APP-API-015]]'
related:
- '[[IT-CASE-013]]'
- '[[DD-APP-API-013]]'
- '[[DD-APP-API-014]]'
tags:
- diopside
- UT
- CASE
---


## 対象API
- `GET /api/v1/admin/publish/{publishRunId}`（[[DD-APP-API-015]]）

## テスト目的
- タグ公開反映および公開runの状態照会を単体で検証する。

## 前提
- publish_runs / publish_steps テーブルはテストデータで初期化する。

## 手順
1. `publishType=tag_master` の完了済みrunを取得する。
2. `publishType=archive` の完了済みrunを取得する。
3. `publishType=all` の完了済みrunを取得する。
4. `publishType=docs` の完了済みrunを取得する。
5. `status=running` のrunを取得し、最新ステップ状態を確認する。
6. `status=failed` のrunを取得し、ロールバック情報を確認する。
7. `status=rolled_back` のrunを取得する。
8. 存在しない `publishRunId` を取得する。
9. 不正な形式の `publishRunId` を取得する。

## 期待結果
- 手順1-4: `200` と対応する `publishType`, `status=succeeded` を返す。
- 手順5: `200` と `status=running`, 進行中ステップを含む `steps[]` を返す。
- 手順6: `200` と `status=failed`, `rollback.executed`, `errorCode`, `errorMessage`, `retryable` を返す。
- 手順7: `200` と `status=rolled_back`, `rollback.executed=true`, `rollback.rollbackToVersion` を返す。
- 手順8: `404 PUBLISH_RUN_NOT_FOUND` を返す。
- 手順9: `400` を返す（形式検証失敗）。

## レスポンススキーマ検証
```json
{
  "publishRunId": "string (UUID)",
  "publishType": "tag_master | archive | all | docs",
  "status": "queued | running | succeeded | failed | rolled_back",
  "startedAt": "ISO8601",
  "finishedAt": "ISO8601 (optional)",
  "triggeredBy": "string",
  "steps": [
    { "name": "generate | validate | switch | post_check", "status": "..." }
  ],
  "rollback": {
    "executed": "boolean",
    "rollbackToVersion": "string (optional)"
  },
  "errorCode": "string (optional)",
  "errorMessage": "string (optional)",
  "retryable": "boolean"
}
```

## [[RQ-GL-012|受入判定]]との対応
- [[RQ-FR-005]] タグ公開反映状態を検証する。
- [[RQ-FR-024]] docs公開反映状態を検証する。
- UI-A06での進行監視を可能にする。

## 変更履歴
- 2026-02-12: 新規作成（分析レポートに基づく追加）
