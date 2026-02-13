---
name: doc-dd-arch
description: DD-ARCH（詳細アーキテクチャ）文書を作成・更新するときに、実装直前レベルの構成原則と境界をdiopside規約準拠で整理する
metadata:
  short-description: DD-ARCH 文書の更新ガイド
---

## 目的
- diopsideの詳細設計における構成原則（境界、依存方向、責務分離）を追跡可能に保つ。

## このスキルを使う条件
- `docs/3.詳細設計(DD)/11.コンポーネント/DD-ARCH-*.md` を新規作成・改訂するとき。
- フレームワーク境界（Server/Client、Route Handlers、データ取得経路）を詳細設計として明文化するとき。

## このスキルを使わない条件
- 個別コンポーネントの責務やI/O仕様が主対象の場合（`doc-dd-comp` を使う）。
- API契約やDB制約が主対象の場合（`doc-dd-api` / `doc-dd-dbcon` などを使う）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 詳細アーキテクチャ境界、依存関係、失敗時の挙動、関連要求/テストへのトレース。
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
- 出力は `DD-ARCH-*` の単一文書更新とし、`id` とファイル名を一致させる。
- 本文には構成原則、境界、依存方向を含め、判断根拠が読める状態にする。
- 変更に伴う `updated` / `version` / `変更履歴` の整合を維持する。
