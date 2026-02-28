---
id: UT-CASE-BE-DD-APP-API-007-PW
title: DD-APP-API-007 動画詳細API 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-007]]'
related:
  - '[[UT-CASE-BE-006]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - BE
---

## 対象
- 生成元モデル: `[UT-PW-BE-DD-APP-API-007](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)/UT-PW-BE-DD-APP-API-007.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 動画ID状態 | 波形含有 | [[RQ-GL-017|ワードクラウド]]含有 | 外部URL状態 | ストア状態 | 認可状態 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-BE-DD-APP-API-007-C001 | exists | true | true | valid | ok | guest |
| UT-PW-BE-DD-APP-API-007-C002 | exists | false | false | missing | unavailable | admin |
| UT-PW-BE-DD-APP-API-007-C003 | not_found | true | true | valid | unavailable | admin |
| UT-PW-BE-DD-APP-API-007-C004 | not_found | false | false | missing | ok | guest |
| UT-PW-BE-DD-APP-API-007-C005 | invalid | false | false | valid | ok | admin |
| UT-PW-BE-DD-APP-API-007-C006 | invalid | false | false | missing | unavailable | guest |
| UT-PW-BE-DD-APP-API-007-C007 | exists | true | true | missing | ok | guest |
| UT-PW-BE-DD-APP-API-007-C008 | exists | true | false | valid | ok | guest |
| UT-PW-BE-DD-APP-API-007-C009 | exists | false | true | valid | ok | guest |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
