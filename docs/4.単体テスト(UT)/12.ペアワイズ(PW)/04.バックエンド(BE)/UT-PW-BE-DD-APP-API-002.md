---
id: UT-PW-BE-DD-APP-API-002
title: ペアワイズ因子定義 DD-APP-API-002 収集実行起動
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
  - '[[DD-APP-API-002]]'
related:
  - '[[UT-CASE-BE-001]]'
tags:
  - diopside
  - UT
  - PW
  - BE
---

## 因子定義
```pairwise
meta:
  id: UT-PW-BE-DD-APP-API-002
  title: DD-APP-API-002 収集実行起動
  target: BE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/04.バックエンド(BE)/UT-CASE-BE-DD-APP-API-002-PW.md
  up:
  - UT-PLAN-005
  - DD-APP-API-002
  related:
  - UT-CASE-BE-001
factors:
  認可状態:
  - valid_admin
  - missing
  - forbidden
  実行モード:
  - immediate
  - reserved
  対象範囲:
  - official_only
  - include_guest
  実行中ジョブ:
  - none
  - exists
  ストア状態:
  - ok
  - unavailable
  リクエスト形式:
  - valid
  - invalid
excludes:
- 実行中ジョブ: exists
  リクエスト形式: invalid
```

## 変更履歴
- 2026-02-28: 新規作成
