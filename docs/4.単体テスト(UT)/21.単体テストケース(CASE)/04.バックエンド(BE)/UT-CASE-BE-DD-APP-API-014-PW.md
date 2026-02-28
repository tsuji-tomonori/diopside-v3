---
id: UT-CASE-BE-DD-APP-API-014-PW
title: DD-APP-API-014 ドキュメント公開実行API 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-014]]'
related:
  - '[[UT-CASE-BE-012]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - BE
---

## 対象
- 生成元モデル: `[UT-PW-BE-DD-APP-API-014](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)/UT-PW-BE-DD-APP-API-014.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 認可状態 | 公開種別 | 対象Ref | 実行中ジョブ | 失敗ステップ | ロールバック方針 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-BE-DD-APP-API-014-C001 | valid_admin | tag_master | head | none | none | auto |
| UT-PW-BE-DD-APP-API-014-C002 | valid_admin | archive | specific | exists | generate | manual |
| UT-PW-BE-DD-APP-API-014-C003 | forbidden | all | missing | none | validate | manual |
| UT-PW-BE-DD-APP-API-014-C004 | forbidden | docs | head | exists | switch | auto |
| UT-PW-BE-DD-APP-API-014-C005 | valid_admin | tag_master | missing | exists | validate | auto |
| UT-PW-BE-DD-APP-API-014-C006 | valid_admin | all | specific | none | switch | auto |
| UT-PW-BE-DD-APP-API-014-C007 | forbidden | archive | head | none | generate | auto |
| UT-PW-BE-DD-APP-API-014-C008 | valid_admin | docs | head | none | validate | manual |
| UT-PW-BE-DD-APP-API-014-C009 | forbidden | tag_master | specific | none | switch | manual |
| UT-PW-BE-DD-APP-API-014-C010 | forbidden | all | head | exists | none | auto |
| UT-PW-BE-DD-APP-API-014-C011 | valid_admin | archive | missing | none | switch | auto |
| UT-PW-BE-DD-APP-API-014-C012 | valid_admin | docs | specific | none | none | auto |
| UT-PW-BE-DD-APP-API-014-C013 | valid_admin | docs | missing | none | generate | auto |
| UT-PW-BE-DD-APP-API-014-C014 | valid_admin | archive | specific | none | validate | auto |
| UT-PW-BE-DD-APP-API-014-C015 | valid_admin | tag_master | head | none | generate | auto |
| UT-PW-BE-DD-APP-API-014-C016 | valid_admin | archive | head | none | none | auto |
| UT-PW-BE-DD-APP-API-014-C017 | valid_admin | all | head | none | generate | auto |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
