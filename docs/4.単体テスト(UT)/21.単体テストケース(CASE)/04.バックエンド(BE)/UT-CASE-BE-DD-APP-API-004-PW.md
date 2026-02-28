---
id: UT-CASE-BE-DD-APP-API-004-PW
title: DD-APP-API-004 アーカイブ一覧配信契約 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-004]]'
related:
  - '[[UT-CASE-BE-003]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - BE
---

## 対象
- 生成元モデル: `[UT-PW-BE-DD-APP-API-004](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)/UT-PW-BE-DD-APP-API-004.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | HTTPメソッド | データ状態 | スキーマ状態 | ETag状態 | ストア状態 | キャッシュ状態 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-BE-DD-APP-API-004-C001 | GET | normal | valid | none | ok | warm |
| UT-PW-BE-DD-APP-API-004-C002 | GET | empty | missing_field | match | unavailable | cold |
| UT-PW-BE-DD-APP-API-004-C003 | GET | normal | valid | mismatch | unavailable | cold |
| UT-PW-BE-DD-APP-API-004-C004 | GET | empty | missing_field | mismatch | ok | warm |
| UT-PW-BE-DD-APP-API-004-C005 | GET | normal | valid | match | ok | warm |
| UT-PW-BE-DD-APP-API-004-C006 | GET | normal | missing_field | none | ok | cold |
| UT-PW-BE-DD-APP-API-004-C007 | GET | empty | valid | none | unavailable | warm |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
