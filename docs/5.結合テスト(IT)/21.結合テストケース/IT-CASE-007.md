---
id: IT-CASE-007
title: 再収集API 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-10
updated: '2026-02-10'
up:
- '[[IT-PLAN-001]]'
- '[[DD-API-008]]'
related:
- '[[AT-SCN-005]]'
tags:
- diopside
- IT
- CASE
---

## 対象API
- `POST /ops/ingestion/runs/{runId}/retry`（[[DD-API-008]]）

## テスト目的
- 失敗runの[[RQ-GL-011|再収集]]実行と追跡API連携を検証する。

## 手順
1. 失敗runを作成する。
2. [[RQ-GL-011|再収集]]APIを実行して `retryRunId` を取得する。
3. 状態APIで[[RQ-GL-011|再収集]]run完了を確認する。

## 期待結果
- [[RQ-GL-011|再収集]]runが起動し、追跡可能である。
- 上限超過時に拒否応答が返る。

## 変更履歴
- 2026-02-10: 新規作成
