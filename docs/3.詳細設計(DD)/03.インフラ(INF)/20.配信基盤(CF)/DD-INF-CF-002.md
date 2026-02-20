---
id: DD-INF-CF-002
title: CloudFront Function詳細（rewrite）
doc_type: インフラ詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[DD-INF-CF-001]]'
related:
- '[[DD-INF-DEP-002]]'
- '[[AT-SCN-006]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- rewrite対象は `/docs/*` のみとし、`/api/*` と `/openapi/*` は対象外とする。
- CloudFront Functionはviewer-requestで実行し、拡張子補完とindex解決のみを行う。

## rewrite規則
| 入力パス | 出力パス | 備考 |
|---|---|---|
| `/docs/` | `/docs/index.html` | ルート解決 |
| `/docs/path` | `/docs/path.html` | 拡張子補完 |
| `/docs/path/` | `/docs/path/index.html` | ディレクトリ解決 |

## 非適用規則
- `/api/*` はrewrite禁止。
- `/openapi/*` はrewrite禁止。
- `/web/*` はSPA fallbackで扱い、Functionでは書き換えない。

## テスト観点
- `/docs/` と `/docs/path` が200到達すること。
- `/api/v1/*` がrewriteされず認証境界を維持すること。
- `/openapi/v1/openapi.json` がrewriteされず短TTLで配信されること。

## 変更履歴
- 2026-02-21: 新規作成（rewrite仕様を配信基盤章へ集約） [[BD-SYS-ADR-036]]
