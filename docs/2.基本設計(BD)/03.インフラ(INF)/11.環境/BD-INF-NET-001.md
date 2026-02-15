---
id: BD-INF-NET-001
title: ネットワーク境界方針
doc_type: インフラアーキテクチャ
phase: BD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[BD-INF-PLAT-001]]'
related:
- '[[RQ-SEC-001]]'
- '[[DD-INF-NET-001]]'
- '[[IT-INF-NET-001]]'
- '[[BD-SYS-ADR-028]]'
tags:
- diopside
- BD
- INF
---

## 方針
- 公開面・管理面・内部実行面を論理分離し、最小到達性を原則とする。
- 送信先制御（egress）を定義し、許可先のみ通信可能にする。

## 設計境界（BDとDDの責務分離）
- 本書はネットワーク境界、通信原則、監査要件の方針を正本とする。
- VPC CIDR、サブネットCIDR、ルート、Security Group、NACLの具体設定値は [[DD-INF-NET-001]] を正本とする。
- CIDR具体値の変更は [[DD-INF-IAC-001]] の破壊的変更判定と二重承認を必須とする。

## 監査要件
- 重要経路（管理API、デプロイ、Secrets取得）は通信ログで追跡可能にする。

## 変更履歴
- 2026-02-13: BDは境界方針のみを保持し、CIDR等の具体値正本を [[DD-INF-NET-001]] へ集約
- 2026-02-13: 新規作成（ネットワーク境界と出口制御方針を定義） [[BD-SYS-ADR-028]]
