---
id: DD-INF-DEP-001
title: デプロイ詳細
doc_type: デプロイ詳細
phase: DD
version: 1.0.14
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-23'
up:
- '[[BD-INF-DEP-003]]'
- '[[BD-SYS-ADR-013]]'
- '[[BD-SYS-ADR-016]]'
- '[[BD-SYS-ADR-037]]'
- '[[BD-SYS-ADR-038]]'
related:
- '[[RQ-FR-024]]'
- '[[RQ-RDR-029]]'
- '[[AT-REL-001]]'
- '[[AT-RUN-001]]'
- '[[DD-INF-CF-001]]'
- '[[DD-INF-S3-001]]'
- '[[DD-INF-SEC-002]]'
- '[[RQ-RDR-050]]'
- '[[BD-SYS-ADR-039]]'
tags:
- diopside
- DD
- DEP
---


## 詳細仕様
- CloudFront/S3の設定値（Behavior/OAC/prefix/暗号化）は [[DD-INF-CF-001]] / [[DD-INF-S3-001]] を正本とし、本書は配備フローを正本とする。
- 公開実行は `task docs:deploy` を起点に `docs -> infra -> quartz/infra build -> cdk deploy` の順で実行する。
- Quartz成果物は `npx quartz build -d ../docs` の出力 `quartz/public` を正本とする。
- CDK実行時は `--context siteAssetPath=<repo>/quartz/public` を必須指定し、明示値が未指定の場合は `../../quartz/public` を既定値として解決する。
- 配信配置先は S3 `obsidian/` プレフィックス固定とし、CloudFront Distribution（OAC）経由で配信する。
- URL書き換えはCloudFront Function（`pretty-url-rewrite.js`）で行い、`/` と `/docs/` は `index.html`、`/path/` は `index.html`、拡張子なしは `.html` 補完とする。
- CDK合成は副作用ゼロを前提とし、Construct/Stack内部での `process.env` 直接参照を禁止する。
- `fromLookup` 等で更新された `cdk.context.json` は差分レビュー対象とし、未コミット状態を許容しない。
- statefulリソースを含む場合はStackを分離し、論理ID変更の有無をレビュー記録へ残す。

## Task定義（設計）
- `docs:deploy`
  - 役割: 公開一括実行（標準入口）
  - 手順: `docs:guard` -> `quartz:build` -> `infra:build` -> `infra:deploy` -> `docs:verify`
- `docs:deploy:ci`
  - 役割: CI向け公開一括実行（直列実行）
  - 手順: `docs:guard` -> `infra:deploy:ci` -> `docs:verify`
- `quartz:build`
  - 役割: 文書ビルド
  - 実行: `npx quartz build -d ../docs`
- `quartz:build:ci`
  - 役割: CIでのQuartz直列ビルド
  - 実行: `task quartz:prepare` -> `npm ci`（lock未検出時は `npm install`）-> `quartz:sync-config` 相当コピー -> `npx quartz build -d ../docs`
- `infra:deploy`
  - 役割: CDK配備とinvalidation
  - 実行: `npm run deploy -- --context siteAssetPath=<repo>/quartz/public`
- `infra:deploy:ci`
  - 役割: CIでのCDK直列配備
  - 実行: `task quartz:build:ci` -> `npm ci` -> `npm run build` -> `npm run deploy -- --context siteAssetPath=<repo>/quartz/public`
- `docs:verify`
  - 役割: 公開反映確認
  - 確認: `/docs/` 到達、更新差分、主要リンク導線

## Workflow定義（設計）
- `docs-link-check.yml`
  - docs変更時に `auto_link_glossary --check` と `validate_vault --targets` を実行する。
- `docs-pdf.yml`
  - docs markdown / `scripts/docs_pdf/**` / `Taskfile.yaml` / workflow変更時に起動する。
  - `task docs:pdf` 実行後、`diopside-docs-{branch}-{shortsha}.pdf` を生成し、Artifact名 `diopside-docs-{branch}-{shortsha}.zip` としてアップロードする。
  - `branch` は `github.ref_name` を使用し、`/` と空白を `-` へ置換して `A-Za-z0-9._-` のみ許可する。
- `release-docs-pdf.yml`
  - Release `published` で起動し、`task docs:pdf` 後にRelease AssetへPDFを添付する。
  - 配布名は `diopside-docs-{branch}-{shortsha}.pdf` とし、`branch` は `github.event.release.target_commitish` を同一規則で正規化する。
  - `gh release upload ... --clobber` で同名Assetを上書きする。
