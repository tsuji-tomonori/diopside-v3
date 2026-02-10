---
name: obsidian-doc-new
description: Obsidian文書運用をdiopside前提で支援する
metadata:
  short-description: Obsidian文書支援
---

## 目的
- diopsideドキュメントをFrontmatter規約とリンク規約に沿って管理する。

## チェック項目
- 必須frontmatterキーの存在
- `filename == id`
- `up/related` のリンク整合
- 用語集（`RQ-GL-*`）にある語彙が本文でObsidianリンク化されている
- `## 変更履歴` の追記

## 実行
- 新規作成・本文更新後に `python3 .codex/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、本文用語を自動リンク化する。
- 続けて `python3 .codex/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し、`reports/doc_check.md` を更新する。
