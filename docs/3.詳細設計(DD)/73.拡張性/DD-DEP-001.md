---
id: DD-DEP-001
title: デプロイ詳細
doc_type: デプロイ詳細
phase: DD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-DEP-003]]'
- '[[BD-ADR-013]]'
related:
- '[[RQ-FR-024]]'
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
- URL書き換えはCloudFront Function（`pretty-url-rewrite.js`）で行い、`/` は `RQ-HM-001.html`、`/path/` は `index.html`、拡張子なしは `.html` 補完とする。

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

## 変更履歴
- 2026-02-11: Quartz + CDK 公開フロー（`siteAssetPath`、rewrite、invalidation、障害切り分け）を具体化
- 2026-02-10: 新規作成
