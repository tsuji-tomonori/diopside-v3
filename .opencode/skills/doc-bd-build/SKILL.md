---
name: doc-bd-build
description: doc-bd-build に対応するdiopside文書を規約準拠で作成・更新する
metadata:
  short-description: BD-BUILD 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- TypeScript型安全方針（`tsconfig` 基準、`any` 抑止、`unknown` 境界、lintゲート）。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## Frontmatter運用
- `phase` は ID prefix と一致させる。
- `owner` は `RQ-SH-*` を使う。
- 意味変更時は `version` をPATCH更新する。
- `updated` は作業日へ更新する。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- TypeScript型安全を扱う場合、`strict`/`noUncheckedIndexedAccess`/`exactOptionalPropertyTypes`/`useUnknownInCatchVariables` の4設定を明記する。
- `@typescript-eslint/no-explicit-any` と `@typescript-eslint/consistent-type-imports` を受入条件へ含める。
- 外部入力境界を `unknown` で受け、絞り込み後に内部型へ変換する手順を記載する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
