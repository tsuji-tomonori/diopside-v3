---
id: UT-PW-BE-DD-APP-API-013
title: ペアワイズ因子定義 DD-APP-API-013 タグ管理API
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
  - '[[DD-APP-API-013]]'
related:
  - '[[UT-CASE-BE-011]]'
tags:
  - diopside
  - UT
  - PW
  - BE
---

## 因子定義
```pairwise
meta:
  id: UT-PW-BE-DD-APP-API-013
  title: DD-APP-API-013 タグ管理API
  target: BE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/04.バックエンド(BE)/UT-CASE-BE-DD-APP-API-013-PW.md
  up:
  - UT-PLAN-005
  - DD-APP-API-013
  related:
  - UT-CASE-BE-011
factors:
  認可状態:
  - valid_admin
  - forbidden
  操作種別:
  - create
  - update
  - delete
  - merge
  対象状態:
  - exists
  - not_found
  - locked
  入力形式:
  - valid
  - invalid
  競合状態:
  - none
  - duplicate_name
  - version_conflict
  dependency_state:
  - ok
  - unavailable
excludes:
- 操作種別: create
  対象状態: not_found
- 操作種別: merge
  対象状態: not_found
```

## 変更履歴
- 2026-02-28: 新規作成
