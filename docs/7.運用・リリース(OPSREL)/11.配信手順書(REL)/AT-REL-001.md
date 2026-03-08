---
id: AT-REL-001
title: 配信手順書 001
doc_type: 配信手順書
phase: AT
version: 1.0.16
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-03-08'
up:
- '[[BD-DEV-TEST-001]]'
- '[[IT-PLAN-001]]'
related:
- '[[AT-GO-001]]'
- '[[BD-INF-DEP-003]]'
- '[[BD-INF-DEP-004]]'
- '[[DD-INF-DEP-001]]'
- '[[AT-RUN-001]]'
- '[[AT-REL-002]]'
- '[[RQ-DEV-006-01]]'
- '[[RQ-RDR-050]]'
- '[[BD-SYS-ADR-039]]'
tags:
- diopside
- AT
- REL
---


## 運用目的
- ローカルでは `task delivery:apply`、GitHub Actions では `task delivery:apply:ci` を用いた公開手順を標準化し、反映確認までの再現性を担保する。
- 各ブランチ push では品質ゲートを先行実行し、`main` 反映時は `Production Delivery` で本番配備とPDF生成を自動実行する。

## 前提条件
- 初回のみローカルAWS認証情報（`CDK_DEFAULT_ACCOUNT` / `CDK_DEFAULT_REGION`）で `task infra:deploy` を実行し、OIDC Provider/Assume先ロールを作成済みである。
- GitHub Environment `delivery-prod` に `AWS_ROLE_ARN` と `AWS_REGION` を設定済みである。
- `docs/` 更新内容がコミット可能状態である。
- `quartz/` と `infra/` が同一リポジトリ配下に存在する。

## ブランチプロテクション `main` 設定手順
1. GitHubリポジトリの `Settings -> Branches` で `main` への branch protection rule を作成する。
2. `Require a pull request before merging` を有効化し、`Required approvals=1` を設定する。
3. `Dismiss stale pull request approvals when new commits are pushed` を有効化する。
4. `Require status checks to pass before merging` を有効化し、`Require branches to be up to date before merging` を有効化する。
5. 必須チェックへ `ci-docs`、`ci-platform`、`ci-api` を追加する。
6. `Require conversation resolution before merging` を有効化する。
7. `Allow force pushes` と `Allow deletions` は無効のまま維持する。

## GitHub Environment `delivery-prod` 設定手順
1. GitHubリポジトリの `Settings -> Environments` で `delivery-prod` を作成する。
2. `delivery-prod` の `Deployment branches` は `main` のみに制限する。
3. `delivery-prod` の `Required reviewers` を1名以上設定し、本番配信承認を必須化する。
4. `delivery-prod` の Variables へ `AWS_REGION=ap-northeast-1` を追加する。
5. 初回の `task infra:deploy` 完了後、Stack Output `GithubActionsDeployRoleArn` を取得し、`delivery-prod` の Variables へ `AWS_ROLE_ARN=<Output値>` を追加する。
6. 公開サイトURLが確定している場合は `DOCS_SITE_URL=https://<docs-domain>` を追加する（未設定時はHTTP確認をスキップ）。
7. `Actions -> Production Delivery` を `workflow_dispatch` で1回実行し、`Validate required variables` と `Verify assumed identity` が成功することを確認する。

## 配信手順
1. 各ブランチで変更を push し、GitHub Actions `CI Docs` / `CI Platform` / `CI API` が起動することを確認する。
2. Pull Request を作成し、`main` の branch protection により `ci-docs` / `ci-platform` / `ci-api` の完了前はマージできないことを確認する。
3. 初回導入時のみローカルで `task infra:deploy` を実行し、OIDC Provider/Assume先ロールを作成する。
4. Stack Output `GithubActionsDeployRoleArn` を GitHub Environment `delivery-prod` の `AWS_ROLE_ARN` へ設定する。
5. `main` へマージ後、GitHub Actions `Production Delivery` が自動起動することを確認する。
6. `apply-delivery` job で `Setup Node` が `22` で実行され、`Reset Quartz workspace` が成功することを確認する。
7. `Configure AWS credentials (OIDC)` と `aws sts get-caller-identity` が成功することを確認する。
8. `task delivery:apply:ci` 実行ログで `docs:guard -> infra:deploy:ci -> docs:verify` が完了することを確認する。
9. `task quartz:prepare` が不整合ディレクトリを検知した場合に再cloneし、`task quartz:build:ci` が `quartz/public` を生成することを確認する。
10. `task infra:deploy` が `siteAssetPath=quartz/public` を参照してS3配置とCloudFront invalidationを完了することを確認する。
11. `build-docs-pdf` job が `diopside-docs-{branch}-{shortsha}.zip` を生成し、90日保持のArtifactとして参照できることを確認する。
12. `'/'` と `'/docs/'` へアクセスし、同一の公開トップ（[[index]]）へ到達することを確認する。
13. 更新差分（変更した文書）が公開サイトに反映されていることを確認する。
14. 通常運用では `main` へのマージまたは `workflow_dispatch` で同手順を反復する。
15. Phase 2適用後は [[BD-INF-DEP-004]] / [[DD-INF-DEP-002]] に従い、`'/web/*'`, `'/openapi/*'`, `'/api/v1/*'` の経路確認を追加する。

