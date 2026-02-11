# Document Template

## 本文
- このテンプレートは diopside 向け文書の下書きです。
- Frontmatterは各文書IDに合わせて設定してください。

## 必須観点
- 要求・設計・テストの目的
- TypeScript型安全の基本方針（`tsconfig` と lint の品質ゲート）
- `unknown` 境界、`any` 使用制限、`switch` 網羅性の運用ルール
- 防御的型付け（Brand/Opaque、判別可能union、センチネル値禁止、`boolean` blindness回避）
- 空配列前提の防止（`NonEmptyArray` 相当または事前検証）
- unsafe cast（`as any`）の局所化と記録ルール
- リソース解放保証（`using` または `try/finally`）
- CDK決定性（`synth` 副作用ゼロ、`cdk.context.json` 固定、props注入）
- CDK依存整合（`aws-cdk-lib` / `constructs`）と `cdk-nag` の品質ゲート
- Next.js本番ゲート（`next build` + `next start`）
- Next.jsキャッシュ/再検証（`cache`/`revalidate`/`tags`、`revalidatePath`/`revalidateTag`）
- Next.js最適化（`next/image`、`<Script>`、bundle analyzer、Web Vitals）
- 受入条件または確認手順
- 依存/関連リンク（Obsidianリンク）

## 推奨章立て（BD-BUILD）
- 設計方針
- 設計要点（`strict`、`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`、`useUnknownInCatchVariables`）
- 防御的型付け要点（Brand、境界decode、Option/Result、NonEmpty、resource cleanup）
- lint/CI品質ゲート（`no-explicit-any`、`consistent-type-imports`）
- Next.js品質ゲート（build/start、Dynamic API利用位置、Suspense/loading、画像/Script）
- 受入基準

## 変更履歴
- YYYY-MM-DD: 変更要約（関連ADR: [[BD-ADR-xxx]]）
