# Document Template

## 本文
- このテンプレートは diopside 向け文書の下書きです。
- Frontmatterは各文書IDに合わせて設定してください。

## 必須観点
- 要求・設計・テストの目的
- 受入条件または確認手順
- 依存/関連リンク（Obsidianリンク）
- HTTPメソッドの意味論（GET/POST/PUT/PATCH/DELETE）とステータス運用
- 一覧取得のページング方針（`limit` + `cursor`、opaque cursor）
- エラー標準（`application/problem+json`、`type/title/status/detail/instance`）
- Hono + Zod 実装規約（`@hono/zod-openapi`、`OpenAPIHono`、`createRoute()`、`app.openapi()`）
- ValidationTargets（`param/query/header/cookie/json/form`）と `c.req.valid(...)`
- Schema-first規約（`z` import元、`.openapi('SchemaName')`、`example`/`description`/`param`）
- ルート契約規約（`summary`/`operationId`/`tags`、`request.params`、`responses` の成功/失敗）
- バリデーション詳細の返却規約（`z.flattenError()` または `z.treeifyError()`）
- Zod v4 運用方針（`safeParseAsync`、未知キー strict/loose、`z.input`/`z.output`）
- RPC型共有規約（`AppType` export、メソッドチェーン、`hc<AppType>`）
- 互換性/廃止方針（SemVer、`deprecated: true`、移行期間）
- 契約運用（OpenAPI正本、Lint、破壊的変更検知、コントラクトテスト）
- OpenAPI公開経路（`/openapi/v1/openapi.json`、`/openapi/`、`/api/v1/*` 版整合）

## 変更履歴
- YYYY-MM-DD: 変更要約（関連ADR: [[BD-ADR-xxx]]）
