---
id: DD-INF-SEC-002
title: IAM詳細設計
doc_type: インフラ詳細
phase: DD
version: 1.0.6
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-23'
up:
- '[[BD-INF-SEC-001]]'
- '[[RQ-SEC-001-01]]'
related:
- '[[UT-POL-001]]'
- '[[AT-OPS-INF-001]]'
- '[[DD-INF-CFG-001]]'
- '[[BD-SYS-ADR-038]]'
- '[[RQ-RDR-049]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- ロール、権限境界、クロスアカウントアクセス条件を定義する。
- 特権ロールは利用期限と承認者を必須とする。

## ロール定義
| ロール | 主体 | 主権限 | 制約 |
|---|---|---|---|
| `infra-deploy-role` | CI/CD | IaC `cdk synth/diff/deploy`、CloudFront invalidation | 初回はローカル実行、以降はGitHub OIDCで引受 |
| `github-actions-docs-deploy-role` | GitHub Actions (`environment: prod`) | `task docs:deploy` 実行に必要な AWS 操作、CDK [[RQ-GL-007|bootstrap]] role 引受 | Trust条件 `aud=sts.amazonaws.com` かつ `sub=repo:tsuji-tomonori/diopside-v3:environment:prod` |
| `infra-readonly-role` | 運用監視 | CloudWatch/Config/CloudTrail参照 | 書き込み権限禁止 |
| `breakglass-admin-role` | 障害一次対応 | 期間限定の管理操作 | 60分で自動失効、二重承認必須 |

## 権限境界
- 全ロールに permission boundary を適用し、`iam:*`, `kms:ScheduleKeyDeletion`, `s3:DeleteBucket` をデフォルト拒否する。
- wildcard権限（`*`）は `Action`/`Resource` ともに原則禁止し、`github-actions-docs-deploy-role` の初期導入例外はADRで根拠と縮退計画を管理する。
- クロスアカウント許可は `Principal` 固定 + `ExternalId` 必須 + `Condition` でIP/時間帯制約を設定する。
- 作成時タグ条件では `aws:RequestTag/Description` を必須とし、説明欠落の作成APIを拒否する。

## OIDC信頼条件
- OIDC Provider は `https://token.actions.githubusercontent.com` を使用し、Audience は `sts.amazonaws.com` のみに固定する。
- `sub` 条件は `repo:tsuji-tomonori/diopside-v3:environment:prod` を固定し、別repo/別環境からの引受を拒否する。
- GitHub Environment `prod` は `main` ブランチのみ許可し、無承認の任意ブランチ配備を禁止する。

## Secrets/KMS運用
- 機密値は Secrets Manager 管理とし、参照は `GetSecretValue` のみに限定する。
- KMSキーは年1回ローテーションを必須化し、鍵ポリシー変更は二重承認とする。
- 平文シークレットのCIログ出力を禁止し、検出時は当日中に失効・再発行する。
- OpenCode/Codex OAuthトークンはGitHub Secretsへbase64で保持し、ジョブ実行時のみ `~/.opencode/auth/openai.json` へ復元する。
- OAuthトークン復元ステップは `chmod 600` を適用し、ジョブログへ内容を出力しない。

## 昇格条件
- 特権昇格は障害対応または緊急復旧時のみ許可し、開始時にチケットIDを必須入力する。
- 昇格セッション終了後10分以内に操作レビューを実施し、逸脱操作を監査記録へ残す。

## 監査要件
- 主要操作は監査ログへ `actor`, `role`, `resource`, `result` を記録する。
- Issueラベル起動の自動実行は `issue_number`, `label`, `actor`, `run_id`, `pull_request` を監査証跡へ残す。

## 変更履歴
- 2026-02-23: OpenCode/Codex OAuthトークンの復元運用とIssueラベル実行の監査項目を追加 [[BD-SYS-ADR-039]]
- 2026-02-21: `Description` タグの作成時必須条件を権限境界へ追加
- 2026-02-21: GitHub OIDC AssumeRole（`github-actions-docs-deploy-role`）の信頼条件と初期導入例外の管理方針を追加 [[BD-SYS-ADR-038]]
- 2026-02-21: DD-INF章再編に合わせて `70.統制と監査(GOV)` へ移設し、Config統制文書との関連を追加 [[BD-SYS-ADR-036]]
- 2026-02-13: `infra-deploy-role` の主権限をCDK標準操作（synth/diff/deploy）へ更新
- 2026-02-13: ロール一覧・権限境界・Secrets/KMS運用・特権昇格条件を具体化
- 2026-02-13: 新規作成
