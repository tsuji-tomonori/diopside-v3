---
id: DD-INF-CF-002
title: CloudFront Function詳細（rewrite）
doc_type: インフラ詳細
phase: DD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-03-07'
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
- CloudFront Functionは viewer-request で実行し、`/docs/*` の拡張子補完と `/web/*` の SPA fallback を扱う。
- `/api/*` と `/openapi/*` は Function 非適用とし、認証/契約応答を HTML へ置換しない。

## rewrite規則
| 入力パス | 出力パス | 備考 |
|---|---|---|
| `/docs/` | `/docs/index.html` | ルート解決 |
| `/docs/path` | `/docs/path.html` | 拡張子補完 |
| `/docs/path/` | `/docs/path/index.html` | ディレクトリ解決 |
| `/web` / `/web/` | `/web/index.html` | SPA入口 |
| `/web/path` | `/web/index.html` | 拡張子なし deep link |
| `/web/path/` | `/web/index.html` | ディレクトリ形式 deep link |

## 非適用規則
- `/api/*` はrewrite禁止。
- `/openapi/*` はrewrite禁止。
- `/web/*.json`、`/web/assets/*` など拡張子付き静的アセットは書き換えない。

## テスト観点
- `/docs/` と `/docs/path` が200到達すること。
- `/web/` と `/web/<deep-path>` が `index.html` へ収束し、静的アセット要求は維持されること。
- `/api/v1/*` がrewriteされず認証境界を維持すること。
- `/openapi/v1/openapi.json` がrewriteされず短TTLで配信されること。

## 変更履歴
- 2026-03-07: `/web/*` のSPA fallbackをCloudFront Functionで実装する詳細へ更新 [[BD-SYS-ADR-014]]
- 2026-02-21: 新規作成（rewrite仕様を配信基盤章へ集約） [[BD-SYS-ADR-036]]
