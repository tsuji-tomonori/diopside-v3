---
id: BD-APP-UI-007
title: ArchiveList
doc_type: UI設計
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-27
updated: '2026-02-27'
up:
- '[[BD-APP-UI-001]]'
- '[[BD-APP-UI-002]]'
related:
- '[[RQ-FR-006]]'
- '[[RQ-FR-015]]'
- '[[RQ-UX-001-01]]'
- '[[RQ-UX-005-01]]'
- '[[BD-SYS-ADR-041]]'
- '[[BD-APP-UI-013]]'
- '[[BD-APP-UI-015]]'
tags:
- diopside
- BD
- UI
---

## 設計方針
- `ArchiveList` は一覧探索の主導線を担当し、短手数到達（[[RQ-UX-001-01]]）を阻害しない。
- モーダル往復後も一覧文脈（条件、件数、表示位置）を維持する。

## 設計要点
- 初期/空/追加読込失敗を同一UI骨格で扱い、復帰操作を明示する。
- タグ選択は `[[BD-APP-UI-013|TagButton]]` で提供し、色だけでなく文言と状態属性で選択を伝える。
- 端末幅は390/768/1280で段階拡張し、操作順序は不変とする（[[RQ-UX-005-01]]）。

## 入出力境界
- 入力: 絞り込み済みアイテム、[[RQ-GL-010|段階ロード]]状態、選択タグ。
- 出力: `openDetail(videoId)`、`toggleTag(tag)`、`loadMore()`。

## 変更履歴
- 2026-02-27: 新規作成（一覧表示コンポーネントの責務と状態遷移を定義） [[BD-SYS-ADR-041]]
