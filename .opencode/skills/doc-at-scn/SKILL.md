---
name: doc-at-scn
description: AT-SCN（受入テストシナリオ）文書を新規作成・改訂するときに、手順・期待結果・判定基準をdiopside規約準拠で整備する
metadata:
  short-description: AT-SCN 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `docs/6.受入テスト(AT)/21.受入テストシナリオ/AT-SCN-*.md` を新規作成・更新するとき。
- 受入観点の追加や仕様変更に合わせて、前提条件・手順・期待結果・判定基準を見直すとき。
- `AT-PLAN` や `AT-GO` の判定入力に必要なシナリオ粒度へ整備するとき。

## このスキルを使わない条件
- 実行順序や体制など受入全体計画の更新が主目的のとき（`doc-at-plan` を使う）。
- 実行ログ・証跡・結果記録の更新が主目的のとき（`doc-at-rpt` を使う）。
- 手順書運用や実施オペレーションの更新が主目的のとき（`doc-at-run` を使う）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- 本文中の文書ID参照（`DD-API-*` など）をObsidianリンク（`[[ID]]`）で記述する。
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

## 出力契約
- 対象 `AT-SCN-*.md` を1ファイル単位で更新し、Frontmatter必須キーと `filename == id` を満たす。
- 本文は少なくとも「シナリオ目的」「前提条件」「手順」「期待結果」「判定基準対応」「記録項目」「変更履歴」を含み、判定可能な具体性を担保する。
- `up/related` で `AT-PLAN` / `AT-GO` / 関連 `DD-API` へ到達できる状態を維持する。
