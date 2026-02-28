---
id: IT-CASE-010
title: 差分更新フロー 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-12
updated: '2026-02-28'
up:
- '[[IT-PLAN-001]]'
- '[[BD-SYS-ARCH-001]]'
- '[[DD-APP-API-012]]'
related:
- '[[AT-SCN-004]]'
- '[[DD-APP-API-002]]'
- '[[DD-APP-API-011]]'
- '[[RQ-UC-009]]'
- '[[IT-PW-UC-009]]'
tags:
- diopside
- IT
- CASE
---


## テスト目的
- 前回配信データがある状態から、差分収集→配信更新→公開完了までの差分パスを検証する。

## 対象UC
- [[RQ-UC-009]]（管理者がタグ付けを実施する）

## 対象契約
- `POST /api/v1/ops/ingestion/runs`（[[DD-APP-API-002]]）
- `GET /api/v1/ops/ingestion/runs/{runId}`（[[DD-APP-API-003]]）
- `GET /api/v1/ops/ingestion/runs/{runId}/items`（[[DD-APP-API-011]]）
- `GET /api/v1/admin/publish/{publishRunId}`（[[DD-APP-API-012]]）

## 生成元PWモデル
- [[IT-PW-UC-009]]

## 契約化した受入条件
- 差分収集時に `new/updated/unchanged` が識別可能である。
- 配信更新後の `archiveVersion` が新runへ更新される。
- 更新後も件数整合と非破壊更新が維持される。

## 因子（機能要件ベース）
| 因子 | 関連要求 | 水準 |
| --- | --- | --- |
| 収集モード | [[RQ-FR-001]] | 差分更新, 通常更新 |
| 差分内容 | [[RQ-FR-017]] | `new` のみ, `updated` 含む |
| 配信反映結果 | [[RQ-FR-019]] | 成功, 一部失敗 |

## 対応フロー
- [[BD-SYS-ARCH-001]] の「差分更新」シナリオ

## 前提条件
- 結合環境に前回の配信データ（`bootstrap.json`, `archive_index.pN.json`）が存在する。
- 前回runの `archiveVersion` を記録しておく。

## 手順
1. 前回の `bootstrap.json` から `archiveVersion` を取得する。
2. `POST /api/v1/ops/ingestion/runs` で `mode=incremental_update` の収集runを起動する。
3. `GET /api/v1/ops/ingestion/runs/{runId}` で完了を監視する。
4. `GET /api/v1/ops/ingestion/runs/{runId}/items` で処理明細を取得する。
5. 新しい `bootstrap.json` から `archiveVersion` を取得し、更新されていることを確認する。
6. `updateType=new` の動画が `archive_index` に追加されていることを確認する。
7. `updateType=updated` の動画のメタデータが更新されていることを確認する。

## 期待結果
- 差分収集で `new`, `updated`, `unchanged` の動画が適切に分類される。
- `archiveVersion` が新しい `runId` に更新される。
- 既存動画のメタデータが上書き更新される（破壊的変更なし）。
- ページ総数と件数の整合性が維持される。

## 差分検証項目
- `items[].updateType` の分布: `new`, `updated`, `unchanged`
- 前回と今回の `total` 件数差分 = `new` 件数
- `unchanged` の動画は `archive_index` の内容が変化しない

## 受入接続
- [[AT-SCN-004]] の差分収集検証の事前検証になる。

## 変更履歴
- 2026-02-28: UC基準フォーマットへ再編し、差分更新契約のFR因子を追加
- 2026-02-13: DD-APP-API-012への直接トレース（upリンク）を追加
- 2026-02-12: 新規作成（分析レポートに基づく追加）
