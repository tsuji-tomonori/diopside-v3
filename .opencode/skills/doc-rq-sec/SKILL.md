---
name: doc-rq-sec
description: doc-rq-sec に対応するdiopsideのセキュリティ要求（RQ-SEC）文書を規約準拠で作成・更新し、統制項目と関連文書の整合を確認する。RQ-SEC文書の追加・変更・レビュー時に使う
metadata:
  short-description: RQ-SEC 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- SnowCard（日本語）の必須項目（要求ID/種別/優先度/要求/根拠/受入基準/例外/依存・関連）。
- セキュリティ統制（認証・認可、入力検証、依存脆弱性、機密情報保護、事故時エスカレーション）の受入条件と例外条件。
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
- RQ-SEC文書を新規作成・更新・レビューし、セキュリティ統制の要求と受入閾値を定義・見直すとき。
- RQ-SECと `BD-SEC` / `DD-SEC` / `AT-RUN` などの関連文書との整合を同一変更で確認するとき。

## 使わない条件
- コード実装のみで、docs/Obsidian文書を更新しないとき。
- RQ-SEC以外（例: FR配置、テスト計画、運用チェックリスト）の更新のみで、セキュリティ要求を変更しないとき。

## 出力
- 対象RQ-SEC文書の更新内容と、追加・変更したセキュリティ統制/受入閾値の要約。
- `RQ-RDR` / `BD-SEC` / `DD-SEC` / `AT-RUN` への反映有無と、実施した整合チェック結果。
