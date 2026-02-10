---
id: IT-CASE-003
title: アーカイブ一覧配信契約 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[IT-PLAN-001]]'
- '[[DD-API-004]]'
related:
- '[[AT-SCN-001]]'
tags:
- diopside
- IT
- CASE
---


## 対象API
- `GET /bootstrap.json`
- `GET /archive_index.p{page}.json`（[[DD-API-004]]）

## テスト目的
- 収集成果物が配信領域へ正しく配置され、Webが段階ロードで参照できることを検証する。

## 手順
1. 最新収集run完了後に `bootstrap.json` を取得する。
2. `archive_index.p0.json` を取得し件数整合を確認する。
3. Web画面を開き初期描画と追加ロードを確認する。

## 期待結果
- 配信データの `archiveVersion` が最新runと一致する。
- Webが一覧を表示し、追加ロード可能である。

## 受入接続
- `AT-SCN-001` の一覧閲覧シナリオへ接続する。

## 変更履歴
- 2026-02-10: 新規作成
- 2026-02-10: DD-API-004対応のAPI単位ケースへ細分化
