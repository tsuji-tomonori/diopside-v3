---
id: DOM-BC-006
title: BC定義 Analytics
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
  - '[[DOM-BC-004]]'
tags:
  - diopside
  - DOM
  - BC
  - ANA
---

## サブドメイン
- Supporting

## 責務
- [[RQ-GL-016|コメント密度波形]]・[[RQ-GL-017|ワードクラウド]]等の補助分析データを生成する。
- 生成成果物を Viewing に提供し、詳細画面の付加価値を高める。

## 主要用語（GL）
- [[RQ-GL-015]] [[RQ-GL-015|盛り上がり区間]]
- [[RQ-GL-016]] [[RQ-GL-016|コメント密度波形]]
- [[RQ-GL-017]] [[RQ-GL-017|ワードクラウド]]

## 主要ドメインモデル（DM）
- [[RQ-DM-008]] [[RQ-GL-015|盛り上がり区間]]モデル
- [[RQ-DM-009]] [[RQ-GL-017|ワードクラウド]]成果物モデル

## 主要機能要求（FR）
- [[RQ-FR-022]]
- [[RQ-FR-023]]

## 境界外との契約
- Ingestion（[[DOM-BC-001]]）から Customer-Supplier で入力を受ける。
- Viewing（[[DOM-BC-004]]）とは [[RQ-DM-008]] / [[RQ-DM-009]] を Shared Kernel として共有する。

## 変更履歴
- 2026-02-14: 新規作成（Analytics BC の責務・GL/DM/FR・境界契約を定義） [[BD-SYS-ADR-029]]
