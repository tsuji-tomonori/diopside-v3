---
id: AT-REL-001
title: 配信手順書 001
doc_type: 配信手順書
phase: AT
version: 1.0.12
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-21'
up:
- '[[BD-DEV-TEST-001]]'
- '[[IT-PLAN-001]]'
related:
- '[[AT-GO-001]]'
- '[[BD-INF-DEP-003]]'
- '[[BD-INF-DEP-004]]'
- '[[DD-INF-DEP-001]]'
- '[[AT-RUN-001]]'
tags:
- diopside
- AT
- REL
---


## 運用目的
- ローカルでは `task docs:deploy`、GitHub Actions では `task docs:deploy:ci` を用いた公開手順を標準化し、反映確認までの再現性を担保する。

## 前提条件
- 初回のみローカルAWS認証情報（`CDK_DEFAULT_ACCOUNT` / `CDK_DEFAULT_REGION`）で `task infra:deploy` を実行し、OIDC Provider/Assume先ロールを作成済みである。
- GitHub Environment `prod` に `AWS_ROLE_ARN` と `AWS_REGION` を設定済みである。
- `docs/` 更新内容がコミット可能状態である。
- `quartz/` と `infra/` が同一リポジトリ配下に存在する。

## GitHub Environment `prod` 設定手順
1. GitHubリポジトリの `Settings -> Environments` で `prod` を作成する。
2. `prod` の Variables へ `AWS_REGION=ap-northeast-1` を追加する。
3. 初回の `task infra:deploy` 完了後、Stack Output `GithubActionsDeployRoleArn` を取得し、`prod` の Variables へ `AWS_ROLE_ARN=<Output値>` を追加する。
4. 公開サイトURLが確定している場合は `DOCS_SITE_URL=https://<docs-domain>` を追加する（未設定時はHTTP確認をスキップ）。
5. `prod` の保護ルールで `main` ブランチのみ実行対象にする（必要時は承認者を設定する）。
6. `Actions -> Docs Deploy` を `workflow_dispatch` で1回実行し、`Validate required variables` と `Verify assumed identity` が成功することを確認する。

## 配信手順
1. 初回導入時のみローカルで `task infra:deploy` を実行し、OIDC Provider/Assume先ロールを作成する。
2. Stack Output `GithubActionsDeployRoleArn` を GitHub Environment `prod` の `AWS_ROLE_ARN` へ設定する。
3. GitHub Actions `Docs Deploy` を `workflow_dispatch` で実行し、`Validate required variables` の成功を確認する。
4. `Setup Node` が `22` で実行され、`Reset Quartz workspace` が成功することを確認する。
5. `Configure AWS credentials (OIDC)` と `aws sts get-caller-identity` が成功することを確認する。
6. `task docs:deploy:ci` 実行ログで `docs:guard -> infra:deploy:ci -> docs:verify` が完了することを確認する。
7. `task quartz:prepare` が不整合ディレクトリを検知した場合に再cloneし、`task quartz:build:ci` が `quartz/public` を生成することを確認する。
8. `task infra:deploy` が `siteAssetPath=quartz/public` を参照してS3配置とCloudFront invalidationを完了することを確認する。
9. `'/'` と `'/docs/'` へアクセスし、同一の公開トップ（[[index]]）へ到達することを確認する。
10. 更新差分（変更した文書）が公開サイトに反映されていることを確認する。
11. 通常運用では `main` へのpushまたは `workflow_dispatch` で同手順を反復する。
12. Phase 2適用後は [[BD-INF-DEP-004]] / [[DD-INF-DEP-002]] に従い、`'/web/*'`, `'/openapi/*'`, `'/api/v1/*'` の経路確認を追加する。

## 設定不備時の確認手順
1. `Missing variable: AWS_ROLE_ARN` が出る場合は Environment `prod` の Variables 名/値を再確認する。
2. `Missing variable: AWS_REGION` が出る場合は `AWS_REGION=ap-northeast-1` を設定する。
3. OIDC Assume失敗時は `AWS_ROLE_ARN`、Trust条件（`aud=sts.amazonaws.com`, `sub=repo:tsuji-tomonori/diopside-v3:environment:prod`）、Jobの `environment: prod` の一致を確認する。
4. `docs:verify` 失敗時は `DOCS_SITE_URL` の値と公開URLの到達性を確認する。

## 判定基準
- 公開手順が単一コマンドで完了し、配信サイトに更新内容が反映される。
- `siteAssetPath` 解決先とS3配置先に不整合がない。
- GitHub Actions 側で OIDC Assume が成功し、長期アクセスキーを使用せずに配備できる。
- Phase 1では `'/'` と `'/docs/*'` の到達性が維持される。
- Phase 2では `'/web/*'`, `'/docs/*'`, `'/openapi/*'`, `'/api/v1/*'` の経路境界が維持される。
- 異常時は [[AT-RUN-001]] の切り分け手順で復旧できる。

## 章構成上の位置づけ
- 本書は「7.運用・リリース(OPS_REL)」配下のRunbookとして管理する。
- 受入判定では [[AT-PLAN-001]] / [[AT-GO-001]] から本書を参照し、証跡は [[AT-RPT-001]] に集約する。

## 変更履歴
- 2026-02-21: Node 22固定とQuartzワークスペース初期化/自己修復をCI手順へ追加
- 2026-02-21: GitHub Actions 実行を `task docs:deploy:ci`（直列実行）へ更新し、CI向け手順を明確化
- 2026-02-21: GitHub Actions の Environment variables 設定手順と設定不備時の確認手順を追加
- 2026-02-21: 初回ローカル配備後に GitHub OIDC AssumeRole へ移行する運用手順と判定基準を追加
- 2026-02-20: テスト章再編に合わせて「7.運用・リリース(OPS_REL)」へ移設し、AT判定からの参照位置づけを明記
- 2026-02-11: 公開トップ参照を [[RQ-HM-001]] から [[index]] へ変更
- 2026-02-11: Phase 1（docs先行公開）基準へ手順を修正し、`/` と `/docs/` の到達確認を明記
- 2026-02-11: 単一CloudFrontパス分岐（`/web` `/docs` `/openapi` `/api/v1`）の配信確認手順を追加
- 2026-02-11: Quartz + CDK 公開手順（`task docs:deploy`、配備確認、反映確認）を追加
- 2026-02-10: 新規作成
