---
id: UT-CASE-BE-DD-APP-API-009-PW
title: DD-APP-API-009 運用診断API 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-009]]'
related:
  - '[[UT-CASE-BE-008]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - BE
---

## 対象
- 生成元モデル: `[UT-PW-BE-DD-APP-API-009](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)/UT-PW-BE-DD-APP-API-009.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 認可状態 | 診断範囲 | dependency_state | タイムアウト予算 | キャッシュ状態 | 出力モード |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-BE-DD-APP-API-009-C001 | valid_admin | storage | ok | within | warm | summary |
| UT-PW-BE-DD-APP-API-009-C002 | valid_admin | queue | degraded | exceeded | cold | verbose |
| UT-PW-BE-DD-APP-API-009-C003 | forbidden | publish | down | within | cold | summary |
| UT-PW-BE-DD-APP-API-009-C004 | forbidden | all | ok | exceeded | warm | verbose |
| UT-PW-BE-DD-APP-API-009-C005 | forbidden | queue | degraded | within | warm | summary |
| UT-PW-BE-DD-APP-API-009-C006 | valid_admin | publish | down | exceeded | warm | summary |
| UT-PW-BE-DD-APP-API-009-C007 | valid_admin | all | ok | within | cold | summary |
| UT-PW-BE-DD-APP-API-009-C008 | forbidden | storage | degraded | within | cold | verbose |
| UT-PW-BE-DD-APP-API-009-C009 | valid_admin | storage | down | exceeded | warm | summary |
| UT-PW-BE-DD-APP-API-009-C010 | valid_admin | publish | ok | within | warm | verbose |
| UT-PW-BE-DD-APP-API-009-C011 | valid_admin | queue | ok | within | warm | summary |
| UT-PW-BE-DD-APP-API-009-C012 | valid_admin | queue | down | within | warm | summary |
| UT-PW-BE-DD-APP-API-009-C013 | valid_admin | publish | degraded | within | warm | summary |
| UT-PW-BE-DD-APP-API-009-C014 | valid_admin | all | degraded | within | warm | summary |
| UT-PW-BE-DD-APP-API-009-C015 | valid_admin | all | down | within | warm | summary |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