- `docs-deploy.yml`
  - `workflow_dispatch` と `push(main)` で起動し、変更パスは `docs/**`, `infra/**`, `config/quartz/**`, `Taskfile.yaml`, workflow自身に限定する。
  - `environment: prod` で実行し、`concurrency: docs-deploy-prod` で直列化する。
  - `permissions` は `id-token: write` / `contents: read` を最小構成で付与する。
  - `aws-actions/configure-aws-credentials@v6` を使用し、`AWS_ROLE_ARN` + `AWS_REGION` で OIDC Assume を実行する。
  - Assume直後に `aws sts get-caller-identity` を実行し、誤アカウント配備を検知する。
  - 実行順: `task docs:deploy:ci`（`docs:guard` -> `infra:deploy:ci` -> `docs:verify`）
- `opencode-issue.yml`
  - `issues:labeled` で起動し、許可ラベル（例: `opencode/run`）と実行者allowlistを `if` 条件で二重判定する。
  - `concurrency: opencode-issue-${issue_number}` を設定し、同一Issueの多重実行を防止する。
  - `permissions` は `contents: write` / `pull-requests: write` / `issues: write` の最小構成とする。
  - 実行前に `OPENCODE_OPENAI_OAUTH_JSON_B64` を `~/.opencode/auth/openai.json` へ復元し、`chmod 600` を適用する。
  - OpenCode実行は `share: false` を既定とし、Issue本文を未信頼入力として扱うセキュリティプロンプトを必須化する。

## GitHub Actions パラメータ・設定値（`docs-deploy.yml`）
| 区分 | パラメータ | 設定値/形式 | 必須 | 設定元 | 目的 |
|---|---|---|---|---|---|
| Trigger | `on.workflow_dispatch` | 有効 | Yes | workflow定義 | 手動配備を許可するため。 |
| Trigger | `on.push.branches` | `main` | Yes | workflow定義 | 本番配備ブランチを固定するため。 |
| Trigger | `on.push.paths` | `docs/**`, `infra/**`, `config/quartz/**`, `Taskfile.yaml`, `.github/workflows/docs-deploy.yml` | Yes | workflow定義 | 不要な起動を防ぐため。 |
| Job | `runs-on` | `ubuntu-latest` | Yes | workflow定義 | 実行環境を統一するため。 |
| Job | `timeout-minutes` | `45` | Yes | workflow定義 | ハング時の長時間実行を防ぐため。 |
| Job | `environment` | `prod` | Yes | workflow定義 | Environment保護ルールを適用するため。 |
| Control | `concurrency.group` | `docs-deploy-prod` | Yes | workflow定義 | 同時配備を禁止するため。 |
| Permission | `permissions.id-token` | `write` | Yes | workflow定義 | OIDCでトークン発行するため。 |
| Permission | `permissions.contents` | `read` | Yes | workflow定義 | リポジトリ読取を許可するため。 |
| Env var | `AWS_ROLE_ARN` | ARN文字列（例: `arn:aws:iam::<account-id>:role/GithubActionsDeployRole`） | Yes | GitHub Environment `prod` variables | Assume先ロールを指定するため。 |
| Env var | `AWS_REGION` | `ap-northeast-1`（運用標準） | Yes | GitHub Environment `prod` variables | AWS API実行リージョンを固定するため。 |
| Env var | `DOCS_SITE_URL` | `https://<docs-domain>` | No | GitHub Environment `prod` variables | `task docs:verify` のHTTP確認先を指定するため。 |
| Step | `actions/checkout` | `@v4` (`fetch-depth: 0`) | Yes | workflow定義 | 差分判定に必要な履歴を取得するため。 |
| Step | `go-task/setup-task` | `@v1` | Yes | workflow定義 | `task docs:deploy:ci` 実行のため。 |
| Step | `actions/setup-python` | `@v5` (`python-version: 3.11`) | Yes | workflow定義 | docs検証スクリプトの実行環境を固定するため。 |
| Step | `actions/setup-node` | `@v4` (`node-version: 22`) | Yes | workflow定義 | Quartzのengine要件を満たした実行環境を固定するため。 |
| Step | `Reset Quartz workspace` | `rm -rf quartz` | Yes | workflow定義 | 途中失敗で残った不整合作業ツリーを除去するため。 |
| Step | `aws-actions/configure-aws-credentials` | `@v6` (`role-to-assume: ${{ vars.AWS_ROLE_ARN }}`, `aws-region: ${{ env.AWS_REGION }}`) | Yes | workflow定義 | 長期アクセスキーを使わず配備するため。 |
| Verify | `aws sts get-caller-identity` | 0終了コード | Yes | workflow定義 | 誤アカウント配備を検知するため。 |
| Deploy | 実行コマンド | `task docs:deploy:ci` | Yes | workflow定義 | docs検証から配備までを一括実行するため。 |

