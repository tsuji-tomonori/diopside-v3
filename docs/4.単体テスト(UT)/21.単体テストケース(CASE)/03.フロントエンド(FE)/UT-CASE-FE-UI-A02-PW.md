---
id: UT-CASE-FE-UI-A02-PW
title: UI-A02 実行監視・履歴 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-004]]'
  - '[[DD-APP-UI-005]]'
related:
  - '[[DD-APP-API-003]]'
  - '[[DD-APP-API-011]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - FE
---

## 対象
- 生成元モデル: `[UT-PW-FE-UI-A02](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/03.フロントエンド(FE)/UT-PW-FE-UI-A02.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | ポーリング間隔 | 状態フィルタ | 一覧状態 | 詳細モーダル | API結果 | 認可状態 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-FE-UI-A02-C001 | short | all | has_rows | closed | ok | valid_admin |
| UT-PW-FE-UI-A02-C002 | normal | running | has_rows | opened | timeout | forbidden |
| UT-PW-FE-UI-A02-C003 | long | failed | empty | closed | error | forbidden |
| UT-PW-FE-UI-A02-C004 | normal | succeeded | empty | closed | timeout | valid_admin |
| UT-PW-FE-UI-A02-C005 | long | succeeded | has_rows | opened | error | valid_admin |
| UT-PW-FE-UI-A02-C006 | short | running | empty | closed | ok | forbidden |
| UT-PW-FE-UI-A02-C007 | short | failed | has_rows | opened | ok | valid_admin |
| UT-PW-FE-UI-A02-C008 | normal | all | has_rows | opened | error | forbidden |
| UT-PW-FE-UI-A02-C009 | long | all | empty | closed | timeout | valid_admin |
| UT-PW-FE-UI-A02-C010 | short | running | has_rows | closed | error | valid_admin |
| UT-PW-FE-UI-A02-C011 | short | succeeded | has_rows | closed | ok | forbidden |
| UT-PW-FE-UI-A02-C012 | short | failed | has_rows | closed | timeout | valid_admin |
| UT-PW-FE-UI-A02-C013 | normal | failed | has_rows | closed | ok | valid_admin |
| UT-PW-FE-UI-A02-C014 | long | running | has_rows | closed | ok | valid_admin |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
