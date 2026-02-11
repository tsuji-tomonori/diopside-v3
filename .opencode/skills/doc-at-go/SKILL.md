---
name: doc-at-go
description: リリース判定（Go/No-Go）文書を追加・更新する際に、判定入力・条件・記録項目をdiopside規約に沿って整備する
metadata:
  short-description: AT-GO 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `AT-GO-*`（リリース判定）文書を新規作成・更新する。
- `AT-RPT-*` / `AT-SCN-*` の受入結果を根拠に、Go/No-Go判定基準を明文化する。

## このスキルを使わない条件
- テスト実行手順そのものを定義する場合（`AT-RUN-*` を使う）。
- 個別シナリオ手順や期待結果を定義する場合（`AT-SCN-*` を使う）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 判定目的、判定入力（最低でも `AT-RPT-*` と関連 `AT-SCN-*`）、Go条件、No-Go条件。
- 判定記録フォーマット（判定日/判定者/例外承認事項/最終判定など）と、必要ならAPI単位の転記表。
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
- Go/No-Go条件が、判定入力（`AT-RPT-*` 等）から追跡可能な形で記述されていることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 出力契約
- 出力は `AT-GO-*` 1ファイルのみを対象とし、1トピック原則を守る。
- Frontmatter必須キーを完備し、`phase: AT`・`owner: RQ-SH-*`・`updated` 当日を満たす。
- 本文は「判定目的/判定入力/Go条件/No-Go条件/判定記録」を含み、`up`/`related` のObsidianリンクと整合する。
