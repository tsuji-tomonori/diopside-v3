---
id: RQ-RDR-038
title: 波形・ワードクラウド生成契約とRTM直接検証リンクを固定する決定
doc_type: 要求決定記録
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-DG-001]]'
- '[[RQ-FR-020]]'
- '[[RQ-FR-022]]'
- '[[RQ-FR-023]]'
- '[[RQ-RTM-001]]'
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-API-001]]'
- '[[BD-APP-API-002]]'
tags:
- diopside
- RQ
- RDR
---

## 決定事項
- [[RQ-FR-020]]（表示）は [[RQ-FR-022]]（波形生成）と [[RQ-FR-023]]（[[RQ-GL-017|ワードクラウド]]生成）を前提とする主従関係を固定する。
- 波形生成の入力契約は、公開チャット由来CSVの `meta_type` / `message_text` を必須列とする。
- コメント密度判定の初期検出パターンは `草|w|くさ|kusa` を採用し、運用設定で上書き可能とする。
- [[RQ-GL-017|ワードクラウド]]成果物の正本キーは `wordcloud/{videoId}.png`、再実行時は同一キー上書きとする。
- FR/NFR変更時は [[RQ-RTM-001]] の検証列へ、主要 `UT-CASE` / `IT-CASE` / `AT-SCN` の直接リンクを必須化する。

## 理由
- docs-analysis-report v2.0 で、波形/[[RQ-GL-017|ワードクラウド]]の生成責務とRTM直接追跡の欠落が未解決として指摘された。
- `.workspace` の既存実装資産（CreateTimestamp/CreateWordCloudService）では入力列・検出パターン・出力キーが実装前提として存在するため、要求側でも固定しないと解釈差が残る。

## 影響
- [[RQ-DG-001]] に、RTM直接検証リンクの必須化とバッチ仕様変更時のBD/DD同時更新ゲートを追加する。
- [[RQ-FR-020]] / [[RQ-FR-022]] / [[RQ-FR-023]] に入力/出力/依存関係を追記する。
- [[RQ-RTM-001]] の検証列に、波形/[[RQ-GL-017|ワードクラウド]]要求の直接テストリンクを反映する。

## 変更履歴
- 2026-02-13: 新規作成
