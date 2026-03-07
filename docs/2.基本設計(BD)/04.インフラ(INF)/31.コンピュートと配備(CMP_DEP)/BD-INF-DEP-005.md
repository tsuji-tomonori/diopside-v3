---
id: BD-INF-DEP-005
title: コンピュートと配備設計
doc_type: デプロイ設計
phase: BD
version: 1.0.12
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-03-07'
up:
  - '[[RQ-FR-025]]'
  - '[[RQ-DEV-001-01]]'
related:
  - '[[BD-SYS-ADR-014]]'
  - '[[BD-SYS-ADR-028]]'
  - '[[BD-SYS-ADR-044]]'
  - '[[BD-SYS-ADR-031]]'
  - '[[BD-INF-DEP-004]]'
  - '[[BD-INF-PLAT-001]]'
  - '[[BD-INF-IAC-001]]'
  - '[[DD-INF-DEP-003]]'
  - '[[AT-REL-001]]'
  - '[[AT-RUN-001]]'
tags:
  - diopside
  - BD
  - DEP
---

## 目的
- インフラ配備の責務を `BE/FE/Infra/DB/Doc/TestAsset` の6領域で分離し、配備モードごとの再実行範囲を限定する。

## 必須設計項目（BDで必ず決める）
- 実行基盤選定（EC2/ASG、ECS、EKS）と採否理由。
- L7入口（ALB/API Gateway）とヘルスチェック境界。
- オートスケーリング指標（CPU/メモリ/RPS）と下限/上限。
- 配備モード（通常/初回/緊急）別の確認項目。

## DDへの引渡し（根拠/入力）
- 配備責務マップ（BE/FE/Infra/DB/Doc/TestAsset）と各単位の再実行境界。
- モード別判定基準（通常/初回/緊急）と最低確認経路。
- 実行基盤の採否理由、スケーリング原則、ロールバック境界。

## 正本境界
- 本書は「配信境界に依存するデプロイ順序/確認ポイント」の正本とする。
- 承認フロー・変更統制・切戻しの承認条件は [[BD-INF-IAC-001]] を正本とし、本書では重複定義しない。
- 具体的なコマンド、pipeline条件、state管理は [[DD-INF-DEP-003]] と [[DD-INF-IAC-001]] を正本とする。

## 配備責務マップ
| 領域 | 主成果物 | 主経路 | 主失敗時の再実行 |
|---|---|---|---|
| BE | API実行バイナリ、運用API | `/api/v1/*` | api build/test -> deploy |
| FE | SPA静的成果物 | `/web/*` | front build/test -> deploy |
| Infra | CloudFront/S3/IAM/Config | 全経路 | `cdk diff` -> `cdk deploy` |
| DB | スキーマ変更、マイグレーション | 非公開経路 | migrate -> verify -> rollback |
| Doc | Quartz静的成果物、OpenAPI公開成果物 | `/docs/*`, `/openapi/*` | `task quartz:build` -> `task docs:deploy` |
| TestAsset | UT/IT/ATの固定データ・検証成果物 | 非公開経路 | test asset republish |

## 配備モード境界
| モード | 適用条件 | 許可配備単位 | 不許可操作 | 最低確認 |
|---|---|---|---|---|
| 通常配備 | 定常の差分反映 | 差分のある単位のみ | 全経路invalidation（`/*`） | `/web/`, `/docs/`, `/openapi/`, `/api/v1/ops/diagnostics/health` |
| 初回配備 | 新規環境立上げ、全面初期化 | 6単位すべて | 省略配備 | 監視/認証/配信経路の全件疎通 |
| 緊急配備 | 重大障害復旧、回避策即時反映 | 影響単位 + 必要最小限Infra | 非関連単位の同時変更 | 障害導線の復旧確認 + 監査記録 |

