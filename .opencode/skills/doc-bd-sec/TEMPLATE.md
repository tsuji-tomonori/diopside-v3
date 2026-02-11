# Document Template

## 本文
- このテンプレートは diopside 向け文書の下書きです。
- Frontmatterは各文書IDに合わせて設定してください。

## 必須観点
- 要求・設計・テストの目的
- セキュリティ境界（対象/対象外、公開経路/管理経路）
- Next.js App Router のデータ境界（Server Components/Client Components/Server Actions）
- 認証・認可境界（`/openapi/*`, `/api/v1/*`）
- 秘密情報管理（`.env`, `NEXT_PUBLIC_`）と公開可否判定
- CSP、3rd party script 制御、監査ログ観点
- 受入条件または確認手順
- 依存/関連リンク（Obsidianリンク）

## 変更履歴
- YYYY-MM-DD: 変更要約（関連ADR: [[BD-ADR-xxx]]）
