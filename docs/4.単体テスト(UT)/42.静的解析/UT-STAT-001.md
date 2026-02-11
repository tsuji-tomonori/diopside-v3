---
id: UT-STAT-001
title: 静的解析方針 001
doc_type: 静的解析方針
phase: UT
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-TST-001]]'
- '[[DD-API-001]]'
related:
- '[[UT-PLAN-001]]'
- '[[UT-PLAN-002]]'
- '[[UT-PLAN-003]]'
- '[[UT-PLAN-004]]'
- '[[UT-PLAN-005]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- UT
- STAT
---


## テスト目的
- 領域別の静的解析観点を統一し、単体テスト前に検出できる欠陥を前倒しで除去する。

## 観点
- DOC: markdown/frontmatterの構文整合とリンク解決不能を検出する。
- INF: TypeScript型整合とテストコード整合（Jest設定）を検出する。
- FE: TypeScript型整合、未使用/到達不能分岐、危険な型アサーションを検出する。
- BE: API契約の型整合、入力バリデーション漏れ、例外処理漏れを検出する。

## 実行方針
- 静的解析エラーがある状態で単体テスト実行へ進まない。
- 解析ルール変更時は影響領域のUT計画（[[UT-PLAN-002]]〜[[UT-PLAN-005]]）を同一変更で更新する。

## 変更履歴
- 2026-02-11: 領域別静的解析観点（DOC/INF/FE/BE）を追加
- 2026-02-10: 新規作成
