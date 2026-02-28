---
id: UT-PW-BE-DD-APP-API-006
title: ペアワイズ因子定義 DD-APP-API-006 検索契約
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
  - '[[DD-APP-API-006]]'
related:
  - '[[UT-CASE-BE-005]]'
tags:
  - diopside
  - UT
  - PW
  - BE
---

## 因子定義
```pairwise
meta:
  id: UT-PW-BE-DD-APP-API-006
  title: DD-APP-API-006 検索契約
  target: BE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/04.バックエンド(BE)/UT-CASE-BE-DD-APP-API-006-PW.md
  up:
  - UT-PLAN-005
  - DD-APP-API-006
  related:
  - UT-CASE-BE-005
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
