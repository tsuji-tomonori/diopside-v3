---
id: UT-CASE-004
title: タグ辞書配信契約 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[UT-PLAN-001]]'
- '[[DD-API-005]]'
related:
- '[[IT-CASE-004]]'
tags:
- diopside
- UT
- CASE
---


## 対象API
- `GET /tag_master.json`（[[DD-API-005]]）

## テスト目的
- タグ辞書契約、タグ解決、廃止タグの後方互換動作を単体で検証する。

## 前提
- タグ辞書読み込み処理とUI変換処理を分離して検証可能である。

## 手順
1. `tagTypes` の順序・属性（singleSelect/requiredPerVideo）を検証する。
2. `tags` タプルの可変長項目（aliases/deprecated/mergedInto）を検証する。
3. `deprecated=true` と `mergedInto` の変換処理を検証する。

## 期待結果
- タグ辞書からUIカテゴリが正しく生成される。
- 廃止タグは表示可能だが新規付与対象外として扱われる。
- 置換タグへの解決が破綻しない。

## 受入判定との対応
- タグ絞り込み機能とデータ整合判定の根拠を保証する。

## 変更履歴
- 2026-02-10: 新規作成
- 2026-02-10: DD-API-005対応のAPI単位ケースへ細分化
