---
name: doc-ut-case
description: UT-CASE（単体テストケース）文書を新規作成・改訂するときに、API/モジュール単位の手順と期待結果をdiopside規約準拠で整備する
metadata:
  short-description: UT-CASE 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `UT-CASE-*` の新規作成、または既存ケースの手順・期待結果・前提条件を更新するとき。
- `[[UT-PLAN-*]]` や `[[DD-API-*]]` の変更に追従して、単体テストケースの内容を同期するとき。

## このスキルを使わない条件
- 単体テスト計画全体（方針/体制/対象範囲）を更新したいだけの場合（`doc-ut-plan` を使う）。
- 単体テスト結果の実績記録を更新する場合（`doc-ut-rpt` を使う）。
- 単体テストデータの設計内容を更新する場合（`doc-ut-tdat` を使う）。

## 出力契約
- 出力対象は `docs/4.単体テスト(UT)/21.単体テストケース/UT-CASE-*.md` の単一文書とし、`filename == id` を維持する。
- 本文には少なくとも `対象API/対象モジュール` `テスト目的` `手順` `期待結果` を含め、必要に応じて `前提` を追加する。
- `up` には `[[UT-PLAN-*]]` と必要な設計文書（例: `[[DD-API-*]]`）を設定し、`related` には結合テストケース（`[[IT-CASE-*]]`）等の接続先を設定する。

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
