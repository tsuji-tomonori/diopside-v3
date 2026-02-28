---
id: UT-PW-BE-DD-APP-API-009
title: ペアワイズ因子定義 DD-APP-API-009 運用診断API
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
  - '[[DD-APP-API-009]]'
related:
  - '[[UT-CASE-BE-008]]'
tags:
  - diopside
  - UT
  - PW
  - BE
---

## 因子定義
```pairwise
meta:
  id: UT-PW-BE-DD-APP-API-009
  title: DD-APP-API-009 運用診断API
  target: BE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/04.バックエンド(BE)/UT-CASE-BE-DD-APP-API-009-PW.md
  up:
  - UT-PLAN-005
  - DD-APP-API-009
  related:
  - UT-CASE-BE-008
factors:
  認可状態:
  - valid_admin
  - forbidden
  診断範囲:
  - storage
  - queue
  - publish
  - all
  dependency_state:
  - ok
  - degraded
  - down
  タイムアウト予算:
  - within
  - exceeded
  キャッシュ状態:
  - warm
  - cold
  出力モード:
  - summary
  - verbose
excludes:
- dependency_state: down
  出力モード: verbose
```

## 変更履歴
- 2026-02-28: 新規作成
