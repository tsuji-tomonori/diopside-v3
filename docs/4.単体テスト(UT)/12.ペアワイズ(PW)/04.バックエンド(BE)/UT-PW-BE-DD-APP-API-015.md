---
id: UT-PW-BE-DD-APP-API-015
title: ペアワイズ因子定義 DD-APP-API-015 配信反映ジョブ状態API
doc_type: 単体テスト設計
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PW-001]]'
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-015]]'
related:
  - '[[UT-CASE-BE-013]]'
tags:
  - diopside
  - UT
  - PW
  - BE
---

## 因子定義
```pairwise
meta:
  id: UT-PW-BE-DD-APP-API-015
  title: DD-APP-API-015 配信反映ジョブ状態API
  target: BE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/04.バックエンド(BE)/UT-CASE-BE-DD-APP-API-015-PW.md
  up:
  - UT-PLAN-005
  - DD-APP-API-015
  related:
  - UT-CASE-BE-013
factors:
  認可状態:
  - valid_admin
  - forbidden
  公開実行ID:
  - exists
  - not_found
  - invalid
  公開種別:
  - tag_master
  - archive
  - all
  - docs
  実行状態:
  - queued
  - running
  - succeeded
  - failed
  - rolled_back
  ロールバック実施:
  - true
  - false
  ステップ表示粒度:
  - summary
  - detail
excludes:
- 実行状態: succeeded
  ロールバック実施: true
- 公開実行ID: invalid
  実行状態: running
```

## 変更履歴
- 2026-02-28: 新規作成
