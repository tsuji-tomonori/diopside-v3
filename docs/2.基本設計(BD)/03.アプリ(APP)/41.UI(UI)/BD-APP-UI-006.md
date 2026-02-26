---
id: BD-APP-UI-006
title: SearchConditionPanel
doc_type: UI設計
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-27
updated: '2026-02-27'
up:
- '[[BD-APP-UI-002]]'
- '[[BD-APP-UI-003]]'
related:
- '[[RQ-FR-008]]'
- '[[RQ-FR-010]]'
- '[[RQ-FR-011]]'
- '[[RQ-FR-012]]'
- '[[RQ-UX-013-01]]'
- '[[RQ-UX-015-01]]'
- '[[BD-SYS-ADR-041]]'
- '[[BD-APP-UI-014]]'
tags:
- diopside
- BD
- UI
---

## 設計方針
- `SearchConditionPanel` は検索語、タグ条件、期間条件、並び順の確定入口を単一化する。
- 同一手続き内の再入力を最小化し、再表示時に直前確定値を復元する（[[RQ-UX-013-01]]）。

## 設計要点
- 入力中状態と確定状態を分離し、確定操作前に一覧再読込を発生させない。
- `[[BD-APP-UI-014|SearchInput/SelectField/RangeSlider]]` を内部プリミティブとして利用する。
- ヘルプ導線は「ヘルプ/お問い合わせ」で名称固定し、同位置に配置する（[[RQ-UX-015-01]]）。

## 入出力境界
- 入力: 現在[[RQ-GL-014|検索条件]]、タグ候補、タグ件数、年別件数。
- 出力: `apply(conditions)`、`clear()`、`validationError(reason)`。

## 変更履歴
- 2026-02-27: 新規作成（[[RQ-GL-014|検索条件]]パネルの責務と境界を定義） [[BD-SYS-ADR-041]]
