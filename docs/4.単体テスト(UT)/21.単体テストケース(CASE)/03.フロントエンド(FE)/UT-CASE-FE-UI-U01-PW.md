---
id: UT-CASE-FE-UI-U01-PW
title: UI-U01 アーカイブ一覧 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-004]]'
  - '[[DD-APP-UI-001]]'
related:
  - '[[DD-APP-API-004]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - FE
---

## 対象
- 生成元モデル: `[UT-PW-FE-UI-U01](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/03.フロントエンド(FE)/UT-PW-FE-UI-U01.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 取得結果 | キャッシュ状態 | 並び順 | ページサイズ | 追加読込回数 | 認可状態 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-FE-UI-U01-C001 | ok | warm | newest | default | none | guest |
| UT-PW-FE-UI-U01-C002 | ok | cold | oldest | max | once | admin |
| UT-PW-FE-UI-U01-C003 | error | warm | newest | max | multi | admin |
| UT-PW-FE-UI-U01-C004 | error | cold | oldest | default | multi | guest |
| UT-PW-FE-UI-U01-C005 | empty | warm | newest | default | once | guest |
| UT-PW-FE-UI-U01-C006 | empty | cold | oldest | max | none | admin |
| UT-PW-FE-UI-U01-C007 | ok | warm | oldest | default | multi | admin |
| UT-PW-FE-UI-U01-C008 | error | cold | newest | max | none | guest |
| UT-PW-FE-UI-U01-C009 | error | warm | newest | default | once | guest |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
