---
id: RQ-RDR-026
title: 単一CloudFrontで画面・文書・OpenAPI・APIをパス分岐する決定
doc_type: 要求決定記録
phase: RQ
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-14'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-FR-025]]'
- '[[RQ-DEV-001]]'
- '[[RQ-SEC-001]]'
- '[[RQ-INT-001]]'
- '[[BD-SYS-ADR-014]]'
- '[[BD-INF-DEP-004]]'
- '[[BD-APP-API-004]]'
- '[[DD-INF-DEP-002]]'
- '[[DD-APP-API-010]]'
- '[[AT-SCN-006]]'
tags:
- diopside
- RQ
- RDR
---

## 決定事項
- 単一CloudFront Distribution上で、`/web/*`、`/docs/*`、`/openapi/*`、`/api/v1/*` の4経路を責務分離して配信する。
- `/` は `/web/` へ誘導し、画面の正規入口を固定する。
- URL書き換え（拡張子補完）は `/docs/*` に限定し、`/openapi/*` と `/api/v1/*` には適用しない。
- [[RQ-SEC-001]] に基づき、`/openapi/*` と `/api/v1/*` は認証必須とする。
- [[RQ-INT-001]] に基づき、`/openapi/v1/*` と `/api/v1/*` の版対応を固定する。

## 理由
- 配信入口を単一化しつつ責務境界を固定することで、運用手順と監視の複雑化を抑えられる。
- パス分岐を明示しないと、rewrite/fallback設定がAPI経路へ混入し障害を誘発しやすい。
- OpenAPIとAPIの版対応をURLで固定することで、[[RQ-SH-002|利用者]]と運用者の参照誤りを減らせる。

## 影響
- 要求文書: [[RQ-FR-025]] を追加し、パス分岐と認証境界の受入条件を明文化する。
- 設計文書: [[BD-SYS-ADR-014]] / [[BD-INF-DEP-004]] / [[BD-APP-API-004]] でルーティング、配信、OpenAPI配布契約を定義する。
- 詳細設計: [[DD-INF-DEP-002]] / [[DD-APP-API-010]] でCloudFront behavior順序と `/api/v1/*` ルーティングを具体化する。
- 受入: [[AT-SCN-006]] で4経路の到達性、認証、rewrite非干渉を検証する。

## 変更履歴
- 2026-02-14: 決定記録から具体ファイル名を除外し、公開経路レベルの記述へ統一 [[RQ-RDR-042]]
- 2026-02-11: 本文中の主体表現「管理者/利用者」をステークホルダーリンクへ統一 [[RQ-RDR-010]]
- 2026-02-11: 新規作成
