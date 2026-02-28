---
id: UT-CASE-BE-DD-APP-API-015-PW
title: DD-APP-API-015 配信反映ジョブ状態API 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-015]]'
related:
  - '[[UT-CASE-BE-013]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - BE
---

## 対象
- 生成元モデル: `[UT-PW-BE-DD-APP-API-015](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)/UT-PW-BE-DD-APP-API-015.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 認可状態 | 公開実行ID | 公開種別 | 実行状態 | ロールバック実施 | ステップ表示粒度 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-BE-DD-APP-API-015-C001 | valid_admin | exists | tag_master | queued | true | summary |
| UT-PW-BE-DD-APP-API-015-C002 | valid_admin | not_found | archive | running | false | detail |
| UT-PW-BE-DD-APP-API-015-C003 | forbidden | invalid | all | succeeded | false | summary |
| UT-PW-BE-DD-APP-API-015-C004 | forbidden | exists | docs | failed | true | detail |
| UT-PW-BE-DD-APP-API-015-C005 | valid_admin | invalid | all | rolled_back | true | detail |
| UT-PW-BE-DD-APP-API-015-C006 | forbidden | not_found | tag_master | rolled_back | false | summary |
| UT-PW-BE-DD-APP-API-015-C007 | valid_admin | not_found | docs | failed | false | summary |
| UT-PW-BE-DD-APP-API-015-C008 | forbidden | exists | archive | running | true | summary |
| UT-PW-BE-DD-APP-API-015-C009 | valid_admin | exists | tag_master | succeeded | false | detail |
| UT-PW-BE-DD-APP-API-015-C010 | forbidden | not_found | all | queued | true | detail |
| UT-PW-BE-DD-APP-API-015-C011 | valid_admin | invalid | archive | queued | false | summary |
| UT-PW-BE-DD-APP-API-015-C012 | valid_admin | invalid | tag_master | failed | true | summary |
| UT-PW-BE-DD-APP-API-015-C013 | valid_admin | exists | archive | rolled_back | true | summary |
| UT-PW-BE-DD-APP-API-015-C014 | valid_admin | exists | all | running | true | summary |
| UT-PW-BE-DD-APP-API-015-C015 | valid_admin | not_found | archive | succeeded | false | summary |
| UT-PW-BE-DD-APP-API-015-C016 | valid_admin | invalid | docs | queued | true | summary |
| UT-PW-BE-DD-APP-API-015-C017 | valid_admin | exists | tag_master | running | true | summary |
| UT-PW-BE-DD-APP-API-015-C018 | valid_admin | exists | archive | failed | true | summary |
| UT-PW-BE-DD-APP-API-015-C019 | valid_admin | exists | all | failed | true | summary |
| UT-PW-BE-DD-APP-API-015-C020 | valid_admin | exists | docs | running | true | summary |
| UT-PW-BE-DD-APP-API-015-C021 | valid_admin | exists | docs | succeeded | false | summary |
| UT-PW-BE-DD-APP-API-015-C022 | valid_admin | exists | docs | rolled_back | true | summary |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
