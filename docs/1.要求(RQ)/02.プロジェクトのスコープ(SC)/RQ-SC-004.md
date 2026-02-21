---
id: RQ-SC-004
title: EPIC-03 配信成果物生成・公開
doc_type: プロジェクトのスコープ
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-FR-006]]'
- '[[RQ-FR-024]]'
- '[[RQ-FR-025]]'
- '[[RQ-GL-007]]'
- '[[RQ-GL-008]]'
- '[[RQ-GL-009]]'
- '[[RQ-GL-010]]'
- '[[RQ-RDR-051]]'
tags:
- diopside
- RQ
- SC
---

## 目的
- 収集済み正本データを配信可能な成果物へ変換し、[[RQ-GL-010|段階ロード]]と公開運用を安定して成立させる。

## 対象（In Scope）
- [[RQ-GL-010|段階ロード]]形式での配信（[[RQ-GL-007|bootstrap]] / [[RQ-GL-008|タグマスター]] / [[RQ-GL-009|アーカイブ索引]]）。
- ページング済み索引（[[RQ-GL-009|アーカイブ索引]]）の生成。
- 管理画面からのドキュメント公開一括実行。
- 単一CloudFrontでの配信経路パス分岐。

## 非対象（Out of Scope）
- 合意なきPublished Language破壊変更。
- 著作権保護対象データの再配布。

## 関連する機能要求（FR）
- [[RQ-FR-006]]
- [[RQ-FR-024]]
- [[RQ-FR-025]]

## 受入観点
- `bootstrap -> tag_master -> archive_index` の順序で段階的拡張ができる。
- 公開運用手順が受入運用文書と整合する。

## 変更履歴
- 2026-02-21: 新規作成（エピック分割） [[RQ-RDR-051]]
