---
id: UT-CASE-FE-UI-A01-PW
title: UI-A01 収集実行 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-004]]'
  - '[[DD-APP-UI-004]]'
related:
  - '[[DD-APP-API-002]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - FE
---

## 対象
- 生成元モデル: `[UT-PW-FE-UI-A01](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/03.フロントエンド(FE)/UT-PW-FE-UI-A01.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 実行モード | 対象範囲 | 認可状態 | クリックパターン | 送信結果 | 通知表示 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-FE-UI-A01-C001 | immediate | official_only | valid_admin | single | accepted | inline |
| UT-PW-FE-UI-A01-C002 | immediate | include_guest | missing | double | conflict | global |
| UT-PW-FE-UI-A01-C003 | reserved | official_only | forbidden | single | invalid | global |
| UT-PW-FE-UI-A01-C004 | reserved | include_guest | valid_admin | double | unavailable | inline |
| UT-PW-FE-UI-A01-C005 | reserved | official_only | missing | single | conflict | inline |
| UT-PW-FE-UI-A01-C006 | immediate | official_only | forbidden | double | unavailable | inline |
| UT-PW-FE-UI-A01-C007 | reserved | include_guest | forbidden | single | accepted | global |
| UT-PW-FE-UI-A01-C008 | reserved | include_guest | valid_admin | double | invalid | inline |
| UT-PW-FE-UI-A01-C009 | immediate | official_only | valid_admin | single | unavailable | global |
| UT-PW-FE-UI-A01-C010 | immediate | official_only | missing | double | accepted | inline |
| UT-PW-FE-UI-A01-C011 | immediate | official_only | valid_admin | single | conflict | inline |
| UT-PW-FE-UI-A01-C012 | immediate | official_only | missing | single | unavailable | inline |
| UT-PW-FE-UI-A01-C013 | immediate | official_only | forbidden | single | conflict | inline |
| UT-PW-FE-UI-A01-C014 | reserved | official_only | missing | single | invalid | inline |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
