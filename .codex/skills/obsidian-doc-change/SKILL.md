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
- `## 変更履歴` の追記

## 実行
- 必要に応じて `reports/doc_check.md` を更新する。
