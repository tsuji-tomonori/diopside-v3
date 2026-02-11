---
name: doc-dd-comp
description: DD-COMP（コンポーネント詳細）文書を作成・更新するときに、責務分割と依存関係をdiopside規約準拠で整理する
metadata:
  short-description: DD-COMP 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。
- DDフェーズのコンポーネント詳細で、分割方針・責務対応・I/O境界を追跡可能に保つ。

## このスキルを使う条件
- `DD-COMP-*` 文書を新規作成・改訂し、コンポーネントの責務や境界を明文化したいとき。
- `web/` 実装の責務分担変更に合わせて、詳細設計との差分を解消したいとき。

## このスキルを使わない条件
- 要求（RQ）や基本設計（BD）の更新が主目的で、コンポーネント詳細の変更がないとき。
- API契約の主変更を扱う場合（`DD-API-*` を優先）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- コンポーネントごとの責務、主要I/O、依存先、関連要求/テストへのトレース。
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

## 出力契約
- 出力は `DD-COMP-*` の単一文書更新（必要時のみ関連文書更新）とし、`id` とファイル名を一致させる。
- 本文には少なくとも `詳細仕様` と `I/Oまたは責務` を含め、責務分割の判断根拠を読める状態にする。
- 変更に伴う `updated` / `version` / `変更履歴` の整合を維持する。
