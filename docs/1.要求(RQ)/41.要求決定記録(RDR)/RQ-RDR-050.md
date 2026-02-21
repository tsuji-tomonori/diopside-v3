---
id: RQ-RDR-050
title: CI/CD実装基盤をGitHub Actionsに統一し要件を原子分割で追加する決定
doc_type: 要求決定記録
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-DEV-001]]'
- '[[RQ-DEV-005]]'
- '[[RQ-DEV-006]]'
- '[[RQ-DEV-007]]'
- '[[RQ-SEC-001]]'
- '[[RQ-SEC-005]]'
- '[[RQ-UC-010]]'
- '[[RQ-UC-011]]'
- '[[RQ-UC-012]]'
- '[[RQ-UC-013]]'
- '[[BD-DEV-PIPE-001]]'
- '[[BD-SYS-ADR-039]]'
tags:
- diopside
- RQ
- RDR
---

## 決定事項
- CI/CDの実装基盤はGitHub Actionsを正本とし、PR品質ゲートとデプロイ運用を同一基盤で運用する。
- 既存要件の意味変更は行わず、GitHub Actions運用に関する要求は新規要件を追加して原子性を維持する。
- 追加要件はDevOps非機能（[[RQ-DEV-005]]/[[RQ-DEV-006]]/[[RQ-DEV-007]]）、セキュリティ非機能（[[RQ-SEC-005]]）、運用ユースケース（[[RQ-UC-010]]〜[[RQ-UC-013]]）へ分割する。
- 設計反映は `BD-DEV-PIPE-001` と `BD-SYS-ADR-039` で実装方針を固定し、運用判定は `AT-REL-001` と `AT-GO-001` から参照する。

## 理由
- 既存の `RQ-DEV-001` と `RQ-SEC-001` は運用閾値と統制の基底要件として維持し、実装基盤固有条件は追加要件で独立管理した方が変更追跡しやすい。
- 要件を原子分割すると、閾値変更・運用手順変更・セキュリティ統制変更を個別に改訂でき、影響範囲を限定できる。
- GitHub Actions採用で、ステータスチェック・Environment承認・Artifacts保持・OIDC認証を一貫運用できる。

## 影響
- 要求文書: `RQ-DEV-005` / `RQ-DEV-006` / `RQ-DEV-007` / `RQ-SEC-005` / `RQ-UC-010`〜`RQ-UC-013` を新規追加する。
- 設計文書: `BD-DEV-PIPE-001` にGitHub Actions実装補足を追加し、`BD-SYS-ADR-039` で設計判断を記録する。
- 運用文書: `AT-REL-001` と `AT-GO-001` に参照関係を補足し、Go/No-Go判定へ証跡連携を追加する。

## 変更履歴
- 2026-02-21: 新規作成
