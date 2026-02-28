---
id: UT-PW-BE-DD-APP-API-011
title: ペアワイズ因子定義 DD-APP-API-011 収集結果明細API
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
  - '[[DD-APP-API-011]]'
related:
  - '[[UT-CASE-BE-009]]'
tags:
  - diopside
  - UT
  - PW
  - BE
---

## 因子定義
```pairwise
meta:
  id: UT-PW-BE-DD-APP-API-011
  title: DD-APP-API-011 収集結果明細API
  target: BE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/04.バックエンド(BE)/UT-CASE-BE-DD-APP-API-011-PW.md
  up:
  - UT-PLAN-005
  - DD-APP-API-011
  related:
  - UT-CASE-BE-009
factors:
  認可状態:
  - valid_admin
  - forbidden
  状態フィルタ:
  - all
  - succeeded
  - failed
  - running
  カーソル状態:
  - none
  - valid
  - invalid
  limit値:
  - default
  - min
  - max
  - over
  データ状態:
  - has_rows
  - empty
  ストア状態:
  - ok
  - unavailable
excludes:
- カーソル状態: none
  limit値: over
```

## 変更履歴
- 2026-02-28: 新規作成
