---
id: DD-INF-CF-001
title: CloudFront詳細設計
doc_type: インフラ詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[BD-INF-DEP-004]]'
- '[[BD-INF-DEP-005]]'
related:
- '[[DD-INF-DEP-002]]'
- '[[DD-INF-MON-001]]'
- '[[DD-INF-SEC-003]]'
- '[[DD-INF-S3-001]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- CloudFront Distributionは単一配信境界として `/api/* -> /openapi/* -> /docs/* -> /web/* -> /*` の順でBehaviorを固定する。
- S3オリジンはOAC経由のみ許可し、S3直アクセスをバケットポリシーで禁止する。
- `/docs/*` のみrewriteを許可し、`/api/*` と `/openapi/*` はrewrite禁止とする。

## Behavior設計
| 優先 | Path Pattern | Origin | Cache | 認証/転送 | ルール |
|---|---|---|---|---|---|
| 1 | `/api/*` | API Origin | 無効 | Authorization転送必須 | rewrite禁止 |
| 2 | `/openapi/*` | Static Origin | 短TTL/長TTL併用 | 認証必須 | rewrite禁止 |
| 3 | `/docs/*` | Static Origin | HTML短TTL | 匿名閲覧 | rewrite許可 |
| 4 | `/web/*` | Static Origin | HTML短TTL | 匿名閲覧 | SPA fallback許可 |
| 5 | `/*` | Redirect Handler | 無効 | なし | `/web/` 誘導のみ |

## Origin/OAC設計
| 項目 | 設定値 | 根拠 |
|---|---|---|
| Static Origin | 単一S3バケット（prefix分離） | 静的成果物を `web/`, `docs/`, `openapi/` で分離運用するため。 |
| API Origin | `/api/v1/*` 配信用origin | API経路を静的配信と分離し認証境界を固定するため。 |
| OAC | Static Originに必須適用 | S3直アクセスを抑止し、配信経路をCloudFrontへ一本化するため。 |
| バケットポリシー | CloudFront service principal + distribution条件 | 許可主体を限定し誤公開を防ぐため。 |

## Policy/TLS/ヘッダ
- TLS最小バージョンは `1.2` を維持し、`80/tcp` はHTTPSへリダイレクトする。
- Response Headers Policyはセキュリティヘッダ付与（例: `X-Content-Type-Options`, `X-Frame-Options`）を必須化する。
- 不要なオリジン応答ヘッダは除去し、公開経路での情報露出を最小化する。

## ログ・監視
- CloudFront 5xx率、経路別4xx/5xx率、エッジレイテンシを [[DD-INF-MON-001]] の閾値で監視する。
- invalidation遅延は [[DD-INF-DEP-003]] の基準（10分超Warning）で監視する。

## 運用
- Behavior順序、OAC、認証境界を変更する場合は破壊的変更として [[DD-INF-IAC-001]] の二重承認を適用する。
- `/docs/*` 以外へのFunction紐づけは運用禁止とする。

## 変更履歴
- 2026-02-21: 新規作成（CloudFront設定値の正本をデプロイ文書から分離） [[BD-SYS-ADR-036]]
