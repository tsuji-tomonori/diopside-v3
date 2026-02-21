---
id: DD-SYS-SEC-001
title: セキュリティ統制詳細
doc_type: セキュリティ詳細
phase: DD
version: 1.0.4
status: 廃止
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-14'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-SYS-SEC-001]]'
related:
- '[[RQ-SEC-001-01]]'
- '[[RQ-PRC-001-01]]'
- '[[RQ-RDR-035]]'
- '[[RQ-DEV-001-01]]'
- '[[BD-SYS-ADR-031]]'
- '[[DD-APP-ERR-001]]'
- '[[DD-APP-LOG-001]]'
- '[[DD-INF-SEC-003]]'
- '[[DD-SYS-COST-001]]'
- '[[AT-OPS-001]]'
- '[[AT-RUN-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- SEC
---


## 統合方針
- DD層のセキュリティ正本は `[[DD-INF-SEC-003]]` へ統合した。
- 本書は廃止扱いとし、過去参照互換のためIDのみ保持する。

## 正本参照
- 認証/認可/IAM粒度: `[[DD-INF-SEC-003]]`
- エラー応答契約: `[[DD-APP-API-001]]`
- 監査ログ契約: `[[DD-APP-LOG-001]]`

## 変更履歴
- 2026-02-14: DDセキュリティ正本を `[[DD-INF-SEC-003]]` へ統合し、本書を廃止へ変更 [[BD-SYS-ADR-031]]
- 2026-02-11: CloudWatch 30日保持方針に合わせて監査ログ保持期間を更新
- 2026-02-11: 認証/認可境界、入力検証、秘密情報管理、監査ログ、障害時ハンドリングを具体化
- 2026-02-10: 新規作成
