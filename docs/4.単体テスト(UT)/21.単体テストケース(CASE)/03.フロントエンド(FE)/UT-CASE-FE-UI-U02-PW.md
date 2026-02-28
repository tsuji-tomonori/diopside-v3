---
id: UT-CASE-FE-UI-U02-PW
title: UI-U02 検索・絞り込み 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-004]]'
  - '[[DD-APP-UI-002]]'
related:
  - '[[DD-APP-API-006]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - FE
---

## 対象
- 生成元モデル: `[UT-PW-FE-UI-U02](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/03.フロントエンド(FE)/UT-PW-FE-UI-U02.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 検索キーワード | 選択タグ数 | タグ結合 | 日付範囲 | 再生時間範囲 | 並び順 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-FE-UI-U02-C001 | empty | one | AND | none | none | newest |
| UT-PW-FE-UI-U02-C002 | empty | many | OR | valid | valid | oldest |
| UT-PW-FE-UI-U02-C003 | normal | one | AND | invalid_reverse | invalid_reverse | oldest |
| UT-PW-FE-UI-U02-C004 | multibyte | many | OR | none | invalid_reverse | newest |
| UT-PW-FE-UI-U02-C005 | special_chars | one | AND | valid | valid | newest |
| UT-PW-FE-UI-U02-C006 | special_chars | many | OR | invalid_reverse | none | oldest |
| UT-PW-FE-UI-U02-C007 | normal | one | OR | none | valid | newest |
| UT-PW-FE-UI-U02-C008 | multibyte | one | AND | valid | none | oldest |
| UT-PW-FE-UI-U02-C009 | multibyte | many | AND | invalid_reverse | valid | newest |
| UT-PW-FE-UI-U02-C010 | normal | many | AND | none | none | oldest |
| UT-PW-FE-UI-U02-C011 | empty | one | AND | valid | invalid_reverse | newest |
| UT-PW-FE-UI-U02-C012 | special_chars | one | AND | none | invalid_reverse | newest |
| UT-PW-FE-UI-U02-C013 | empty | one | AND | invalid_reverse | none | newest |
| UT-PW-FE-UI-U02-C014 | normal | one | AND | valid | none | newest |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
