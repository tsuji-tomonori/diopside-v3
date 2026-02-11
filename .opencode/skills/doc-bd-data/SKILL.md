---
name: doc-bd-data
description: BD-DATA（データアーキテクチャ）文書を新規作成・改訂するときに、収集対象境界とデータ設計方針をdiopside規約準拠で整備する
metadata:
  short-description: BD-DATA 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `BD-DATA-*` を新規作成・更新し、データの収集境界/保持方針/配信方針を明文化するとき。
- 公開YouTubeアーカイブ（公式投稿動画/出演動画）を前提に、対象外（非公開/限定公開）を設計上で明示するとき。

## このスキルを使わない条件
- API仕様の詳細（I/O項目やエラー契約）を主に更新する場合（`doc-bd-api` を使用）。
- 物理ERD/テーブル定義を主に更新する場合（`doc-bd-erd` または DD 系スキルを使用）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 収集対象区分（公式投稿/出演）と対象外条件（非公開/限定公開）を含むデータ境界。
- 収集・正規化・索引生成・配信の責務分離方針と、関連する `up/related` リンク。
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
- 最終出力は、更新した `BD-DATA-*` のパスと変更理由（1-3点）を簡潔に示す。
- 意味変更を含む場合は `version` PATCH更新と `updated` 更新を反映し、関連する `[[BD-ADR-*]]`/`[[RQ-RDR-*]]` の追従要否を明記する。
