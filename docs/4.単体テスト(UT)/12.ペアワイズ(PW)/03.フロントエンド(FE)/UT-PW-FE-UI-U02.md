---
id: UT-PW-FE-UI-U02
title: ペアワイズ因子定義 UI-U02 検索・絞り込み
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
  - '[[DD-APP-UI-002]]'
  - '[[DD-APP-API-006]]'
tags:
  - diopside
  - UT
  - PW
  - FE
---

## 対象
- UI-U02 [[RQ-GL-014|検索条件]]オブジェクト生成とフィルタ適用。

## 因子定義
```pairwise
meta:
  id: UT-PW-FE-UI-U02
  title: UI-U02 検索・絞り込み
  target: FE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/03.フロントエンド(FE)/UT-CASE-FE-UI-U02-PW.md
  up:
  - UT-PLAN-004
  - DD-APP-UI-002
  related:
  - DD-APP-API-006
factors:
  検索キーワード:
  - empty
  - normal
  - multibyte
  - special_chars
  選択タグ数:
  - none
  - one
  - many
  タグ結合:
  - AND
  - OR
  日付範囲:
  - none
  - valid
  - invalid_reverse
  再生時間範囲:
  - none
  - valid
  - invalid_reverse
  並び順:
  - newest
  - oldest
excludes:
- 選択タグ数: none
  タグ結合: AND
- 選択タグ数: none
  タグ結合: OR
```

## 変更履歴
- 2026-02-28: 新規作成
