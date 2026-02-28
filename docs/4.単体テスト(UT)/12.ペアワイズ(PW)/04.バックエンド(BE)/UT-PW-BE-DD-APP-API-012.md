---
id: UT-PW-BE-DD-APP-API-012
title: ペアワイズ因子定義 DD-APP-API-012 配信前後再確認API
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
  - '[[DD-APP-API-012]]'
related:
  - '[[UT-CASE-BE-010]]'
tags:
  - diopside
  - UT
  - PW
  - BE
---

## 因子定義
```pairwise
meta:
  id: UT-PW-BE-DD-APP-API-012
  title: DD-APP-API-012 配信前後再確認API
  target: BE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/04.バックエンド(BE)/UT-CASE-BE-DD-APP-API-012-PW.md
  up:
  - UT-PLAN-005
  - DD-APP-API-012
  related:
  - UT-CASE-BE-010
factors:
  認可状態:
  - valid_admin
  - forbidden
  再確認モード:
  - before
  - after
  対象動画ID:
  - one
  - many
  - empty
  上流状態:
  - consistent
  - mismatch
  - unavailable
  タイムアウト予算:
  - within
  - exceeded
  再試行モード:
  - none
  - auto
excludes:
- 対象動画ID: empty
  再確認モード: after
- 上流状態: unavailable
  再試行モード: none
```

## 変更履歴
- 2026-02-28: 新規作成
