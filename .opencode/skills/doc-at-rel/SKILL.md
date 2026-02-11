---
name: doc-at-rel
description: 配信手順書（AT-REL）文書を追加・更新する際に、公開手順・前提条件・配信後確認をdiopside規約に沿って整備する
metadata:
  short-description: AT-REL 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `AT-REL-*`（配信手順書）文書を新規作成・更新する。
- `task docs:deploy` などの公開手順、前提条件、反映確認/経路確認を受入可能な形で明文化する。

## このスキルを使わない条件
- Go/No-Goの判定条件や判定記録を主対象にする場合（`AT-GO-*` を使う）。
- テスト実行時の障害切り分け・再実行手順を主対象にする場合（`AT-RUN-*` を使う）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 配信目的、前提条件（認証/リポジトリ状態/依存ディレクトリなど）、実行手順（コマンドと確認点）。
- 配信後の確認観点（反映確認、公開/保護経路の境界、異常時の参照先）。
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
- 配信手順が単一の流れとして再実行可能で、確認観点が手順内で追跡できることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 出力契約
- 出力は `AT-REL-*` 1ファイルのみを対象とし、1トピック原則を守る。
- Frontmatter必須キーを完備し、`phase: AT`・`owner: RQ-SH-*`・`updated` 当日を満たす。
- 本文は「配信目的/前提条件/配信手順/判定基準」を含み、`up`/`related` のObsidianリンクと整合する。