## 実行方針
- 標準入口は `task docs:deploy` を維持し、内部で領域別タスクへ分岐する。
- インフラ反映は `cdk diff` で差分確認後に `cdk deploy` する順序を必須化する。
- CloudFront behavior順序は `/api/*` -> `/openapi/*` -> `/docs/*` -> `/web/*` -> `/*` を固定する。
- invalidationは経路別（`/docs/*` `/web/*` `/openapi/*`）で実施し、`/*` は緊急時のみ許可する。
- 通常配備は差分単位のみを許可し、Infra差分がない場合はInfra配備を実施しない。
- 初回配備は6単位すべてを対象にし、途中省略を禁止する。

## AWSリソース一覧（管理対象）
| AWSサービス | 論理個数（本番） | 構築理由 | 根拠文書 | 導入段階 |
|---|---:|---|---|---|
| Amazon VPC | 1 VPC / 3 Subnets / 3 RouteTables / 3 SecurityGroups / 2 NetworkACLs / 1 GatewayEndpoint | 公開/管理/API実行の境界をVPC内で分離し、常設NATなしで閉域制御するため。 | [[BD-INF-NET-001]], [[DD-INF-NET-001]] | Phase 1導入済 |
| Amazon CloudFront | 1 Distribution / 3 Functions / 1 OAC / 1 ResponseHeadersPolicy | 画面・ドキュメント・OpenAPI・APIを単一配信境界で経路分離し、URL補正・SPA fallback・既定遷移をエッジで実施するため。 | [[BD-INF-DEP-004]], [[DD-INF-CF-001]] | Phase 1導入済 |
| Amazon S3 | 3 Buckets（静的配信 / CloudFrontアクセスログ / Config証跡） | 静的成果物配信、配信証跡、Config証跡をバケット分離し、保持/暗号化境界を明確化するため。 | [[BD-INF-AUD-001]], [[DD-INF-S3-001]] | Phase 1導入済 |
| Amazon API Gateway | 1 HTTP API / 3 Routes / 1 Integration / 1 Authorizer / 1 Stage | `/api/v1/*` と `/openapi/*` をCloudFront配下で公開し、JWT認証境界を固定するため。 | [[BD-APP-API-004]], [[DD-INF-LMB-001]] | Phase 1導入済 |
| AWS Lambda | 1ワークロード（API） | Phase 1ではAPI/Ops/OpenAPI返却を単一関数で提供し、運用・配信補助はPhase 2で分離拡張するため。 | [[BD-INF-DEP-005]], [[DD-INF-LMB-001]] | Phase 2で拡張 |
| Amazon CloudWatch Logs | 2ログ系統（Lambda / API Gateway） | API実行ログとHTTP APIアクセスログを30日保持で集約し、監視・監査に利用するため。 | [[BD-INF-MON-001]], [[DD-INF-MON-002]] | Phase 1導入済 |
| Amazon CloudWatch | 3アラーム（CloudFront 5xx / 月額警告 / 月額臨界） | 公開経路異常と月額コスト超過を段階通知するため。 | [[BD-INF-MON-001]], [[DD-INF-MON-001]] | Phase 1導入済 |
| AWS IAM | 6ロール + 1 OIDC Provider | 配備実行、運用参照、監査参照、緊急管理、API実行、Config記録の責務を分離し、GitHub OIDC連携を固定するため。 | [[BD-INF-SEC-001]], [[DD-INF-SEC-002]], [[DD-INF-SEC-003]] | Phase 1導入済 |
| AWS Config | 1 Recorder / 1 DeliveryChannel / 1 ConfigRule（prodのみ） | 必須タグ欠落をprodで継続検知し、証跡をS3へ保管するため。 | [[BD-SYS-ADR-043]], [[DD-INF-CFG-001]] | Phase 1導入済 |
| Amazon Cognito | 1 UserPool / 1 UserPoolClient | `/openapi/*` と運用系APIのJWT認証境界を固定するため。 | [[BD-SYS-ADR-014]], [[DD-INF-COG-001]] | Phase 1導入済 |
| AWS WAF | 0（Phase 1） | Phase 1では未導入とし、単一CloudFront運用の拡張時に再評価するため。 | [[BD-INF-DEP-003]], [[BD-INF-WAF-001]] | Phase 2で評価 |

