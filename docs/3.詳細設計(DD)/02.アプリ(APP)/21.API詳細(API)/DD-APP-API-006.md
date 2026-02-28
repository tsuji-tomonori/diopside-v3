---
id: DD-APP-API-006
title: 検索API
doc_type: API詳細
phase: DD
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-28'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-API-001]]'
related:
- '[[RQ-FR-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- [[RQ-SH-002|利用者]]検索を高速化するため、`GET /api/v1/search` の契約と判定ロジックを定義する。

## エンドポイント
- `GET /api/v1/search`

## 契約正本
- HTTP API契約は Hono実装から生成する OpenAPI（`/openapi/v1/openapi.json`）を正本とする。
- 本書は検索フロー、判定ロジック、検索品質オラクルを定義する入力文書として扱う。

## MVP適用境界
- MVPでは `GET /api/v1/search` を提供し、クライアント[[RQ-GL-014|検索条件]]（キーワード/タグ/日付/再生時間）をサーバ契約へマッピングする。
- 将来の高度検索拡張（全文検索・重み付け等）は `v2` 候補として別RDR/ADRで判断する。

## 検索契約（クライアント実行）
- 入力
  - `q`: 空白分割トークン（AND）
  - `selectedTags`: タグ集合
  - `tagMode`: `AND | OR`
  - `dateRange`: `fromYmd`, `toYmd`
  - `durationRange`: 最小/最大分
  - `sortOrder`: `asc | desc`
- 出力
  - 条件適合動画のソート済み配列

## 判定ロジック
- キーワードは前計算`searchText`に対する部分一致。
- タグは`tagMode`に応じて全包含または任意一致。
- 日付はJST日付へ正規化して範囲比較。
- 再生時間は分→秒換算して閾値比較。

## 将来拡張
- 高度検索導入時は `/api/v2/search` を追加し、同一パラメータ名を踏襲する。
- `v1` 互換期間中は既存UIの検索導線を維持する。

## 受入観点
- `AT-SCN-002` で複合条件（キーワード+タグ+日付+時間）の再現が可能。
- 並び順切替時に順序が逆転すること。

## 変更履歴
- 2026-02-28: 現行経路 `GET /api/v1/search` と OpenAPI正本方針を反映し、将来拡張を `v2` 候補へ整理
- 2026-02-11: MVP非対象の予約境界を明記し、将来経路を `/api/v2/search` へ更新 [[BD-SYS-ADR-021]]
- 2026-02-10: 新規作成
- 2026-02-10: クライアント検索契約と判定ロジックを追加
