---
id: UT-CASE-FE-UI-A06-PW
title: UI-A06 配信反映ジョブ 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-004]]'
  - '[[DD-APP-UI-009]]'
related:
  - '[[DD-APP-API-015]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - FE
---

## 対象
- 生成元モデル: `[UT-PW-FE-UI-A06](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/03.フロントエンド(FE)/UT-PW-FE-UI-A06.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 公開種別 | 実行状態 | ロールバック可否 | 手順表示 | 監視取得状態 | 認可状態 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-FE-UI-A06-C001 | tag_master | queued | false | collapsed | normal | valid_admin |
| UT-PW-FE-UI-A06-C002 | tag_master | running | true | expanded | timeout | forbidden |
| UT-PW-FE-UI-A06-C003 | archive | succeeded | false | collapsed | timeout | forbidden |
| UT-PW-FE-UI-A06-C004 | archive | failed | true | expanded | normal | valid_admin |
| UT-PW-FE-UI-A06-C005 | all | rolled_back | true | collapsed | normal | forbidden |
| UT-PW-FE-UI-A06-C006 | docs | rolled_back | false | expanded | timeout | valid_admin |
| UT-PW-FE-UI-A06-C007 | all | queued | false | expanded | timeout | valid_admin |
| UT-PW-FE-UI-A06-C008 | docs | running | true | collapsed | normal | valid_admin |
| UT-PW-FE-UI-A06-C009 | docs | failed | false | collapsed | timeout | forbidden |
| UT-PW-FE-UI-A06-C010 | tag_master | succeeded | false | expanded | normal | valid_admin |
| UT-PW-FE-UI-A06-C011 | archive | queued | false | collapsed | normal | forbidden |
| UT-PW-FE-UI-A06-C012 | archive | running | false | collapsed | normal | valid_admin |
| UT-PW-FE-UI-A06-C013 | tag_master | failed | true | collapsed | normal | valid_admin |
| UT-PW-FE-UI-A06-C014 | tag_master | rolled_back | true | collapsed | normal | valid_admin |
| UT-PW-FE-UI-A06-C015 | archive | rolled_back | true | collapsed | normal | valid_admin |
| UT-PW-FE-UI-A06-C016 | all | running | true | collapsed | normal | valid_admin |
| UT-PW-FE-UI-A06-C017 | all | succeeded | false | collapsed | normal | valid_admin |
| UT-PW-FE-UI-A06-C018 | all | failed | true | collapsed | normal | valid_admin |
| UT-PW-FE-UI-A06-C019 | docs | queued | false | collapsed | normal | valid_admin |
| UT-PW-FE-UI-A06-C020 | docs | succeeded | false | collapsed | normal | valid_admin |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
