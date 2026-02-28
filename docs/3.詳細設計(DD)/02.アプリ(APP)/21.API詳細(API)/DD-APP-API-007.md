---
id: DD-APP-API-007
title: 動画詳細API
doc_type: API詳細
phase: DD
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-28'
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
- `GET /api/v1/videos/{videoId}`

## 契約正本
- HTTP API契約は Hono実装から生成する OpenAPI（`/openapi/v1/openapi.json`）を正本とする。
- 本書は動画詳細取得フロー、フォールバック制約、表示品質オラクルを定義する入力文書として扱う。

## MVP適用境界
- MVPでは `GET /api/v1/videos/{videoId}` を提供し、公開配信契約との差分項目（`watchUrl`/`embedUrl` など）をAPIで補完する。
- 静的配信契約の組み立てロジックはフォールバックとして維持する。

## レスポンス契約
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
- 2026-02-28: 現行経路 `GET /api/v1/videos/{videoId}` と OpenAPI正本方針を反映し、将来経路を拡張候補へ整理
- 2026-02-11: MVP非対象の予約境界を明記し、将来経路を `/api/v2/videos/{videoId}` へ更新 [[BD-SYS-ADR-021]]
- 2026-02-10: 新規作成
- 2026-02-10: 動画詳細のMVP組み立て仕様と将来API契約を追加
