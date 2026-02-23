---
id: BD-SYS-ADR-038
title: docs配備は初回ローカル構築後にGitHub OIDC AssumeRoleで自動実行する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[RQ-DEV-001-01]]'
- '[[RQ-SEC-001-01]]'
related:
- '[[BD-INF-DEP-003]]'
- '[[DD-INF-DEP-001]]'
- '[[DD-INF-SEC-002]]'
- '[[AT-REL-001]]'
tags:
- diopside
- BD
- ADR
---

## 決定事項
- `QuartzSiteStack` に GitHub OIDC Provider（`token.actions.githubusercontent.com`）と `GithubActionsDeployRole` を同居させる。
- 初回のみローカル権限で `task infra:deploy` を実行し、OIDC Provider/Assume先ロールを作成する。
- 2回目以降の docs 配備は `.github/workflows/docs-deploy.yml` から OIDC AssumeRole で実行する。
- Trust Policy は `aud=sts.amazonaws.com` かつ `sub=repo:tsuji-tomonori/diopside-v3:environment:prod` を必須にする。
- デプロイジョブは `push(main)` と `workflow_dispatch` の両方で起動し、`environment: prod` と `concurrency: docs-deploy-prod` を必須にする。

## 理由
- 長期アクセスキーを廃止し、実行ごとの短期クレデンシャルで配備する方が漏えい耐性と運用監査性が高い。
- ロールをCDKで管理すると、信頼条件と運用境界をIaC差分としてレビューできる。
- 初回のみローカル実行にすることで、ブートストラップ順序（ロール未作成問題）を解消できる。

## 影響
- `infra/lib/quartz-site-stack.ts` に OIDC Provider / AssumeRole / Output（`GithubActionsDeployRoleArn`）を追加する。
- `docs-deploy.yml` を追加し、OIDC認証後に `task docs:deploy` を実行する。
- `BD-INF-DEP-003` / `DD-INF-DEP-001` / `DD-INF-SEC-002` / `AT-REL-001` に運用・設計条件を同期する。

## 却下した選択肢
- GitHub Secrets に長期アクセスキーを保存する案: 鍵ローテーション運用負荷と漏えい時の影響が大きいため不採用。
- 初回からGitHub Actionsのみで構築する案: Assume先ロールが未作成のためブートストラップできず不採用。
- `sub` をブランチ条件のみにする案: Environment保護を通さない実行経路を許すため不採用。

## 変更履歴
- 2026-02-21: 新規作成（初回ローカル構築後にGitHub OIDC AssumeRoleでdocs自動配備する方式を決定） [[BD-SYS-ADR-038]]
