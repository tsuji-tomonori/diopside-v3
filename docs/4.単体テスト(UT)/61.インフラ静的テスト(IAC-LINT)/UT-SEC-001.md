---
id: UT-SEC-001
title: IaCセキュリティスキャンケース
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
- '[[RQ-SEC-001]]'
tags:
- diopside
- UT
- INF
---

## 目的
- IaC定義の設定不備（暗号化未設定、公開設定、弱いTLS）を検出する。

## 期待結果
- Critical/High脆弱設定が0件である。

## 変更履歴
- 2026-02-13: 新規作成
