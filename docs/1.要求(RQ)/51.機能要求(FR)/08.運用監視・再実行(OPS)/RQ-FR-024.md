---
id: RQ-FR-024
title: 管理者がドキュメント公開を一括実行できる
doc_type: 機能要求
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-RDR-025]]'
- '[[RQ-DEV-001]]'
- '[[BD-DEP-003]]'
- '[[AT-REL-001]]'
tags:
- diopside
- RQ
- FR
---

## SnowCard（日本語）
- 要求ID: RQ-FR-024
- 種別: 機能要求
- 優先度: MUST
- 要求: 本システムは、管理者が `task docs:deploy` を単一入口として、QuartzビルドとCDKデプロイを連続実行し、公開サイト反映まで完了できることを提供する。
- 根拠: 公開手順が分断されると、アセット不整合や反映漏れによりリリース品質が低下するため。
- 受入基準:
  - `task docs:deploy` 実行で、`quartz/public` の生成とCDKデプロイが同一実行チェーンで完了する。
  - CDKデプロイは `siteAssetPath` に `quartz/public` を明示し、S3配備後にCloudFront invalidationを実行する。
  - 公開トップ（`/`）アクセス時に規定ページへ到達し、更新内容が配信サイトで確認できる。
- 例外/エラー:
  - Quartzビルド失敗時はデプロイを中断し、Markdown記法/リンク不整合を修正後に再実行する。
  - CDKデプロイ失敗時は認証情報と `siteAssetPath` 解決結果を確認し、再実行する。
  - 反映遅延時はCloudFront invalidation完了状態を確認し、必要時に再デプロイする。
- 依存・関連:
  - [[RQ-DEV-001]]
  - [[RQ-PC-005]]
  - [[RQ-PC-009]]
  - [[RQ-RDR-025]]

## テスト観点
- 正常系で `task docs:deploy` 実行後に公開サイトで更新差分が確認できること。
- 異常系でQuartz/CDKそれぞれの失敗時に、切り分け観点どおりに復旧できること。

## 個別確認チェックリスト
- 確認主体: 管理者
- 重点確認対象: 単一コマンド公開、アセット整合、反映完了
- 確認方法: 実行ログ、CDK出力、公開URL表示結果を照合する。

## 変更履歴
- 2026-02-11: 新規作成
