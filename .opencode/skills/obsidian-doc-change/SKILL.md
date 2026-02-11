---
name: obsidian-doc-change
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
- FR（`docs/1.要求(RQ)/51.機能要求(FR)`）は機能単位カテゴリ（ING/SCH/TAG/LST/DET/HLW/WCL/OPS）で配置されている
- FR生成系要求は独立カテゴリ化されず、利用者機能カテゴリに配置されている
- 用語集（`RQ-GL-*`）にある語彙が本文でObsidianリンク化されている
- 本文中の文書ID参照（`RQ-DM-*`, `DD-API-*` など）がObsidianリンク化されている
- 本文中の文書ID参照をコード表記（`（`ID`）`）で残していない
- 用語文書（`RQ-GL-*`）は `term_en` を持ち、値がASCII `snake_case` である
- `## 変更履歴` の追記

## 実行
- 本文更新後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、本文用語を自動リンク化する。
- 用語文書更新時は、`## 定義` に英名（`英名: \`term_en\``）を併記する。
- 続けて `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し、`reports/doc_check.md` を更新する。
