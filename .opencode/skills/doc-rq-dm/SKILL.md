---
name: doc-rq-dm
description: doc-rq-dm に対応するdiopside文書を規約準拠で作成・更新するときに使う
metadata:
  short-description: RQ-DM 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `RQ-DM-*` の要求文書を新規作成または改訂するとき。
- RQ文書の必須Frontmatterと本文構造を、diopside規約へ合わせる必要があるとき。
- 本文中のID参照や用語リンク（`RQ-GL-*`）をObsidianリンクへ整備するとき。

## このスキルを使わない条件
- FRカテゴリ配置の判断や整理が主目的のとき（`doc-rq-fr` を使う）。
- RQ以外の設計/テスト文書（BD/DD/UT/IT/AT）を更新するとき。
- 文書内容の妥当性評価だけを行い、文書更新を伴わないレビュー作業のとき。

## 出力契約
- 対象 `RQ-DM-*` 文書が、`filename == id` と必須Frontmatterを満たした状態で更新されていること。
- 本文中のID参照と用語リンクが Obsidianリンク（`[[ID]]`）で記述されていること。
- `validate_vault.py` 実行後の検証結果が `reports/doc_check.md` に反映されていること。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- 本文中の文書ID参照（`RQ-DM-*` など）をObsidianリンク（`[[ID]]`）で記述する。
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
- 本文中の文書ID参照をコード表記（`\`ID\``）のまま残さない。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
