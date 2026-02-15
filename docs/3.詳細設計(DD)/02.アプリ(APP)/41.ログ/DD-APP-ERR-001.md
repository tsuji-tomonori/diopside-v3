---
id: DD-APP-ERR-001
title: エラーコード設計
doc_type: エラー設計
phase: DD
version: 1.0.4
status: 廃止
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-14'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-API-004]]'
- '[[BD-APP-API-003]]'
- '[[BD-APP-API-005]]'
related:
- '[[RQ-SEC-001]]'
- '[[RQ-OBY-001]]'
- '[[BD-SYS-ADR-031]]'
- '[[DD-APP-LOG-001]]'
- '[[DD-APP-API-001]]'
- '[[DD-APP-API-010]]'
- '[[AT-SCN-006]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- ERR
---


## 統合方針
- DD層のエラー契約正本は `[[DD-APP-API-001]]` へ統合した。
- 本書は廃止扱いとし、過去参照互換のためIDのみ保持する。

## 正本参照
- Problem Details契約、コード体系、HTTPマッピング: `[[DD-APP-API-001]]`
- エラーログ相関と監視連携: `[[DD-APP-LOG-001]]`

## 変更履歴
- 2026-02-14: エラー契約正本を `[[DD-APP-API-001]]` へ統合し、本書を廃止へ変更 [[BD-SYS-ADR-031]]
- 2026-02-11: Problem Details（`application/problem+json`）を正本化し、必須/拡張メンバーと `errors[]` 正規化方針を追加
- 2026-02-11: エラーコード体系、HTTPマッピング、再試行ポリシー、ログ連携を具体化
- 2026-02-10: 新規作成
