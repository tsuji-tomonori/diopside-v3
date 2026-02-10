---
id: DD-API-004
title: アーカイブ一覧API
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
- 一覧表示に必要な配信契約を[[RQ-GL-010|段階ロード]]で提供する。

## エンドポイント（静的配信）
- `GET /bootstrap.json`
- `GET /archive_index.p{page}.json`

## `bootstrap.json` 契約
- `schemaVersion`, `generatedAt`, `tagTypes`, `tagPreview`, `latest`, `next` を必須とする。
- `latest` は初期表示件数を満たす最小セットとする。
- `next.archiveIndex.urlPattern` でページ索引URIを通知する。

## `archive_index.p{page}.json` 契約
- `page`, `pageSize`, `total`, `items` を必須とする。
- `items` の要素は `[videoId, title, channelTagId, publishedAtEpochSec, durationSec, tagIds]`。
- `total` は全件数、`pageSize` は固定サイズを示す。

## キャッシュ方針
- ハッシュ化バージョン更新時に新規配信。
- `generatedAt` と `archiveVersion` で鮮度を判定。

## 受入観点
- Webが`bootstrap -> archive_index`の順で読み込み、一覧件数が最終的に`total`へ収束すること。
- 欠損ページ時は表示継続しつつ警告通知できること。

## 変更履歴
- 2026-02-10: 新規作成
- 2026-02-10: 一覧配信契約（[[RQ-GL-007|bootstrap]]/[[RQ-GL-009|archive_index]]）の詳細を追加

