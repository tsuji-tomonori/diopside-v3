---
id: IT-CASE-003
title: アーカイブ一覧配信契約 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-28'
up:
- '[[IT-PLAN-001]]'
- '[[DD-APP-API-004]]'
related:
- '[[AT-SCN-001]]'
- '[[RQ-UC-002]]'
- '[[IT-PW-UC-002]]'
tags:
- diopside
- IT
- CASE
---


## 対象API
- `GET /bootstrap.json`
- `GET /archive_index.p{page}.json`（[[DD-APP-API-004]]）

## 対象UC
- [[RQ-UC-002]]（利用者が一覧から動画を閲覧する）

## 生成元PWモデル
- [[IT-PW-UC-002]]

## テスト目的
- 配信契約（`bootstrap -> archive_index`）と[[RQ-GL-010|段階ロード]]の整合を検証する。

## 契約化した受入条件
- `bootstrap` 取得成功時に初期表示が成立する。
- `archive_index` は `bootstrap` の件数定義と矛盾しない。
- 追加ロード後も `total` と一覧表示件数の整合を維持する。

## 因子（機能要件ベース）
| 因子 | 関連要求 | 水準 |
| --- | --- | --- |
| 初期配信状態 | [[RQ-FR-006]] | `bootstrap` 正常, 欠損 |
| [[RQ-GL-010|段階ロード]]状態 | [[RQ-FR-007]] | `archive_index` 正常, 欠損 |
| ページ境界 | [[RQ-FR-015]] | 初期ページ, 追加ページ |

## テストケース一覧
| case_id | 条件 | 期待結果 |
| --- | --- | --- |
| IT-CASE-003-C01 | `bootstrap`/`archive_index` 正常 | 初期表示と追加ロードが成功 |
| IT-CASE-003-C02 | `archive_index` 欠損 | 初期表示維持 + 再試行導線 |
| IT-CASE-003-C03 | 追加ページ取得 | 表示件数と `total` が整合 |

## 手順
1. `bootstrap.json` と `archive_index.p0.json` を取得する。
2. Web画面の初期表示件数と `bootstrap.total` を比較する。
3. 追加ロードを実行し、ページ跨ぎの件数整合を確認する。

## 期待結果
- 配信データの `archiveVersion` が最新runと一致する。
- Webが一覧を表示し、追加ロード可能である。

## 受入接続
- `AT-SCN-001` の[[AT-SCN-001|一覧閲覧シナリオ]]へ接続する。

## 変更履歴
- 2026-02-28: UC基準フォーマットへ再編し、[[RQ-GL-010|段階ロード]]契約のケースを追加
- 2026-02-10: 新規作成
- 2026-02-10: DD-APP-API-004対応のAPI単位ケースへ細分化
