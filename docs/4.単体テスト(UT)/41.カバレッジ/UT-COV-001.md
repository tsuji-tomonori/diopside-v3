---
id: UT-COV-001
title: カバレッジ方針 001
doc_type: カバレッジ方針
phase: UT
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-DEV-TEST-001]]'
- '[[DD-APP-API-001]]'
related:
- '[[UT-PLAN-001]]'
- '[[UT-PLAN-002]]'
- '[[UT-PLAN-003]]'
- '[[UT-PLAN-004]]'
- '[[UT-PLAN-005]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- UT
- COV
---


## テスト目的
- 4領域の単体テストで、必須分岐と失敗経路の未検証を減らす。

## 観点
- DOC: docs検査の成功/失敗分岐（リンク破断、frontmatter欠落）を網羅する。
- INF: rewrite対象/非対象、CDKテストの主要分岐を網羅する。
- FE: [[RQ-GL-014|検索条件]]と表示状態（loading/success/empty/error）の分岐を網羅する。
- BE: APIごとの正常/異常/境界値を網羅し、拒否コードの分岐を検証する。

## 実行方針
- 変更領域のケースは必ず再実行し、共通モジュール変更時は複数領域へ横展開する。
- カバレッジ値そのものより、仕様上必須の分岐未検証を優先して解消する。
- 未達分岐は理由（未実装/将来機能/到達不能）を記録して管理する。

## 変更履歴
- 2026-02-11: 領域別カバレッジ観点（DOC/INF/FE/BE）を追加
- 2026-02-10: 新規作成
