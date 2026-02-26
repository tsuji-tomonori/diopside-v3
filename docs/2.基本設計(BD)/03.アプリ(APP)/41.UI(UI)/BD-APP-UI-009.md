---
id: BD-APP-UI-009
title: HighlightWavePanel
doc_type: UI設計
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-27
updated: '2026-02-27'
up:
- '[[BD-APP-UI-002]]'
- '[[BD-APP-UI-004]]'
related:
- '[[RQ-FR-020]]'
- '[[RQ-UX-017-01]]'
- '[[BD-SYS-ADR-010]]'
- '[[BD-SYS-ADR-041]]'
- '[[BD-APP-UI-015]]'
- '[[BD-APP-UI-016]]'
tags:
- diopside
- BD
- UI
---

## 設計方針
- `HighlightWavePanel` は見どころ導線を提供する補助コンポーネントとして定義する。
- 取得失敗や未生成でも詳細モーダルの主操作を止めない。

## 設計要点
- 波形表示と区間リストの二重表現で、視覚依存を回避する。
- 区間クリックは `t=<秒>` 付き外部遷移に接続する。
- 状態（未生成/失敗/不正）は色以外の文言で明確化する。

## 入出力境界
- 入力: `videoId`、波形データ、取得状態。
- 出力: `openAt(second)`、`retry()`。

## 変更履歴
- 2026-02-27: 新規作成（[[RQ-GL-016|コメント密度波形]]の補助導線仕様を部品化） [[BD-SYS-ADR-041]]
