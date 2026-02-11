# Document Template

## 本文
- このテンプレートは diopside 向け文書の下書きです。
- Frontmatterは各文書IDに合わせて設定してください。

## 必須観点
- 要求・設計・テストの目的
- TypeScript型安全の基本方針（`tsconfig` と lint の品質ゲート）
- `unknown` 境界、`any` 使用制限、`switch` 網羅性の運用ルール
- 受入条件または確認手順
- 依存/関連リンク（Obsidianリンク）

## 推奨章立て（BD-BUILD）
- 設計方針
- 設計要点（`strict`、`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`、`useUnknownInCatchVariables`）
- lint/CI品質ゲート（`no-explicit-any`、`consistent-type-imports`）
- 受入基準

## 変更履歴
- YYYY-MM-DD: 変更要約
