---
name: doc-rq-gl
description: doc-rq-gl に対応するdiopside文書を規約準拠で作成・更新する
metadata:
  short-description: RQ-GL 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/term_en/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## Frontmatter運用
- `phase` は ID prefix と一致させる。
- `owner` は `RQ-SH-*` を使う。
- `term_en` は ASCII の `snake_case` で定義し、同義の英名を重複登録しない。
- 意味変更時は `version` をPATCH更新する。
- `updated` は作業日へ更新する。

## 定義運用
- `## 定義` の用語説明には英名を併記する（例: `英名: \`term_en\``）。
- `## 定義` は表形式（`用語ID/用語名/英名/定義/判定条件/適用範囲`）を標準とする。
- プログラム実装では原則 `term_en` を識別子の基準語彙として参照する。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- 変更後に `python3 .codex/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .codex/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
