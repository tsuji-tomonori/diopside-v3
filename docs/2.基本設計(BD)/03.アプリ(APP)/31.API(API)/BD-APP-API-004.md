---
id: BD-APP-API-004
title: OpenAPI配布とAPIバージョン境界
doc_type: API設計
phase: BD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-03-06'
up:
- '[[RQ-FR-025]]'
- '[[RQ-INT-001-01]]'
related:
- '[[BD-SYS-ADR-014]]'
- '[[BD-SYS-ADR-023]]'
- '[[BD-APP-API-005]]'
- '[[BD-INF-DEP-004]]'
- '[[DD-APP-API-010]]'
- '[[BD-APP-OAS-000]]'
- '[[AT-SCN-006]]'
tags:
- diopside
- BD
- API
---

## 設計方針
- APIの公開経路は `/api/v1/*` に統一し、OpenAPI仕様は `/openapi/v1/openapi.json` で配布する。
- HTTP API契約の正本は、`@hono/zod-openapi`（`OpenAPIHono` + `createRoute()` + `app.openapi()`）から生成した OpenAPI とする。
- 設計文書（BD/DD/IT）は実装入力として扱い、機械可読な契約差分判定はOpenAPI生成物で実施する。
- APIごとの契約Markdownは OpenAPI 正本から `[[BD-APP-OAS-000]]` / `BD-APP-OAS-*` を自動生成し、メソッド/パス/パラメータ/戻り値を表形式で配布する。
- 処理フロー・業務制約・オラクルは `DD-APP-API-*` に記載し、IF文書へ混在させない。
- OpenAPI UIは `/openapi/` 配下に配置し、仕様参照先を `/openapi/v1/openapi.json` に固定する。
- API版とOpenAPI版は同一バージョンで管理する。
- バージョン互換性、廃止通知、CI契約検証は [[BD-APP-API-005]] の共通規約に従う。

## 契約一覧
| 種別 | パス | 用途 | 認証 |
|---|---|---|---|
| OpenAPI JSON | `/openapi/v1/openapi.json` | 機械可読仕様 | 必須 |
| OpenAPI UI | `/openapi/` | 人向け仕様閲覧 | 必須 |
| 業務API | `/api/v1/*` | 運用・業務処理 | 必須 |

## バージョニング
- v1は以下を対応付ける。
  - `/openapi/v1/openapi.json`
  - `/api/v1/*`
- 破壊的変更時は v2 を新設し、v1は互換期間終了後に廃止する。
- OpenAPI `info.version` は SemVer で管理し、MAJORを経路版（`v1`/`v2`）変更判断に利用する。

## 廃止運用
- 廃止対象のAPI/スキーマは OpenAPI へ `deprecated: true` を明記する。
- 廃止時は移行先、移行手順、サンセット日を仕様へ記載する。
- 可能な範囲で `Deprecation` と `Sunset` ヘッダを返し、[[RQ-SH-002|利用者]]が検知可能な状態を維持する。

## 認証境界
- `/openapi/*` と `/api/*` は Cognito JWT を必須とする。
- 未認証時は仕様閲覧・API実行のいずれも拒否する。

## 契約検証
- CIで OpenAPI Lint、破壊的変更検知、コントラクトテストを実行する。
- CIで `task api:docs:check` を実行し、OpenAPI 正本から生成される `BD-APP-OAS-*` が最新であることを確認する。
- CIで `task api:openapi:check` を実行し、OpenAPI生成物と `BD-APP-OAS-*` のI/F整合を検出する。
- 破壊的変更が検出された場合は、並行提供計画または新経路版の設計完了まで配信を停止する。

## 変更履歴
- 2026-03-06: OpenAPI 正本から `BD-APP-OAS-*` を表形式で自動生成する運用と `api:docs:check` を追加 [[BD-SYS-ADR-023]]
- 2026-02-28: HTTP API契約の正本を Hono生成OpenAPI へ統一し、文書は実装入力として扱う方針と `api:openapi:check` 運用を追加 [[BD-SYS-ADR-025]]
- 2026-02-11: バージョニング/廃止/CI契約検証の運用規約を追加 [[BD-SYS-ADR-023]]
- 2026-02-11: 新規作成 [[BD-SYS-ADR-014]]
