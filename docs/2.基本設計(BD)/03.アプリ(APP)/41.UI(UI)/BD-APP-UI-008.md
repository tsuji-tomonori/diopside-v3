---
id: BD-APP-UI-008
title: ArchiveDetailModal
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
- '[[RQ-FR-013]]'
- '[[RQ-FR-014]]'
- '[[RQ-UX-006-01]]'
- '[[RQ-UX-017-01]]'
- '[[BD-SYS-ADR-041]]'
- '[[BD-APP-UI-009]]'
- '[[BD-APP-UI-010]]'
- '[[BD-APP-UI-011]]'
- '[[BD-APP-UI-015]]'
tags:
- diopside
- BD
- UI
---

## 設計方針
- `ArchiveDetailModal` は詳細確認と外部遷移を担う主画面部品として定義する。
- 補助情報の取得失敗時でも主操作（閉じる、YouTubeで開く、URLコピー）を阻害しない。

## 設計要点
- モーダル表示階層は「必須情報 -> 主操作 -> 補助情報」の順とする。
- 主操作群は `[[BD-APP-UI-011|ModalActionBar]]` で統一する。
- 処理結果通知は `[[BD-APP-UI-015|StatusToast/StatusBanner]]` を用いてフォーカス移動に依存せず提示する（[[RQ-UX-017-01]]）。

## 入出力境界
- 入力: 選択動画、補助情報ロード状態、選択タグ。
- 出力: `close()`、`openYoutube(url)`、`copyUrl(url)`、`toggleTag(tag)`。

## 変更履歴
- 2026-02-27: 新規作成（詳細モーダルの主操作と補助表示境界を定義） [[BD-SYS-ADR-041]]
