---
id: RQ-DEV-001
title: DevOps要件
doc_type: 非機能要求
phase: RQ
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-RDR-017]]'
- '[[RQ-RDR-024]]'
- '[[RQ-RDR-025]]'
- '[[RQ-PC-009]]'
- '[[BD-BUILD-001]]'
- '[[BD-DEP-001]]'
- '[[BD-DEP-003]]'
tags:
- diopside
- RQ
- DEV
---


## SnowCard（日本語）
- 要求ID: RQ-DEV-001
- 種別: 非機能要求
- 優先度: MUST
- 要求: 本システムは、小差分リリースを前提に、検証自動化とロールバック可能性を維持した運用を行うこと。
- 根拠: [[RQ-PC-009]] の低リスクリリース制約を満たし、個人開発でも品質と速度を両立するため。
- 受入基準:
  - すべてのリリース候補に対して、最低限 `lint` / `test` / `build` の3系統チェックを実行し成功率 100% である。
  - 文書運用規約を変更したリリース候補では、対象 `doc-*` スキルと `skill-maintainer` / `docops-orchestrator` の同期更新が同一変更で実施されている。
  - スキル更新を含む変更では、`reports/impact_check_YYYY-MM-DD.md` と `reports/doc_check.md` が同一変更で更新され、`broken_links: 0` を満たす。
  - ドキュメント公開は `task docs:deploy` を標準入口として実行され、Quartz成果物（`quartz/public`）と配信アセット（`siteAssetPath`）の不整合がない。
  - 公開反映時はCloudFront invalidationが実行され、配信確認手順（`[[AT-REL-001]]`）で更新差分を確認できる。
  - 本番反映手順は 15分以内で完了し、失敗時は 10分以内に直前版へロールバックできる。
  - デプロイ手順書（`[[AT-REL-001]]`）と障害時手順（`[[AT-RUN-001]]`）が常に最新版と整合する。
  - 手動承認を伴うリリース判定記録（`[[AT-GO-001]]`）を毎回残す。
- 例外/エラー:
  - チェック未実施または失敗時はリリース禁止とし、例外承認を認めない。
  - ロールバック不能な変更が発生した場合は、次回以降の変更を凍結して原因是正を優先する。
- 依存・関連:
  - [[RQ-RDR-017]]
  - [[RQ-RDR-025]]
  - [[RQ-PC-009]]
  - [[BD-BUILD-001]]

## 変更履歴
- 2026-02-11: Quartz + CDK 公開フロー品質ゲート（`task docs:deploy`、`siteAssetPath` 整合、invalidation確認）を追加
- 2026-02-11: スキルメンテナンス方針をDevOps受入基準へ追加（同一変更同期、影響記録、doc_check判定）
- 2026-02-10: 新規作成
- 2026-02-11: CI必須チェック/反映時間/ロールバック時間の受入閾値を追加し、テンプレート記述を具体化
