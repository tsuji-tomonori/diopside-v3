---
id: UT-PW-FE-UI-A01
title: ペアワイズ因子定義 UI-A01 収集実行
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
  - '[[DD-APP-UI-004]]'
  - '[[DD-APP-API-002]]'
tags:
  - diopside
  - UT
  - PW
  - FE
---

## 対象
- UI-A01 収集開始フォームの入力検証と実行結果通知。

## 因子定義
```pairwise
meta:
  id: UT-PW-FE-UI-A01
  title: UI-A01 収集実行
  target: FE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/03.フロントエンド(FE)/UT-CASE-FE-UI-A01-PW.md
  up:
  - UT-PLAN-004
  - DD-APP-UI-004
  related:
  - DD-APP-API-002
factors:
  実行モード:
  - immediate
  - reserved
  対象範囲:
  - official_only
  - include_guest
  認可状態:
  - valid_admin
  - missing
  - forbidden
  クリックパターン:
  - single
  - double
  送信結果:
  - accepted
  - conflict
  - invalid
  - unavailable
  通知表示:
  - inline
  - global
excludes:
- 実行モード: immediate
  送信結果: invalid
```

## 変更履歴
- 2026-02-28: 新規作成
