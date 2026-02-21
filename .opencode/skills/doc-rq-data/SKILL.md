---
name: doc-rq-data
description: 公開アーカイブのデータ品質要件（RQ-DATA）を新規作成・改訂するときに、SnowCardと関連設計へのトレーサビリティをdiopside規約準拠で整備する
metadata:
  short-description: RQ-DATA 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `RQ-DATA-*` 文書を新規作成・改訂し、データの完全性/一意性/分類正確性などの非機能要求を定義するとき。
- 受入基準として、欠損率・重複率・反映時間のような測定可能な品質閾値を追加/変更するとき。
- `RQ-RDR-*`、`BD-DATA-*`、`BD-ERD-*` との依存関係を同時に確認し、要件起点の追跡可能性を維持するとき。

## このスキルを使わない条件
- 画面仕様や操作導線（`RQ-UX-*`）の整理が主目的のとき。
- 機能要求カテゴリ（`RQ-FR-*`）の配置や分類ルールの調整が主目的のとき。
- 要求ではなく設計本文（`BD-*` / `DD-*`）そのものを編集するだけのとき。

## 出力契約
- 更新対象の `RQ-DATA-*` 本文で、SnowCard必須項目（要求/根拠/受入基準/例外/依存・関連）を欠落なく満たす。
- 受入基準は運用で検証可能な閾値または判定条件として記述し、例外時の代替基準または記録条件を明記する。
- 最終報告では、変更した文書パス・トレーサビリティ更新先（RDR/設計文書）・実施した品質チェック結果を簡潔に示す。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- データ品質要求の意図、測定可能な受入条件、関連リンク。
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
- NFR文書では SnowCard の `要求` / `受入基準` / `例外/エラー` を「〜できる」基調で記述し、1項目1判定に分解する。
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- 受入基準が定性的表現のみになっていないこと（閾値・件数・時間などで判定できること）を確認する。
- 例外条件に、記録対象と再実行/再収集の判断条件が含まれていることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
