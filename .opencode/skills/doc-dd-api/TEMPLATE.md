# Document Template

## 本文
- このテンプレートは diopside 向け文書の下書きです。
- Frontmatterは各文書IDに合わせて設定してください。

## 必須観点
- 要求・設計・テストの目的
- 受入条件または確認手順
- 依存/関連リンク（Obsidianリンク）
- ValidationTargets別の入力検証（`param/query/header/cookie/json/form`）と適用順
- Hono + Zod 実装規約（`@hono/zod-openapi`、`OpenAPIHono`、`createRoute()`、`app.openapi()`）
- スキーマ規約（`z` import元、`.openapi('SchemaName')`、`example`/`description`/`param`）
- ルート規約（`summary`/`operationId`/`tags`、`request.params/query/body`、`responses` 成功/失敗）
- Problem Details応答（`application/problem+json`、`type/title/status/detail/instance`、拡張項目）
- 例外統一（`HTTPException`、`app.notFound`、`app.onError`、Zodエラー整形）
- HTTPステータス詳細（`201` + `Location`、`429` + `Retry-After`、`4xx/5xx` 使い分け）
- ページング詳細（cursor生成/検証、上限、不正cursor時挙動）
- 可観測性詳細（`X-Request-Id`、`traceparent`、ログ相関）
- 型推論とRPC共有（ルート直後ハンドラ、`factory.createHandlers()` 採用条件、`AppType` export）

## 変更履歴
- YYYY-MM-DD: 変更要約（関連ADR: [[BD-ADR-xxx]]）