## GitHub Actions パラメータ・設定値（`opencode-issue.yml`）
| 区分 | パラメータ | 設定値/形式 | 必須 | 設定元 | 目的 |
|---|---|---|---|---|---|
| Trigger | `on.issues.types` | `labeled` | Yes | workflow定義 | Issueラベル起点で自動実行するため。 |
| Gate | `if.label` | `github.event.label.name == 'opencode/run'` | Yes | workflow定義 | 許可ラベルのみ実行するため。 |
| Gate | `if.actor` | allowlist（`github.actor`） | Yes | workflow定義 | 許可ユーザー以外の実行を防ぐため。 |
| Control | `concurrency.group` | `opencode-issue-${{ github.event.issue.number }}` | Yes | workflow定義 | 同一Issueの多重実行を防ぐため。 |
| Permission | `permissions.contents` | `write` | Yes | workflow定義 | 修正ブランチ反映とPR差分作成のため。 |
| Permission | `permissions.pull-requests` | `write` | Yes | workflow定義 | PR作成/更新のため。 |
| Permission | `permissions.issues` | `write` | Yes | workflow定義 | 実行結果コメント/ラベル更新のため。 |
| Secret | `OPENCODE_OPENAI_OAUTH_JSON_B64` | base64文字列 | Yes | GitHub Secrets | OAuth認証キャッシュをヘッドレス環境で復元するため。 |
| Step | `Restore OAuth token` | `~/.opencode/auth/openai.json` へ復元 + `chmod 600` | Yes | workflow定義 | 認証情報の権限制御を維持するため。 |
| OpenCode | `share` | `false` | Yes | workflow定義 | 共有による情報露出を防止するため。 |
| OpenCode | `prompt security rules` | secrets出力禁止 / workflow改変禁止 | Yes | workflow定義 | Prompt injection耐性を確保するため。 |

## OIDC信頼条件（固定値）
- Provider URL: `https://token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`
- Subject: `repo:tsuji-tomonori/diopside-v3:environment:prod`
- Assume先ロール: `GithubActionsDeployRole`（Stack Output `GithubActionsDeployRoleArn` から取得し、`AWS_ROLE_ARN` へ設定）

## 初回導入手順
- 初回はローカルの[[RQ-SH-001|管理者]]権限で `task infra:deploy` を実行し、`GithubOidcProvider` と `GithubActionsDeployRole` を作成する。
- 初回配備後、`GithubActionsDeployRoleArn` Output を GitHub Environment `prod` の `AWS_ROLE_ARN` へ設定する。
- 2回目以降の配備は GitHub Actions から OIDC で実行する。

## テスト方針（CDK）
- Fine-grained assertions: CloudFormationテンプレートの主要プロパティ（behavior順序、認証設定、OAC設定）を個別検証する。
- Snapshot tests: テンプレート全体差分を検知するが、ライブラリアップグレード時の差分はfine-grainedで補強して判定する。
- Integration tests: 1テスト=1 CDKアプリで配備可能性を検証し、`/docs/*` 到達とinvalidation後反映を確認する。
- statefulリソース追加時は、論理ID不変を担保する回帰テストを追加する。

## cdk-nag除外の詳細
- `AwsSolutionsChecks` をCDKアプリへ適用し、未除外の `AwsSolutions-*` 指摘が残る場合はテストを失敗させる。
- suppressions は `QuartzSiteStack` 内で明示し、除外理由をコードと本設計で同期管理する。
- 現行除外と理由:
  - `AwsSolutions-IAM4` / `AwsSolutions-IAM5` / `AwsSolutions-L1`
    - 対象: `BucketDeployment` のCDK管理カスタムリソース（Lambda/Role/Policy）
    - 理由: フレームワーク実装由来で、当スタック側で細粒度制御できないため。
  - `AwsSolutions-S1`
    - 対象: docs配信用S3バケット
    - 理由: Phase 1ではCloudFront配信中心で運用し、S3アクセスログを未導入とするため。
  - `AwsSolutions-CFR1`
    - 対象: CloudFront Distribution
    - 理由: 公開文書をグローバル配信する要件のためGeo制限を設けないため。
  - `AwsSolutions-CFR2`
    - 対象: CloudFront Distribution
    - 理由: WAF導入はPhase 2（単一CloudFront統合時）で再評価するため。
  - `AwsSolutions-CFR3`
    - 対象: CloudFront Distribution
    - 理由: CloudFrontアクセスログは監視基盤拡張時に導入予定で、Phase 1では未導入とするため。
  - `AwsSolutions-CFR4`
    - 対象: CloudFront Distribution
    - 理由: Phase 1では標準証明書を許容し、カスタムドメイン導入時にACM証明書へ移行するため。

