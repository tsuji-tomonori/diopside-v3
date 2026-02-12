---
id: UT-CASE-011
title: タグ管理API 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-12
updated: '2026-02-12'
up:
- '[[UT-PLAN-005]]'
- '[[DD-API-013]]'
related:
- '[[IT-CASE-011]]'
- '[[RQ-FR-005]]'
- '[[RQ-FR-019]]'
tags:
- diopside
- UT
- CASE
---


## 対象API
- `POST /api/v1/admin/tags`（[[DD-API-013]]）
- `PATCH /api/v1/admin/tags/{tagId}`（[[DD-API-013]]）
- `PATCH /api/v1/admin/videos/{videoId}/tags`（[[DD-API-013]]）
- `POST /api/v1/admin/tagging/prompts`（[[DD-API-013]]）
- `POST /api/v1/admin/tagging/imports`（[[DD-API-013]]）

## テスト目的
- [[RQ-GL-005|タグ辞書]]の作成/更新/無効化と、動画への手動タグ付け、LLM支援タグ運用を単体で検証する。

## 前提
- tags / video_tags テーブルはテストデータで初期化する。
- 監査ログはモック化し、呼び出しを検証する。

## 手順（POST /api/v1/admin/tags）
1. 有効な `tag_name`, `tag_type_id` で新規タグを作成する。
2. 既存タグと重複する `slug` で作成を試みる。
3. 禁止語を含む `tag_name` で作成を試みる。
4. 最大長を超える `tag_name` で作成を試みる。

## 期待結果（POST /admin/tags）
- 手順1: `201` と新規 `tagId` を返す。監査ログに記録される。
- 手順2: `409 TAG_SLUG_CONFLICT` を返す。
- 手順3: `400 INVALID_TAG_INPUT` を返す。
- 手順4: `400 INVALID_TAG_INPUT` を返す。

## 手順（PATCH /api/v1/admin/tags/{tagId}）
1. 存在するタグの `tag_name` を更新する。
2. `is_active=false` でタグを無効化する。
3. `merged_into` を指定してタグを統合する。
4. 存在しない `tagId` で更新を試みる。

## 期待結果（PATCH /admin/tags/{tagId}）
- 手順1: `200` と更新後のタグ情報を返す。`propagation_state=pending_publish` が設定される。
- 手順2: `200` と `is_active=false` を返す。
- 手順3: `200` と統合先情報を返す。
- 手順4: `404 TAG_NOT_FOUND` を返す。

## 手順（PATCH /api/v1/admin/videos/{videoId}/tags）
1. `set[]` のみで新規タグを付与する。
2. `unset[]` のみで既存タグを解除する。
3. `set[]` と `unset[]` を同時指定する（競合なし）。
4. 同一タグを `set[]` と `unset[]` に同時指定する。
5. 存在しない `videoId` でタグ操作を試みる。
6. 存在しない `tagId` を `set[]` に指定する。

## 期待結果（PATCH /admin/videos/{videoId}/tags）
- 手順1-3: `200` と最新タグ集合、`updatedAt` を返す。監査ログに `reason` が記録される。
- 手順4: `400 TAG_CONFLICT` を返す。
- 手順5: `404 VIDEO_NOT_FOUND` を返す。
- 手順6: `404 TAG_NOT_FOUND` を返す。

## 手順（POST /api/v1/admin/tagging/prompts）
1. 有効な `runId` と `videoIds[]` でプロンプト生成する。
2. 存在しない `runId` で生成を試みる。
3. `includeFields[]` を指定して生成する。

## 期待結果（POST /admin/tagging/prompts）
- 手順1: `200` と `promptText`, `promptVersion`, `videoCount`, `generatedAt` を返す。
- 手順2: `404 RUN_NOT_FOUND` を返す。
- 手順3: `200` と指定フィールドのみを含む `promptText` を返す。

## 手順（POST /api/v1/admin/tagging/imports）
1. 有効な `schemaVersion=v1` と正常な `items[]` でインポートする。
2. 未対応 `schemaVersion` でインポートを試みる。
3. 必須キー欠落の `items[]` でインポートを試みる。
4. 存在しない `videoId` を含む `items[]` でインポートする。
5. 存在しない `tagId` を含む `items[]` でインポートする。
6. 無効（`is_active=false`）な `tagId` を含む `items[]` でインポートする。

## 期待結果（POST /admin/tagging/imports）
- 手順1: `200` と `importRunId`, `appliedCount > 0`, `rejectedCount = 0`, `nextAction=publish_required` を返す。
- 手順2: `400 INVALID_IMPORT_SCHEMA` を返す。
- 手順3: `400 INVALID_IMPORT_PAYLOAD` を返す。
- 手順4: `200` と `rejectedCount > 0`, `errors[]` に `UNKNOWN_VIDEO_ID` を含む。
- 手順5: `200` と `rejectedCount > 0`, `errors[]` に `UNKNOWN_TAG_ID` を含む。
- 手順6: `200` と `rejectedCount > 0`, `errors[]` に `INACTIVE_TAG_ID` を含む。

## [[RQ-GL-012|受入判定]]との対応
- [[RQ-FR-005]] タグ管理機能を検証する。
- [[RQ-FR-019]] LLM支援タグ運用を検証する。

## 変更履歴
- 2026-02-12: 新規作成（分析レポートに基づく追加）
