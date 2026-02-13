---
id: IT-INF-NET-001
title: ネットワーク到達性・境界テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[IT-PLAN-001]]'
- '[[DD-NET-001]]'
related:
- '[[BD-INF-003]]'
tags:
- diopside
- IT
- INF
---

## 目的
- 許可通信のみ到達可能で、禁止経路が遮断されることを検証する。

## 期待結果
- allowlist経路は成功、deny経路は失敗となる。

## 変更履歴
- 2026-02-13: 新規作成
