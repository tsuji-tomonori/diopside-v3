---
id: BD-SYS-ADR-015
title: 単一アカウントでAWSタグ統制をIAMとConfigで実施する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-21'
up:
- '[[RQ-RDR-027]]'
- '[[RQ-RDR-049]]'
related:
- '[[RQ-COST-001]]'
- '[[RQ-SEC-001]]'
- '[[DD-SYS-COST-001]]'
- '[[AT-OPS-001]]'
tags:
- diopside
- BD
- ADR
---

## 決定事項
- タグ統制は、単一アカウント前提で次の3層を組み合わせる。
  - IaC: 必須タグキーと列挙値を標準入力として固定する。
  - IAM: `aws:RequestTag/<key>` と `aws:TagKeys` で作成時タグ条件を強制する。
  - AWS Config: `required-tags` によりタグ欠落を検知し、是正運用へ接続する。
- 必須タグは `CostCenter` / `Environment` / `Owner` / `Project` / `ManagedBy` / `Description` とする。
- 説明を設定できるインフラ構成要素は `description` または `comment` を必須とし、用途を1文で判別できる記述を保持する。
- タグ値へのPII/秘密情報格納を禁止し、違反検知時は当日是正とする。

## 理由
- OrganizationsのTag Policy/SCPを使わない単一アカウントでも、作成時強制と事後検知の両立が必要である。
- コスト可視化とセキュリティ統制を同じ[[RQ-GL-005|タグ辞書]]で運用することで、運用負荷を抑えて継続できる。
- IAMだけでは欠落検知が難しいため、Configによる準拠監査を併用する必要がある。

## 影響
- 要求: [[RQ-COST-001]] の配賦要件と [[RQ-SEC-001]] の禁止事項に実装可能な統制手段を提供する。
- 詳細設計: [[DD-SYS-COST-001]] で[[RQ-GL-005|タグ辞書]]、IAM条件、Config監査、是正手順を定義する。
- 運用: [[AT-OPS-001]] へ月次コスト確認とタグ是正記録を残す。

## 却下した選択肢
- Organizations Tag Policy/SCPを前提にする案: 現行の単一アカウント運用では導入前提を満たさないため不採用。
- Config監査のみで運用する案: 作成時の誤タグ混入を防げないため不採用。
- タグ自由入力を許可する案: 表記ゆれと配賦不能コストが増えるため不採用。

## 変更履歴
- 2026-02-21: `Description` タグ追加と説明フィールド必須化を反映
- 2026-02-11: 新規作成
