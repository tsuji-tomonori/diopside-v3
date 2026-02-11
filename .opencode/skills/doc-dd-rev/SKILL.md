---
name: doc-dd-rev
description: DD-REV（レビュー規約）文書を新規作成・改訂するときに、レビュー観点・判定基準・運用手順をdiopside規約準拠で整備する
metadata:
  short-description: DD-REV 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- DDフェーズで、レビュー規約（レビュー対象、観点、判定区分、指摘の記録方法、是正フロー）を新規作成・改訂するとき。
- 要求/設計変更に伴い、レビュー時に確認すべき整合条件や証跡の残し方を具体化するとき。

## このスキルを使わない条件
- 個別機能のAPI/UI/DB仕様そのものを詳細化する更新（DD-API/DD-UI/DD-DDL など）が主題のとき。
- 受入テスト計画や運用手順の更新が主題で、レビュー規約の変更を伴わないとき。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- レビュー対象、レビュー観点（仕様整合/実装妥当性/テスト観点/運用影響）、判定基準（OK/要修正/保留など）、再レビュー条件。
- 指摘の記録単位（チケット/コメント/議事録）、責任者、期限、クローズ条件。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- 対象文書は `filename == id` を満たし、Frontmatter必須キーを欠落なく保持する。
- レビュー規約として、観点・判定基準・記録/是正フローが実運用で再現可能な粒度で記述されている。
- `up/related` により、対象要求/設計文書とレビュー規約の関係を追跡できる状態にする。

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
