---
name: doc-it-rst
description: IT-RST（結合テスト結果）文書を新規作成・改訂するときに、実施結果・不具合・再実行判断をdiopside規約準拠で記録する
metadata:
  short-description: IT-RST 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `IT-RST-*` の新規作成、または既存結果の実行ログ・判定・是正履歴を更新するとき。
- `[[IT-CASE-*]]` の実施結果を取り込み、Go/No-Go や再実行要否の判断記録を残すとき。

## このスキルを使わない条件
- 結合テストの計画（体制/範囲/入口出口条件）を更新するだけの場合（`doc-it-plan` を使う）。
- テストケース定義（手順/期待結果）を更新する場合（`doc-it-case` を使う）。

## 出力契約
- 出力対象は `docs/5.結合テスト(IT)/41.結合テスト結果/IT-RST-*.md` の単一文書とし、`filename == id` を維持する。
- 本文には少なくとも `実施範囲` `結果サマリ` `不具合/課題` `再実行判断` を含め、ケース単位の記録がある場合は `[[IT-CASE-*]]` を明示する。
- `up` には根拠となる `[[IT-PLAN-*]]` または `[[IT-CASE-*]]` を設定し、`related` には受入側の接続先（`[[AT-PLAN-*]]` など）を設定する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
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
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
