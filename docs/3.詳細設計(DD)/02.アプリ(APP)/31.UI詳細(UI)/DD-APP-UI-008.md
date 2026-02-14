---
id: DD-APP-UI-008
title: 再収集設定画面
doc_type: UI詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
- '[[BD-APP-UI-001]]'
- '[[BD-APP-UI-003]]'
related:
- '[[RQ-FR-018]]'
- '[[RQ-UC-008]]'
- '[[DD-APP-API-008]]'
- '[[DD-APP-UI-006]]'
- '[[DD-APP-UI-018]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- UI
---

## 詳細仕様
- 本画面は [[DD-APP-UI-008|UI-A03]] として、失敗runの再実行条件を設定する。
- 親runの失敗分類を引き継ぎ、[[RQ-GL-011|再収集]]対象を動画単位で絞り込む。

## 画面構成
| ブロック | 内容 | 操作 |
| --- | --- | --- |
| 親run概要 | run ID、失敗件数、失敗分類 | run固定表示 |
| 対象抽出 | 失敗種別、期間、チャンネル | フィルタ設定 |
| 実行設定 | 再試行回数、優先度 | [[RQ-GL-011|再収集]]実行 |

## 状態遷移
- `loading`: 親run情報取得中。
- `ready`: [[RQ-GL-011|再収集]]条件編集可能。
- `submitting`: [[RQ-GL-011|再収集]]実行API送信中。
- `accepted`: [[RQ-GL-011|再収集]]受付成功。
- `invalid/error`: 入力不正またはAPI失敗。

## 操作制約
- `succeeded` 親runは[[RQ-GL-011|再収集]]対象外とする。
- 抽出件数0件では実行ボタンを無効化する。
- 実行成功時は [[DD-APP-UI-006|UI-A02]] へ戻り、子runを選択状態で表示する。

## I/Oまたは責務
- 入力: 親run情報、失敗明細、[[RQ-GL-011|再収集]]設定、[[DD-APP-API-008]] 応答。
- 出力: [[RQ-GL-011|再収集]]要求、入力エラー、子run遷移イベント。

## 変更履歴
- 2026-02-14: 新規作成
