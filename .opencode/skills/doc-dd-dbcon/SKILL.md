---
name: doc-dd-dbcon
description: DD-DBCON（DB制約詳細設計）文書を新規作成・改訂するときに、制約定義と整合観点をdiopside規約準拠で作成・更新する
metadata:
  short-description: DD-DBCON 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- DDフェーズのDB制約（主キー/一意制約/チェック制約/参照整合性）を新規作成・改訂するとき。
- 要求やBD設計の変更を受けて、データ不整合防止のための制約条件・例外条件を詳細化するとき。

## このスキルを使わない条件
- 要求定義（RQ-*）のみの更新、またはBD段階で方針だけを見直す作業。
- SQL実装手順やマイグレーション運用を主題とする文書（DD-MIG等）の更新。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 制約対象テーブル/カラム、制約種別、許容値・禁止値、違反時の扱い、関連リンク。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- 対象文書は `filename == id` を満たし、Frontmatter必須キーを欠落なく保持する。
- DB制約の追加/変更理由と影響範囲を `up/related` で追跡可能にし、関連するBD/DD/UT文書と整合した状態にする。
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
