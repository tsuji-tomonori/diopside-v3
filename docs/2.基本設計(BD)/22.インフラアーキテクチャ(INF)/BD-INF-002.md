---
id: BD-INF-002
title: 環境分割方針
doc_type: インフラアーキテクチャ
phase: BD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-14'
up:
- '[[BD-INF-001]]'
related:
- '[[BD-ENV-001]]'
- '[[BD-ENV-002]]'
- '[[IT-ENV-001]]'
- '[[BD-ADR-028]]'
tags:
- diopside
- BD
- INF
---

## 方針
- 環境は `dev/prod` を正本とし、PR検証は一時環境（ephemeral）を作成・破棄する。
- 昇格は `dev -> prod` の順のみ許可する。

## 受入条件
- 一時環境はIaCで再現可能で、破棄後に残存リソースが0件である。
- dev/prod差分は変数管理で制御し、手動差分を禁止する。

## 変更履歴
- 2026-02-14: 環境定義を `dev/prod` に統一し、昇格ルールを2環境運用へ更新 [[BD-ADR-028]]
- 2026-02-13: 新規作成（環境分割と昇格ルールを定義） [[BD-ADR-028]]
