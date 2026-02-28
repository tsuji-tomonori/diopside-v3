---
id: UT-PW-FE-UI-A06
title: ペアワイズ因子定義 UI-A06 配信反映ジョブ
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
  - '[[DD-APP-UI-009]]'
  - '[[DD-APP-API-015]]'
tags:
  - diopside
  - UT
  - PW
  - FE
---

## 対象
- UI-A06 配信反映ジョブ実行と進行ステータス表示。

## 因子定義
```pairwise
meta:
  id: UT-PW-FE-UI-A06
  title: UI-A06 配信反映ジョブ
  target: FE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/03.フロントエンド(FE)/UT-CASE-FE-UI-A06-PW.md
  up:
  - UT-PLAN-004
  - DD-APP-UI-009
  related:
  - DD-APP-API-015
factors:
  公開種別:
  - tag_master
  - archive
  - all
  - docs
  実行状態:
  - queued
  - running
  - succeeded
  - failed
  - rolled_back
  ロールバック可否:
  - true
  - false
  手順表示:
  - collapsed
  - expanded
  監視取得状態:
  - normal
  - timeout
  認可状態:
  - valid_admin
  - forbidden
excludes:
- 実行状態: succeeded
  ロールバック可否: true
- 実行状態: queued
  ロールバック可否: true
```

## 変更履歴
- 2026-02-28: 新規作成
