---
id: DOM-BC-004
title: BC定義 Viewing
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
  - '[[DOM-BC-003]]'
  - '[[DOM-BC-006]]'
tags:
  - diopside
  - DOM
  - BC
  - VIEW
---

## サブドメイン
- Core

## 責務
- 利用者向け閲覧体験（検索・絞り込み・並び替え・一覧・詳細・外部遷移）を提供する。
- [[RQ-GL-010|段階ロード]]により初期表示性能と継続閲覧性を両立する。

## 主要用語（GL）
- [[RQ-GL-010]] [[RQ-GL-010|段階ロード]]
- [[RQ-GL-014]] [[RQ-GL-014|検索条件]]
- [[RQ-GL-015]] [[RQ-GL-015|盛り上がり区間]]
- [[RQ-GL-016]] [[RQ-GL-016|コメント密度波形]]
- [[RQ-GL-017]] [[RQ-GL-017|ワードクラウド]]

## 主要ドメインモデル（DM）
- [[RQ-DM-007]] [[RQ-GL-014|検索条件]]モデル
- [[RQ-DM-008]] [[RQ-GL-015|盛り上がり区間]]モデル
- [[RQ-DM-009]] [[RQ-GL-017|ワードクラウド]]成果物モデル

## 主要機能要求（FR）
- [[RQ-FR-007]]
- [[RQ-FR-008]]
- [[RQ-FR-009]]
- [[RQ-FR-010]]
- [[RQ-FR-011]]
- [[RQ-FR-012]]
- [[RQ-FR-013]]
- [[RQ-FR-014]]
- [[RQ-FR-015]]
- [[RQ-FR-020]]
- [[RQ-FR-021]]

## 境界外との契約
- Publishing（[[DOM-BC-003]]）の Published Language を唯一の参照契約として利用する。
- Analytics（[[DOM-BC-006]]）とは [[RQ-DM-008]] / [[RQ-DM-009]] を Shared Kernel として共有する。

## 変更履歴
- 2026-02-14: 新規作成（Viewing BC の責務・GL/DM/FR・境界契約を定義） [[BD-SYS-ADR-029]]
