---
id: DD-APP-UI-014
title: ArchiveDetailModal コンポーネント
doc_type: UI詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
- '[[DD-APP-UI-004]]'
- '[[DD-APP-MOD-003]]'
related:
- '[[RQ-FR-013]]'
- '[[RQ-FR-014]]'
- '[[RQ-UX-006-01]]'
- '[[RQ-UX-007-01]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- UI
---

## 詳細仕様
- `ArchiveDetailModal` は動画詳細表示と外部遷移導線を担当する。
- モーダル開閉時にフォーカス遷移と背景コンテキスト復帰を保証する。

## 入出力契約
| 種別 | 内容 |
| --- | --- |
| props | `video`, `isOpen`, `onClose`, `onOpenYoutube`, `onCopyUrl` |
| emits | `onClose()`, `onOpenYoutube(url)`, `onCopyUrl(url)` |

## 操作制約
- `Esc` と背景クリックのどちらでも閉じる操作を提供する。
- 補助表示取得失敗時も `onOpenYoutube` と `onClose` を無効化しない。

## I/Oまたは責務
- 入力: 選択動画情報、補助表示状態、操作イベント。
- 出力: 外部遷移イベント、閉じるイベント、コピー通知。

## 変更履歴
- 2026-02-14: 新規作成
