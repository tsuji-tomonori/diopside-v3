---
id: UT-CASE-010
title: 配信経路rewrite 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[UT-PLAN-003]]'
- '[[DD-INF-DEP-001]]'
related:
- '[[IT-PLAN-001]]'
tags:
- diopside
- UT
- CASE
---


## 対象モジュール
- `infra/functions/pretty-url-rewrite.js`

## テスト目的
- URL rewriteの経路分岐が設計どおりで、API/OpenAPI経路へ誤った書き換えを適用しないことを検証する。

## 前提
- 単体テストは `infra/test` のJest環境で実行する。

## 手順
1. `/` と `/docs/` の入力で公開トップへの変換結果を検証する。
2. `/docs/<path>` の入力で `index.html` への期待変換を検証する。
3. `/web/*`、`/api/v1/*`、`/openapi/*` の入力で非対象経路が維持されることを検証する。

## 期待結果
- docs系経路のみが設計どおりにrewriteされる。
- `/web/*`、`/api/v1/*`、`/openapi/*` はrewrite/fallbackの誤適用がない。

## 変更履歴
- 2026-02-11: 新規作成
