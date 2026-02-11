---
id: RQ-RDR-025
title: ドキュメント公開フローをQuartzとCDKの単一実行で標準化する決定
doc_type: 要求決定記録
phase: RQ
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-FR-024]]'
- '[[RQ-DEV-001]]'
- '[[BD-ADR-013]]'
- '[[BD-DEP-003]]'
- '[[AT-REL-001]]'
- '[[AT-RUN-001]]'
tags:
- diopside
- RQ
- RDR
---

## 決定事項
- ドキュメント公開は `task docs:deploy` を標準入口として実行する。
- `docs:deploy` は QuartzビルドとCDKデプロイを同一チェーンで実行し、配信アセットの不整合を防止する。
- CDKデプロイでは `siteAssetPath` を明示し、S3配備とCloudFront invalidationを必須手順とする。
- 失敗時の復旧は「Quartz build失敗」「CDK deploy失敗」「反映遅延」の3系統で切り分ける。
- 公開方式は `.workspace/CornellNoteWeb` の運用原則（Task入口統一、IaCで配信、運用手順の明文化）を踏襲し、[[RQ-GL-001|diopside]]へ適用する。
- 導入は2段階で実施する。
  - Phase 1: `/docs/*` 公開を `task docs:deploy` で先行稼働
  - Phase 2: 単一CloudFront分岐（`/web/*`, `/docs/*`, `/openapi/*`, `/api/v1/*`）へ拡張

## 理由
- 公開工程が手作業で分断されると、古いアセットの配信やキャッシュ残存が発生しやすい。
- 個人開発運用では、単一コマンド化により再現性と復旧速度を両立できる。
- [[RQ-PC-005]] のAWS配信基盤制約と [[RQ-PC-009]] の小差分リリース制約を同時に満たすため、公開フローの固定化が必要である。

## 影響
- 要求文書: [[RQ-FR-024]] を新規追加し、[[RQ-DEV-001]] の受入基準へ公開フロー品質ゲートを追加する。
- 設計文書: [[BD-ADR-013]] と [[BD-DEP-003]] で実行順序、責務分担、失敗時観点を明文化する。
- 詳細/運用文書: [[DD-DEP-001]] / [[AT-REL-001]] / [[AT-RUN-001]] を公開フロー前提へ更新する。
- CI/CD: docs変更を対象に、`docs-link-check` と `docs-deploy`（手動またはmain反映時）を分離運用する。

## 変更履歴
- 2026-02-11: CornellNoteWeb準拠の導入方針（Task入口/IaC/運用明文化）とPhase分割（先行公開->経路拡張）を追記
- 2026-02-11: 新規作成
