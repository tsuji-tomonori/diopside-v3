---
id: UT-CASE-008
title: 運用診断API 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-10
updated: '2026-02-11'
up:
- '[[UT-PLAN-005]]'
- '[[DD-APP-API-009]]'
related:
- '[[IT-CASE-008]]'
tags:
- diopside
- UT
- CASE
---

## 対象API
- `GET /ops/ingestion/latest`
- `GET /ops/diagnostics/health`（[[DD-APP-API-009]]）

## テスト目的
- 健全性判定（ok/degraded/critical）と最新収集情報の算出を単体で検証する。

## 前提
- 時刻依存判定を固定時刻で実行できる。

## 手順
1. 正常データで `status=ok` を検証する。
2. 鮮度遅延状態で `status=degraded` を検証する。
3. 欠損・連続失敗状態で `status=critical` を検証する。

## 期待結果
- 各状態で `checks` 内訳が期待値になる。
- `targetCounts` が `official/appearance/total` で一貫する。

## 変更履歴
- 2026-02-11: バックエンド領域へ再配置し、上位計画を [[UT-PLAN-005]] に更新
- 2026-02-10: 新規作成
