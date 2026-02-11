---
name: doc-bd-adr
description: BD-ADR（アーキテクチャ決定記録）を新規作成・改訂するときに、意思決定の根拠・選択肢・影響をdiopside規約準拠で整理する
metadata:
  short-description: BD-ADR 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `docs/2.基本設計(BD)/11.アーキテクチャ決定記録(ADR)/BD-ADR-*.md` を作成・更新するとき。
- 要求変更や設計方針見直しに伴い、採用判断と非採用案を記録するとき。
- `RQ-RDR` から辿れる設計上の意思決定を追加・更新するとき。

## このスキルを使わない条件
- API仕様や画面仕様など、特定領域の設計本文のみを更新する場合（`doc-bd-api` / `doc-bd-ui` などを使う）。
- 詳細設計（DD）や実装手順の記述が主目的の場合（対応する `doc-dd-*` / `doc-it-*` を使う）。
- 要求そのものの追加・変更が主目的の場合（`doc-rq-*` を使う）。

## 出力契約
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）を満たし、`filename == id` を維持する。
- 本文には少なくとも、`## 決定事項`、`## 理由`、`## 影響`、`## 却下した選択肢`、`## 変更履歴` を含める。
- 決定の根拠と影響先が `RQ-*` / `BD-*` / `DD-*` への Obsidian リンクで追跡可能である。
- 複数トピック混在、本文での上位/下位セクション追加、Mermaid以外の図表形式は行わない。

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
