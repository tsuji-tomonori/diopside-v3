---
id: BD-INF-007
title: インフラ変更フロー
doc_type: インフラアーキテクチャ
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[BD-INF-001]]'
related:
- '[[BD-CM-001]]'
- '[[DD-IAC-001]]'
- '[[DD-CICD-INF-001]]'
- '[[IT-INF-ROLL-001]]'
- '[[BD-ADR-028]]'
tags:
- diopside
- BD
- INF
---

## 方針
- インフラ変更はIaCのみで実施し、手動変更を禁止する。
- `plan -> review -> approve -> apply -> verify` を必須手順とする。

## ロールバック
- 破壊的変更は事前にロールバック手順を定義し、適用前に検証済みであることを必須化する。

## 変更履歴
- 2026-02-13: 新規作成（IaC変更フローと承認/ロールバック規約を追加） [[BD-ADR-028]]
