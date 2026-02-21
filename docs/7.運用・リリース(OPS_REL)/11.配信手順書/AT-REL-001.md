---
id: AT-REL-001
title: 配信手順書 001
doc_type: 配信手順書
phase: AT
version: 1.0.9
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
- '[[AT-RUN-001]]'
tags:
- diopside
- AT
- REL
---


## 運用目的
- `task docs:deploy` を用いたドキュメント公開手順を標準化し、反映確認までの再現性を担保する。

## 前提条件
- 初回のみローカルAWS認証情報（`CDK_DEFAULT_ACCOUNT` / `CDK_DEFAULT_REGION`）で `task infra:deploy` を実行し、OIDC Provider/Assume先ロールを作成済みである。
- GitHub Environment `prod` に `AWS_ROLE_ARN` と `AWS_REGION` を設定済みである。
- `docs/` 更新内容がコミット可能状態である。
- `quartz/` と `infra/` が同一リポジトリ配下に存在する。

## 配信手順
1. 初回導入時のみローカルで `task infra:deploy` を実行し、Stack Output の `GithubActionsDeployRoleArn` を GitHub Environment `prod` の `AWS_ROLE_ARN` へ設定する。
2. 通常運用では `main` へのpushまたは `docs-deploy` の手動起動で GitHub Actions 配備を実行する。
3. workflow が OIDC で `AWS_ROLE_ARN` を引受し、`aws sts get-caller-identity` が成功することを確認する。
4. `task docs:deploy` 実行ログで `task quartz:build` が `quartz/public` を生成することを確認する。
5. `task infra:deploy` が `siteAssetPath=quartz/public` を参照してCDKデプロイし、S3配置とCloudFront invalidationが完了することを確認する。
6. `'/'` と `'/docs/'` へアクセスし、同一の公開トップ（[[index]]）へ到達することを確認する。
7. 更新差分（変更した文書）が公開サイトに反映されていることを確認する。
8. Phase 2適用後は [[BD-INF-DEP-004]] / [[DD-INF-DEP-002]] に従い、`'/web/*'`, `'/openapi/*'`, `'/api/v1/*'` の経路確認を追加する。

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
- 2026-02-21: 初回ローカル配備後に GitHub OIDC AssumeRole へ移行する運用手順と判定基準を追加
- 2026-02-20: テスト章再編に合わせて「7.運用・リリース(OPS_REL)」へ移設し、AT判定からの参照位置づけを明記
- 2026-02-11: 公開トップ参照を [[RQ-HM-001]] から [[index]] へ変更
- 2026-02-11: Phase 1（docs先行公開）基準へ手順を修正し、`/` と `/docs/` の到達確認を明記
- 2026-02-11: 単一CloudFrontパス分岐（`/web` `/docs` `/openapi` `/api/v1`）の配信確認手順を追加
- 2026-02-11: Quartz + CDK 公開手順（`task docs:deploy`、配備確認、反映確認）を追加
- 2026-02-10: 新規作成
