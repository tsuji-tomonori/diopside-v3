---
id: UT-STAT-003
title: '静的解析方針 003（DOC: auto_link_glossary --check）'
doc_type: 静的解析方針
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-002]]'
related:
  - '[[UT-STAT-001]]'
  - '[[UT-MET-001]]'
tags:
  - diopside
  - UT
  - STAT
  - DOC
---

## ツール概要
- ツール: `auto_link_glossary.py --check`
- 目的: 用語リンク未適用を静的に検出し、用語運用を統一する。

## 設定
| 項目 | 値 |
| --- | --- |
| docs_root | `docs` |
| mode | `--check`（非破壊） |
| glossary_source | `docs/1.要求(RQ)/21.用語(GL)/RQ-GL-*.md` |
| protection | 既存wikilink / inline code / code fence を除外 |

## 対象
- 変更対象の `docs/**/*.md`（`task docs:guard` の流れで実行）。

## 実行コマンド
- `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py --docs-root docs --check <targets...>`

## 失敗条件
- 終了コード `!= 0`。
- `mode=check` 実行結果で `changed > 0`。

```ut-static
tool_id: UT-STAT-003
tool_name: auto_link_glossary.py --check
domain: DOC
target: changed docs markdown files
command: python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py --docs-root docs --check <targets...>
settings:
  docs_root: docs
  mode: check
  glossary_source: docs/1.要求(RQ)/21.用語(GL)/RQ-GL-*.md
gate: exit_code == 0 and changed == 0
```

## 変更履歴
- 2026-02-28: 新規作成
