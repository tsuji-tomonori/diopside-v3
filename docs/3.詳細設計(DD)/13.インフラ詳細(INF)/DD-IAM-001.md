---
id: DD-IAM-001
title: IAM詳細設計
doc_type: インフラ詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[BD-INF-004]]'
related:
- '[[UT-POL-001]]'
- '[[AT-OPS-INF-001]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- ロール、権限境界、クロスアカウントアクセス条件を定義する。
- 特権ロールは利用期限と承認者を必須とする。

## 監査要件
- 主要操作は監査ログへ `actor`, `role`, `resource`, `result` を記録する。

## 変更履歴
- 2026-02-13: 新規作成
