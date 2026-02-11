---
name: doc-bd-tst
description: BD-TST（テスト戦略）文書を新規作成・改訂する際に、テストレベル/対象範囲/合否判定をdiopside規約準拠で整備する
metadata:
  short-description: BD-TST 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `BD-TST-*`（テスト戦略）文書を新規作成・更新する。
- 単体/結合/受入の責務分担、テスト対象範囲、合否判定基準を基本設計として明文化する。

## このスキルを使わない条件
- 実装コード単位のテストケース詳細やモック設計を主対象にする場合（`UT-*` / `doc-ut-*` を使う）。
- 運用受入の実行手順や判定記録を主対象にする場合（`AT-*` / `doc-at-*` を使う）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- テストレベル別の対象範囲（UT/IT/AT）と責務境界。
- エントリ条件/完了条件（Go/No-Goに接続できる判定条件）。
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
- 要求起点の設計変更では `RDR -> ADR -> BD-TST` を辿れるリンク整合を確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 出力契約
- 出力は `BD-TST-*` 1ファイルのみを対象とし、1トピック原則を守る。
- Frontmatter必須キーを完備し、`phase: BD`・`owner: RQ-SH-*`・`updated` 当日を満たす。
- 本文は「テストレベル別範囲/責務境界/判定条件」を含み、UT/IT/ATやGo/No-Go文書へ接続できる。
