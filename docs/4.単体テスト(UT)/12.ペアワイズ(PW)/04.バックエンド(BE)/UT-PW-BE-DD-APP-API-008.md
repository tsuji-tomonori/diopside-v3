---
id: UT-PW-BE-DD-APP-API-008
title: ペアワイズ因子定義 DD-APP-API-008 再収集API
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
  - '[[DD-APP-API-008]]'
related:
  - '[[UT-CASE-BE-007]]'
tags:
  - diopside
  - UT
  - PW
  - BE
---

## 因子定義
```pairwise
meta:
  id: UT-PW-BE-DD-APP-API-008
  title: DD-APP-API-008 再収集API
  target: BE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/04.バックエンド(BE)/UT-CASE-BE-DD-APP-API-008-PW.md
  up:
  - UT-PLAN-005
  - DD-APP-API-008
  related:
  - UT-CASE-BE-007
factors:
  認可状態:
  - valid_admin
  - missing
  - forbidden
  対象ID数:
  - single
  - many
  - too_many
  理由文字列:
  - normal
  - empty
  - too_long
  実行中ジョブ:
  - none
  - exists
  再試行回数:
  - within
  - exceeded
  ストア状態:
  - ok
  - unavailable
excludes:
- 対象ID数: too_many
  再試行回数: within
- 認可状態: missing
  実行中ジョブ: exists
```

## 変更履歴
- 2026-02-28: 新規作成
