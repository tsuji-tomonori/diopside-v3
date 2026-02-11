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
- 互換性/廃止方針（SemVer、`deprecated: true`、移行期間）
- 契約運用（OpenAPI正本、Lint、破壊的変更検知、コントラクトテスト）

## 変更履歴
- YYYY-MM-DD: 変更要約（関連ADR: [[BD-ADR-xxx]]）
