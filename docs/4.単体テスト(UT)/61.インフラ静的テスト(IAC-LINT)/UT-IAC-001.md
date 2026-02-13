---
id: UT-IAC-001
title: IaC静的検証ケース
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[UT-PLAN-001]]'
- '[[DD-IAC-001]]'
related:
- '[[UT-STAT-001]]'
tags:
- diopside
- UT
- INF
---

## 目的
- IaCの構文/型/命名規約違反を静的検査で検出する。

## 手順
1. lint/format/validate を実行する。
2. 失敗時は違反箇所を記録し、修正後に再実行する。

## 期待結果
- 重大違反ゼロで完了する。

## 変更履歴
- 2026-02-13: 新規作成
