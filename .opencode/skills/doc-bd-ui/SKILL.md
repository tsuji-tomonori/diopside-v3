---
name: doc-bd-ui
description: BD-UI（UI基本設計）文書を新規作成・改訂するときに、画面構成・操作導線・状態遷移をdiopside規約準拠で整理する
metadata:
  short-description: BD-UI 文書の更新ガイド
---

## 目的
- diopside の UI 基本設計（画面構成、主要導線、状態遷移）を、Obsidian運用規約に沿って一貫して記述する。

## このスキルを使う条件
- BD-UI 文書を新規作成するとき。
- 既存 BD-UI 文書で、画面遷移・操作手順・UI状態（初期/空/エラー/読み込み）に意味変更があるとき。

## このスキルを使わない条件
- 要求定義のみを更新する作業（RQ系スキルを使用）。
- UI以外の設計（API/監視/データなど）を主対象にする作業（対応するBD/DD系スキルを使用）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- UIの設計意図（対象画面、利用者操作、期待する体験）と、要求とのトレーサビリティ。
- 主要画面の導線、状態遷移、例外時の表示/復帰方針。
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
- 出力は `docs/**/<doc-id>.md` の単一文書差分とし、1トピック=1ファイルを維持する。
- 変更時は frontmatter の `updated` を当日へ更新し、意味変更がある場合のみ `version` をPATCH更新する。
- 関連要求/設計を `up/related` と本文リンクで辿れる状態にする。
