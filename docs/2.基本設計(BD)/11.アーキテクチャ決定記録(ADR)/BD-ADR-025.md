---
id: BD-ADR-025
title: Hono + Zod の入力検証と例外処理を標準化する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
  - '[[RQ-SEC-001]]'
  - '[[RQ-INT-001]]'
  - '[[RQ-DEV-001]]'
related:
  - '[[BD-API-005]]'
  - '[[BD-API-002]]'
  - '[[BD-API-003]]'
  - '[[DD-API-001]]'
  - '[[DD-ERR-001]]'
tags:
  - diopside
  - BD
  - ADR
---

## 決定事項
- API契約の定義方式は `@hono/zod-openapi` に統一し、`OpenAPIHono` + `createRoute()` + `app.openapi()` を標準実装とする。
- API実装では Hono のルート境界で入力を検証し、`param/query/header/cookie/json/form` を必要箇所ごとに分割して Zod で検証する。
- 検証済みデータは `c.req.valid(...)` のみを利用し、ハンドラ内部で未検証データを扱わない。
- バリデーション失敗は `HTTPException(400, { cause: zodError })` で送出し、`app.onError` で統一形式（Problem Details + 検証詳細）へ整形する。
- 404 は `app.notFound`、未捕捉例外は `app.onError` でトップレベル集約する。
- 型推論維持のため、ルート定義直後にハンドラを記述する。分離が必要な場合のみ `factory.createHandlers()` を採用する。
- RPC型共有を行うAPIは `AppType` を export し、メソッドチェーンでルートを定義する。
- OpenAPI 仕様は `createRoute()` の request/response 定義から生成し、`/openapi/v1/openapi.json` と `/openapi/` で配布する。

## 理由
- 入力検証、例外整形、型推論が実装者ごとに揺れると、同一API群でもエラー挙動と保守性が不一致になる。
- `HTTPException` と `app.onError` へ集約すると、監視・ログ相関・クライアント実装を統一できる。
- Hono の推論が効く記述スタイルを固定することで、型安全と実装速度を両立できる。
- スキーマとOpenAPI記述を同一定義へ集約することで、契約と実装の乖離を継続的に抑止できる。

## 影響
- 基本設計: [[BD-API-005]] に Hono + Zod の実装規約を追加する。
- 収集API設計: [[BD-API-002]] に更新系APIの入力検証/エラー処理の準拠先を明記する。
- エラーモデル: [[BD-API-003]] に Zod エラー詳細の返却方針を追加する。
- 詳細設計: [[DD-API-001]] と [[DD-ERR-001]] で `HTTPException`/`onError` の実装マッピングを具体化する。
- スキル運用: `doc-bd-api` / `doc-dd-api` のチェック項目へ `@hono/zod-openapi` 観点を同期する。

## 却下した選択肢
- ハンドラ内部で都度 `parse` する案: 重複実装と例外形式の不一致を招くため不採用。
- バリデーション失敗を各ルートで直接 `c.json` 返却する案: 横断整形が困難になるため不採用。
- controller中心の分離を標準にする案: Hono の型推論が弱くなりやすいため不採用。
- `hono-openapi` を標準化する案: 既存移行の要件がないため、createRoute起点で仕様を一元化できる `@hono/zod-openapi` 統一を優先して不採用。

## 変更履歴
- 2026-02-11: `@hono/zod-openapi` 統一（`OpenAPIHono`/`createRoute`、OpenAPI配布、選定理由）を追記 [[BD-ADR-025]]
- 2026-02-11: 新規作成（Hono + Zod の入力検証・例外処理標準化） [[BD-ADR-025]]
