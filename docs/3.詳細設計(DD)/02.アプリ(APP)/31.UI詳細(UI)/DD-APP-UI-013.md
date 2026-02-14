---
id: DD-APP-UI-013
title: ArchiveList コンポーネント
doc_type: UI詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
- '[[DD-APP-UI-002]]'
- '[[DD-APP-MOD-003]]'
related:
- '[[RQ-FR-006]]'
- '[[RQ-FR-015]]'
- '[[RQ-UX-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- UI
---

## 詳細仕様
- `ArchiveList` は一覧カード描画、[[RQ-GL-010|段階ロード]]、空状態表示を担当する。
- 一覧末尾到達時は「もっと見る」導線で次ページ読込を起動する。

## 入出力契約
| 種別 | 内容 |
| --- | --- |
| props | `items`, `hasNext`, `isLoadingMore`, `onSelect`, `onLoadMore` |
| emits | `onSelect(videoId)`, `onLoadMore()` |

## 操作制約
- `isLoadingMore=true` の間は重複読込を禁止する。
- 空結果時は[[RQ-GL-014|検索条件]]維持のままリセット導線を表示する。

## I/Oまたは責務
- 入力: 絞り込み済み動画一覧、[[RQ-GL-010|段階ロード]]状態。
- 出力: 詳細選択イベント、追加読込イベント、空結果表示。

## 変更履歴
- 2026-02-14: 新規作成
