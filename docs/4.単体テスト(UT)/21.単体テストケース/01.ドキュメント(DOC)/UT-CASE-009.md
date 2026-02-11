---
id: UT-CASE-009
title: docs運用ガード 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[UT-PLAN-002]]'
- '[[RQ-DG-001]]'
related:
- '[[IT-PLAN-001]]'
tags:
- diopside
- UT
- CASE
---


## 対象モジュール
- docs運用タスク（`task docs:guard`）

## テスト目的
- 文書差分に対して、用語リンク補正と文書整合検査が局所的に実行できることを検証する。

## 前提
- 検証対象文書は `docs/` 配下のMarkdownである。

## 手順
1. docs差分を含む状態で `task docs:guard` を実行する。
2. `reports/doc_check.md` の検査結果を確認する。
3. リンク不整合を意図的に含む差分で失敗条件を確認し、修正後に再実行する。

## 期待結果
- 差分文書のみを対象に検査が実行される。
- 整合状態では `broken_links: 0` を満たす。
- 不整合時は失敗し、修正後の再実行で成功する。

## 変更履歴
- 2026-02-11: 新規作成
