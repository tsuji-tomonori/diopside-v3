---
id: UT-CASE-BE-DD-APP-API-011-PW
title: DD-APP-API-011 収集結果明細API 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-011]]'
related:
  - '[[UT-CASE-BE-009]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - BE
---

## 対象
- 生成元モデル: `[UT-PW-BE-DD-APP-API-011](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)/UT-PW-BE-DD-APP-API-011.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 認可状態 | 状態フィルタ | カーソル状態 | limit値 | データ状態 | ストア状態 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-BE-DD-APP-API-011-C001 | valid_admin | all | none | default | has_rows | ok |
| UT-PW-BE-DD-APP-API-011-C002 | valid_admin | succeeded | valid | min | empty | unavailable |
| UT-PW-BE-DD-APP-API-011-C003 | forbidden | failed | invalid | max | has_rows | unavailable |
| UT-PW-BE-DD-APP-API-011-C004 | forbidden | running | valid | over | empty | ok |
| UT-PW-BE-DD-APP-API-011-C005 | valid_admin | all | invalid | max | empty | ok |
| UT-PW-BE-DD-APP-API-011-C006 | forbidden | succeeded | none | default | empty | unavailable |
| UT-PW-BE-DD-APP-API-011-C007 | valid_admin | running | invalid | over | has_rows | unavailable |
| UT-PW-BE-DD-APP-API-011-C008 | valid_admin | failed | none | min | has_rows | ok |
| UT-PW-BE-DD-APP-API-011-C009 | forbidden | all | valid | min | has_rows | unavailable |
| UT-PW-BE-DD-APP-API-011-C010 | valid_admin | succeeded | none | max | has_rows | ok |
| UT-PW-BE-DD-APP-API-011-C011 | valid_admin | failed | valid | default | empty | ok |
| UT-PW-BE-DD-APP-API-011-C012 | valid_admin | succeeded | invalid | default | has_rows | ok |
| UT-PW-BE-DD-APP-API-011-C013 | valid_admin | running | none | default | has_rows | ok |
| UT-PW-BE-DD-APP-API-011-C014 | valid_admin | running | valid | max | has_rows | ok |
| UT-PW-BE-DD-APP-API-011-C015 | valid_admin | running | invalid | min | has_rows | ok |
| UT-PW-BE-DD-APP-API-011-C016 | valid_admin | all | valid | over | has_rows | ok |
| UT-PW-BE-DD-APP-API-011-C017 | valid_admin | succeeded | valid | over | has_rows | ok |
| UT-PW-BE-DD-APP-API-011-C018 | valid_admin | failed | valid | over | has_rows | ok |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
