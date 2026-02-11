---
id: UT-CASE-003
title: アーカイブ一覧配信契約 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[UT-PLAN-005]]'
- '[[DD-API-004]]'
related:
- '[[IT-CASE-003]]'
tags:
- diopside
- UT
- CASE
---


## 対象API
- `GET /bootstrap.json`
- `GET /archive_index.p{page}.json`（[[DD-API-004]]）

## テスト目的
- 一覧配信JSONの必須項目、型、件数整合を単体で検証する。

## 前提
- スキーマ定義とJSONデコード処理が同一バージョンである。

## 手順
1. `bootstrap.json` を読み込み必須キー存在を検証する。
2. `archive_index.p0.json` の `page/pageSize/total/items` を検証する。
3. ページ境界（最終ページ相当）で `items` 件数の整合を検証する。

## 期待結果
- 必須キー欠落時はバリデーションエラーとなる。
- `items` タプル構造が契約と一致する。
- 合計件数とページ情報が矛盾しない。

## [[RQ-GL-012|受入判定]]との対応
- 一覧閲覧・[[RQ-GL-010|段階ロード]]のデータ判定（欠損High=0）を担保する。

## 変更履歴
- 2026-02-11: バックエンド領域へ再配置し、上位計画を [[UT-PLAN-005]] に更新
- 2026-02-10: 新規作成
- 2026-02-10: DD-API-004対応のAPI単位ケースへ細分化