※ 本表は運用上意図して管理する主リソースを対象とし、`BucketPolicy` / `Route` / `NetworkAclEntry` / Association / Permission / Layer といった補助リソース、および CDK 内部生成リソースは自動照合の対象外とする。
※ 個数は[[BD-DEV-ENV-002|本番環境]]の論理個数を記載。未固定事項は実装詳細（DD/IaC）で確定する。

## AWSリソース比較定義
```yaml
schema_version: 1
stack: DiopsideDeliveryStack
deployment_stage: prod
tag_environment: Production
exclude:
  resource_types:
    - AWS::CDK::Metadata
    - AWS::EC2::NetworkAclEntry
    - AWS::EC2::Route
    - AWS::EC2::SubnetNetworkAclAssociation
    - AWS::EC2::SubnetRouteTableAssociation
    - AWS::EC2::VPCGatewayAttachment
    - AWS::IAM::ManagedPolicy
    - AWS::IAM::Policy
    - AWS::Lambda::LayerVersion
    - AWS::Lambda::Permission
    - AWS::S3::BucketPolicy
    - Custom::CDKBucketDeployment
  logical_id_patterns:
    - '^CustomAWSCDKOpenIdConnectProviderCustomResourceProvider'
    - '^CustomCDKBucketDeployment'
items:
  - service: Amazon VPC
    selectors:
      - type: AWS::EC2::VPC
        count: 1
      - type: AWS::EC2::Subnet
        count: 3
      - type: AWS::EC2::InternetGateway
        count: 1
      - type: AWS::EC2::RouteTable
        count: 3
      - type: AWS::EC2::NetworkAcl
        count: 2
      - type: AWS::EC2::VPCEndpoint
        count: 1
      - type: AWS::EC2::SecurityGroup
        count: 3
  - service: Amazon CloudFront
    selectors:
      - type: AWS::CloudFront::Distribution
        count: 1
      - type: AWS::CloudFront::Function
        count: 3
      - type: AWS::CloudFront::OriginAccessControl
        count: 1
      - type: AWS::CloudFront::ResponseHeadersPolicy
        count: 1
  - service: Amazon S3
    selectors:
      - type: AWS::S3::Bucket
        count: 3
  - service: Amazon API Gateway
    selectors:
      - type: AWS::ApiGatewayV2::Api
        count: 1
      - type: AWS::ApiGatewayV2::Route
        count: 3
      - type: AWS::ApiGatewayV2::Integration
        count: 1
      - type: AWS::ApiGatewayV2::Authorizer
        count: 1
      - type: AWS::ApiGatewayV2::Stage
        count: 1
  - service: AWS Lambda
    selectors:
      - type: AWS::Lambda::Function
        count: 1
        logical_id_patterns:
          - '^ApiHandler'
  - service: Amazon CloudWatch Logs
    selectors:
      - type: AWS::Logs::LogGroup
        count: 2
        logical_id_patterns:
          - '^ApiHandlerLogGroup'
          - '^HttpApiAccessLogGroup'
  - service: Amazon CloudWatch
    selectors:
      - type: AWS::CloudWatch::Alarm
        count: 3
  - service: AWS IAM
    selectors:
      - type: AWS::IAM::Role
        count: 6
        logical_id_patterns:
          - '^GithubActionsDeployRole'
          - '^InfraReadonlyRole'
          - '^InfraAuditRole'
          - '^BreakglassAdminRole'
          - '^ApiHandlerServiceRole'
          - '^ConfigRecorderRole'
      - type: Custom::AWSCDKOpenIdConnectProvider
        count: 1
        logical_id_patterns:
          - '^GithubOidcProvider'
  - service: AWS Config
    selectors:
      - type: AWS::Config::ConfigurationRecorder
        count: 1
      - type: AWS::Config::DeliveryChannel
        count: 1
      - type: AWS::Config::ConfigRule
        count: 1
  - service: Amazon Cognito
    selectors:
      - type: AWS::Cognito::UserPool
        count: 1
      - type: AWS::Cognito::UserPoolClient
        count: 1
  - service: AWS WAF
    selectors:
      - type_prefix: 'AWS::WAFv2::'
        count: 0
```
- `task docs:infra:check` / `task docs:check` では、本定義を正本として `infra/test/fixtures/site` を入力に prod 条件の `cdk synth` を実行し、過不足を `reports/infra_resource_check.md` へ記録する。

