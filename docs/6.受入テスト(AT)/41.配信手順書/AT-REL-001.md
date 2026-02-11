---
id: AT-REL-001
title: 配信手順書 001
doc_type: 配信手順書
phase: AT
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-TST-001]]'
- '[[IT-PLAN-001]]'
related:
- '[[AT-GO-001]]'
- '[[BD-DEP-003]]'
- '[[AT-RUN-001]]'
tags:
- diopside
- AT
- REL
---


## 受入目的
- `task docs:deploy` を用いたドキュメント公開手順を標準化し、反映確認までの再現性を担保する。

## 前提条件
- AWS認証情報（`CDK_DEFAULT_ACCOUNT` / `CDK_DEFAULT_REGION`）が有効である。
- `docs/` 更新内容がコミット可能状態である。
- `quartz/` と `infra/` が同一リポジトリ配下に存在する。

## 配信手順
1. `task docs:deploy` を実行する。
2. `task quartz:build` が `quartz/public` を生成することをログで確認する。
3. `task infra:deploy` が `siteAssetPath=quartz/public` を参照してCDKデプロイすることを確認する。
4. S3配置完了とCloudFront invalidation実行を確認する。
5. 公開URLへアクセスし、`/` がトップページへリライトされ、更新差分が表示されることを確認する。

## 判定基準
- 公開手順が単一コマンドで完了し、配信サイトに更新内容が反映される。
- `siteAssetPath` 解決先とS3配置先に不整合がない。
- 異常時は `[[AT-RUN-001]]` の切り分け手順で復旧できる。

## 変更履歴
- 2026-02-11: Quartz + CDK 公開手順（`task docs:deploy`、配備確認、反映確認）を追加
- 2026-02-10: 新規作成
