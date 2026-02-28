---
id: UT-PW-BE-DD-APP-API-007
title: ペアワイズ因子定義 DD-APP-API-007 動画詳細API
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
  - '[[DD-APP-API-007]]'
related:
  - '[[UT-CASE-BE-006]]'
tags:
  - diopside
  - UT
  - PW
  - BE
---

## 因子定義
```pairwise
meta:
  id: UT-PW-BE-DD-APP-API-007
  title: DD-APP-API-007 動画詳細API
  target: BE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/04.バックエンド(BE)/UT-CASE-BE-DD-APP-API-007-PW.md
  up:
  - UT-PLAN-005
  - DD-APP-API-007
  related:
  - UT-CASE-BE-006
factors:
  動画ID状態:
  - exists
  - not_found
  - invalid
  波形含有:
  - true
  - false
  ワードクラウド含有:
  - true
  - false
  外部URL状態:
  - valid
  - missing
  ストア状態:
  - ok
  - unavailable
  認可状態:
  - guest
  - admin
excludes:
- 動画ID状態: invalid
  波形含有: true
- 動画ID状態: invalid
  ワードクラウド含有: true
```

## 変更履歴
- 2026-02-28: 新規作成
