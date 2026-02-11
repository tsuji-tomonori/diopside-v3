---
id: DD-API-009
title: 運用診断API
doc_type: API詳細
phase: DD
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[BD-ARCH-001]]'
- '[[BD-API-002]]'
related:
- '[[RQ-FR-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- 直近の収集健全性と配信健全性を管理者が即時確認できるようにする。

## エンドポイント
- `GET /api/v1/ops/ingestion/latest`
- `GET /api/v1/ops/diagnostics/health`

## `GET /api/v1/ops/ingestion/latest` 応答
- `lastSuccessAt`
- `lastRunId`
- `targetCounts`: `official`, `appearance`, `total`
- `warnings`: 欠損/遅延/不整合の配列

## `GET /api/v1/ops/diagnostics/health` 応答
- `status`: `ok | degraded | critical`
- `checks`
  - `dataFreshness`
  - `tagMasterConsistency`
  - `archivePageCompleteness`
  - `distributionAvailability`

## 異常判定基準
- 最新成功時刻が閾値超過で`degraded`。
- 索引欠損、配信不可、連続失敗で`critical`。

## 処理ロジック
### `GET /api/v1/ops/ingestion/latest`
1. 直近成功runを参照し、`lastSuccessAt/lastRunId` を解決する。
2. 公式/出演/合計の件数を再計算し `targetCounts` へ格納する。
3. 欠損・遅延・不整合ルールを評価し `warnings` を構築する。

### `GET /api/v1/ops/diagnostics/health`
1. `dataFreshness/tagMasterConsistency/archivePageCompleteness/distributionAvailability` を収集する。
2. 各チェックを `ok|degraded|critical` に正規化する。
3. 最重度チェックを全体 `status` として返す。

## エラーマッピング
- `DIAGNOSTICS_SOURCE_UNAVAILABLE`: 503
- `UNAUTHORIZED`: 401
- `INTERNAL_ERROR`: 500

## 受入観点
- 管理者が単一画面で「収集停止」と「配信劣化」を識別できること。
- `AT-SCN-005` の障害対応シナリオで判定APIの結果を利用できること。

## 変更履歴
- 2026-02-11: `/api/v1` 統一と診断API処理ロジック/エラーマッピングを追加 [[BD-ADR-021]]
- 2026-02-10: 新規作成
- 2026-02-10: 運用診断APIの健全性指標と異常判定基準を追加
- 2026-02-10: ステークホルダー2者（管理者/利用者）に合わせて主体表現を修正
