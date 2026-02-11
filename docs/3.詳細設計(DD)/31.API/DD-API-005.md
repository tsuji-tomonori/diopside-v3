---
id: DD-API-005
title: タグ辞書API
doc_type: API詳細
phase: DD
version: 1.0.5
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-ARCH-001]]'
- '[[BD-API-001]]'
related:
- '[[RQ-FR-001]]'
- '[[BD-ADR-021]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- タグID解決とフィルタUI生成に必要な辞書を提供する。

## エンドポイント（静的配信）
- `GET /tag_master.json`

## エンドポイント（管理API）
- `POST /api/v1/admin/tags`
- `PATCH /api/v1/admin/tags/{tagId}`
- `POST /api/v1/admin/publish/tag-master`

## 契約
- 必須項目: `schemaVersion`, `tagMasterVersion`, `generatedAt`, `tagTypes`, `tags`。
- `tagTypes` は表示順・単一選択可否・必須性を持つ。
- `tags` は `[tagTypeId, tagName, aliases?, deprecated?, mergedInto?]` の可変長タプル。

## JSON Schema
- `tag_master.json` の正本スキーマ: `contracts/static-json/tag_master.schema.json`
- `tags` の可変長タプルは JSON Schema の `prefixItems` と `oneOf` で 2〜5要素として検証する。
- 互換性方針: 必須キーを固定しつつ、追加キーは将来拡張として許容する。

## UI利用ルール
- フィルタカテゴリは `tagTypes.order` に従って表示する。
- `deprecated=true` タグは選択候補に残すが、新規付与対象から除外する。
- `mergedInto` が存在する場合は後方互換で新タグへ解決する。

## 管理API利用ルール
- タグ更新APIはDB正本を更新し、即時に `tag_master.json` を直接書き換えない。
- 公開反映APIは生成ジョブを起動し、生成成功後に公開版を切り替える。
- 生成失敗時は直前公開版を維持し、`publish_run_id` と失敗理由を返す。

## 処理ロジック
### `POST /api/v1/admin/tags`
1. JWTを検証し、`operator` を解決する。
2. `tag_name/tag_type_id/synonyms/is_active` を検証する。
3. slug重複と禁止文字を検証し、違反時は `409 TAG_SLUG_CONFLICT` を返す。
4. DBへ新規タグを作成し、監査ログへ操作履歴を記録する。
5. `tag_id/updated_at/propagation_state=pending_publish` を返す。

### `PATCH /api/v1/admin/tags/{tagId}`
1. `tagId` 存在確認後、変更対象フィールドを検証する。
2. 削除要求は論理無効化へ変換し、参照整合を維持する。
3. DB更新後、公開待ち状態へ遷移させる。
4. 差分と操作者を監査ログへ記録する。

### `POST /api/v1/admin/publish/tag-master`
1. [[RQ-GL-018|配信反映実行]]を作成し、`queued` で受理する。
2. 生成処理で `tag_master.json` を再生成する。
3. 生成検証成功時に公開版へ切替する。
4. 失敗時は直前公開版を維持して `failed` を返す。

## エラーマッピング
- `TAG_NOT_FOUND`: 404
- `TAG_SLUG_CONFLICT`, `TAG_ID_REUSED`: 409
- `INVALID_TAG_PAYLOAD`: 400
- `PUBLISH_GENERATION_FAILED`, `PUBLISH_SWITCH_FAILED`: 500

## エラーハンドリング
- 取得失敗時は`bootstrap.tagPreview`をフォールバック辞書として使用する。
- 管理API失敗時は、更新失敗と公開失敗を別コードで返し再試行可否を明示する。

## 受入観点
- タグ検索UIが`tag_master`読込後にカテゴリ/タグ名を更新できること。
- 廃止タグが一覧で識別可能であること。

## 変更履歴
- 2026-02-11: `tag_master.json` 契約の JSON Schema 正本参照と可変長タプル検証方針を追加 [[BD-ADR-021]]
- 2026-02-11: タグ新規作成APIと管理API処理ロジック/エラーマッピングを追加 [[BD-ADR-021]]
- 2026-02-11: 管理API（タグ更新/公開反映）と公開切替ルールを追加 [[BD-ADR-021]]
- 2026-02-10: 新規作成
- 2026-02-10: [[RQ-GL-005|タグ辞書]]契約とフォールバック動作を追加
