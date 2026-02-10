---
id: BD-BUILD-001
title: ビルド方針
doc_type: ビルド設計
phase: BD
version: 1.0.1
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
- BUILD
---


## 設計方針
- ビルド方針としてdiopsideの基本設計を定義する。
- 収集対象（公式+出演）を前提に設計する。

## 設計要点
- 公開データの収集・正規化・索引生成を分離する。
- Web配信は静的JSON + フロント検索を採用する。
- 運用監視と再収集導線を設計に含める。

## 変更履歴
- 2026-02-10: 新規作成
