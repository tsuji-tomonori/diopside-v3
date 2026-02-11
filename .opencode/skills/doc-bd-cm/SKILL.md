---
name: doc-bd-cm
description: BD-CM（構成管理）文書を新規作成・改訂するときに、構成管理方針と文書運用手順をdiopside規約準拠で整備する
metadata:
  short-description: BD-CM 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使うとき
- `BD-CM-*` の新規作成・改訂で、構成管理方針（変更分類ごとの更新対象、同一変更原則、検証順序）を定義・更新するとき。
- `docs` と `.opencode/skills` の同時更新や、`reports/impact_check_YYYY-MM-DD.md` への影響記録を伴う変更を扱うとき。

## このスキルを使わないとき
- FR要件定義や画面設計など、構成管理方針以外の主題を更新するとき（対応する `doc-*` スキルを使う）。
- 用語リンク補正やリンク整合チェックだけを実施するとき（`obsidian-doc-new` / `obsidian-doc-check` を使う）。

## 出力契約
- 対象 `BD-CM-*` 文書が、必須frontmatter・`filename == id`・`up/related` 整合を満たして更新されていること。
- 構成管理方針として、変更分類に応じた更新対象、`docs`/`.opencode/skills` 同一変更原則、`auto_link_glossary.py -> validate_vault.py` の順序固定が本文で明示されていること。
- 意味変更時は `version` PATCH更新、`updated` 当日更新、`## 変更履歴` の当日追記が反映されていること。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- スキル同期設計（変更分類ごとの更新対象、同一変更原則、検証順序）。
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
- 変更分類（文書種別/共通規約）ごとのスキル更新対象が明示されていることを確認する。
- `docs` と `.opencode/skills` の同一変更方針、および `auto_link_glossary.py -> validate_vault.py` の順序固定が記載されていることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
