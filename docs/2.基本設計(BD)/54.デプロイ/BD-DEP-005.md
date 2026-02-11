---
id: BD-DEP-005
title: インフラデプロイ設計（配信境界）
doc_type: デプロイ設計
phase: BD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
  - '[[RQ-FR-025]]'
  - '[[RQ-DEV-001]]'
related:
  - '[[BD-ADR-014]]'
  - '[[BD-DEP-004]]'
  - '[[DD-DEP-003]]'
  - '[[AT-REL-001]]'
  - '[[AT-RUN-001]]'
tags:
  - diopside
  - BD
  - DEP
---

## 目的
- インフラ配備の責務を docs/front/backend/infra の4領域で分離し、障害時の再実行範囲を限定する。

## 配備責務マップ
| 領域 | 主成果物 | 主経路 | 主失敗時の再実行 |
|---|---|---|---|
| docs | Quartz静的成果物 | `/docs/*` | `task quartz:build` -> `task infra:deploy` |
| front | SPA静的成果物 | `/web/*` | front build -> `task infra:deploy` |
| backend | API実行バイナリ | `/api/v1/*` | backend deploy |
| infra | CloudFront/S3/配備設定 | 全経路 | `task infra:deploy` |

## 実行方針
- 標準入口は `task docs:deploy` を維持し、内部で領域別タスクへ分岐する。
- CloudFront behavior順序は `/api/*` -> `/openapi/*` -> `/docs/*` -> `/web/*` -> `/*` を固定する。
- invalidationは経路別（`/docs/*` `/web/*` `/openapi/*`）で実施し、`/*` は緊急時のみ許可する。

## AWSリソース一覧
| リソース名 | 個数（設計上） | 構築理由 | 根拠文書 |
|---|---:|---|---|
| CloudFront Distribution | 1 | 画面・ドキュメント・OpenAPI・APIを単一配信境界で経路分離して運用するため。 | [[BD-DEP-004]], [[BD-ARCH-006]] |
| S3 Bucket（静的配信オリジン） | 1 | 静的成果物（`web/`, `docs/`, `openapi/`）をプレフィックス分離で配置し、CloudFrontから配信するため。 | [[BD-DEP-004]], [[BD-ENV-002]] |
| CloudFront OAC | 1 | S3を非公開に保ち、CloudFront経由のみで配信するため。 | [[BD-ADR-013]], [[BD-ENV-002]] |
| CloudFront Function（URL rewrite） | 1 | pretty URL補完と公開トップ解決を一貫させるため。 | [[BD-DEP-003]], [[DD-DEP-003]] |
| Lambda（Backend API/運用/配信関連） | 3系統 | API処理・運用処理・配信関連処理を同一実行基盤で運用するため。 | [[DD-LOG-001]], [[BD-ARCH-006]] |
| CloudWatch Logs | 3系統 | Lambdaの構造化ログを集約し、30日保持で監視判定へ利用するため。 | [[BD-ADR-022]], [[DD-LOG-001]], [[DD-LOG-002]] |
| IAMロール（配備実行/運用参照/監査参照） | 3 | 最小権限で配備・運用参照・監査参照を分離するため。 | [[DD-SEC-002]] |
| AWS Config `required-tags` | 1ルール | 必須タグ欠落を日次検知し、是正運用へ接続するため。 | [[BD-ADR-015]], [[DD-COST-001]] |
| Cognito JWT認証基盤 | 1系統 | `/openapi/*` と `/api/v1/*` の認証境界を固定するため。 | [[BD-ADR-014]], [[BD-API-004]] |
| WAF | 0（Phase 1） | Phase 1では未導入とし、単一CloudFront運用の拡張時に再評価するため。 | [[BD-DEP-003]] |

※ 個数は本番環境の論理個数を記載。未固定事項は実装詳細（DD/IaC）で確定する。

## ロールバック方針
- docs/frontは直前の静的成果物へ戻す。
- backendは直前の安定版へ戻し、API契約互換を破らない版を選ぶ。
- infra設定変更は差分単位で戻し、CloudFront behavior順序と認証境界を最優先で復旧する。

## 品質ゲート
- 配備前に `docs:guard` を通過し、リンク・参照不整合を解消する。
- infra配備は `lint` / `test` / `cdk synth` / `cdk-nag` を通過条件とする。
- 配備後は `/docs/` `/web/` `/openapi/` `/api/v1/health` の到達を確認する。

## 変更履歴
- 2026-02-11: AWSリソース一覧（個数/構築理由/根拠文書）を追加 [[BD-ADR-014]]
- 2026-02-11: 新規作成（領域分割型インフラデプロイ設計） [[BD-ADR-014]]
- 2026-02-11: ADR参照を配信経路境界の決定へ整理 [[BD-ADR-014]]
