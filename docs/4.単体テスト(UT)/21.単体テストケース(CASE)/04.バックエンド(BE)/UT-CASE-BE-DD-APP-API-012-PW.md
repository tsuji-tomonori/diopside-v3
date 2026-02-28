---
id: UT-CASE-BE-DD-APP-API-012-PW
title: DD-APP-API-012 配信前後再確認API 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-012]]'
related:
  - '[[UT-CASE-BE-010]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - BE
---

## 対象
- 生成元モデル: `[UT-PW-BE-DD-APP-API-012](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)/UT-PW-BE-DD-APP-API-012.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 認可状態 | 再確認モード | 対象動画ID | 上流状態 | タイムアウト予算 | 再試行モード |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-BE-DD-APP-API-012-C001 | valid_admin | before | one | consistent | within | none |
| UT-PW-BE-DD-APP-API-012-C002 | valid_admin | after | many | mismatch | exceeded | auto |
| UT-PW-BE-DD-APP-API-012-C003 | forbidden | before | empty | unavailable | within | auto |
| UT-PW-BE-DD-APP-API-012-C004 | forbidden | after | one | consistent | exceeded | none |
| UT-PW-BE-DD-APP-API-012-C005 | forbidden | before | many | mismatch | within | none |
| UT-PW-BE-DD-APP-API-012-C006 | valid_admin | before | one | unavailable | exceeded | auto |
| UT-PW-BE-DD-APP-API-012-C007 | valid_admin | before | empty | consistent | exceeded | none |
| UT-PW-BE-DD-APP-API-012-C008 | valid_admin | after | many | consistent | within | auto |
| UT-PW-BE-DD-APP-API-012-C009 | valid_admin | after | many | unavailable | within | auto |
| UT-PW-BE-DD-APP-API-012-C010 | valid_admin | before | one | mismatch | within | none |
| UT-PW-BE-DD-APP-API-012-C011 | valid_admin | before | empty | mismatch | within | none |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
