---
name: doc-rq-fr
description: doc-rq-fr に対応するdiopsideの機能要求（FR）文書を規約準拠で作成・更新し、機能単位カテゴリ配置と関連文書整合を確認する。機能要求（FR）文書の追加・変更・レビュー時に使う
metadata:
  short-description: RQ-FR 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- FRは機能単位カテゴリ（ING/SCH/TAG/LST/DET/HLW/WCL/OPS）へ配置する。
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
- FR追加/移動時に、実装工程単位（収集実行/データ整備など）へ戻していないことを確認する。
- 生成系要求（例: 派生データ生成）は、独立カテゴリ化せず利用者機能カテゴリへ配置する。
- FRの配置判断が曖昧な場合は、RDRへ配置理由を同一変更で記録する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 使う条件
- FR文書を新規作成・更新・レビューし、カテゴリ（ING/SCH/TAG/LST/DET/HLW/WCL/OPS）配置を判断するとき。
- FR追加/移動に伴い、関連RDRや他要求との整合を同一変更で確認するとき。

## 使わない条件
- FR以外（例: ADR/DD/UT/IT/AT）だけを更新し、FRカテゴリ配置判断が発生しないとき。
- 実装都合の工程分類だけで要求を整理し、利用者機能カテゴリの判断を行わないとき。

## 出力
- 対象FR文書の更新内容と、機能単位カテゴリへ配置した理由。
- 配置判断が曖昧な場合に追記したRDR記録と、実施した整合チェック結果。
