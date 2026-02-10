---
id: BD-ARCH-003
title: クラウド配置構成
doc_type: アーキテクチャ概要
phase: BD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[RQ-SC-001]]'
- '[[RQ-FR-001]]'
related:
- '[[BD-ARCH-001]]'
- '[[BD-ADR-001]]'
tags:
- diopside
- BD
- ARCH
---


## 設計方針
- クラウド配置構成として[[RQ-GL-001|diopside]]の基本設計を定義する。
- 収集対象（公式+出演）を前提に設計する。

## 設計要点
- 公開データの収集・正規化・索引生成を分離する。
- Web配信は静的JSON + フロント検索を採用する。
- 運用監視と[[RQ-GL-011|再収集]]導線を設計に含める。

## 図
```mermaid
flowchart LR
  A[YouTube API] --> B[Collector]
  B --> C[tag_master.json]
  B --> D[archive_index.pN.json]
  D --> E[Web App]
```

## 変更履歴
- 2026-02-10: 新規作成
