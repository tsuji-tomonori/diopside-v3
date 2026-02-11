---
id: DD-API-004
title: アーカイブ一覧API
doc_type: API詳細
phase: DD
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
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
- `next.archiveIndex.urlPattern` で[[RQ-GL-009|archive_index（ページング済み索引）]]のURIを通知する。

## `archive_index.p{page}.json` 契約
- `page`, `pageSize`, `total`, `items` を必須とする。
- `items` の要素は `[videoId, title, channelTagId, publishedAtEpochSec, durationSec, tagIds]`。
- `total` は全件数、`pageSize` は固定サイズを示す。

## 処理ロジック
1. Publish Orchestrator が対象[[RQ-GL-018|配信反映実行]]を `running` に遷移する。
2. DB正本から公開対象動画を抽出し、公開状態・必須属性欠損を検証する。
3. `bootstrap` 用の先頭集合を確定する。
4. 残り集合を `pageSize` 固定で分割し、`archive_index.p{page}.json` を生成する。
5. 生成物をステージング領域へ配置し、整合検証（総件数/ページ連続性/重複ID）を実施する。
6. 検証成功時に公開領域へ切替し、失敗時は前版維持で終了する。

## 失敗時挙動
- 検証失敗: 切替を実施せず `PUBLISH_GENERATION_FAILED` を返す。
- 部分生成失敗: 失敗ページを隔離し、公開版は更新しない。
- 配信障害: `PUBLISH_SWITCH_FAILED` と `publish_run_id` を返し再試行対象にする。

## キャッシュ方針
- ハッシュ化バージョン更新時に新規配信。
- `generatedAt` と `archiveVersion` で鮮度を判定。

## 受入観点
- Webが`bootstrap -> archive_index`の順で読み込み、一覧件数が最終的に`total`へ収束すること。
- 欠損ページ時は表示継続しつつ警告通知できること。

## 変更履歴
- 2026-02-11: 配信生成APIの処理ロジックと失敗時挙動を追加 [[BD-ADR-021]]
- 2026-02-11: `archive_index` 契約の用語参照を [[RQ-GL-009]] へ統一
- 2026-02-10: 新規作成
- 2026-02-10: 一覧配信契約（[[RQ-GL-007|bootstrap]]/[[RQ-GL-009|archive_index]]）の詳細を追加
