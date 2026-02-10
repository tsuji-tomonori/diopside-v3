---
id: UT-CASE-007
title: 再収集API 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-10
updated: '2026-02-10'
up:
- '[[UT-PLAN-001]]'
- '[[DD-API-008]]'
related:
- '[[IT-CASE-007]]'
tags:
- diopside
- UT
- CASE
---

## 対象API
- `POST /ops/ingestion/runs/{runId}/retry`（[[DD-API-008]]）

## テスト目的
- 再収集APIの再実行条件、上限管理、監査項目付与を単体で検証する。

## 前提
- 元run状態（failed/succeeded）を切り替え可能なテストダブルを用いる。

## 手順
1. `failed` runを指定して再収集を実行する。
2. `succeeded` runで再収集不可ケースを実行する。
3. 同一runへの再実行を上限回数まで実行する。

## 期待結果
- 失敗runは `202` と `retryRunId` を返す。
- 不可状態は `409` を返す。
- 上限超過で明確な拒否コードを返す。

## 変更履歴
- 2026-02-10: 新規作成
