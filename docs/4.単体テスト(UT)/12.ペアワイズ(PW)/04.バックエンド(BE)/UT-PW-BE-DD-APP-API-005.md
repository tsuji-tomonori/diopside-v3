---
id: UT-PW-BE-DD-APP-API-005
title: ペアワイズ因子定義 DD-APP-API-005 タグ辞書配信契約
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
  - '[[DD-APP-API-005]]'
related:
  - '[[UT-CASE-BE-004]]'
tags:
  - diopside
  - UT
  - PW
  - BE
---

## 因子定義
```pairwise
meta:
  id: UT-PW-BE-DD-APP-API-005
  title: DD-APP-API-005 タグ辞書配信契約
  target: BE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/04.バックエンド(BE)/UT-CASE-BE-DD-APP-API-005-PW.md
  up:
  - UT-PLAN-005
  - DD-APP-API-005
  related:
  - UT-CASE-BE-004
factors:
  HTTPメソッド:
  - GET
  - other
  辞書状態:
  - normal
  - empty
  - corrupted
  別名含有:
  - true
  - false
  キャッシュヘッダ:
  - enabled
  - disabled
  ストア状態:
  - ok
  - unavailable
  シリアライズ状態:
  - utf8
  - invalid
excludes:
- HTTPメソッド: other
  辞書状態: normal
- HTTPメソッド: other
  辞書状態: empty
```

## 変更履歴
- 2026-02-28: 新規作成
