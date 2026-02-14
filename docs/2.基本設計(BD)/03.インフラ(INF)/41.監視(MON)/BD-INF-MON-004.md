---
id: BD-INF-MON-004
title: インフラ可観測性方針
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
- '[[RQ-OBY-001]]'
- '[[BD-INF-MON-001]]'
- '[[DD-INF-MON-001]]'
- '[[AT-SLO-001]]'
- '[[BD-SYS-ADR-028]]'
tags:
- diopside
- BD
- INF
---

## 方針
- アプリ層とインフラ層を同一ダッシュボードで観測し、レイヤ横断で障害原因を追跡できる状態にする。
- メトリクス/ログ/トレースを最小セットとして必須化する。

## 監視対象
- compute, network, storage, queue, deploy pipeline, secrets access。

## 変更履歴
- 2026-02-13: 新規作成（インフラ可観測性の基本方針を定義） [[BD-SYS-ADR-028]]
