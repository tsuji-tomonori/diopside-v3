---
id: DD-APP-API-007
title: 動画詳細API
doc_type: API詳細
phase: DD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-API-001]]'
related:
- '[[RQ-FR-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- 一覧から選択した動画の詳細表示に必要な情報を提供する。

## エンドポイント
- `GET /api/v2/videos/{videoId}`（将来のサーバ詳細取得）
- MVPでは `archive_index` + `tag_master` からクライアント組み立てで代替する。

## MVP適用境界
- 本項目は将来サーバ詳細APIの予約設計であり、MVPでは静的契約からの組み立てを正本とする。
- サーバ詳細API導入時は、公開配信契約との二重管理期間を設ける。

## レスポンス契約（将来）
- `videoId`, `title`, `publishedAt`, `durationSec`, `tags`, `channel`, `watchUrl`, `embedUrl`
- 任意項目: `description`, `sourceType`（official/appearance）, `collectedAt`

## MVP組み立て仕様
- `videoId` で索引項目を検索し、タグIDをタグ名に解決してモーダルへ渡す。
- YouTube遷移URLは `https://www.youtube.com/watch?v={videoId}` を使用。

## エラー仕様
- 未検出時は404相当のUI通知（「動画が見つかりません」）。
- 参照解決失敗時はタグのみフォールバック表示する。

## 受入観点
- 一覧カード選択からモーダル表示まで3秒以内で完了すること。
- 「YouTubeで開く」操作で正しい動画IDへ遷移すること。

## 変更履歴
- 2026-02-11: MVP非対象の予約境界を明記し、将来経路を `/api/v2/videos/{videoId}` へ更新 [[BD-SYS-ADR-021]]
- 2026-02-10: 新規作成
- 2026-02-10: 動画詳細のMVP組み立て仕様と将来API契約を追加
