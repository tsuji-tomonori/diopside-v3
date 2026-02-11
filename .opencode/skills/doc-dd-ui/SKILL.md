---
name: doc-dd-ui
description: DD-UI（UI詳細設計）文書を新規作成・改訂するときに、画面要素・状態遷移・操作制約をdiopside規約準拠で整理する
metadata:
  short-description: DD-UI 文書の更新ガイド
---

## 目的
- diopside の UI 詳細設計（画面要素、コンポーネント責務、状態遷移、操作制約）を、Obsidian運用規約に沿って一貫して記述する。

## このスキルを使う条件
- DDフェーズのUI詳細設計を新規作成・改訂するとき。
- BD-UIや要求変更を受けて、画面内の振る舞い（入力条件、状態別表示、例外時挙動）を実装可能な粒度で具体化するとき。

## このスキルを使わない条件
- 要求定義（RQ-*）のみを更新する作業。
- UI以外の詳細設計（API/DB/監視/性能など）を主題にする作業。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
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
- UI詳細設計として、対象画面の要素責務・状態別表示・操作制約・例外時の復帰を読者が追跡できる状態にする。
- 変更時は frontmatter の `updated` を当日へ更新し、意味変更がある場合のみ `version` をPATCH更新する。
