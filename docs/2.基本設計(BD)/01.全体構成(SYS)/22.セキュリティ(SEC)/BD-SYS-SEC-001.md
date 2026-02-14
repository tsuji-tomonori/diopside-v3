---
id: BD-SYS-SEC-001
title: セキュリティ設計（統合済み）
doc_type: セキュリティ設計
phase: BD
version: 1.0.4
status: 廃止
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-14'
up:
- '[[RQ-SC-001]]'
- '[[RQ-SEC-001]]'
- '[[RQ-DEV-001]]'
related:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-SYS-ADR-001]]'
- '[[BD-SYS-ADR-024]]'
- '[[BD-INF-SEC-001]]'
- '[[BD-APP-API-004]]'
- '[[BD-DEV-PIPE-001]]'
- '[[DD-SYS-SEC-001]]'
- '[[AT-OPS-001]]'
- '[[RQ-UX-022]]'
tags:
- diopside
- BD
- SEC
---


## 統合方針
- 基本設計内で重複していたセキュリティ章は、INF領域の `[[BD-INF-SEC-001]]` を正本として統合した。
- 本書は廃止扱いとし、過去参照互換のためIDのみ保持する。

## 変更履歴
- 2026-02-14: 基本設計セキュリティ章を `[[BD-INF-SEC-001]]` へ統合し、本書を廃止へ変更 [[BD-SYS-ADR-028]]
- 2026-02-11: [[RQ-UX-022]] 対応として外部サービス評価（VPAT等）と代替導線・再評価運用を追加 [[BD-SYS-ADR-024]]
- 2026-02-11: Next.js App Router前提のセキュリティ統制（Server Actions認可、秘密情報境界、CSP、env運用）を追加 [[BD-SYS-ADR-024]]
- 2026-02-10: 新規作成 [[BD-SYS-ADR-001]]
