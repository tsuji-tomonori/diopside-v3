---
id: DD-INF-IAC-002
title: IaCモジュール設計
doc_type: インフラ詳細
phase: DD
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-21'
up:
- '[[BD-INF-IAC-001]]'
related:
- '[[DD-INF-IAC-003]]'
- '[[UT-IAC-001]]'
- '[[UT-POL-001]]'
- '[[RQ-DEV-001-01]]'
- '[[RQ-RDR-049]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- IaCは環境共通モジュールと環境別スタックに分離する。
- モジュールI/Oは型定義し、暗黙依存を禁止する。
- 説明設定可能なリソースは `description/comment` をモジュール入力または定数として必須化し、空欄を禁止する。

## 章構成
1. モジュール分割
2. リソース別設定責務
3. 差分レビュー観点

## 1. モジュール分割
- 命名規則: `<domain>-<resource>-<env>`。
- IaC管理方式はCDKのみを採用し、Terraform定義を追加しない。
- 変更は `cdk diff` 出力をレビュー証跡として保存する。

## 2. リソース別設定責務
| リソース | 主設定値 | 定義場所 | 根拠 |
|---|---|---|---|
| VPC/Subnet/Route | CIDR、サブネット分割、ルート | `network-stack` | [[DD-INF-NET-001]] の具体値をCDKで再現し、環境差分を明示管理するため。 |
| Security Group/NACL | ingress/egress、denyルール | `network-stack` | 最小到達性と出口制御をIaCで固定し、手動逸脱を防ぐため。 |
| IAM Roles/Boundary | ロール名、権限境界、条件句 | `iam-stack` | [[DD-INF-SEC-002]] の最小権限要件をコード化し、監査可能性を担保するため。 |
| Logs/Alarm | 保持日数、閾値、通知先 | `observability-stack` | [[DD-INF-MON-001]] の監視閾値をデプロイと同一ライフサイクルで管理するため。 |
| Deployment Pipeline | 承認ゲート、artifact ID | `cicd-stack` | [[DD-INF-IAC-001]] の破壊的変更制御を自動実施するため。 |

## 3. 差分レビュー観点
- `network-stack`: CIDR/route/SG/NACL変更がある場合は破壊的変更判定を必須化する。
- `iam-stack`: `Action`/`Resource` の wildcard混入を拒否する。
- `observability-stack`: CRITICAL閾値や通知先変更は運用承認を必須化する。
- `cicd-stack`: 承認者分離（承認者と実行者の兼任禁止）を維持する。
- 全モジュール共通: 説明設定可能なリソースで `description/comment` 欠落差分を拒否する。

## 変更履歴
- 2026-02-21: `description/comment` 必須化ルールと差分レビュー観点を追加
- 2026-02-13: リソース別設定責務（network/iam/observability/cicd）と差分レビュー観点を追加
- 2026-02-13: CDKオンリー方針と `cdk diff` 証跡ルールを追加
- 2026-02-13: 設計別RTMの根拠追跡を補強するため、[[RQ-DEV-001-01]] を関連へ追加 [[BD-SYS-ADR-028]]
- 2026-02-13: 新規作成
