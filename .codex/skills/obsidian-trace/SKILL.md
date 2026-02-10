---
name: obsidian-trace
description: Obsidianリンク(up/related)からトレーサビリティをツリー/CSVで生成する
metadata:
  short-description: Obsidianリンク(up/related)からトレーサビリティをツリー/CSVで生成する
---

## 目的
Obsidianの `up/related` を利用して、指定IDからトレーサビリティを生成します。
（静的なRTMを手更新せず、必要なときに生成する用途）

## 使い方
- ツリー（Markdown）:
  - `python .codex/skills/obsidian-trace/scripts/traceability.py --start RQ-FR-001 --depth 4 --direction both --include-related --mode tree --out reports/trace_RQ-FR-001.md`
- エッジ一覧（CSV）:
  - `python .codex/skills/obsidian-trace/scripts/traceability.py --start RQ-FR-001 --depth 4 --direction both --include-related --mode csv --out reports/trace_edges_RQ-FR-001.csv`

## 注意
- 出力は **Frontmatterのリンク**のみを使います（本文中リンクは解析しません）
- `--include-related` を付けると、横断リンクも辿ります（ノイズが増える場合あり）
