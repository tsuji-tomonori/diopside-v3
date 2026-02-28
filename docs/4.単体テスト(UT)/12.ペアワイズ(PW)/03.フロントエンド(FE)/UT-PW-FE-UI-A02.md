---
id: UT-PW-FE-UI-A02
title: ペアワイズ因子定義 UI-A02 実行監視・履歴
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
  - '[[DD-APP-UI-005]]'
  - '[[DD-APP-API-003]]'
  - '[[DD-APP-API-011]]'
tags:
  - diopside
  - UT
  - PW
  - FE
---

## 対象
- UI-A02 実行状態ポーリング、履歴フィルタ、詳細遷移。

## 因子定義
```pairwise
meta:
  id: UT-PW-FE-UI-A02
  title: UI-A02 実行監視・履歴
  target: FE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/03.フロントエンド(FE)/UT-CASE-FE-UI-A02-PW.md
  up:
  - UT-PLAN-004
  - DD-APP-UI-005
  related:
  - DD-APP-API-003
  - DD-APP-API-011
factors:
  ポーリング間隔:
  - short
  - normal
  - long
  状態フィルタ:
  - all
  - running
  - failed
  - succeeded
  一覧状態:
  - has_rows
  - empty
  詳細モーダル:
  - closed
  - opened
  API結果:
  - ok
  - timeout
  - error
  認可状態:
  - valid_admin
  - forbidden
excludes:
- 一覧状態: empty
  詳細モーダル: opened
```

## 変更履歴
- 2026-02-28: 新規作成
