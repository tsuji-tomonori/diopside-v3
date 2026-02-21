---
id: DD-APP-API-009
title: 運用診断API
doc_type: API詳細
phase: DD
version: 1.0.5
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-14'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-API-002]]'
related:
- '[[RQ-FR-001]]'
- '[[DD-APP-UI-006]]'
- '[[DD-APP-UI-011]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- 直近の収集健全性と配信健全性を[[RQ-SH-001|管理者]]が即時確認できるようにする。

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
| エラーコード | HTTPステータス | 意味 |
| --- | --- | --- |
| `UNAUTHORIZED` | 401 | JWTが未指定または無効で診断情報を参照できない。 |
| `DIAGNOSTICS_SOURCE_UNAVAILABLE` | 503 | 診断元データ（run集計/配信監視値）の取得に失敗し判定不能。 |
| `INTERNAL_ERROR` | 500 | サーバ内部例外により診断結果生成が中断した。 |

## 受入観点
- [[RQ-SH-001|管理者]]が [[DD-APP-UI-006|UI-A02]] / [[DD-APP-UI-011|UI-A05]] で「収集停止」と「配信劣化」を識別できること。
- `AT-SCN-005` の障害対応シナリオで判定APIの結果を利用できること。

## 変更履歴
- 2026-02-14: 診断結果の利用画面を [[DD-APP-UI-006]] / [[DD-APP-UI-011]] として明記
- 2026-02-14: エラーマッピングを表形式へ統一し、各エラーコードの意味を明記
- 2026-02-11: `/api/v1` 統一と診断API処理ロジック/エラーマッピングを追加 [[BD-SYS-ADR-021]]
- 2026-02-10: 新規作成
- 2026-02-10: 運用診断APIの健全性指標と異常判定基準を追加
- 2026-02-10: ステークホルダー2者（[[RQ-SH-001|管理者]]/[[RQ-SH-002|利用者]]）に合わせて主体表現を修正
