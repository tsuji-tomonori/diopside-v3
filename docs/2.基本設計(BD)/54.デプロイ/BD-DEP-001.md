---
id: BD-DEP-001
title: デプロイ方式
doc_type: デプロイ設計
phase: BD
version: 1.0.5
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-13'
up:
- '[[RQ-SC-001]]'
- '[[RQ-FR-001]]'
related:
- '[[BD-ARCH-001]]'
- '[[BD-ADR-001]]'
- '[[BD-ADR-028]]'
- '[[BD-INF-007]]'
- '[[DD-CICD-INF-001]]'
tags:
- diopside
- BD
- DEP
---


## 設計方針
- デプロイ方式として[[RQ-GL-001|diopside]]の基本設計を定義する。
- 収集対象（公式+出演）を前提に設計する。

## 設計要点
- 公開データの収集・正規化・索引生成を分離する。
- Web配信は静的JSON + フロント検索を採用する。
- 運用監視と[[RQ-GL-011|再収集]]導線を設計に含める。
- インフラ配備はIaCパイプライン（[[DD-CICD-INF-001]]）を正本とし、手動配備を禁止する。

## 変更履歴
- 2026-02-13: インフラCI/CD正本参照とIaC配備原則を追加 [[BD-ADR-028]]
- 2026-02-10: 新規作成
