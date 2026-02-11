---
name: doc-dd-api
description: DD-API（API詳細設計）文書を新規作成・改訂するときに、diopside規約準拠で作成・更新する
metadata:
  short-description: DD-API 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- DDフェーズのAPI詳細設計（エンドポイント内部処理、入力検証、例外マッピング、再実行/冪等性）を新規作成・改訂するとき。
- BD-APIや要求変更を受けて、実装に近いI/F仕様や失敗時挙動の具体化が必要なとき。

## このスキルを使わない条件
- 要求定義（RQ-*）のみの更新、または基本設計（BD-API）レベルで契約方針だけを見直す作業。
- DB構造やUI遷移など、API詳細設計を主題としない文書の更新。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- API処理フロー、入力検証規則、外部依存の呼び出し順、エラー/例外の返却条件、冪等性・再試行方針。
- HonoのValidationTargets（`param/query/header/cookie/json/form`）単位の検証設計と適用順。
- `@hono/zod-openapi` 利用時の `OpenAPIHono`、`createRoute()`、`app.openapi()` の実装規約。
- `request.params/query/body` の定義位置、`safeParseAsync` 前提、`c.req.valid(...)` 利用規約。
- スキーマ記述規約（`z` import元統一、`.openapi('SchemaName')`、`example`/`description`/`param`）。
- ルート記述規約（`summary`/`operationId`/`tags`、`responses` の成功/失敗スキーマ）。
- `HTTPException(400, { cause })` と `app.onError` 集約の実装規約、`app.notFound` の扱い。
- Zod v4 エラー整形（`z.flattenError()` / `z.treeifyError()`）と Problem Details拡張フィールドの対応。
- ルート直後ハンドラの原則、分離時の `factory.createHandlers()` 採用条件。
- RPC利用時の `AppType` export とメソッドチェーン定義条件。
- Problem Details（`application/problem+json`）の実装マッピング（`type/title/status/detail/instance` + 拡張）
- HTTPステータス実装規則（`201` + `Location`、`429` + `Retry-After`、`4xx/5xx` 切り分け）
- 一覧APIのページング実装（cursor生成/検証、opaque維持、上限値）
- 可観測性実装（`X-Request-Id`、`traceparent`、ログ相関）
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- 対象文書は `filename == id` を満たし、Frontmatter必須キーを欠落なく保持する。
- API詳細設計の変更理由と影響範囲を `up/related` で追跡可能にし、関連するBD/DD文書と整合した状態にする。
- 設計変更時は同一変更でADRを更新し、BD側の変更履歴で参照可能な状態にする。
- 変更後の整合チェック結果（用語リンク補正と検証）をリポジトリ手順に沿って確認できる状態にする。

## Frontmatter運用
- `phase` は ID prefix と一致させる。
- `owner` は `RQ-SH-*` を使う。
- 意味変更時は `version` をPATCH更新する。
- `updated` は作業日へ更新する。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- Problem Details必須メンバーと拡張項目の責務分離（文字列パース非依存）を確認する。
- `GET` ボディ非利用、PUT/DELETE冪等性、`429` + `Retry-After`、ページサイズ上限が定義されていることを確認する。
- `trace_id`/`request_id`/`instance` でログと応答を相互追跡できることを確認する。
- `json/form` の `Content-Type` 条件、`header` 小文字キー規約、ValidationTargets別の適用順が定義されていることを確認する。
- 検証済みデータの参照が `c.req.valid(...)` に統一され、ハンドラ内で未検証入力を使わないことを確認する。
- `@hono/zod-openapi` の `OpenAPIHono` / `createRoute()` / `app.openapi()` を用いた定義になっていることを確認する。
- `summary`/`operationId`/`tags` と `responses`（成功/失敗）がルート単位で定義されていることを確認する。
- バリデーション失敗が `HTTPException(400, { cause })` を経由して `app.onError` に集約されることを確認する。
- Zod v4 のエラー整形関数（`z.flattenError()`/`z.treeifyError()`）を利用し、`format`/`flatten` 旧運用へ依存しないことを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
