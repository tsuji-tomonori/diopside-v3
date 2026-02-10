---
id: IT-CASE-001
title: 収集ジョブ起動API 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[IT-PLAN-001]]'
- '[[DD-API-002]]'
related:
- '[[AT-SCN-004]]'
tags:
- diopside
- IT
- CASE
---


## 対象API
- `POST /ops/ingestion/runs`（[[DD-API-002]]）

## テスト目的
- 起動APIと実行キュー、実行履歴保存の連携を検証する。

## 前提
- 結合環境で[[RQ-GL-002|収集ジョブ]]ランナーが稼働している。

## 手順
1. `manual` 起動を実行する。
2. 応答 `runId` で実行履歴ストアを照会する。
3. 同一 `Idempotency-Key` で再実行する。

## 期待結果
- 起動APIの `runId` と履歴保存runが一致する。
- 二重起動防止が動作する。

## 受入接続
- `AT-SCN-004` の起動手順の事前検証になる。

## 変更履歴
- 2026-02-10: 新規作成
- 2026-02-10: DD-API-002対応のAPI単位ケースへ細分化
