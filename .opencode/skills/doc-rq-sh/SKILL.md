---
name: doc-rq-sh
description: doc-rq-sh に対応するdiopsideのステークホルダー要求（RQ-SH）文書を規約準拠で作成・更新し、スコープ・ユースケースとの整合を確認する。ステークホルダー定義の追加・変更・レビュー時に使う
metadata:
  short-description: RQ-SH 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- ステークホルダーの `## 責務` と `## 関与範囲`（対象機能・判断責任・参照先文書）。
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

## 使う条件
- `RQ-SH-*` 文書の新規作成・更新・レビューを行うとき。
- ステークホルダーの責務/関与範囲変更に伴い、`RQ-SC-*`・`RQ-UC-*` など関連要求との整合を確認したいとき。

## 使わない条件
- コード実装のみで、docs/Obsidian文書を更新しないとき。
- ステークホルダーではない要求カテゴリ（例: FR/NFR）を主対象として更新するとき。

## 出力
- 更新した `RQ-SH-*` 文書と、責務/関与範囲の変更理由の要約。
- 実施した検証（`RQ-SC-*`/`RQ-UC-*` とのリンク整合、RDR更新要否）と結果。
