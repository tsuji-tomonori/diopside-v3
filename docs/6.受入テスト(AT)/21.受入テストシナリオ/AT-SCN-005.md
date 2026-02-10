---
id: AT-SCN-005
title: 障害時対応シナリオ
doc_type: 受入テストシナリオ
phase: AT
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[BD-TST-001]]'
- '[[IT-PLAN-001]]'
related:
- '[[AT-GO-001]]'
- '[[DD-API-003]]'
- '[[DD-API-008]]'
- '[[DD-API-009]]'
tags:
- diopside
- AT
- SCN
---

## シナリオ目的
- 収集失敗または配信劣化時に、運用手順で復旧判断まで到達できることを確認する。

## 対応DD-API
- `DD-API-003`（収集ジョブ状態API）
- `DD-API-008`（再収集API）
- `DD-API-009`（運用診断API）

## 前提条件
- 失敗run、または診断APIで`degraded/critical`となる状態を再現済み。

## 手順
1. `GET /ops/diagnostics/health` で障害状態を確認する。
2. 失敗runを特定し、`GET /ops/ingestion/runs/{runId}` で原因概要を確認する。
3. 必要に応じて `POST /ops/ingestion/runs/{runId}/retry` を実行する。
4. 再実行runの完了を確認し、診断APIが正常へ戻るか確認する。
5. 復旧結果を運用記録へ反映する。

## 期待結果
- 障害検知から再実行まで手順が中断なく実行できる。
- 復旧後に状態が`ok`または受容可能な`degraded`となる。
- 未復旧時はリリース延期判断へエスカレーションできる。

## 判定基準対応
- 非機能判定: 異常時の運用手順が機能する。
- データ判定: 欠損・不整合の重大度Highが残存しない。

## 記録項目
- 障害検知時刻
- 影響範囲
- 実施手順
- 復旧可否
- 対応DD-API（`DD-API-003`, `DD-API-008`, `DD-API-009`）
- 判定（Pass/Fail）

## 変更履歴
- 2026-02-10: 新規作成
- 2026-02-10: AT-PLAN-001の判定基準に合わせて障害対応手順を具体化
- 2026-02-10: 対応DD-API番号を明示
