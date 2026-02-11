---
name: doc-rq-gl
description: RQ-GL（用語集要求）文書を新規作成・改訂するときに、diopside規約準拠で作成・更新する
metadata:
  short-description: RQ-GL 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `RQ-GL-*` 文書を新規作成・改訂し、用語定義や判定条件を追加・変更するとき。
- 用語ID/英名（`term_en`）/適用範囲の整合を取りながら、関連文書へのリンクを更新するとき。

## このスキルを使わない条件
- 機能要求（`RQ-FR-*`）や非機能要求の本文改訂が主目的のとき（対応する `doc-rq-*` スキルを使う）。
- 用語定義を変えず、リンク検査や体裁確認だけを実施するとき（`obsidian-doc-check` を優先する）。

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
- タクソノミ系用語（例: `タグ種別`）は、別表として `タグ種別/説明/付与ルール` を定義し、運用時の判定基準を明示する。
- プログラム実装では原則 `term_en` を識別子の基準語彙として参照する。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 出力契約
- 出力は「更新した `RQ-GL-*` 文書（1トピック=1ファイル）」を中心とし、定義表と `term_en` の整合を満たすこと。
- 意味変更がある場合は `version`（PATCH）と `updated` を更新し、`up/related` で関連文書を辿れる状態にすること。
- 品質チェック実行後、必要な差分（文書本体と `reports/doc_check.md`）のみを提示すること。
