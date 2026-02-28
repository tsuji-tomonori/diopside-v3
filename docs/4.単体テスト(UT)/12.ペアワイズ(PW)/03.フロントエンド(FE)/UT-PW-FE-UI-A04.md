---
id: UT-PW-FE-UI-A04
title: ペアワイズ因子定義 UI-A04 配信前後確認・手動タグ付け
doc_type: 単体テスト設計
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PW-001]]'
  - '[[UT-PLAN-004]]'
  - '[[BD-APP-UI-001]]'
related:
  - '[[DD-APP-UI-007]]'
  - '[[DD-APP-API-012]]'
  - '[[DD-APP-API-013]]'
tags:
  - diopside
  - UT
  - PW
  - FE
---

## 対象
- UI-A04 の確認操作、タグ付け操作、競合表示。

## 因子定義
```pairwise
meta:
  id: UT-PW-FE-UI-A04
  title: UI-A04 配信前後確認・手動タグ付け
  target: FE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/03.フロントエンド(FE)/UT-CASE-FE-UI-A04-PW.md
  up:
  - UT-PLAN-004
  - DD-APP-UI-007
  related:
  - DD-APP-API-012
  - DD-APP-API-013
factors:
  確認モード:
  - before
  - after
  対象動画件数:
  - one
  - many
  タグ操作:
  - add
  - remove
  - replace
  整合状態:
  - consistent
  - mismatch
  送信結果:
  - ok
  - conflict
  - invalid
  認可状態:
  - valid_admin
  - forbidden
excludes:
- 対象動画件数: one
  タグ操作: replace
```

## 変更履歴
- 2026-02-28: 新規作成
