---
name: doc-rq-rdr
description: doc-rq-rdr に対応するdiopsideの要求定義記録（RDR）を規約準拠で作成・更新し、要求追加・意味変更時の判断根拠と関連文書整合を確認する。要求文書の追加・変更・レビュー時に使う
metadata:
  short-description: RQ-RDR 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求追加・意味変更の背景、判断根拠、関連文書への反映方針。
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
- 要求追加・意味変更を伴う場合、同一変更内で対象RQ文書との対応関係が辿れることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 使う条件
- RQ文書の追加・意味変更に合わせて、判断根拠や配置理由をRDRへ記録するとき。
- 要求変更の経緯を、関連RQ/ADRと辿れる形でレビューしたいとき。

## 使わない条件
- RDRを伴わない軽微な表記修正のみで、要求判断の記録更新が発生しないとき。
- 要求IDや変更理由が未確定で、判断根拠を記述できないとき。

## 出力
- 更新したRDR項目と、要求追加・意味変更に対する判断根拠の要約。
- 対応するRQ/関連文書への反映状況と、実施した整合チェック結果。