## I/Oまたは責務
- 入力:
  - `docs/` 配下Markdown
  - `siteAssetPath` context（明示または既定値）
  - AWS認証情報（初回ローカル: `CDK_DEFAULT_ACCOUNT` / `CDK_DEFAULT_REGION`）
  - GitHub Environment変数（`AWS_ROLE_ARN`, `AWS_REGION`, 任意で `DOCS_SITE_URL`）
- 出力:
  - `quartz/public` の静的サイト成果物
  - `diopside-docs-{branch}-{shortsha}.pdf`（Release配布用PDF）
  - `diopside-docs-{branch}-{shortsha}.zip`（Actions Artifact名）
  - S3配置済みアセット（`obsidian/`）
  - CloudFront invalidation結果
  - `GithubActionsDeployRoleArn` / `GithubOidcProviderArn`（初回構築時のStack Output）

## 障害ハンドリング
- Quartz build失敗: Markdown構文・リンク不整合を修正し、`task quartz:build` で再試行する。
- CDK deploy失敗: AWS認証情報と `siteAssetPath` 解決結果を確認し、`task infra:deploy` を再実行する。
- OIDC Assume失敗: `AWS_ROLE_ARN`、Trust Policy の `aud/sub`、`environment: prod` の一致を確認する。
- 反映遅延: invalidation完了状態を確認し、必要時に再デプロイする。
- cdk-nag失敗: 新規指摘は原則修正し、除外する場合は本設計とコードに理由を同時追記して再実行する。

## 変更履歴
- 2026-02-23: `opencode-issue.yml` の実行仕様（`issues:labeled`、allowlist、OAuth復元、最小権限、`share=false`）を追加 [[BD-SYS-ADR-039]]
- 2026-02-21: Quartz不整合ディレクトリの自己修復、Node 22固定、CI実行前のQuartzワークスペース初期化を追加
- 2026-02-21: CI競合回避のため `docs:deploy:ci` / `infra:deploy:ci` / `quartz:build:ci` を追加し、workflow実行コマンドを直列タスクへ更新
- 2026-02-21: `docs-deploy.yml` のパラメータ/設定値一覧と OIDC信頼条件の固定値を追加
- 2026-02-21: `docs-deploy.yml` を追加し、初回ローカル配備 -> GitHub OIDC配備へ移行する実行手順を確定 [[BD-SYS-ADR-038]]
- 2026-02-21: `docs-pdf.yml` のArtifact名を `.zip` とし、PDF本体との役割を分離 [[BD-SYS-ADR-037]]
- 2026-02-21: `docs-pdf.yml` / `release-docs-pdf.yml` のPDF配布仕様（命名規則・正規化・Asset上書き）を追加 [[BD-SYS-ADR-037]]
- 2026-02-21: CloudFront/S3設定値の正本をサービス別詳細へ分離し、本書を配備フロー正本として明確化 [[BD-SYS-ADR-036]]
- 2026-02-11: CDK決定性運用（副作用ゼロ、context差分管理、stateful分離）とCDKテスト方針を追加
- 2026-02-11: 公開トップの解決先を `index.html` に統一し、`/docs/` の同値到達を明記
- 2026-02-11: cdk-nag除外（IAM4/IAM5/L1/S1/CFR1/CFR2/CFR3/CFR4）の理由と運用ルールを追記
- 2026-02-11: Task定義（`docs:deploy`/`quartz:build`/`infra:deploy`/`docs:verify`）とWorkflow設計を追記
- 2026-02-11: Quartz + CDK 公開フロー（`siteAssetPath`、rewrite、invalidation、障害切り分け）を具体化
- 2026-02-10: 新規作成
