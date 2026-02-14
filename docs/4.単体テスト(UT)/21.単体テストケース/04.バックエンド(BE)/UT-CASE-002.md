---
id: UT-CASE-002
title: 収集ジョブ状態API 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[UT-PLAN-005]]'
- '[[DD-APP-API-003]]'
related:
- '[[IT-CASE-002]]'
tags:
- diopside
- UT
- CASE
---


## 対象API
- `GET /ops/ingestion/runs/{runId}`（[[DD-APP-API-003]]）

## テスト目的
- run状態取得の状態遷移表現、404判定、失敗時の要約返却を検証する。

## 前提
- 実行履歴リポジトリをテストダブルで置き換える。

## 手順
1. `queued/running/succeeded/failed` 各状態のrunを取得する。
2. 未存在 `runId` を取得する。
3. `failed` 状態で `errorSummary` の整形を確認する。

## 期待結果
- 各状態で `status` と件数フィールドが正しく返る。
- 未存在runは `404 RUN_NOT_FOUND`。
- 失敗runは `errorSummary` と `traceId` を返す。

## [[RQ-GL-012|受入判定]]との対応
- 運用監視シナリオの状態追跡根拠を保証する。

## 変更履歴
- 2026-02-11: バックエンド領域へ再配置し、上位計画を [[UT-PLAN-005]] に更新
- 2026-02-10: 新規作成
- 2026-02-10: DD-APP-API-003対応のAPI単位ケースへ細分化
