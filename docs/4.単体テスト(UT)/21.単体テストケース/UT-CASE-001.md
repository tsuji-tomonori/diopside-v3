---
id: UT-CASE-001
title: 収集ジョブ起動API 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[UT-PLAN-001]]'
- '[[DD-API-002]]'
related:
- '[[IT-CASE-001]]'
tags:
- diopside
- UT
- CASE
---


## 対象API
- `POST /ops/ingestion/runs`（[[DD-API-002]]）

## テスト目的
- [[RQ-GL-002|収集ジョブ]]起動時の入力検証、冪等性、重複起動制御を単体で検証する。

## 前提
- run採番サービスと実行キューはモック化する。

## 手順
1. `mode=manual`, `targetTypes=[official, appearance]` で起動リクエストを実行する。
2. `targetTypes=[]` の不正入力を実行する。
3. 同一 `Idempotency-Key` で2回実行する。
4. 実行中ジョブがある状態で重複起動を実行する。

## 期待結果
- 正常入力で `202` と `runId` を返す。
- 空配列入力で `400 INVALID_TARGET` を返す。
- 同一キーは同一 `runId` を返す。
- 重複起動は `409` を返す。

## [[RQ-GL-012|受入判定]]との対応
- Must FR（収集実行）の前提品質を満たす。

## 変更履歴
- 2026-02-10: 新規作成
- 2026-02-10: DD-API-002対応のAPI単位ケースへ細分化
