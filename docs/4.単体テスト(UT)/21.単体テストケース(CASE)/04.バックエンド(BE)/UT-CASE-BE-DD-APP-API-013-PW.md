---
id: UT-CASE-BE-DD-APP-API-013-PW
title: DD-APP-API-013 タグ管理API 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-013]]'
related:
  - '[[UT-CASE-BE-011]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - BE
---

## 対象
- 生成元モデル: `[UT-PW-BE-DD-APP-API-013](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)/UT-PW-BE-DD-APP-API-013.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 認可状態 | 操作種別 | 対象状態 | 入力形式 | 競合状態 | dependency_state |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-BE-DD-APP-API-013-C001 | valid_admin | create | exists | valid | none | ok |
| UT-PW-BE-DD-APP-API-013-C002 | valid_admin | update | not_found | invalid | duplicate_name | unavailable |
| UT-PW-BE-DD-APP-API-013-C003 | forbidden | delete | locked | valid | version_conflict | unavailable |
| UT-PW-BE-DD-APP-API-013-C004 | forbidden | merge | exists | invalid | duplicate_name | ok |
| UT-PW-BE-DD-APP-API-013-C005 | valid_admin | create | locked | invalid | version_conflict | ok |
| UT-PW-BE-DD-APP-API-013-C006 | forbidden | update | not_found | valid | none | ok |
| UT-PW-BE-DD-APP-API-013-C007 | valid_admin | delete | exists | invalid | none | unavailable |
| UT-PW-BE-DD-APP-API-013-C008 | valid_admin | merge | locked | valid | none | unavailable |
| UT-PW-BE-DD-APP-API-013-C009 | forbidden | create | locked | valid | duplicate_name | unavailable |
| UT-PW-BE-DD-APP-API-013-C010 | valid_admin | update | exists | valid | version_conflict | ok |
| UT-PW-BE-DD-APP-API-013-C011 | valid_admin | delete | not_found | valid | duplicate_name | ok |
| UT-PW-BE-DD-APP-API-013-C012 | valid_admin | update | not_found | valid | version_conflict | ok |
| UT-PW-BE-DD-APP-API-013-C013 | valid_admin | update | locked | valid | none | ok |
| UT-PW-BE-DD-APP-API-013-C014 | valid_admin | merge | exists | valid | version_conflict | ok |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
