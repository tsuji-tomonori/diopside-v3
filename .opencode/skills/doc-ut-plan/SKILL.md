---
name: doc-ut-plan
description: UT-PLAN（単体テスト計画）文書を新規作成・改訂するときに、テスト方針・対象範囲・完了条件をdiopside規約準拠で整備する
metadata:
  short-description: UT-PLAN 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `UT-PLAN-*` の新規作成、または既存計画の `テスト目的` `観点` `完了条件` を更新するとき。
- `[[BD-TST-*]]` や `[[DD-API-*]]` の変更に追従して、単体テストの対象範囲・ケース接続方針を更新するとき。

## このスキルを使わない条件
- API/モジュール単位の個別手順・期待結果を更新する場合（`doc-ut-case` を使う）。
- 単体テスト結果の実績記録を更新する場合（`doc-ut-rpt` を使う）。
- 単体テストデータの設計内容を更新する場合（`doc-ut-tdat` を使う）。

## 出力契約
- 出力対象は `docs/4.単体テスト(UT)/11.単体テスト計画/UT-PLAN-*.md` の単一文書とし、`filename == id` を維持する。
- 本文には少なくとも `テスト目的` `観点` `ケース一覧または対象範囲` `完了条件` を含める。
- `up` には方針/設計の根拠文書（例: `[[BD-TST-*]]` `[[DD-API-*]]`）を設定し、`related` には実行計画・下位文書（例: `[[IT-PLAN-*]]` `[[UT-CASE-*]]`）を設定する。

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
