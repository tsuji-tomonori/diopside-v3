---
id: UT-PW-FE-UI-A03
title: ペアワイズ因子定義 UI-A03 再収集設定
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
  - '[[DD-APP-UI-006]]'
  - '[[DD-APP-API-008]]'
tags:
  - diopside
  - UT
  - PW
  - FE
---

## 対象
- UI-A03 [[RQ-GL-011|再収集]]条件入力、実行可否、警告表示。

## 因子定義
```pairwise
meta:
  id: UT-PW-FE-UI-A03
  title: UI-A03 再収集設定
  target: FE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/03.フロントエンド(FE)/UT-CASE-FE-UI-A03-PW.md
  up:
  - UT-PLAN-004
  - DD-APP-UI-006
  related:
  - DD-APP-API-008
factors:
  起動種別:
  - manual
  - scheduled
  対象件数:
  - single
  - batch
  再試行上限:
  - default
  - max
  - exceeded
  重複判定キー:
  - valid
  - duplicate
  API結果:
  - accepted
  - conflict
  - validation_error
  認可状態:
  - valid_admin
  - forbidden
excludes:
- 再試行上限: exceeded
  API結果: accepted
```

## 変更履歴
- 2026-02-28: 新規作成
