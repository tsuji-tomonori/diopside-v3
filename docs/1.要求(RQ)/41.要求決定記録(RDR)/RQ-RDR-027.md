---
id: RQ-RDR-027
title: AWSタグ統制を単一アカウント運用へ適用する決定
doc_type: 要求決定記録
phase: RQ
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-21'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-COST-001-01]]'
- '[[RQ-SEC-001-01]]'
- '[[RQ-PC-006]]'
- '[[BD-SYS-ADR-015]]'
- '[[DD-SYS-COST-001]]'
- '[[AT-OPS-001]]'
- '[[RQ-RDR-049]]'
tags:
- diopside
- RQ
- RDR
---

## 決定事項
- AWSタグ統制は、単一アカウント運用を前提に要件化する。
- 必須タグキーを `CostCenter` / `Environment` / `Owner` / `Project` / `ManagedBy` / `Description` に固定する。
- タグキーは `UpperCamelCase` を標準とし、`Environment` の許容値は `Production` / `Development` に固定する。
- タグ値へのPII/秘密情報格納を禁止し、`aws:` プレフィックスを利用しない。

## 理由
- [[RQ-PC-006]] の月額上限制約を守るには、タグによる配賦軸の固定と未付与検知が必要である。
- Organizations未採用のため、Tag PolicyやSCPに依存しない統制手段を先に確立する必要がある。
- 表記ゆれ（大小文字差分）や禁止情報混入は、コスト分析とセキュリティ統制の両方を毀損する。
- 実行環境を `dev/prod` に統一したため、未使用環境値（`Staging`/`Test`）の許容を終了して運用誤設定を抑止する。

## 影響
- 要求文書: [[RQ-COST-001-01]] と [[RQ-SEC-001-01]] を意味変更し、タグ統制の受入基準を追加する。
- 設計文書: [[BD-SYS-ADR-015]] と [[DD-SYS-COST-001]] に単一アカウント向けの強制/検知手段を反映する。
- 運用記録: タグ欠落・禁止情報混入の是正記録を [[AT-OPS-001]] へ集約する。

## 変更履歴
- 2026-02-21: `Description` を必須タグキーへ追加し、関連決定 [[RQ-RDR-049]] へ連携
- 2026-02-14: `Environment` 許容値を `Production` / `Development` へ変更
- 2026-02-11: 新規作成
