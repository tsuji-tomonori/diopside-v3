---
id: DD-INF-DEP-001
title: デプロイ詳細
doc_type: デプロイ詳細
phase: DD
version: 1.0.7
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-INF-DEP-003]]'
- '[[BD-SYS-ADR-013]]'
- '[[BD-SYS-ADR-016]]'
related:
- '[[RQ-FR-024]]'
- '[[RQ-RDR-029]]'
- '[[AT-REL-001]]'
- '[[AT-RUN-001]]'
tags:
- diopside
- DD
- DEP
---


## 詳細仕様
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
- `quartz:build`
  - 役割: 文書ビルド
  - 実行: `npx quartz build -d ../docs`
- `infra:deploy`
  - 役割: CDK配備とinvalidation
  - 実行: `npm run deploy -- --context siteAssetPath=<repo>/quartz/public`
- `docs:verify`
  - 役割: 公開反映確認
  - 確認: `/docs/` 到達、更新差分、主要リンク導線

## Workflow定義（設計）
- `docs-link-check.yml`
  - docs変更時に `auto_link_glossary --check` と `validate_vault --targets` を実行する。
- `docs-deploy.yml`
  - `workflow_dispatch` を標準起動とし、必要に応じてmain反映時に起動する。
  - 実行順: `task docs:guard` -> `task docs:deploy`
  - AWS認証はOIDCロール引受で実施する。

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
  - AWS認証情報（`CDK_DEFAULT_ACCOUNT` / `CDK_DEFAULT_REGION`）
- 出力:
  - `quartz/public` の静的サイト成果物
  - S3配置済みアセット（`obsidian/`）
  - CloudFront invalidation結果

## 障害ハンドリング
- Quartz build失敗: Markdown構文・リンク不整合を修正し、`task quartz:build` で再試行する。
- CDK deploy失敗: AWS認証情報と `siteAssetPath` 解決結果を確認し、`task infra:deploy` を再実行する。
- 反映遅延: invalidation完了状態を確認し、必要時に再デプロイする。
- cdk-nag失敗: 新規指摘は原則修正し、除外する場合は本設計とコードに理由を同時追記して再実行する。

## 変更履歴
- 2026-02-11: CDK決定性運用（副作用ゼロ、context差分管理、stateful分離）とCDKテスト方針を追加
- 2026-02-11: 公開トップの解決先を `index.html` に統一し、`/docs/` の同値到達を明記
- 2026-02-11: cdk-nag除外（IAM4/IAM5/L1/S1/CFR1/CFR2/CFR3/CFR4）の理由と運用ルールを追記
- 2026-02-11: Task定義（`docs:deploy`/`quartz:build`/`infra:deploy`/`docs:verify`）とWorkflow設計を追記
- 2026-02-11: Quartz + CDK 公開フロー（`siteAssetPath`、rewrite、invalidation、障害切り分け）を具体化
- 2026-02-10: 新規作成
