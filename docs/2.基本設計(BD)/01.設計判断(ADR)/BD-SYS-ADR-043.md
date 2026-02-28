---
id: BD-SYS-ADR-043
title: 監視と統制の初期構成を定額課金最小化で運用する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
- '[[RQ-RDR-054]]'
related:
- '[[RQ-PC-006]]'
- '[[BD-INF-NET-001]]'
- '[[DD-INF-NET-001]]'
- '[[DD-INF-MON-001]]'
- '[[DD-SYS-COST-001]]'
tags:
- diopside
- BD
- ADR
---

## 決定事項
- CloudWatch Logs Interface Endpointは初期構成で採用しない。
- CloudWatchアラームはCloudFront 5xxのみを必須とし、Lambda詳細監視は段階導入とする。
- AWS Config（Recorder/Rule/Delivery）はprodのみで有効化し、devでは無効とする。

## 理由
- 常時課金の積み上げを抑制し、[[RQ-PC-006]] のコスト上限制約を満たしやすくするため。
- 現行MVPではprod監視と統制を優先し、dev側は実装検証用途の最小機能で十分なため。

## 影響
- IaC差分でInterface EndpointとLambda関連アラームを削除する。
- Configリソースを環境条件付き生成へ変更する。
- ネットワーク詳細設計のEndpoint表を「S3必須、Logs Interface非採用（初期）」へ更新する。
- コスト詳細設計へシナリオ別見積（低/中/高）と準固定費内訳を追加し、月次判定の入力を定量化する。

## 却下した選択肢
- dev/prod両環境で同一の監視統制を常時有効化する案: 運用一貫性は高いが、初期コストが過大なため不採用。
- 監視を無効化する案: 障害検知能力を失い、受入運用要件に反するため不採用。

## 変更履歴
- 2026-02-28: DDコスト設計への見積モデル反映を影響範囲へ追加 [[BD-SYS-ADR-043]]
- 2026-02-28: 新規作成（監視・統制の初期最小構成を決定） [[BD-SYS-ADR-043]]
