---
id: DD-UI-017
title: RunStatusScreen コンポーネント
doc_type: UI詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
- '[[DD-UI-006]]'
- '[[DD-COMP-002]]'
related:
- '[[RQ-FR-017]]'
- '[[RQ-FR-018]]'
- '[[RQ-UX-017]]'
- '[[DD-API-003]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- UI
---

## 詳細仕様
- `RunStatusScreen` はrun状態一覧の表示、失敗run選択、再実行導線を担当する。
- run状態と警告通知は同一タイムラインで保持し、監視判断を中断させない。

## 入出力契約
| 種別 | 内容 |
| --- | --- |
| props | `runs`, `selectedRunId`, `onSelectRun`, `onRetryRun`, `onRefresh` |
| emits | `onSelectRun(runId)`, `onRetryRun(runId)` |

## 操作制約
- `running` runには再実行操作を表示しない。
- 連続失敗3回で障害バナーを固定表示する。

## I/Oまたは責務
- 入力: run一覧、run詳細、運用操作イベント。
- 出力: run選択イベント、再実行イベント、障害通知表示。

## 変更履歴
- 2026-02-14: 新規作成
