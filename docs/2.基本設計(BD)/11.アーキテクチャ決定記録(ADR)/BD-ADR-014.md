---
id: BD-ADR-014
title: 単一CloudFrontのパス分岐と認証境界を固定する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[RQ-RDR-026]]'
related:
- '[[RQ-FR-025]]'
- '[[BD-DEP-004]]'
- '[[BD-API-004]]'
- '[[DD-DEP-002]]'
- '[[DD-API-010]]'
tags:
- diopside
- BD
- ADR
---

## 決定事項
- CloudFront behaviorは上位から `'/api/*'`、`'/openapi/*'`、`'/docs/*'`、`'/web/*'`、`'/*'` の順で評価する。
- `'/*'` はデフォルト配信を持たず、`/web/` への誘導専用とする。
- rewrite/fallbackの適用範囲を経路ごとに固定する。
  - `/docs/*`: 拡張子補完rewriteを許可
  - `/web/*`: SPA fallbackを許可
  - `/openapi/*` と `/api/*`: rewrite/fallbackを禁止
- `/openapi/*` と `/api/*` は Cognito JWT 認証を必須とする。

## 理由
- 1 Distributionで複数責務を扱うため、behavior優先順位の明示がないと誤配信の再発防止が難しい。
- rewrite適用範囲を限定しないと、API応答がHTMLへ置換される障害を引き起こす。
- 認証境界をCloudFront経路で固定することで、保護対象の抜け漏れを防げる。

## 影響
- デプロイ設計: `[[BD-DEP-004]]` にpath予約、cache policy、invalidation範囲を反映する。
- API設計: `[[BD-API-004]]` にOpenAPI公開経路と版対応を反映する。
- 詳細設計: `[[DD-DEP-002]]` でbehavior詳細、`[[DD-API-010]]` で `/api/v1/*` 命名を具体化する。

## 却下した選択肢
- 画面を `/` 直下に配置する案: docs/openapiとの経路競合が起きやすく運用上の誤設定リスクが高いため不採用。
- rewriteを全経路に適用する案: API/OpenAPIの契約を壊すため不採用。

## 変更履歴
- 2026-02-11: 新規作成
