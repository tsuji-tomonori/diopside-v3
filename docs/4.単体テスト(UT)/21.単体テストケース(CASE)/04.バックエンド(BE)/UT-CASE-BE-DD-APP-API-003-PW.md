---
id: UT-CASE-BE-DD-APP-API-003-PW
title: DD-APP-API-003 収集実行状態 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-003]]'
related:
  - '[[UT-CASE-BE-002]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - BE
---

## 対象
- 生成元モデル: `[UT-PW-BE-DD-APP-API-003](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)/UT-PW-BE-DD-APP-API-003.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 認可状態 | 実行ID状態 | 実行ステータス | 詳細レベル | ストア状態 | タイムアウト予算 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-BE-DD-APP-API-003-C001 | valid_admin | exists | queued | summary | ok | within |
| UT-PW-BE-DD-APP-API-003-C002 | valid_admin | not_found | running | full | unavailable | exceeded |
| UT-PW-BE-DD-APP-API-003-C003 | missing | invalid_format | succeeded | summary | ok | exceeded |
| UT-PW-BE-DD-APP-API-003-C004 | missing | exists | failed | full | unavailable | within |
| UT-PW-BE-DD-APP-API-003-C005 | forbidden | not_found | running | summary | ok | within |
| UT-PW-BE-DD-APP-API-003-C006 | forbidden | exists | queued | full | unavailable | exceeded |
| UT-PW-BE-DD-APP-API-003-C007 | valid_admin | invalid_format | succeeded | summary | unavailable | within |
| UT-PW-BE-DD-APP-API-003-C008 | forbidden | invalid_format | failed | summary | ok | exceeded |
| UT-PW-BE-DD-APP-API-003-C009 | missing | not_found | queued | full | ok | within |
| UT-PW-BE-DD-APP-API-003-C010 | forbidden | exists | succeeded | full | ok | within |
| UT-PW-BE-DD-APP-API-003-C011 | valid_admin | not_found | failed | summary | ok | within |
| UT-PW-BE-DD-APP-API-003-C012 | missing | exists | running | summary | ok | within |
| UT-PW-BE-DD-APP-API-003-C013 | valid_admin | not_found | succeeded | summary | ok | within |
| UT-PW-BE-DD-APP-API-003-C014 | valid_admin | invalid_format | queued | summary | ok | within |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
