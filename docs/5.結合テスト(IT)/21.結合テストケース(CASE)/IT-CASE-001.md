---
id: IT-CASE-001
title: 収集実行起動API 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-28'
up:
- '[[IT-PLAN-001]]'
- '[[DD-APP-API-002]]'
related:
- '[[AT-SCN-004]]'
- '[[RQ-UC-001]]'
- '[[IT-PW-UC-001]]'
tags:
- diopside
- IT
- CASE
---


## 対象UC
- [[RQ-UC-001]]（管理者がメタデータを収集する）

## 対象契約
- `POST /api/v1/ops/ingestion/runs`（[[DD-APP-API-002]]）

## 生成元PWモデル
- [[IT-PW-UC-001]]

## テスト目的
- 収集起動の受理契約（入力検証、冪等性、同時実行制約）を、UC起点で検証する。

## 契約化した受入条件
- 必須入力が有効な場合は `202` と `run_id` を返し、run状態が `queued` で作成される。
- `Idempotency-Key` 再送時は同一 `run_id` を返す。
- 同種runが実行中の場合は `409 RUN_ALREADY_ACTIVE` を返す。

## 因子（機能要件ベース）
| 因子 | 関連要求 | 水準 |
| --- | --- | --- |
| 起動モード妥当性 | [[RQ-FR-001]] | `manual`, `scheduled`, 無効値 |
| 対象区分妥当性 | [[RQ-FR-001]] | `official`, `appearance`, 空配列 |
| 冪等キー | [[RQ-DATA-002-05]] | 新規キー, 既存キー, 未指定 |
| 同時実行状態 | [[RQ-FR-001]] | 実行中なし, 同種run実行中 |

## オラクル判定
- 未認証は `401` を最優先とする。
- 認証成功後は入力検証エラー（`400` 系）を判定する。
- 入力が正当な場合のみ競合判定（`409`）を適用する。

## テストケース一覧
| case_id | 条件 | 期待結果 |
| --- | --- | --- |
| IT-CASE-001-C01 | 正常入力 + 新規Idempotency-Key | `202` + 新規 `run_id` |
| IT-CASE-001-C02 | 同一キー再送 | `202` + 既存 `run_id` 再返却 |
| IT-CASE-001-C03 | `target_types=[]` | `400 INVALID_TARGET` |
| IT-CASE-001-C04 | `Idempotency-Key` なし | `400 MISSING_IDEMPOTENCY_KEY` |
| IT-CASE-001-C05 | 同種run実行中 | `409 RUN_ALREADY_ACTIVE` |

## 手順
1. ケース条件に従い起動リクエストを送信する。
2. 応答コードとエラーコード、`run_id` の有無を確認する。
3. `run_id` が返るケースは状態APIで run 作成結果を確認する。

## 受入接続
- [[AT-SCN-004]] の起動手順の事前検証になる。

## 変更履歴
- 2026-02-28: UC基準フォーマットへ再編し、FR因子ベースのケース表を追加
- 2026-02-11: API経路を `/api/v1/ops` へ更新
- 2026-02-10: 新規作成
- 2026-02-10: DD-APP-API-002対応のAPI単位ケースへ細分化