## ロールバック方針
- docs/frontは直前の静的成果物へ戻す。
- apiは直前の安定版へ戻し、API契約互換を破らない版を選ぶ。
- infra設定変更は差分単位で戻し、CloudFront behavior順序と認証境界を最優先で復旧する。

## 品質ゲート
- 配備前に `docs:guard` を通過し、リンク・参照不整合を解消する。
- `BD-INF-DEP-005` の管理対象AWSリソース一覧と prod 条件の `cdk synth` 結果に過不足がないことを `task docs:infra:check` で確認する。
- infra配備は `lint` / `test` / `cdk synth` / `cdk diff` / `cdk-nag` を通過条件とする。
- 配備後は `/docs/` `/web/` `/openapi/` `/api/v1/ops/diagnostics/health` の到達を確認する。

## 受入基準
- 配備モード別の許可/不許可操作と再実行境界が明確であること。
- DDで手順や具体コマンドを確定する前提情報が揃っていること。

## 変更履歴
- 2026-03-07: `/web/*` のSPA fallback用CloudFront Function追加に合わせて管理対象AWSリソース一覧を同期 [[BD-SYS-ADR-044]]
- 2026-03-07: 管理対象AWSリソース一覧をprod `cdk synth` と自動照合できる比較定義へ更新し、主リソースの個数を現行IaCへ同期 [[BD-SYS-ADR-044]]
- 2026-02-28: API正本化に合わせて配備責務マップとロールバック記述の backend 表記を api へ更新 [[BD-SYS-ADR-036]]
- 2026-02-23: 必須設計項目をBD確定観点へ明確化し、DD引渡し/受入基準を追加 [[BD-SYS-ADR-036]]
- 2026-02-20: 章再編に合わせてコンピュート選定・スケーリング必須項目を追加 [[BD-SYS-ADR-036]]
- 2026-02-19: ヘルスチェック確認経路を `/api/v1/ops/diagnostics/health` へ統一 [[BD-SYS-ADR-034]]
- 2026-02-14: 配備モード（通常/初回/緊急）を定義し、配備責務を6分類（BE/FE/Infra/DB/Doc/TestAsset）へ拡張 [[BD-SYS-ADR-031]]
- 2026-02-13: CDK反映順序（`cdk diff` 先行、`cdk deploy` 後続）と品質ゲートを追加 [[BD-SYS-ADR-028]]
- 2026-02-13: 管理対象AWSサービス基準（サービス単位の個数/構築理由/導入段階/除外ルール）へ表記を統一 [[BD-SYS-ADR-028]]
- 2026-02-13: INF変更フローとの正本境界（承認統制は[[BD-INF-IAC-001]]正本）を明確化 [[BD-SYS-ADR-028]]
- 2026-02-11: AWSリソース一覧（個数/構築理由/根拠文書）を追加 [[BD-SYS-ADR-014]]
- 2026-02-11: 新規作成（領域分割型インフラデプロイ設計） [[BD-SYS-ADR-014]]
- 2026-02-11: ADR参照を配信経路境界の決定へ整理 [[BD-SYS-ADR-014]]
