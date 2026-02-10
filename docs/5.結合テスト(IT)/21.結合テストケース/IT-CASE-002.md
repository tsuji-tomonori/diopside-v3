---
id: IT-CASE-002
title: 収集ジョブ状態API 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[IT-PLAN-001]]'
- '[[DD-API-003]]'
related:
- '[[AT-SCN-004]]'
tags:
- diopside
- IT
- CASE
---


## 対象API
- `GET /ops/ingestion/runs/{runId}`（[[DD-API-003]]）

## テスト目的
- run状態取得APIと実行エンジン状態反映の整合を検証する。

## 手順
1. 起動直後のrunを取得し `queued/running` を確認する。
2. 実行完了後に再取得し `succeeded/failed` を確認する。
3. 未存在runを取得して 404 を確認する。

## 期待結果
- 状態遷移が実行実態と一致する。
- 失敗時は `errorSummary` が返る。

## 受入接続
- `AT-SCN-004` の進捗監視手順に接続する。

## 変更履歴
- 2026-02-10: 新規作成
- 2026-02-10: DD-API-003対応のAPI単位ケースへ細分化
