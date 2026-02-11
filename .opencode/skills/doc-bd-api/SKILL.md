---
name: doc-bd-api
description: BD-API（API基本設計）文書を新規作成・改訂するときに、diopside規約準拠で作成・更新する
metadata:
  short-description: BD-API 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- BDフェーズのAPI仕様（エンドポイント、入出力、認証/認可、エラー契約）を新規作成・改訂するとき。
- 要求変更により、APIのI/F契約や後方互換条件の見直しが必要なとき。

## このスキルを使わない条件
- 要求定義（RQ-*）のみを更新する作業、または実装詳細中心の設計（DD-*）を更新する作業。
- UI/運用手順など、API契約を主題としない文書の更新。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- APIの利用目的、対象利用者、エンドポイント単位の要求/応答、エラー契約、互換性方針。
- HTTPセマンティクス（GET/POST/PUT/PATCH/DELETE の意味、冪等性、安全性）とステータスコード方針。
- 一覧取得のページング方式（`limit` + `cursor` 推奨、cursorはopaque）と検索パラメータ統一方針。
- エラー形式の標準（`application/problem+json`、`type/title/status/detail/instance`）と拡張項目方針。
- Hono + Zod を採用するAPIの実装規約（`@hono/zod-openapi` 統一、`OpenAPIHono`、`createRoute()`、`app.openapi()`）。
- ValidationTargets単位の検証（`param/query/header/cookie/json/form`）、`c.req.valid(...)` 利用、`HTTPException` と `app.onError` 集約。
- Schema-first 方針（`z` は `@hono/zod-openapi` から import、`.openapi('SchemaName')`、`example`/`description`/`param` メタ付与）。
- ルート契約規約（`summary`/`operationId`/`tags` 必須、`request.params`、`responses` の成功/失敗スキーマ定義）。
- OpenAPI公開規約（`/openapi/v1/openapi.json`、`/openapi/`）と `/api/v1/*` 版対応。
- バリデーションエラー整形方針（`z.flattenError()` / `z.treeifyError()`）と機械可読フィールドの定義。
- Zod v4 前提の運用方針（`safeParseAsync`、未知キー strict/loose 方針、`z.input`/`z.output` の型境界）。
- RPC型共有時の運用（`AppType` export、メソッドチェーン定義、`hc<AppType>` 利用）。
- バージョニング/廃止（SemVer、`deprecated: true`、移行手順、Sunset）と契約運用（OpenAPI正本、CI破壊的変更検知）。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- 対象文書は `filename == id` を満たし、Frontmatter必須キーを欠落なく保持する。
- API仕様の変更理由と影響範囲を `up/related` で追跡可能にし、必要に応じて関連文書へ反映する。
- 設計変更時は同一変更でADRを更新し、BD文書の `## 変更履歴` 各行に `[[BD-ADR-xxx]]` を付与する。
- 変更後の整合チェック結果（用語リンク補正と検証）をリポジトリ手順に沿って確認できる状態にする。

## Frontmatter運用
- `phase` は ID prefix と一致させる。
- `owner` は `RQ-SH-*` を使う。
- 意味変更時は `version` をPATCH更新する。
- `updated` は作業日へ更新する。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- `GET` にボディを持たせない設計になっていることを確認する。
- PUT/DELETE の冪等性、POST作成時の `201` + `Location`、レート制限時の `429` + `Retry-After` が定義されていることを確認する。
- Problem Details必須メンバー（`type/title/status/detail/instance`）を欠落なく定義していることを確認する。
- `param/query/header/cookie/json/form` の必要箇所が定義され、`json/form` の `Content-Type` 条件と `header` 小文字運用が明記されていることを確認する。
- 検証済み入力が `c.req.valid(...)` 経由に統一され、未検証入力の利用を許容していないことを確認する。
- `@hono/zod-openapi` の `OpenAPIHono` / `createRoute()` / `app.openapi()` で契約と実装を接続していることを確認する。
- スキーマの `z` import元が `@hono/zod-openapi` であり、`.openapi()` メタが運用されていることを確認する。
- ルートごとに `summary`/`operationId`/`tags` と `responses`（成功/失敗）が定義されていることを確認する。
- バリデーション失敗が `HTTPException(400, { cause })` と `app.onError` 集約で返却される方針を確認する。
- RPC採用時に `AppType` export とメソッドチェーン定義が記載されていることを確認する。
- OpenAPIを契約正本として、Lint/破壊的変更検知/契約テストの運用が記述されていることを確認する。
- OpenAPI JSON配布（`/openapi/v1/openapi.json`）と仕様UI配布（`/openapi/`）が記述されていることを確認する。
- `## 変更履歴` 各行に `[[BD-ADR-xxx]]` が含まれていることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
