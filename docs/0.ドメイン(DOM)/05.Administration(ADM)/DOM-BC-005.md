---
id: DOM-BC-005
title: BC定義 Administration
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
  - '[[DOM-BC-003]]'
tags:
  - diopside
  - DOM
  - BC
  - ADM
---

## サブドメイン
- Supporting

## 責務
- 管理画面経由で収集・[[RQ-GL-011|再収集]]・公開運用・配信経路確認を統制する。
- 各 BC の結果を集約し、運用判断に必要な可視化を提供する。

## 主要用語（GL）
- 本 BC は固有語彙を最小化し、対象 BC の用語を変換せずに利用する。

## 主要ドメインモデル（DM）
- 固有の主要ドメインモデルは定義しない（調整役）。

## 主要機能要求（FR）
- [[RQ-FR-016]]
- [[RQ-FR-017]]
- [[RQ-FR-025]]
- [[RQ-FR-001]]
- [[RQ-FR-018]]
- [[RQ-FR-019]]
- [[RQ-FR-024]]

## 境界外との契約
- Ingestion（[[DOM-BC-001]]）/ TagManagement（[[DOM-BC-002]]）/ Publishing（[[DOM-BC-003]]）へ OHS/Command で操作を行う。
- コマンド契約の変更は操作対象 BC の契約変更として扱う。

## 変更履歴
- 2026-02-14: 新規作成（Administration BC の責務・FR・OHS 契約を定義） [[BD-SYS-ADR-029]]
