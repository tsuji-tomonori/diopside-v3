---
id: RQ-DEV-001
title: DevOps要件
doc_type: 非機能要求
phase: RQ
version: 1.0.7
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
- '[[RQ-RDR-026]]'
- '[[RQ-RDR-029]]'
- '[[RQ-DEV-002]]'
- '[[RQ-PC-009]]'
- '[[BD-BUILD-001]]'
- '[[BD-DEP-001]]'
- '[[BD-DEP-003]]'
- '[[BD-DEP-004]]'
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
  - AIエージェント運用を含む変更では、[[RQ-DEV-002]] の受入基準（役割分離・最小権限・実行上限）を満たす。
  - 文書運用規約を変更したリリース候補では、対象 `doc-*` スキルと `skill-maintainer` / `docops-orchestrator` の同期更新が同一変更で実施されている。
  - CDKを含む変更では `cdk synth` が副作用なく再現可能であり、`cdk.context.json` が差分管理されている。
  - CDKの構成は「Construct中心 + Stack配線」に従い、Construct/Stack内部で `process.env` を直接参照しない。
  - statefulリソースを含む変更では、論理IDの変更有無をレビューで確認し、意図しない置換が発生しない。
  - スキル更新を含む変更では、`reports/impact_check_YYYY-MM-DD.md` と `reports/doc_check.md` が同一変更で更新され、`broken_links: 0` を満たす。
  - ドキュメント公開は `task docs:deploy` を標準入口として実行され、Quartz成果物（`quartz/public`）と配信アセット（`siteAssetPath`）の不整合がない。
  - 公開反映時はCloudFront invalidationが実行され、配信確認手順（[[AT-REL-001]]）で更新差分を確認できる。
  - 単一CloudFront運用では `'/web/*'`, `'/docs/*'`, `'/openapi/*'`, `'/api/v1/*'` の経路分岐が維持され、`'/docs/*'` 以外へrewriteが適用されない。
  - 本番反映手順は 15分以内で完了し、失敗時は 10分以内に直前版へロールバックできる。
  - デプロイ手順書（[[AT-REL-001]]）と障害時手順（[[AT-RUN-001]]）が常に最新版と整合する。
  - 手動承認を伴うリリース判定記録（[[AT-GO-001]]）を毎回残す。
- 例外/エラー:
  - チェック未実施または失敗時はリリース禁止とし、例外承認を認めない。
  - ロールバック不能な変更が発生した場合は、次回以降の変更を凍結して原因是正を優先する。
- 依存・関連:
  - [[RQ-RDR-017]]
  - [[RQ-RDR-025]]
  - [[RQ-DEV-002]]
  - [[RQ-PC-009]]
  - [[BD-BUILD-001]]

## 変更履歴
- 2026-02-11: `RQ-DEV-002` 参照を追加し、AIエージェント運用要件との束ねを明確化
- 2026-02-11: CDK運用受入基準（synth決定性、context固定、props注入、stateful置換防止）を追加
- 2026-02-11: 単一CloudFrontパス分岐運用（`/web` `/docs` `/openapi` `/api/v1`）の品質ゲートを追加
- 2026-02-11: Quartz + CDK 公開フロー品質ゲート（`task docs:deploy`、`siteAssetPath` 整合、invalidation確認）を追加
- 2026-02-11: スキルメンテナンス方針をDevOps受入基準へ追加（同一変更同期、影響記録、doc_check判定）
- 2026-02-10: 新規作成
- 2026-02-11: CI必須チェック/反映時間/ロールバック時間の受入閾値を追加し、テンプレート記述を具体化
