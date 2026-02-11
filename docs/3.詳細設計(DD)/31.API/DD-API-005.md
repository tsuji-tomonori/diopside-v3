---
id: DD-API-005
title: タグ辞書API
doc_type: API詳細
phase: DD
version: 1.0.3
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
- `PATCH /api/v1/admin/tags/{tagId}`
- `POST /api/v1/admin/publish/tag-master`

## 契約
- 必須項目: `schemaVersion`, `tagMasterVersion`, `generatedAt`, `tagTypes`, `tags`。
- `tagTypes` は表示順・単一選択可否・必須性を持つ。
- `tags` は `[tagTypeId, tagName, aliases?, deprecated?, mergedInto?]` の可変長タプル。

## UI利用ルール
- フィルタカテゴリは `tagTypes.order` に従って表示する。
- `deprecated=true` タグは選択候補に残すが、新規付与対象から除外する。
- `mergedInto` が存在する場合は後方互換で新タグへ解決する。

## 管理API利用ルール
- タグ更新APIはDB正本を更新し、即時に `tag_master.json` を直接書き換えない。
- 公開反映APIは生成ジョブを起動し、生成成功後に公開版を切り替える。
- 生成失敗時は直前公開版を維持し、`publish_run_id` と失敗理由を返す。

## エラーハンドリング
- 取得失敗時は`bootstrap.tagPreview`をフォールバック辞書として使用する。
- 管理API失敗時は、更新失敗と公開失敗を別コードで返し再試行可否を明示する。

## 受入観点
- タグ検索UIが`tag_master`読込後にカテゴリ/タグ名を更新できること。
- 廃止タグが一覧で識別可能であること。

## 変更履歴
- 2026-02-11: 管理API（タグ更新/公開反映）と公開切替ルールを追加 [[BD-ADR-021]]
- 2026-02-10: 新規作成
- 2026-02-10: [[RQ-GL-005|タグ辞書]]契約とフォールバック動作を追加
