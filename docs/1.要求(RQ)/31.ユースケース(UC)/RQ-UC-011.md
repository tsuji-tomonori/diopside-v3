---
id: RQ-UC-011
title: 管理者がdocs-deployワークフローで公開する
doc_type: ユースケース
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-DEV-006]]'
- '[[AT-REL-001]]'
- '[[RQ-RDR-025]]'
- '[[RQ-RDR-050]]'
bounded_context: Administration
subdomain: Supporting
tags:
- diopside
- RQ
- UC
---

## 概要
- [[RQ-SH-001|管理者]]がGitHub Actionsの `docs-deploy` ワークフローを起動し、ドキュメント公開と反映確認を完了する利用シナリオ。

## 基本フロー
1. [[RQ-SH-001|管理者]]がmain反映または手動実行で `docs-deploy` を起動する。
2. ワークフローが `docs:guard -> infra:deploy:ci -> docs:verify` を順に実行する。
3. [[RQ-SH-001|管理者]]がCloudFront invalidation完了と公開URL到達を確認する。
4. [[RQ-SH-001|管理者]]が更新差分の公開反映を確認し、実行記録を残す。

## 代替/例外フロー
- Quartz build失敗: [[RQ-SH-001|管理者]]はドキュメント整合を修正し、再実行する。
- CDK deploy失敗: [[RQ-SH-001|管理者]]はインフラ差分と認証設定を確認し、復旧後に再実行する。
- 反映遅延: [[RQ-SH-001|管理者]]はinvalidaton実行と到達確認を再検証し、必要時に[[AT-RUN-001]]へ遷移する。

## 変更履歴
- 2026-02-21: 新規作成（docs-deploy公開運用のユースケースを追加） [[RQ-RDR-050]]
