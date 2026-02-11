---
name: doc-dd-ddl
description: DD-DDL（DDL詳細設計）文書を新規作成・改訂するときに、テーブル定義・制約・移行方針をdiopside規約準拠で整理する
metadata:
  short-description: DD-DDL 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- DDフェーズのDDL詳細設計（テーブル/カラム定義、キー制約、インデックス、マイグレーション方針）を新規作成・改訂するとき。
- BD-ERDや要求変更を受けて、DBスキーマ変更の実装可能な粒度で仕様化が必要なとき。

## このスキルを使わない条件
- 要求定義（RQ-*）や基本設計（BD-*）のみを更新し、DDLレベルの変更手順を扱わない作業。
- API内部処理やUI遷移など、DDL詳細設計を主題としない文書の更新。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- テーブル/カラム定義、データ型、NULL許容、既定値、PK/FK/UNIQUE/CHECK制約、インデックス方針、変更時の移行・ロールバック条件。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- 対象文書は `filename == id` を満たし、Frontmatter必須キーを欠落なく保持する。
- DDL変更の意図と影響範囲を `up/related` で追跡可能にし、関連するBD/DD文書と整合した状態にする。
- 変更後の整合チェック結果（用語リンク補正と検証）をリポジトリ手順に沿って確認できる状態にする。

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
