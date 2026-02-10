---
id: DD-API-009
title: 運用診断API
doc_type: API詳細
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[BD-ARCH-001]]'
- '[[BD-API-001]]'
related:
- '[[RQ-FR-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- 直近の収集健全性と配信健全性を運用者が即時確認できるようにする。

## エンドポイント
- `GET /ops/ingestion/latest`
- `GET /ops/diagnostics/health`

## `GET /ops/ingestion/latest` 応答
- `lastSuccessAt`
- `lastRunId`
- `targetCounts`: `official`, `appearance`, `total`
- `warnings`: 欠損/遅延/不整合の配列

## `GET /ops/diagnostics/health` 応答
- `status`: `ok | degraded | critical`
- `checks`
  - `dataFreshness`
  - `tagMasterConsistency`
  - `archivePageCompleteness`
  - `distributionAvailability`

## 異常判定基準
- 最新成功時刻が閾値超過で`degraded`。
- 索引欠損、配信不可、連続失敗で`critical`。

## 受入観点
- 運用者が単一画面で「収集停止」と「配信劣化」を識別できること。
- `AT-SCN-005` の障害対応シナリオで判定APIの結果を利用できること。

## 変更履歴
- 2026-02-10: 新規作成
- 2026-02-10: 運用診断APIの健全性指標と異常判定基準を追加

