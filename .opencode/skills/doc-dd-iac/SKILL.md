---
name: doc-dd-iac
description: DD-IAC（インフラ詳細）文書を作成・更新するときに、IaC運用と差分適用の実装レベル設計をdiopside規約準拠で整理する
metadata:
  short-description: DD-IAC 文書の更新ガイド
---

## 目的
- diopsideのインフラ詳細設計を、要求・基本設計・検証文書へ追跡可能な状態で維持する。

## このスキルを使う条件
- `docs/3.詳細設計(DD)/13.インフラ詳細(INF)/DD-IAC-*.md` を新規作成・改訂するとき。
- IaC定義・差分適用・安全策（stateful資産保護など）の詳細設計を更新するとき。

## このスキルを使わない条件
- 基本設計（`BD-*`）の更新が主目的で、実装レベル詳細を変更しないとき。
- インフラ以外の詳細設計（`DD-API-*` / `DD-UI-*` など）が主対象のとき。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 詳細仕様、制約、失敗時の挙動、関連要求/テストへのトレース。
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
- 出力は対象 `DD-*` 単一文書更新とし、`id` とファイル名を一致させる。
- 本文には詳細仕様と確認手順を含め、運用時の判断根拠が読める状態にする。
- 変更に伴う `updated` / `version` / `変更履歴` の整合を維持する。
