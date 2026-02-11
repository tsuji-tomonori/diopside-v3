# Document Template

## 本文
- このテンプレートは diopside 向け文書の下書きです。
- Frontmatterは各文書IDに合わせて設定してください。

## 必須観点
- 要求・設計・テストの目的
- 受入条件または確認手順
- 依存/関連リンク（Obsidianリンク）
- HTTP API互換性（メソッド意味論、ステータス、ページング）
- エラー互換性（`application/problem+json`、必須メンバー、拡張項目）
- 廃止/移行（`deprecated: true`、告知、並行提供、サンセット）
- 契約運用（OpenAPI正本、Lint、破壊的変更検知、契約テスト）

## 変更履歴
- YYYY-MM-DD: 変更要約（関連RDR: [[RQ-RDR-xxx]]）
