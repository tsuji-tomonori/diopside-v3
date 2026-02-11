---
id: DD-DEP-002
title: CloudFrontパス分岐詳細
doc_type: デプロイ詳細
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[BD-DEP-004]]'
- '[[BD-ADR-014]]'
related:
- '[[RQ-FR-025]]'
- '[[DD-API-010]]'
- '[[DD-DEP-003]]'
- '[[DD-DEP-004]]'
- '[[AT-SCN-006]]'
tags:
- diopside
- DD
- DEP
---

## 詳細仕様
- CloudFront behaviorは次順序で定義する。
  1. `/api/*`
  2. `/openapi/*`
  3. `/docs/*`
  4. `/web/*`
  5. `/*`
- `/*` は `/web/` へ301/302で誘導し、静的配信を行わない。
- CloudFront Functionは `/docs/*` にのみ紐づける。

## 適用条件
- 本詳細は単一CloudFront分岐を導入するPhase 2で適用する。
- Phase 1のdocs単独公開（[[DD-DEP-001]]）で運用手順が安定していることを前提とする。

## 領域別詳細の参照
- docs配信の詳細は [[DD-DEP-001]] を参照する。
- front配信の詳細は [[DD-DEP-003]] を参照する。
- backend配備の詳細は [[DD-DEP-004]] と [[DD-API-010]] を参照する。
- 本書はinfra（CloudFront分岐・behavior順序・rewrite境界）の正本として扱う。

## behavior別設定
| Path | Origin | Cache | Function | 備考 |
|---|---|---|---|---|
| `/api/*` | API | Disabled | None | Authorization転送必須 |
| `/openapi/*` | Static | Short/Long mix | None | `/openapi/v1/openapi.json` 短TTL |
| `/docs/*` | Static | HTML短TTL | pretty-url-rewrite | 拡張子補完許可 |
| `/web/*` | Static | HTML短TTL | None | SPA fallback |
| `/*` | Redirect | Disabled | None | `/web/` 誘導 |

## rewriteルール
- 対象は `/docs/*` のみ。
- 補完規則:
  - `/docs/` -> `/docs/index.html`
  - `/docs/path` -> `/docs/path.html`
  - `/docs/path/` -> `/docs/path/index.html`
- `/api/*` と `/openapi/*` は書き換え禁止。

## 監視観点
- path別4xx/5xx率（`/web`, `/docs`, `/openapi`, `/api/v1`）
- `/api/*` の認証エラー率
- `/openapi/v1/openapi.json` の可用性

## 変更履歴
- 2026-02-11: 領域別詳細（docs/front/backend）の参照マップを追加
- 2026-02-11: Phase 2適用条件（Phase 1安定化前提）を追記
- 2026-02-11: 新規作成
