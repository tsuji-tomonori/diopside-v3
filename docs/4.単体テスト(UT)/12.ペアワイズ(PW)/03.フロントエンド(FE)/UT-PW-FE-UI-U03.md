---
id: UT-PW-FE-UI-U03
title: ペアワイズ因子定義 UI-U03 動画詳細モーダル
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
  - '[[DD-APP-UI-003]]'
  - '[[DD-APP-API-007]]'
tags:
  - diopside
  - UT
  - PW
  - FE
---

## 対象
- UI-U03 モーダルの表示、外部遷移、取得失敗時ハンドリング。

## 因子定義
```pairwise
meta:
  id: UT-PW-FE-UI-U03
  title: UI-U03 動画詳細モーダル
  target: FE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/03.フロントエンド(FE)/UT-CASE-FE-UI-U03-PW.md
  up:
  - UT-PLAN-004
  - DD-APP-UI-003
  related:
  - DD-APP-API-007
factors:
  起動操作:
  - list_click
  - keyboard_open
  詳細取得結果:
  - ok
  - not_found
  - error
  フォーカス状態:
  - inside_modal
  - escaped
  外部遷移可否:
  - enabled
  - disabled
  波形アセット:
  - exists
  - missing
  ワードクラウドアセット:
  - exists
  - missing
excludes:
- 詳細取得結果: not_found
  外部遷移可否: enabled
```

## 変更履歴
- 2026-02-28: 新規作成
