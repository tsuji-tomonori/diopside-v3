---
id: RQ-RDR-054
title: 定額課金リソースを最小構成へ集約する決定
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
- '[[BD-SYS-ADR-043]]'
tags:
- diopside
- RQ
- RDR
---

## 決定事項
- 定額課金または準定額課金を伴うインフラ要素は、MVP運用に必要な最小構成へ集約する。
- Interface VPC Endpoint（CloudWatch Logs）は常設しない。
- CloudWatchアラームはサービス健全性の最小本数を原則とし、初期はCloudFront 5xxの1本に集約する。
- AWS Config記録と評価はprod必須、dev任意とし、devでは標準無効とする。

## 理由
- [[RQ-PC-006]] の月額コスト上限と、個人開発での継続運用性を両立するため。
- 現行構成ではEndpoint常設やアラーム多重化に対する費用対効果が低く、MVP運用要件を超過しやすいため。

## 影響
- CDK実装からCloudWatch Logs Interface Endpointを除外する。
- 監視アラームをCloudFront 5xxの単一アラームへ整理する。
- AWS Config関連リソースをprodのみ作成する。
- ネットワーク設計文書と制約文書へ、最小構成原則と環境別適用条件を反映する。

## 変更履歴
- 2026-02-28: 新規作成（定額課金リソース最小構成化の要求決定を追加） [[RQ-RDR-054]]
