---
id: BD-SYS-ADR-042
title: ネットワーク設計をNAT非依存へ変更し固定費を抑制する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
- '[[RQ-RDR-053]]'
related:
- '[[RQ-PC-006]]'
- '[[BD-INF-NET-001]]'
- '[[DD-INF-NET-001]]'
- '[[DD-INF-IAC-001]]'
tags:
- diopside
- BD
- ADR
---

## 決定事項
- Private app subnetのデフォルトルート（`0.0.0.0/0 -> NAT Gateway`）を採用しない。
- Private subnetの外向き通信はVPC Endpoint経由を標準とし、IGW/NAT経由を常設しない。
- NATが必要な運用は一時例外として扱い、期限・撤去条件・再発防止策を同時定義する。

## 理由
- NAT Gatewayは時間課金の固定費が継続発生し、[[RQ-PC-006]] の月額上限制約を圧迫する。
- 現行運用で必要な送信先はS3/Logs等のAWSサービスが中心であり、Endpoint化で要件を満たせる。

## 影響
- [[BD-INF-NET-001]] の必須設計項目から常設NAT前提を除外し、IGW/VPC Endpoint中心へ更新する。
- [[DD-INF-NET-001]] のPrivate app route tableを「デフォルトルートなし」に変更する。
- IaC実装（CDK）からNAT Gateway/EIPを削除し、コスト要因を除去する。

## 却下した選択肢
- NAT 1台を常設する案: 実装容易性はあるが固定費が継続し、個人開発コスト上限と整合しないため不採用。
- 時間帯でNATをON/OFFする案: 運用複雑性と失敗時の復旧負荷が高く、恒常運用として不適切なため不採用。

## 変更履歴
- 2026-02-28: 新規作成（ネットワークをNAT非依存へ変更する判断を追加） [[BD-SYS-ADR-042]]
