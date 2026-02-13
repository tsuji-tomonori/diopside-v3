---
id: DD-UI-015
title: HighlightWavePanel コンポーネント
doc_type: UI詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
- '[[DD-UI-004]]'
- '[[DD-COMP-002]]'
related:
- '[[RQ-FR-020]]'
- '[[RQ-UX-002]]'
- '[[RQ-UX-017]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- UI
---

## 詳細仕様
- `HighlightWavePanel` は[[RQ-GL-016|コメント密度波形]]を表示し、区間クリック遷移を提供する。
- 波形表示に加えて区間リストのテキスト代替を保持する。

## 入出力契約
| 種別 | 内容 |
| --- | --- |
| props | `videoId`, `onJumpToTime`, `onRetry` |
| emits | `onJumpToTime(seconds)`, `onRetry()` |

## 操作制約
- 取得失敗時は再試行ボタンを表示し、主操作を無効化しない。
- 区間項目はキーボードフォーカス可能とし `Enter` で遷移する。

## I/Oまたは責務
- 入力: `highlights/{videoId}.json`、利用者操作。
- 出力: 区間遷移イベント、失敗通知、再試行要求。

## 変更履歴
- 2026-02-14: 新規作成
