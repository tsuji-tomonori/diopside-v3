---
id: DOM-BC-003
title: BC定義 Publishing
doc_type: 境界づけられたコンテキスト定義
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
  - '[[DOM-CTX-001]]'
related:
  - '[[DOM-SUB-001]]'
  - '[[DOM-BC-001]]'
  - '[[DOM-BC-002]]'
  - '[[DOM-BC-004]]'
  - '[[DOM-BC-005]]'
tags:
  - diopside
  - DOM
  - BC
  - PUB
---

## サブドメイン
- Supporting

## 責務
- DB 正本から配信成果物を生成し、公開切替とロールバックを制御する。
- 配信前後再確認を実行し、公開整合を維持する。

## 主要用語（GL）
- [[RQ-GL-006]] [[RQ-GL-006|アーカイブ索引]]
- [[RQ-GL-007]] [[RQ-GL-007|bootstrap]]
- [[RQ-GL-009]] [[RQ-GL-009|archive_index]]
- [[RQ-GL-010]] [[RQ-GL-010|段階ロード]]
- [[RQ-GL-018]] [[RQ-GL-018|配信反映実行]]

## 主要ドメインモデル（DM）
- [[RQ-DM-010]] [[RQ-GL-018|配信反映実行]]エンティティ（提案）

## 主要機能要求（FR）
- [[RQ-FR-006]]
- [[RQ-FR-019]]
- [[RQ-FR-024]]

## 境界外との契約
- Ingestion（[[DOM-BC-001]]）と TagManagement（[[DOM-BC-002]]）から Customer-Supplier で供給を受ける。
- Viewing（[[DOM-BC-004]]）とは Published Language で契約する。
- Administration（[[DOM-BC-005]]）から OHS コマンドを受け付ける。

## Published Language
- `contracts/static-json/bootstrap.schema.json`
- `contracts/static-json/tag_master.schema.json`
- `contracts/static-json/archive_index_page.schema.json`

## 変更履歴
- 2026-02-14: 新規作成（Publishing BC の責務・GL/DM/FR・契約スキーマを定義） [[BD-SYS-ADR-029]]
