---
id: RQ-DG-001
title: ドキュメント更新フロー
doc_type: ドキュメント運用ガイド
phase: RQ
version: 1.0.13
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[RQ-SC-001]]'
related:
- '[[BD-CM-001]]'
- '[[RQ-RTM-001]]'
tags:
- diopside
- RQ
- DG
---


## 改修フロー
1. RQ更新時はRDRを同一変更で更新する。
2. BD/DD更新時はADR経路を確認する。
3. 本文更新後に `python3 .codex/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス...>` を実行し、用語（`RQ-GL-*`）をWikiリンク化する。
4. 変更後に整合チェック（`python3 .codex/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md`）を実行する。

## 受入基準
- 用語集に定義された語彙（`RQ-GL-*`）が本文でObsidianリンク化されている。
- 用語文書（`RQ-GL-*`）は frontmatter に `term_en` を持ち、値は ASCII `snake_case` とする。
- 用語文書の `## 定義` には英名（`英名: \`term_en\``）を併記する。
- frontmatter、既存Wikiリンク、インラインコード、コードブロックは自動リンク化の対象外である。

## 変更履歴
- 2026-02-10: 用語の英名運用（`term_en` + 本文併記）を受入基準へ追加
- 2026-02-10: 新規作成
- 2026-02-10: 用語自動リンク化スクリプトの実行手順と受入基準を追加
