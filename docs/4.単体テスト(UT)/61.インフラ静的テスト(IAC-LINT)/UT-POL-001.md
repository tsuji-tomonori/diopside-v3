---
id: UT-POL-001
title: Policy as Code検証ケース
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[UT-PLAN-001]]'
- '[[DD-IAM-001]]'
related:
- '[[DD-IAC-001]]'
tags:
- diopside
- UT
- INF
---

## 目的
- 公開設定禁止、過剰権限禁止などのポリシー違反を事前に検出する。

## 期待結果
- 高リスク違反（public, wildcard privilege）が0件である。

## 変更履歴
- 2026-02-13: 新規作成
