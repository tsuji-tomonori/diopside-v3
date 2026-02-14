---
id: DD-APP-UI-007
title: 収集実行画面
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
- '[[RQ-FR-001]]'
- '[[RQ-FR-002]]'
- '[[RQ-FR-003]]'
- '[[RQ-FR-004]]'
- '[[DD-APP-API-002]]'
- '[[DD-APP-UI-006]]'
- '[[DD-APP-UI-018]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- UI
---

## 詳細仕様
- 本画面は [[DD-APP-UI-007|UI-A01]] として、[[RQ-GL-002|収集ジョブ]]起動要求を受け付ける。
- 実行受け付け後は `publishRunId` ではなく `ingestionRunId` を起点に [[DD-APP-UI-006|UI-A02]] へ遷移する。

## 入力要素
| 項目 | 入力形式 | バリデーション | 備考 |
| --- | --- | --- | --- |
| 取得モード | 単一選択 | 列挙値のみ | `manual/scheduled/recheck` |
| 対象チャンネル | 文字列 | 1-128文字 | 公式/出演の判定対象 |
| 期間指定 | 日付範囲 | 開始<=終了 | 任意指定 |
| 実行オプション | チェック | 真偽のみ | 失敗時通知など |

## 状態遷移
- `idle`: 初期表示。
- `validating`: 実行前検証中。
- `submitting`: API送信中。
- `accepted`: 受付成功、[[DD-APP-UI-006|UI-A02]] へ遷移可能。
- `conflict/error`: 競合または失敗。修正後に再送可能。

## 操作制約
- 同種runが `running` の場合、実行ボタンを無効化し理由を表示する。
- 必須項目未入力時は送信不可とし、先頭エラーへフォーカス移動する。
- 受付成功時は二重送信防止のため同一入力での再送を30秒抑止する。

## I/Oまたは責務
- 入力: 収集条件、管理者操作イベント、[[DD-APP-API-002]] 応答。
- 出力: 実行要求、入力エラー状態、`ingestionRunId` 遷移イベント。

## 変更履歴
- 2026-02-14: 新規作成
