---
id: AT-SCN-006
title: 単一CloudFrontパス分岐シナリオ
doc_type: 受入テストシナリオ
phase: AT
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[BD-DEV-TEST-001]]'
- '[[IT-PLAN-001]]'
related:
- '[[AT-GO-001]]'
- '[[RQ-FR-025]]'
- '[[BD-SYS-ADR-021]]'
- '[[BD-INF-DEP-004]]'
- '[[BD-APP-API-004]]'
- '[[DD-INF-DEP-002]]'
- '[[DD-APP-API-010]]'
tags:
- diopside
- AT
- SCN
---

## シナリオ目的
- 単一CloudFront上で `/web` `/docs` `/openapi` `/api/v1` が競合なく分岐し、認証境界が成立することを確認する。

## 前提条件
- CloudFront behaviorが [[DD-INF-DEP-002]] の順序で適用されている。
- OpenAPI仕様は `/openapi/v1/openapi.json` に配置済み。

## 手順
1. `/` にアクセスし、`/web/` へ誘導されることを確認する。
2. `/web/` と `/web/<deep-path>` が表示できることを確認する。
3. `/docs/` と `/docs/<doc-path>` が表示できることを確認する。
4. `bootstrap.json` `tag_master.json` `archive_index.p0.json` が `Web App` から参照可能なことを確認する。
5. 未認証で `/openapi/` と `/api/v1/ops/diagnostics/health` へアクセスし、拒否されることを確認する。
6. 認証後に `/openapi/` へアクセスし、`/openapi/v1/openapi.json` が取得できることを確認する。
7. 認証後に `/api/v1/ops/diagnostics/health` へアクセスし、正常応答を確認する。
8. `/api/v1/*` へのアクセスでHTMLが返らないこと（rewrite非干渉）を確認する。
9. `/web/*` `/docs/*` 応答にDB接続情報など非公開情報が含まれないことを確認する。

## 期待結果
- 4経路が責務どおりに配信される。
- 利用者向け参照データ（静的JSON）が `Web App` から取得できる。
- 認証必須経路の未認証アクセスが拒否される。
- OpenAPI版とAPI版が `v1` で一致する。

## 記録項目
- 確認URL
- 認証状態
- HTTPステータス
- 応答種別（HTML/JSON）
- 情報漏えい有無（機密情報含有: Yes/No）
- 判定（Pass/Fail）

## 変更履歴
- 2026-02-11: web/data静的JSON確認と情報漏えい観点を追加 [[BD-SYS-ADR-021]]
- 2026-02-11: 新規作成
