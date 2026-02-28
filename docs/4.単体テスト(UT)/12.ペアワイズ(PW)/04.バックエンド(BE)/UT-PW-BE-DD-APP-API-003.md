---
id: UT-PW-BE-DD-APP-API-003
title: ペアワイズ因子定義 DD-APP-API-003 収集実行状態
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
  - '[[DD-APP-API-003]]'
related:
  - '[[UT-CASE-BE-002]]'
tags:
  - diopside
  - UT
  - PW
  - BE
---

## 因子定義
```pairwise
meta:
  id: UT-PW-BE-DD-APP-API-003
  title: DD-APP-API-003 収集実行状態
  target: BE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/04.バックエンド(BE)/UT-CASE-BE-DD-APP-API-003-PW.md
  up:
  - UT-PLAN-005
  - DD-APP-API-003
  related:
  - UT-CASE-BE-002
factors:
  認可状態:
  - valid_admin
  - missing
  - forbidden
  実行ID状態:
  - exists
  - not_found
  - invalid_format
  実行ステータス:
  - queued
  - running
  - succeeded
  - failed
  詳細レベル:
  - summary
  - full
  ストア状態:
  - ok
  - unavailable
  タイムアウト予算:
  - within
  - exceeded
excludes:
- 実行ID状態: invalid_format
  実行ステータス: running
- 実行ID状態: invalid_format
  詳細レベル: full
```

## 変更履歴
- 2026-02-28: 新規作成
