---
id: IT-CASE-004
title: タグ辞書配信契約 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-10
updated: '2026-02-10'
up:
- '[[IT-PLAN-001]]'
- '[[DD-API-005]]'
related:
- '[[AT-SCN-002]]'
tags:
- diopside
- IT
- CASE
---

## 対象API
- `GET /tag_master.json`（[[DD-API-005]]）

## テスト目的
- [[RQ-GL-005|タグ辞書]]生成、配信、Web反映の連携を検証する。

## 手順
1. 最新run後の `tag_master.json` を取得する。
2. Webのフィルタドロワーを開いてカテゴリ表示を確認する。
3. タグ検索と選択で絞り込みが機能することを確認する。

## 期待結果
- 辞書更新内容がUIに反映される。
- 廃止タグの表示挙動が仕様どおりである。

## 変更履歴
- 2026-02-10: 新規作成
