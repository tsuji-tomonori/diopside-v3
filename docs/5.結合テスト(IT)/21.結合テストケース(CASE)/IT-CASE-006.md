---
id: IT-CASE-006
title: 動画詳細表示契約 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-10
updated: '2026-02-10'
up:
- '[[IT-PLAN-001]]'
- '[[DD-APP-API-007]]'
related:
- '[[AT-SCN-003]]'
tags:
- diopside
- IT
- CASE
---

## 対象API
- 動画詳細組み立て契約（[[DD-APP-API-007]]）

## テスト目的
- 一覧カード選択からモーダル表示、YouTube遷移までの連携を検証する。

## 手順
1. 一覧の動画カードを選択しモーダル表示を確認する。
2. タグ解決と公開日時表示を確認する。
3. `YouTubeで開く` 操作で遷移URLを確認する。

## 期待結果
- 選択動画IDとモーダル情報が一致する。
- 遷移URLのvideoIdが一致する。

## 変更履歴
- 2026-02-10: 新規作成
