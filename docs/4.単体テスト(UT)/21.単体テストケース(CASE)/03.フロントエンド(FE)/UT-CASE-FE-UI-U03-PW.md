---
id: UT-CASE-FE-UI-U03-PW
title: UI-U03 動画詳細モーダル 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-03-07'
up:
  - '[[UT-PLAN-004]]'
  - '[[DD-APP-UI-003]]'
related:
  - '[[DD-APP-API-007]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - FE
---

## 対象
- 生成元モデル: `[UT-PW-FE-UI-U03](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/03.フロントエンド(FE)/UT-PW-FE-UI-U03.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 起動操作 | 詳細取得結果 | フォーカス状態 | 外部遷移可否 | 波形アセット | ワードクラウドアセット |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-FE-UI-U03-C001 | list_click | ok | inside_modal | enabled | exists | exists |
| UT-PW-FE-UI-U03-C002 | list_click | not_found | escaped | disabled | missing | missing |
| UT-PW-FE-UI-U03-C003 | keyboard_open | error | inside_modal | enabled | missing | missing |
| UT-PW-FE-UI-U03-C004 | keyboard_open | error | escaped | disabled | exists | exists |
| UT-PW-FE-UI-U03-C005 | keyboard_open | ok | inside_modal | disabled | exists | missing |
| UT-PW-FE-UI-U03-C006 | list_click | ok | escaped | enabled | missing | exists |
| UT-PW-FE-UI-U03-C007 | keyboard_open | not_found | inside_modal | disabled | exists | exists |
| UT-PW-FE-UI-U03-C008 | list_click | error | inside_modal | enabled | exists | exists |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-03-07: 自動生成
- 2026-02-28: 自動生成
