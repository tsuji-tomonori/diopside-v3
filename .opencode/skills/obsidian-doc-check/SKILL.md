---
name: obsidian-doc-check
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
- 必要に応じて `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を先に実行する。
- 用語文書更新時は `term_en` と本文英名併記（`英名: \`term_en\``）を確認する。
- `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し、`reports/doc_check.md` を更新する。
- 差分ファイルのみ検査する場合は `--targets <対象Markdownパス...>` を併用する。
- 検査は fail-fast 運用とし、`issues` / `nonlinked_doc_ids` / `broken_links` / `backlink_issues` のいずれかが 1 件でもあれば失敗とする。
- CI（`.github/workflows/docs-link-check.yml`）と pre-commit（`.pre-commit-config.yaml`）で同一検査を必須化する。