## Issueラベル起動（OpenCode）運用手順
1. [[RQ-SH-001|管理者]]が対象Issueへ `opencode/run` ラベルを付与する。
2. `opencode-codex-issue.yml` が `issues:labeled`（補助で `issues:assigned`）で起動し、`label/assignee一致` と `github.actor allowlist` の二重条件を判定する。
3. OAuthトークン登録/更新は [[AT-REL-002]] に従い、Environment `opencode` の Secret `OPENCODE_OPENAI_OAUTH_JSON_B64` を正本として管理する。
4. ジョブが OAuthトークンを `~/.opencode/auth/openai.json` へ復元し、OpenCodeを `share=false` で実行する。
5. 実行ログから `issue_number`、実行者、付与ラベル、作成PR番号を確認し、Issueへ結果コメントを記録する。
6. 失敗時はラベルを外して再試行し、反復失敗時は [[AT-RUN-001]] に従って自動実行を停止する。

## 設定不備時の確認手順
1. `Missing variable: AWS_ROLE_ARN` が出る場合は Environment `delivery-prod` の Variables 名/値を再確認する。
2. `Missing variable: AWS_REGION` が出る場合は `AWS_REGION=ap-northeast-1` を設定する。
3. OIDC Assume失敗時は `AWS_ROLE_ARN`、Trust条件（`aud=sts.amazonaws.com`, `sub=repo:tsuji-tomonori/diopside-v3:environment:delivery-prod`）、Jobの `environment: delivery-prod` の一致を確認する。
4. `docs:verify` 失敗時は `DOCS_SITE_URL` の値と公開URLの到達性を確認する。

## 判定基準
- 公開手順が単一コマンドで完了し、配信サイトに更新内容が反映される。
- `siteAssetPath` 解決先とS3配置先に不整合がない。
- GitHub Actions 側で OIDC Assume が成功し、長期アクセスキーを使用せずに配備できる。
- `main` の branch protection と GitHub Environment `delivery-prod` の承認ゲート/`concurrency` 制御が有効な実行履歴を確認できる。
- Phase 1では `'/'` と `'/docs/*'` の到達性が維持される。
- Phase 2では `'/web/*'`, `'/docs/*'`, `'/openapi/*'`, `'/api/v1/*'` の経路境界が維持される。
- 異常時は [[AT-RUN-001]] の切り分け手順で復旧できる。
- `main` 反映時にPDF Artifactが生成され、配信証跡として参照できる。
- Issueラベル起動時に、許可ユーザー以外のラベル付与ではジョブが実行されない。
- Issueラベル起動時に、`issue_number`/実行者/ラベル/PR番号の証跡が残る。

## 章構成上の位置づけ
- 本書は「7.運用・リリース(OPSREL)」配下のRunbookとして管理する。
- OpenCode OAuthシークレットの登録/更新手順は [[AT-REL-002]] を正本とし、本書はIssueラベル起動運用の入口として扱う。
- 受入判定では [[AT-PLAN-001]] / [[AT-GO-001]] から本書を参照し、証跡は [[AT-RPT-001]] に集約する。

## 変更履歴
- 2026-03-08: `main` branch protection、Environment `delivery-prod`、`Production Delivery`、`task delivery:apply(:ci)`、main反映時PDF生成を追加 [[RQ-RDR-050]]
- 2026-02-23: OpenCode OAuthシークレット管理を [[AT-REL-002]] へ分離し、Environment `opencode` を参照する運用へ更新 [[RQ-RDR-050]]
- 2026-02-23: `opencode-codex-issue.yml` へ名称同期し、`issues:assigned` 補助入口を運用手順へ追記 [[RQ-RDR-050]]
- 2026-02-23: Issueラベル起動の運用手順（allowlist判定、OAuth復元、証跡確認）を追加 [[RQ-RDR-050]]
- 2026-02-21: GitHub Actions要件追加に合わせ、Environment承認とconcurrency確認を判定基準へ追記 [[RQ-RDR-050]]
- 2026-02-21: Node 22固定とQuartzワークスペース初期化/自己修復をCI手順へ追加
- 2026-02-21: GitHub Actions 実行を `task docs:deploy:ci`（直列実行）へ更新し、CI向け手順を明確化
- 2026-02-21: GitHub Actions の Environment variables 設定手順と設定不備時の確認手順を追加
- 2026-02-21: 初回ローカル配備後に GitHub OIDC AssumeRole へ移行する運用手順と判定基準を追加
- 2026-02-20: テスト章再編に合わせて「7.運用・リリース(OPSREL)」へ移設し、AT判定からの参照位置づけを明記
- 2026-02-11: 公開トップ参照を旧仕様から [[index]] へ変更
- 2026-02-11: Phase 1（docs先行公開）基準へ手順を修正し、`/` と `/docs/` の到達確認を明記
- 2026-02-11: 単一CloudFrontパス分岐（`/web` `/docs` `/openapi` `/api/v1`）の配信確認手順を追加
- 2026-02-11: Quartz + CDK 公開手順（`task docs:deploy`、配備確認、反映確認）を追加
- 2026-02-10: 新規作成
