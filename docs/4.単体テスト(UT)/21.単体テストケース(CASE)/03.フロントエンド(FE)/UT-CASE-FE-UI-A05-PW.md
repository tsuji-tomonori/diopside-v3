---
id: UT-CASE-FE-UI-A05-PW
title: UI-A05 公開後運用・配信経路確認 単体テストケース（ペアワイズ）
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-004]]'
  - '[[DD-APP-UI-008]]'
related:
  - '[[DD-APP-API-009]]'
  - '[[DD-APP-API-014]]'
tags:
  - diopside
  - UT
  - CASE
  - PW
  - FE
---

## 対象
- 生成元モデル: `[UT-PW-FE-UI-A05](docs/4.単体テスト(UT)/12.ペアワイズ(PW)/03.フロントエンド(FE)/UT-PW-FE-UI-A05.md)`
- 生成方式: 2-wise（pairwise）、被覆率 100.00%

## テストケース一覧
| case_id | 配信経路 | 確認結果 | 再試行操作 | 通知種別 | 診断API状態 | 認可状態 |
| --- | --- | --- | --- | --- | --- | --- |
| UT-PW-FE-UI-A05-C001 | archive | ok | none | toast | ok | valid_admin |
| UT-PW-FE-UI-A05-C002 | archive | warning | once | banner | unavailable | forbidden |
| UT-PW-FE-UI-A05-C003 | docs | error | max | toast | ok | forbidden |
| UT-PW-FE-UI-A05-C004 | tags | error | none | banner | unavailable | valid_admin |
| UT-PW-FE-UI-A05-C005 | tags | warning | once | toast | ok | valid_admin |
| UT-PW-FE-UI-A05-C006 | docs | ok | none | banner | unavailable | forbidden |
| UT-PW-FE-UI-A05-C007 | docs | warning | max | toast | unavailable | valid_admin |
| UT-PW-FE-UI-A05-C008 | archive | error | max | banner | ok | valid_admin |
| UT-PW-FE-UI-A05-C009 | tags | ok | once | toast | ok | forbidden |
| UT-PW-FE-UI-A05-C010 | docs | error | once | toast | ok | valid_admin |
| UT-PW-FE-UI-A05-C011 | archive | warning | none | toast | ok | valid_admin |
| UT-PW-FE-UI-A05-C012 | tags | warning | max | toast | ok | valid_admin |

## 注意
- この文書は自動生成対象。手動編集せず、`UT-PW-*` を修正して再生成する。
- 期待結果（Expected）は仕様差分や境界値補完ケースを別途追記して補強する。

## 変更履歴
- 2026-02-28: 自動生成
