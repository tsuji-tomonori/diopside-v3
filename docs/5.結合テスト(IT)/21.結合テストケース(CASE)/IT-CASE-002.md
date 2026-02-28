---
id: IT-CASE-002
title: 収集実行状態API 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-28'
up:
- '[[IT-PLAN-001]]'
- '[[DD-APP-API-003]]'
related:
- '[[AT-SCN-004]]'
- '[[RQ-UC-001]]'
- '[[IT-PW-UC-001]]'
tags:
- diopside
- IT
- CASE
---


## 対象API
- `GET /api/v1/ops/ingestion/runs/{runId}`（[[DD-APP-API-003]]）

## 対象UC
- [[RQ-UC-001]]（管理者がメタデータを収集する）

## 生成元PWモデル
- [[IT-PW-UC-001]]

## テスト目的
- run状態遷移の契約（`queued -> running -> terminal`）と失敗時要約返却を検証する。

## 契約化した受入条件
- 既存runに対して状態APIは現在状態を返却できる。
- 終端状態 `failed` では `errorSummary` を返却できる。
- 未存在runは `404` を返却できる。

## 因子（機能要件ベース）
| 因子 | 関連要求 | 水準 |
| --- | --- | --- |
| run状態 | [[RQ-FR-001]] | `queued`, `running`, `succeeded`, `failed` |
| run識別子 | [[RQ-FR-001]] | 既存, 未存在 |
| 失敗詳細可視化 | [[RQ-UC-007]] | あり, なし |

## テストケース一覧
| case_id | 条件 | 期待結果 |
| --- | --- | --- |
| IT-CASE-002-C01 | `queued` run を取得 | `200` + `status=queued` |
| IT-CASE-002-C02 | `running` run を取得 | `200` + `status=running` |
| IT-CASE-002-C03 | `succeeded` run を取得 | `200` + `status=succeeded` |
| IT-CASE-002-C04 | `failed` run を取得 | `200` + `status=failed` + `errorSummary` |
| IT-CASE-002-C05 | 未存在runを取得 | `404` |

## 手順
1. ケース条件のrunを事前に作成する（または状態を待機する）。
2. 状態APIを呼び出し、`status` と補助項目を確認する。
3. 未存在runケースで `404` を確認する。

## 期待結果
- 状態遷移が実行実態と一致する。
- 失敗時は `errorSummary` が返る。

## 受入接続
- `AT-SCN-004` の進捗監視手順に接続する。

## 変更履歴
- 2026-02-28: UC基準フォーマットへ再編し、状態遷移契約のケースを追加
- 2026-02-11: API経路を `/api/v1/ops` へ更新
- 2026-02-10: 新規作成
- 2026-02-10: DD-APP-API-003対応のAPI単位ケースへ細分化
