---
id: DD-DEP-004
title: バックエンド配備デプロイ詳細
doc_type: デプロイ詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[BD-DEP-006]]'
- '[[BD-DEP-004]]'
- '[[BD-API-004]]'
related:
- '[[RQ-FR-025]]'
- '[[DD-DEP-002]]'
- '[[DD-API-010]]'
- '[[AT-REL-001]]'
- '[[AT-SCN-006]]'
tags:
- diopside
- DD
- DEP
---

## 目的
- `'/api/v1/*'` と `'/openapi/*'` のデプロイ詳細を定義し、認証境界と版整合を担保する。

## デプロイ対象
- API経路: `'/api/v1/*'`
- OpenAPI経路: `'/openapi/*'`, `'/openapi/v1/openapi.json'`
- 依存: CloudFront behavior（`'/api/*'`, `'/openapi/*'`）、認証設定

## 詳細手順
1. APIを `'/api/v1/*'` で公開できる状態に配備する。
2. OpenAPI UIと `'/openapi/v1/openapi.json'` を配備する。
3. `'/api/*'` と `'/openapi/*'` の認証必須設定を確認する。
4. `'/api/*'` と `'/openapi/*'` にrewrite/fallbackが未適用であることを確認する。
5. `'/api/v1/*'` と `'/openapi/v1/openapi.json'` の版対応を確認する。

## 検証観点
- 未認証アクセス時に `'/api/v1/*'` と `'/openapi/*'` が拒否されること。
- 認証後に `'/api/v1/ops/diagnostics/health'` がJSONを返すこと。
- `'/openapi/v1/openapi.json'` が取得でき、`v1` を示すこと。
- `'/api/v1/*'` へのアクセスでHTMLが返らないこと。

## ロールバック観点
- API版とOpenAPI版を同一版で切戻しできること。
- 切戻し後に認証境界と版整合が維持されること。

## 変更履歴
- 2026-02-11: 新規作成
