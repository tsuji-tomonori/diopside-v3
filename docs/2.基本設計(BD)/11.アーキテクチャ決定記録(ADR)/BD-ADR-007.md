---
id: BD-ADR-007
title: リリースゲートをATで管理する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-09
updated: '2026-02-10'
up:
- '[[RQ-RDR-001]]'
related:
- '[[BD-ARCH-001]]'
tags:
- diopside
- BD
- ADR
---


## 設計方針
- リリースゲートをATで管理するとして[[RQ-GL-001|diopside]]の基本設計を定義する。
- 収集対象（公式+出演）を前提に設計する。

## 設計要点
- 公開データの収集・正規化・索引生成を分離する。
- Web配信は静的JSON + フロント検索を採用する。
- 運用監視と[[RQ-GL-011|再収集]]導線を設計に含める。

## 変更履歴
- 2026-02-10: 新規作成
