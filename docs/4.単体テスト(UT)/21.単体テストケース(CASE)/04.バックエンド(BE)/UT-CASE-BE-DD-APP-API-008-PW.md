---
id: UT-CASE-BE-DD-APP-API-008-PW
title: DD-APP-API-008 再収集API 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-008]]'
related:
  - '[[UT-CASE-BE-007]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - BE
---

## 対象
- 生成元モデル: `[UT-PW-BE-DD-APP-API-008](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)/UT-PW-BE-DD-APP-API-008.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 認可状態 | 対象ID数 | 理由文字列 | 実行中ジョブ | 再試行回数 | ストア状態 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-BE-DD-APP-API-008-C001 | valid_admin | single | normal | none | within | ok |
| UT-PW-BE-DD-APP-API-008-C002 | valid_admin | many | empty | exists | exceeded | unavailable |
| UT-PW-BE-DD-APP-API-008-C003 | missing | too_many | too_long | none | exceeded | ok |
| UT-PW-BE-DD-APP-API-008-C004 | forbidden | single | too_long | exists | within | unavailable |
| UT-PW-BE-DD-APP-API-008-C005 | forbidden | many | empty | none | within | ok |
| UT-PW-BE-DD-APP-API-008-C006 | forbidden | too_many | normal | exists | exceeded | unavailable |
| UT-PW-BE-DD-APP-API-008-C007 | missing | single | empty | none | within | unavailable |
| UT-PW-BE-DD-APP-API-008-C008 | valid_admin | single | too_long | exists | exceeded | ok |
| UT-PW-BE-DD-APP-API-008-C009 | missing | many | normal | none | within | ok |
| UT-PW-BE-DD-APP-API-008-C010 | valid_admin | too_many | empty | none | exceeded | ok |
| UT-PW-BE-DD-APP-API-008-C011 | valid_admin | many | too_long | none | within | ok |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
