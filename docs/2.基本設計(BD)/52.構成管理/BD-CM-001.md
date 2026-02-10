---
id: BD-CM-001
title: 構成管理方針
doc_type: 構成管理
phase: BD
version: 1.0.10
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
- CM
---


## 設計方針
- 構成管理方針として[[RQ-GL-001|diopside]]の基本設計を定義する。
- 収集対象（公式+出演）を前提に設計する。

## 設計要点
- 公開データの収集・正規化・索引生成を分離する。
- Web配信は静的JSON + フロント検索を採用する。
- 運用監視と[[RQ-GL-011|再収集]]導線を設計に含める。
- 文書更新時は用語自動リンク化（`auto_link_glossary.py`）と文書整合チェック（`validate_vault.py`）を標準手順として運用する。

## 変更履歴
- 2026-02-10: 新規作成
- 2026-02-10: 用語自動リンク化と整合チェックの標準運用を追記
