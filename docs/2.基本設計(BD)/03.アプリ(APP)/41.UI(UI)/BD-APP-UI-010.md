---
id: BD-APP-UI-010
title: WordCloudPanel
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
- '[[RQ-FR-021]]'
- '[[RQ-UX-017-01]]'
- '[[BD-SYS-ADR-009]]'
- '[[BD-SYS-ADR-041]]'
- '[[BD-APP-UI-015]]'
- '[[BD-APP-UI-016]]'
tags:
- diopside
- BD
- UI
---

## 設計方針
- `WordCloudPanel` は詳細モーダル内の補助情報表示として定義する。
- 画像依存を避けるため、代替テキストと状態文言を必須化する。

## 設計要点
- 表示成功時は画像と説明文を併置する。
- 404/5xx/破損の状態を分離し、再試行可否を明示する。
- 状態通知は `[[BD-APP-UI-015|StatusBanner]]` と連動し、読み上げ環境へ通知する。

## 入出力境界
- 入力: `videoId`、画像URL、取得状態。
- 出力: `retry()`。

## 変更履歴
- 2026-02-27: 新規作成（[[RQ-GL-017|ワードクラウド]]の表示/代替/再試行仕様を部品化） [[BD-SYS-ADR-041]]
