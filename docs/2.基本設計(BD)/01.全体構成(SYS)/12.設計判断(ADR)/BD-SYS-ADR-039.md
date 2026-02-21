---
id: BD-SYS-ADR-039
title: CI/CDはGitHub Actionsを実装基盤に統一しPRとデプロイを分離運用する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[RQ-DEV-005]]'
- '[[RQ-DEV-006]]'
- '[[RQ-DEV-007]]'
- '[[RQ-SEC-005]]'
related:
- '[[RQ-RDR-050]]'
- '[[BD-DEV-PIPE-001]]'
- '[[AT-REL-001]]'
- '[[AT-GO-001]]'
tags:
- diopside
- BD
- ADR
---

## 決定事項
- CI実行は `ci` ワークフローに統一し、PRごとに必須ステータスチェックを実行する。
- CD実行は `docs-deploy` などのデプロイ専用ワークフローへ分離し、`workflow_dispatch` と main反映で起動できる構成を採用する。
- デプロイジョブは環境単位 `concurrency` を必須化し、同一環境への並列反映を禁止する。
- 本番反映はGitHub Environment保護ルールと承認ゲートを必須化する。
- 認証はOIDC AssumeRoleを採用し、長期アクセスキーをSecretsへ保持しない。
- セキュリティ統制として、Actions参照SHA固定・`GITHUB_TOKEN` 最小権限・利用元制限を実装条件に含める。

## 理由
- PR判定と本番反映を同一ワークフローへ混在させると権限境界が曖昧になり、運用事故時の切り分けも困難になる。
- GitHub Actions標準機能（status checks, environments, artifacts, concurrency, OIDC）で既存運用要件を追加実装なしに満たせる。
- docs先行公開フェーズから単一CloudFront分岐運用へ拡張しても、単位別ジョブ分離を維持できる。

## 影響
- `BD-DEV-PIPE-001` にGitHub Actions実装補足（job命名、paths、排他、証跡保持）を追加する。
- `AT-REL-001` に `docs-deploy` 実行時の確認観点を参照可能な状態で維持する。
- `AT-GO-001` に非機能ゲート判定でGitHub Actions証跡参照を追加する。

## 却下した選択肢
- CI/CDをローカルTask実行のみに固定する案: 実行者依存が強く、証跡と承認履歴の一元化ができないため不採用。
- PRとデプロイを単一ワークフローに統合する案: Secrets境界と承認境界が混在するため不採用。
- 長期アクセスキーをGitHub Secretsで運用する案: ローテーションと漏えい時影響の観点で不採用。

## 変更履歴
- 2026-02-21: 新規作成（GitHub Actions統一運用と権限境界分離を決定） [[BD-SYS-ADR-039]]
