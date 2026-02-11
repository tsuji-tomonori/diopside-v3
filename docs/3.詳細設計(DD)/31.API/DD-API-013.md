---
id: DD-API-013
title: タグ管理API
doc_type: API詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[BD-API-002]]'
- '[[RQ-FR-005]]'
- '[[RQ-FR-019]]'
related:
- '[[DD-API-005]]'
- '[[RQ-UC-009]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- 管理画面からの[[RQ-GL-005|タグ辞書]]更新と動画への手動タグ付けを、DB正本へ安全に反映する。

## エンドポイント
- `POST /api/v1/admin/tags`
- `PATCH /api/v1/admin/tags/{tagId}`
- `PATCH /api/v1/admin/videos/{videoId}/tags`

## リクエスト要約
- `POST /admin/tags`: `tag_name`, `tag_type_id`, `synonyms[]`, `is_active`
- `PATCH /admin/tags/{tagId}`: `tag_name?`, `synonyms?`, `is_active?`, `merged_into?`
- `PATCH /admin/videos/{videoId}/tags`: `set[]`, `unset[]`, `reason`

## 処理ロジック
### `POST /api/v1/admin/tags`
1. 認証と権限を検証する。
2. 文字種・長さ・禁止語を検証する。
3. slug重複をチェックし、重複時は拒否する。
4. tagsテーブルへINSERTし、監査ログへ記録する。

### `PATCH /api/v1/admin/tags/{tagId}`
1. `tagId` 存在と状態を確認する。
2. 変更フィールドを検証する。
3. 参照中タグの削除要求は `is_active=false` へ変換する。
4. 更新差分を保存し、`propagation_state=pending_publish` を設定する。

### `PATCH /api/v1/admin/videos/{videoId}/tags`
1. `videoId` と `set/unset` の対象タグ存在を確認する。
2. 競合検証（同一タグをset/unset同時指定禁止）を実施する。
3. video_tags を更新し、操作理由を監査ログへ記録する。
4. 成功時に最新タグ集合と `updatedAt` を返す。

## エラーマッピング
- `TAG_NOT_FOUND`, `VIDEO_NOT_FOUND`: 404
- `TAG_SLUG_CONFLICT`, `TAG_CONFLICT`: 409
- `INVALID_TAG_INPUT`, `INVALID_TAG_OPERATION`: 400
- `UNAUTHORIZED`, `FORBIDDEN`: 401/403

## 受入観点
- タグ作成/更新/無効化がDB正本へ反映されること。
- 配信前後確認画面からの手動タグ付けが理由付きで記録されること。

## 変更履歴
- 2026-02-11: 新規作成 [[BD-ADR-021]]
