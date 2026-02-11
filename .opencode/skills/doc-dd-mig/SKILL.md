---
name: doc-dd-mig
description: DD-MIG（DB移行詳細設計）文書を新規作成・改訂するときに、移行手順・互換期間・ロールバック条件をdiopside規約準拠で整理する
metadata:
  short-description: DD-MIG 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- DDフェーズのDB移行詳細設計（段階移行、バックフィル、互換期間、切替判定）を新規作成・改訂するとき。
- BD/DDL変更を受けて、データ移送順序や停止条件、失敗時の復旧手順を実装可能な粒度で明文化するとき。

## このスキルを使わない条件
- 要求定義（RQ-*）や基本設計（BD-*）のみを更新し、移行実行手順を扱わない作業。
- 制約定義やAPI契約など、移行運用以外を主題とする文書（DD-DBCON/DD-API等）の更新。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 移行前提、スキーマ/データ変更の実行順、バックフィル方式、整合確認、ロールバック条件、関連リンク。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- 対象文書は `filename == id` を満たし、Frontmatter必須キーを欠落なく保持する。
- 移行手順の開始条件/停止条件/復旧条件を追跡可能にし、`up/related` で関連するBD/DD/IT文書と整合した状態にする。
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
