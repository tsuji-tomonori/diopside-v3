---
id: AT-RUN-001
title: 障害対応手順書 001
doc_type: 障害対応手順書
phase: AT
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-DEV-TEST-001]]'
- '[[IT-PLAN-001]]'
related:
- '[[AT-GO-001]]'
- '[[AT-REL-001]]'
- '[[BD-INF-DEP-003]]'
- '[[BD-INF-DEP-004]]'
tags:
- diopside
- AT
- RUN
---


## 受入目的
- Quartz + CDK 公開フローで障害が発生した際の切り分け手順と復旧手順を標準化する。

## 障害分類と初動
- Quartz build失敗: Markdown記法エラー、リンク不整合、ビルド設定不備を確認する。
- CDK deploy失敗: AWS認証情報、権限、`siteAssetPath` 解決結果を確認する。
- cdk-nag失敗: `AwsSolutions-*` 指摘の新規発生有無、既存suppressions対象、除外理由の文書整合を確認する。
- 反映遅延: CloudFront invalidation完了状態、対象パス、前回デプロイとの差分を確認する。
- 経路競合: CloudFront behavior優先順位とpath pattern衝突を確認する。
- 認証障害: `'/openapi/*'` / `'/api/v1/*'` の認証設定とトークン検証状態を確認する。

## 復旧手順
1. 障害分類に応じて該当確認項目をチェックする。
2. Quartz build失敗時は修正後に `task quartz:build` を再実行する。
3. CDK deploy失敗時は認証情報とcontextを修正後に `task infra:deploy` を再実行する。
4. cdk-nag失敗時は原則コード修正で解消し、除外が必要な場合は [[DD-INF-DEP-001]] へ除外理由を追記して再実行する。
5. 反映遅延時はinvalidation完了を待機し、必要時に `task docs:deploy` を再実行する。
6. 経路競合時はbehavior順序を修正し、`'/web'`, `'/docs'`, `'/openapi'`, `'/api/v1'` の到達試験を再実行する。
7. 認証障害時は認証設定を修正し、未認証拒否と認証後アクセスを再確認する。
8. 復旧完了後、公開URLで更新差分を確認して運用記録へ残す。

## 判定基準
- 3分類いずれの障害でも、原因特定から復旧確認までの手順が再現可能である。
- 復旧後の公開サイトが期待バージョンへ更新され、運用記録に再実行結果が残る。

## 変更履歴
- 2026-02-11: cdk-nag失敗時の切り分けと文書同期（[[DD-INF-DEP-001]]）手順を追加
- 2026-02-11: 単一CloudFrontパス分岐に伴う経路競合/認証障害の切り分け手順を追加
- 2026-02-11: Quartz + CDK 公開障害の分類と復旧手順を追加
- 2026-02-10: 新規作成
