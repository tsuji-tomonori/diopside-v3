---
id: UT-CASE-FE-UI-A03-PW
title: UI-A03 再収集設定 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-004]]'
  - '[[DD-APP-UI-006]]'
related:
  - '[[DD-APP-API-008]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - FE
---

## 対象
- 生成元モデル: `[UT-PW-FE-UI-A03](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/03.フロントエンド(FE)/UT-PW-FE-UI-A03.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 起動種別 | 対象件数 | 再試行上限 | 重複判定キー | API結果 | 認可状態 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-FE-UI-A03-C001 | manual | single | default | valid | accepted | valid_admin |
| UT-PW-FE-UI-A03-C002 | manual | batch | max | duplicate | conflict | forbidden |
| UT-PW-FE-UI-A03-C003 | scheduled | single | exceeded | valid | validation_error | forbidden |
| UT-PW-FE-UI-A03-C004 | scheduled | batch | default | duplicate | validation_error | valid_admin |
| UT-PW-FE-UI-A03-C005 | scheduled | single | max | valid | conflict | valid_admin |
| UT-PW-FE-UI-A03-C006 | manual | single | exceeded | duplicate | conflict | valid_admin |
| UT-PW-FE-UI-A03-C007 | scheduled | batch | default | valid | accepted | forbidden |
| UT-PW-FE-UI-A03-C008 | manual | single | max | valid | validation_error | valid_admin |
| UT-PW-FE-UI-A03-C009 | manual | single | max | duplicate | accepted | valid_admin |
| UT-PW-FE-UI-A03-C010 | manual | single | default | valid | conflict | valid_admin |
| UT-PW-FE-UI-A03-C011 | manual | batch | exceeded | valid | conflict | valid_admin |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
