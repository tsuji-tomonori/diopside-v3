---
name: doc-ut-rpt
description: 単体テスト報告（UT-RPT）文書を追加・改訂するときに、実行結果・不具合・再実行判断をdiopside規約準拠で記録する
metadata:
  short-description: UT-RPT 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `UT-RPT-*` 文書を新規作成するとき。
- 単体テストの実行結果（成功/失敗/未実行）や、失敗原因・再実行の判断を更新するとき。

## このスキルを使わない条件
- 単体テスト計画（対象範囲・体制・実施方針）を更新したい場合（`doc-ut-plan` を使う）。
- 単体テストケース（手順・期待結果）を更新したい場合（`doc-ut-case` を使う）。
- 品質メトリクス定義や閾値を更新したい場合（`doc-ut-met` を使う）。

## 出力契約
- 出力対象は `docs/4.単体テスト(UT)/51.単体テストレポート/UT-RPT-*.md` の単一文書とし、`filename == id` を維持する。
- 本文には少なくとも `実行日` `対象（モジュール/API）` `実行コマンド` `結果（件数または合否）` `失敗時の原因と再実行方針` を含める。
- `up` にはテスト計画・設計の根拠文書（例: `[[UT-PLAN-*]]` `[[DD-API-*]]`）を設定し、`related` には後続工程の文書（例: `[[IT-PLAN-*]]`）を設定する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 実行結果の要約（対象、件数、成功/失敗、未実行有無）。
- 失敗または保留項目がある場合の原因、暫定対処、再実行条件。
- 要求または設計の意図、関連リンク。
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
