---
name: doc-bd-env
description: BD-ENV（環境設計）文書を新規作成・改訂するときに、開発/検証/本番の環境差分・前提依存・運用上の制約をdiopside規約準拠で整理する
metadata:
  short-description: BD-ENV 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `docs/2.基本設計(BD)/51.環境/BD-ENV-*.md` を作成・更新するとき。
- 開発/検証/本番の環境差分、必須外部依存、実行前提（OS・ランタイム・ツール）を整理するとき。
- 要求やアーキテクチャ変更に伴い、環境制約やセットアップ前提の見直しが必要なとき。

## このスキルを使わない条件
- ビルド失敗条件や型安全ゲートが主題の場合（`doc-bd-build` を使う）。
- 配信手順・リリース判定・障害対応手順の更新が主題の場合（`doc-at-rel` / `doc-at-go` / `doc-at-run` を使う）。
- API契約やUI仕様など、環境条件以外の基本設計本文が主題の場合（対応する `doc-bd-*` を使う）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 環境区分（開発/検証/本番）ごとの差分、必須依存（外部サービス・ツール・バージョン）、前提条件。
- 環境変数・認証情報の扱い方針（実値や秘密情報は記載しない）。
- 要求または設計の意図、運用上の制約、関連リンク。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- 対象は `BD-ENV-*` 1文書に限定し、`filename == id` と Frontmatter必須キーを維持する。
- 本文は「環境区分ごとの差分」「依存/前提条件」「運用上の制約」を読み取れる内容にする。
- `up/related` から関連要求・関連設計へ追跡できる状態にし、変更理由を `## 変更履歴` に当日追記する。

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
