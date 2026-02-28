---
id: RQ-RDR-053
title: 固定費抑制のため常設NATを禁止する決定
doc_type: 要求決定記録
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-PC-006]]'
- '[[BD-INF-NET-001]]'
- '[[DD-INF-NET-001]]'
- '[[BD-SYS-ADR-042]]'
tags:
- diopside
- RQ
- RDR
---

## 決定事項
- プロジェクト制約として、NAT Gatewayの常設を禁止する。
- Private subnetの外向き通信はVPC Endpoint優先で構成し、インターネット向けデフォルトルートを持たない。
- 例外でNATを使う場合は期限付き運用とし、承認時に撤去条件と撤去予定日を必須で記録する。

## 理由
- 個人開発のコスト上限制約（[[RQ-PC-006]]）を維持するため、時間課金の常時発生源を除外する必要がある。
- 公開対象が限定された構成では、Endpoint経由で必要通信を満たせるため、常設NATの費用対効果が低い。

## 影響
- [[RQ-PC-006]] に常設NAT禁止と例外運用条件を追記する。
- [[BD-INF-NET-001]] / [[DD-INF-NET-001]] のルート設計をNAT非依存へ更新する。
- IaC実装はPrivate app subnetのデフォルトルートを削除し、Endpoint経由通信のみ許可する。

## 変更履歴
- 2026-02-28: 新規作成（常設NAT禁止の要求決定を追加） [[RQ-RDR-053]]
