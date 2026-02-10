---
id: IT-CASE-008
title: 運用診断API 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-10
updated: '2026-02-10'
up:
- '[[IT-PLAN-001]]'
- '[[DD-API-009]]'
related:
- '[[AT-SCN-005]]'
tags:
- diopside
- IT
- CASE
---

## 対象API
- `GET /ops/ingestion/latest`
- `GET /ops/diagnostics/health`（[[DD-API-009]]）

## テスト目的
- 収集実行結果と診断状態表示の連携を検証する。

## 手順
1. 正常run後に最新結果APIを取得する。
2. 障害状態を再現し診断APIの状態を確認する。
3. 復旧後に状態が回復することを確認する。

## 期待結果
- `targetCounts` と実データ件数が一致する。
- 状態が `ok/degraded/critical` で適切に遷移する。

## 変更履歴
- 2026-02-10: 新規作成
