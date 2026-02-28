---
id: UT-PW-FE-UI-U01
title: ペアワイズ因子定義 UI-U01 アーカイブ一覧
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
  - '[[DD-APP-UI-001]]'
  - '[[DD-APP-API-004]]'
tags:
  - diopside
  - UT
  - PW
  - FE
---

## 対象
- UI-U01 アーカイブ一覧の表示状態遷移と一覧操作。

## 因子定義
```pairwise
meta:
  id: UT-PW-FE-UI-U01
  title: UI-U01 アーカイブ一覧
  target: FE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/03.フロントエンド(FE)/UT-CASE-FE-UI-U01-PW.md
  up:
  - UT-PLAN-004
  - DD-APP-UI-001
  related:
  - DD-APP-API-004
factors:
  取得結果:
  - ok
  - empty
  - error
  キャッシュ状態:
  - warm
  - cold
  並び順:
  - newest
  - oldest
  ページサイズ:
  - default
  - max
  追加読込回数:
  - none
  - once
  - multi
  認可状態:
  - guest
  - admin
excludes:
- 取得結果: empty
  追加読込回数: multi
```

## 変更履歴
- 2026-02-28: 新規作成
