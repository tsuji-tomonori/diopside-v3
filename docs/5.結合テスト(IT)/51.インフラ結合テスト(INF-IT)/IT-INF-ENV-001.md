---
id: IT-INF-ENV-001
title: 一時環境構築/破棄テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[IT-PLAN-001]]'
- '[[BD-INF-002]]'
related:
- '[[DD-IAC-002]]'
tags:
- diopside
- IT
- INF
---

## 目的
- ephemeral環境が構築・検証・破棄まで一連で成功することを確認する。

## 期待結果
- apply/destroyともに成功し、残存リソースがない。

## 変更履歴
- 2026-02-13: 新規作成
