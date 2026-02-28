---
id: UT-PW-BE-DD-APP-API-004
title: ペアワイズ因子定義 DD-APP-API-004 アーカイブ一覧配信契約
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
  - '[[DD-APP-API-004]]'
related:
  - '[[UT-CASE-BE-003]]'
tags:
  - diopside
  - UT
  - PW
  - BE
---

## 因子定義
```pairwise
meta:
  id: UT-PW-BE-DD-APP-API-004
  title: DD-APP-API-004 アーカイブ一覧配信契約
  target: BE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/04.バックエンド(BE)/UT-CASE-BE-DD-APP-API-004-PW.md
  up:
  - UT-PLAN-005
  - DD-APP-API-004
  related:
  - UT-CASE-BE-003
factors:
  HTTPメソッド:
  - GET
  - other
  データ状態:
  - normal
  - empty
  スキーマ状態:
  - valid
  - missing_field
  ETag状態:
  - none
  - match
  - mismatch
  ストア状態:
  - ok
  - unavailable
  キャッシュ状態:
  - warm
  - cold
excludes:
- HTTPメソッド: other
  データ状態: normal
- HTTPメソッド: other
  データ状態: empty
```

## 変更履歴
- 2026-02-28: 新規作成
