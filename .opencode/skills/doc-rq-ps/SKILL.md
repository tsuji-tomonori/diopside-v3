---
name: doc-rq-ps
description: doc-rq-ps に対応するdiopsideの性能要求（RQ-PS）文書を規約準拠で作成・更新し、受入閾値と計測条件の整合を確認する。性能要求（RQ-PS）文書の追加・変更・レビュー時に使う
metadata:
  short-description: RQ-PS 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 性能要件の意図、受入条件（p95閾値・対象操作・計測条件）、関連リンク。
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
- SnowCard の `受入基準` が対象操作ごとに計測可能な数値（例: p95）と計測条件を含むことを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 使う条件
- RQ-PS文書を新規作成・更新・レビューし、主要操作の性能受入閾値を明確化するとき。
- 性能劣化時の例外運用や、`DD-PERF`/`AT-RPT` への接続を同一変更で整合させるとき。

## 使わない条件
- 性能以外（例: 可用性/セキュリティ/コスト）の要求だけを更新するとき。
- 実装コードのみを変更し、`docs/**` の RQ-PS 文書を更新しないとき。

## 出力契約
- 更新対象の RQ-PS 文書で、性能目標・計測条件・例外条件・依存リンクが規約に沿っていること。
- 変更理由の要約と、実施した整合チェック（リンク/検証スクリプト）の結果。
