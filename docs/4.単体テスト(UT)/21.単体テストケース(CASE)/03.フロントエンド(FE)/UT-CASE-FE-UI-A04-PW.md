---
id: UT-CASE-FE-UI-A04-PW
title: UI-A04 配信前後確認・手動タグ付け 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-004]]'
  - '[[DD-APP-UI-007]]'
related:
  - '[[DD-APP-API-012]]'
  - '[[DD-APP-API-013]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - FE
---

## 対象
- 生成元モデル: `[UT-PW-FE-UI-A04](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/03.フロントエンド(FE)/UT-PW-FE-UI-A04.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 確認モード | 対象動画件数 | タグ操作 | 整合状態 | 送信結果 | 認可状態 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-FE-UI-A04-C001 | before | one | add | consistent | ok | valid_admin |
| UT-PW-FE-UI-A04-C002 | before | many | remove | mismatch | conflict | forbidden |
| UT-PW-FE-UI-A04-C003 | after | many | replace | consistent | invalid | valid_admin |
| UT-PW-FE-UI-A04-C004 | after | one | add | mismatch | invalid | forbidden |
| UT-PW-FE-UI-A04-C005 | after | one | remove | consistent | conflict | valid_admin |
| UT-PW-FE-UI-A04-C006 | before | many | replace | mismatch | ok | forbidden |
| UT-PW-FE-UI-A04-C007 | before | one | remove | consistent | invalid | forbidden |
| UT-PW-FE-UI-A04-C008 | before | many | add | mismatch | conflict | valid_admin |
| UT-PW-FE-UI-A04-C009 | after | one | remove | consistent | ok | valid_admin |
| UT-PW-FE-UI-A04-C010 | before | many | replace | consistent | conflict | valid_admin |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
