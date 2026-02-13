---
id: DD-UI-010
title: 配信反映ジョブ画面
doc_type: UI詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
- '[[BD-UI-001]]'
- '[[BD-UI-003]]'
related:
- '[[RQ-FR-005]]'
- '[[RQ-FR-024]]'
- '[[RQ-FR-025]]'
- '[[DD-API-014]]'
- '[[DD-API-015]]'
- '[[DD-UI-018]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- UI
---

## 詳細仕様
- 本画面は [[DD-UI-010|UI-A06]] として、配信成果物の再生成と公開切替の進行を監視する。
- 反映失敗時はロールバック結果を同一runで可視化する。

## 表示ブロック
| ブロック | 主表示 | 操作 |
| --- | --- | --- |
| runヘッダ | `publishRunId`、開始者、対象種別 | run固定表示 |
| ステップ進行 | `generate/validate/switch/post_check` | 再読込 |
| ロールバック | 実行有無、復帰先バージョン | 再試行判断 |
| エラー詳細 | コード、要因、再試行可否 | 失敗確認 |

## 状態遷移
- `queued -> running -> succeeded|failed|rolled_back`。
- `failed` かつ `retryable=true` の場合のみ再試行導線を表示する。

## 操作制約
- 進行中は同一 `publishRunId` の再実行を禁止する。
- 反映成功時は [[DD-UI-011|UI-A05]] への遷移を表示する。
- ロールバック済みrunでは成功表示を出さず、要再確認の状態で固定する。

## I/Oまたは責務
- 入力: [[DD-API-014]] 実行結果、[[DD-API-015]] 状態応答、運用操作イベント。
- 出力: 進行監視表示、再試行導線、公開後確認遷移イベント。

## 変更履歴
- 2026-02-14: 新規作成
