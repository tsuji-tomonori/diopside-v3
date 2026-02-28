---
id: UT-CASE-BE-DD-APP-API-005-PW
title: DD-APP-API-005 タグ辞書配信契約 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-005]]'
related:
  - '[[UT-CASE-BE-004]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - BE
---

## 対象
- 生成元モデル: `[UT-PW-BE-DD-APP-API-005](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)/UT-PW-BE-DD-APP-API-005.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | HTTPメソッド | 辞書状態 | 別名含有 | キャッシュヘッダ | ストア状態 | シリアライズ状態 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-BE-DD-APP-API-005-C001 | GET | normal | true | enabled | ok | utf8 |
| UT-PW-BE-DD-APP-API-005-C002 | GET | empty | false | disabled | unavailable | invalid |
| UT-PW-BE-DD-APP-API-005-C003 | other | corrupted | true | enabled | unavailable | invalid |
| UT-PW-BE-DD-APP-API-005-C004 | other | corrupted | false | disabled | ok | utf8 |
| UT-PW-BE-DD-APP-API-005-C005 | GET | normal | true | disabled | ok | invalid |
| UT-PW-BE-DD-APP-API-005-C006 | GET | normal | false | enabled | unavailable | utf8 |
| UT-PW-BE-DD-APP-API-005-C007 | GET | empty | true | enabled | ok | utf8 |
| UT-PW-BE-DD-APP-API-005-C008 | GET | corrupted | true | enabled | ok | utf8 |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
