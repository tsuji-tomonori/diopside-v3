---
id: DD-API-005
title: タグ辞書API
doc_type: API詳細
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[BD-ARCH-001]]'
- '[[BD-API-001]]'
related:
- '[[RQ-FR-001]]'
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

## 契約
- 必須項目: `schemaVersion`, `tagMasterVersion`, `generatedAt`, `tagTypes`, `tags`。
- `tagTypes` は表示順・単一選択可否・必須性を持つ。
- `tags` は `[tagTypeId, tagName, aliases?, deprecated?, mergedInto?]` の可変長タプル。

## UI利用ルール
- フィルタカテゴリは `tagTypes.order` に従って表示する。
- `deprecated=true` タグは選択候補に残すが、新規付与対象から除外する。
- `mergedInto` が存在する場合は後方互換で新タグへ解決する。

## エラーハンドリング
- 取得失敗時は`bootstrap.tagPreview`をフォールバック辞書として使用する。

## 受入観点
- タグ検索UIが`tag_master`読込後にカテゴリ/タグ名を更新できること。
- 廃止タグが一覧で識別可能であること。

## 変更履歴
- 2026-02-10: 新規作成
- 2026-02-10: タグ辞書契約とフォールバック動作を追加

