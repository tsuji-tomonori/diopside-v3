---
id: BD-INF-DEP-005
title: インフラデプロイ設計（配信境界）
doc_type: デプロイ設計
phase: BD
version: 1.0.7
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-19'
up:
  - '[[RQ-FR-025]]'
  - '[[RQ-DEV-001]]'
related:
  - '[[BD-SYS-ADR-014]]'
  - '[[BD-SYS-ADR-028]]'
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

## 正本境界
- 本書は「配信境界に依存するデプロイ順序/確認ポイント」の正本とする。
- 承認フロー・変更統制・切戻しの承認条件は [[BD-INF-IAC-001]] を正本とし、本書では重複定義しない。
- 具体的なコマンド、pipeline条件、state管理は [[DD-INF-DEP-003]] と [[DD-INF-IAC-001]] を正本とする。

## 配備責務マップ
| 領域 | 主成果物 | 主経路 | 主失敗時の再実行 |
|---|---|---|---|
| BE | API実行バイナリ、運用API | `/api/v1/*` | backend build/test -> deploy |
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
| Amazon CloudFront | 1 Distribution | 画面・ドキュメント・OpenAPI・APIを単一配信境界で経路分離して運用するため。 | [[BD-INF-DEP-004]], [[BD-SYS-ARCH-003]] | Phase 1導入済 |
| Amazon S3 | 1 Bucket（静的配信オリジン） | 静的成果物（`web/`, `docs/`, `openapi/`）をプレフィックス分離で配置し、CloudFrontから配信するため。 | [[BD-INF-DEP-004]], [[BD-DEV-ENV-002]] | Phase 1導入済 |
| AWS Lambda | 3ワークロード（API/運用/配信関連） | API処理・運用処理・配信関連処理を同一実行基盤で運用するため。 | [[DD-APP-LOG-001]], [[BD-SYS-ARCH-003]] | Phase 2で拡張 |
| Amazon CloudWatch Logs | 3ログ系統 | Lambdaの構造化ログを集約し、30日保持で監視判定へ利用するため。 | [[BD-SYS-ADR-022]], [[DD-APP-LOG-001]], [[DD-INF-MON-002]] | Phase 1導入済 |
| AWS IAM | 3ロール（配備実行/運用参照/監査参照） | 最小権限で配備・運用参照・監査参照を分離するため。 | [[DD-INF-SEC-003]] | Phase 1導入済 |
| AWS Config | 1ルール（`required-tags`） | 必須タグ欠落を日次検知し、是正運用へ接続するため。 | [[BD-SYS-ADR-015]], [[DD-SYS-COST-001]] | Phase 1導入済 |
| Amazon Cognito | 1認証系統（JWT） | `/openapi/*` と `/api/v1/*` の認証境界を固定するため。 | [[BD-SYS-ADR-014]], [[BD-APP-API-004]] | Phase 2で拡張 |
| AWS WAF | 0（Phase 1） | Phase 1では未導入とし、単一CloudFront運用の拡張時に再評価するため。 | [[BD-INF-DEP-003]] | Phase 2で評価 |

※ 本表は運用上意図して管理するAWSサービスのみを対象とし、CDK内部生成リソース（`Custom::CDKBucketDeployment` 由来のLambda/Layerなど）は集計対象外とする。
※ 個数は本番環境の論理個数を記載。未固定事項は実装詳細（DD/IaC）で確定する。

## ロールバック方針
- docs/frontは直前の静的成果物へ戻す。
- backendは直前の安定版へ戻し、API契約互換を破らない版を選ぶ。
- infra設定変更は差分単位で戻し、CloudFront behavior順序と認証境界を最優先で復旧する。

## 品質ゲート
- 配備前に `docs:guard` を通過し、リンク・参照不整合を解消する。
- infra配備は `lint` / `test` / `cdk synth` / `cdk diff` / `cdk-nag` を通過条件とする。
- 配備後は `/docs/` `/web/` `/openapi/` `/api/v1/ops/diagnostics/health` の到達を確認する。

## 変更履歴
- 2026-02-19: ヘルスチェック確認経路を `/api/v1/ops/diagnostics/health` へ統一 [[BD-SYS-ADR-034]]
- 2026-02-14: 配備モード（通常/初回/緊急）を定義し、配備責務を6分類（BE/FE/Infra/DB/Doc/TestAsset）へ拡張 [[BD-SYS-ADR-031]]
- 2026-02-13: CDK反映順序（`cdk diff` 先行、`cdk deploy` 後続）と品質ゲートを追加 [[BD-SYS-ADR-028]]
- 2026-02-13: 管理対象AWSサービス基準（サービス単位の個数/構築理由/導入段階/除外ルール）へ表記を統一 [[BD-SYS-ADR-028]]
- 2026-02-13: INF変更フローとの正本境界（承認統制は[[BD-INF-IAC-001]]正本）を明確化 [[BD-SYS-ADR-028]]
- 2026-02-11: AWSリソース一覧（個数/構築理由/根拠文書）を追加 [[BD-SYS-ADR-014]]
- 2026-02-11: 新規作成（領域分割型インフラデプロイ設計） [[BD-SYS-ADR-014]]
- 2026-02-11: ADR参照を配信経路境界の決定へ整理 [[BD-SYS-ADR-014]]
