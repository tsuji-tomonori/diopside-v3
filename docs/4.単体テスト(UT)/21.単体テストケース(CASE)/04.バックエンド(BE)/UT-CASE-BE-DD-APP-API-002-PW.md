---
id: UT-CASE-BE-DD-APP-API-002-PW
title: DD-APP-API-002 収集実行起動 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-002]]'
related:
  - '[[UT-CASE-BE-001]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - BE
---

## 対象
- 生成元モデル: `[UT-PW-BE-DD-APP-API-002](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)/UT-PW-BE-DD-APP-API-002.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 認可状態 | 実行モード | 対象範囲 | 実行中ジョブ | ストア状態 | リクエスト形式 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-BE-DD-APP-API-002-C001 | valid_admin | immediate | official_only | none | ok | valid |
| UT-PW-BE-DD-APP-API-002-C002 | missing | reserved | include_guest | none | unavailable | invalid |
| UT-PW-BE-DD-APP-API-002-C003 | forbidden | immediate | include_guest | exists | unavailable | valid |
| UT-PW-BE-DD-APP-API-002-C004 | missing | reserved | official_only | exists | ok | valid |
| UT-PW-BE-DD-APP-API-002-C005 | forbidden | immediate | official_only | none | ok | invalid |
| UT-PW-BE-DD-APP-API-002-C006 | valid_admin | reserved | official_only | none | unavailable | invalid |
| UT-PW-BE-DD-APP-API-002-C007 | valid_admin | immediate | include_guest | exists | ok | valid |
| UT-PW-BE-DD-APP-API-002-C008 | missing | immediate | official_only | none | ok | valid |
| UT-PW-BE-DD-APP-API-002-C009 | forbidden | reserved | official_only | none | ok | valid |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
