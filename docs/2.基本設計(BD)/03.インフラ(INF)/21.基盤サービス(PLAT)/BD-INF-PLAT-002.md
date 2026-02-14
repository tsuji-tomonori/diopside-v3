---
id: BD-INF-PLAT-002
title: DR/BCP方針
doc_type: インフラアーキテクチャ
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[BD-INF-PLAT-001]]'
related:
- '[[RQ-AV-001]]'
- '[[BD-INF-DEP-006]]'
- '[[DD-INF-SEC-001]]'
- '[[AT-DR-001]]'
- '[[BD-SYS-ADR-028]]'
tags:
- diopside
- BD
- INF
---

## 方針
- 主要サービスのRTO/RPOを定義し、復旧手順をRunbook化する。
- バックアップ有無だけでなく、復元演習を受入条件へ含める。

## 受入基準
- 四半期ごとにDR演習を実施し、目標RTO/RPOを満たすこと。

## 変更履歴
- 2026-02-13: 新規作成（DR/BCP方針と受入基準を定義） [[BD-SYS-ADR-028]]
