---
id: BD-INF-PLAT-001
title: インフラ全体像
doc_type: インフラアーキテクチャ
phase: BD
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-14'
up:
- '[[RQ-DEV-001]]'
- '[[RQ-SEC-001]]'
related:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-INF-ENV-001]]'
- '[[BD-INF-NET-001]]'
- '[[BD-INF-SEC-001]]'
- '[[BD-INF-MON-004]]'
- '[[BD-INF-PLAT-002]]'
- '[[BD-INF-IAC-001]]'
- '[[BD-INF-DEP-005]]'
- '[[BD-SYS-ADR-028]]'
- '[[BD-SYS-ADR-031]]'
tags:
- diopside
- BD
- INF
---

## 設計方針
- インフラをソフトウェア成果物として扱い、要求 -> 設計 -> IaC -> テスト -> 受入を同一運用で管理する。
- アプリ層とインフラ層の責任分界を固定し、監視・DR・変更管理を設計対象へ含める。
- IaC管理方式はCDKのみを採用し、インフラ変更は `cdk synth` / `cdk diff` / `cdk deploy` を正規フローとする。

## 構成境界
- クラウド基盤: ネットワーク、IAM、Secrets、ストレージ、配信。
- 実行基盤: API/バッチ実行面、CI/CD実行面、監視収集面。
- 運用基盤: アラート、Runbook、監査証跡、復旧導線。

## 監視・イベント責務
- 監視責務は「収集run」「再確認run」「公開run」「docs公開run」の状態遷移と、公開経路の到達性を対象にする。
- イベント責務は run状態イベント（queued/running/succeeded/failed/partial/rolled_back/cancelled）を監査可能な形で保持し、通知判定へ接続する。
- 監視設定値の正本は `[[DD-INF-MON-001]]` / `[[DD-INF-MON-002]]`、イベント契約の正本は `[[BD-APP-API-002]]` とする。

## AWSサービス一覧（管理対象）
- 管理対象AWSサービスは 8 サービス（CloudFront, S3, Lambda, CloudWatch Logs, IAM, Config, Cognito, WAF）とする。
- 本一覧は運用上意図して管理するサービスのみを対象とし、CDK内部生成リソース（`Custom::CDKBucketDeployment` 由来のLambda/Layerなど）は集計対象外とする。
- As-Is（運用中）とTo-Be（Phase 2拡張）を導入段階で区別し、未導入サービスを実装済みとして扱わない。

| AWSサービス | 論理個数（本番） | 構築理由 | 根拠文書 | 導入段階 |
|---|---:|---|---|---|
| Amazon CloudFront | 1 Distribution | 画面・ドキュメント・OpenAPI・APIを単一配信境界で経路分離し、公開導線を統一運用するため。 | [[BD-INF-DEP-004]], [[BD-INF-DEP-005]], [[BD-SYS-ARCH-003]] | Phase 1導入済 |
| Amazon S3 | 1 Bucket | `web/` `docs/` `openapi/` の静的成果物をプレフィックス分離し、CloudFront配信のオリジンとして運用するため。 | [[BD-INF-DEP-004]], [[BD-DEV-ENV-002]], [[BD-INF-DEP-005]] | Phase 1導入済 |
| AWS Lambda | 3ワークロード（API/運用/配信関連） | API処理、運用処理、配信関連処理を同一実行基盤で分離運用するため。 | [[BD-SYS-ARCH-003]], [[DD-APP-LOG-001]], [[BD-INF-DEP-005]] | Phase 2で拡張 |
| Amazon CloudWatch Logs | 3ログ系統 | Lambda構造化ログを集約し、保持30日で運用監視・障害調査へ利用するため。 | [[BD-SYS-ADR-022]], [[DD-APP-LOG-001]], [[DD-INF-MON-002]], [[BD-INF-DEP-005]] | Phase 1導入済 |
| AWS IAM | 3ロール（配備実行/運用参照/監査参照） | 最小権限でデプロイ、運用参照、監査参照の権限境界を固定するため。 | [[DD-INF-SEC-003]], [[BD-INF-SEC-001]], [[BD-INF-DEP-005]] | Phase 1導入済 |
| AWS Config | 1ルール（`required-tags`） | 必須タグ欠落を日次監査し、コスト・セキュリティ是正運用へ接続するため。 | [[BD-SYS-ADR-015]], [[DD-SYS-COST-001]], [[BD-INF-DEP-005]] | Phase 1導入済 |
| Amazon Cognito | 1認証系統 | `/openapi/*` と `/api/v1/*` の認証境界を固定し、公開/保護経路の混在を防止するため。 | [[BD-SYS-ADR-014]], [[BD-APP-API-004]], [[BD-INF-DEP-005]] | Phase 2で拡張 |
| AWS WAF | 0（Phase 1） | Phase 1では未導入とし、単一CloudFront運用の拡張時に再評価するため。 | [[BD-INF-DEP-003]], [[BD-INF-DEP-005]] | Phase 2で評価 |

## 正本境界
- 本書（[[BD-INF-PLAT-001]]）はインフラ設計全体の入口・責務分割の正本とし、個別手順の正本は持たない。
- 変更手順/承認/切戻しの正本は [[BD-INF-IAC-001]]、配信経路に依存する配備手順の正本は [[BD-INF-DEP-005]] とする。
- 実装値（CIDR、IAMポリシー、監視閾値、DR手順）はDD文書（[[DD-INF-NET-001]]/[[DD-INF-SEC-002]]/[[DD-INF-MON-001]]/[[DD-INF-SEC-001]]）を正本とする。

## I/Oまたは責務
- 入力: [[RQ-DEV-001]], [[RQ-SEC-001]], [[RQ-OBY-001]], [[RQ-AV-001]]。
- 出力: INF系基本設計群（[[BD-INF-ENV-001]]〜[[BD-INF-IAC-001]]）と詳細設計群（[[DD-INF-IAC-002]]/[[DD-INF-NET-001]]/[[DD-INF-SEC-002]]/[[DD-INF-MON-001]]/[[DD-INF-SEC-001]]/[[DD-INF-IAC-001]]）。

## 変更履歴
- 2026-02-14: INF全体像へ監視・イベント責務を追加し、正本参照を `DD-INF-MON-*` / `BD-APP-API-002` へ明示 [[BD-SYS-ADR-031]]
- 2026-02-13: CDKオンリー運用とAs-Is/To-Be分離方針を追記 [[BD-SYS-ADR-028]]
- 2026-02-13: 管理対象AWSサービス一覧（個数/構築理由/導入段階/除外ルール）を追加 [[BD-SYS-ADR-028]]
- 2026-02-13: 正本境界（INF親文書/変更フロー/配信配備/DD実装値）の責務を明確化 [[BD-SYS-ADR-028]]
- 2026-02-13: 新規作成（インフラ文書体系の親文書を追加） [[BD-SYS-ADR-028]]
