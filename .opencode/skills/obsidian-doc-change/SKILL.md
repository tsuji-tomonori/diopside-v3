---
name: obsidian-doc-change
description: diopsideのObsidian文書を更新・改訂するときに、frontmatter/リンク整合と用語リンク補正を実施する
metadata:
  short-description: Obsidian文書支援
---

## 目的
- diopsideドキュメントをFrontmatter規約とリンク規約に沿って管理する。

## このスキルを使う条件
- `docs/**` の既存文書を更新・改訂し、Frontmatter整合と `up/related` の追跡性を同時に担保したいとき。
- 用語集（`RQ-GL-*`）や文書ID参照（`RQ-DM-*`, `DD-API-*` など）を本文に追加・変更し、Obsidianリンク補正まで一気通貫で行うとき。

## このスキルを使わない条件
- 新規文書を作成するとき（`obsidian-doc-new` を使用）。
- 文書整合の監査のみを行い、本文修正を伴わないとき（`obsidian-doc-check` を使用）。

## チェック項目
- 必須frontmatterキーの存在
- `filename == id`
- `up/related` のリンク整合
- FR（`docs/1.要求(RQ)/51.機能要求(FR)`）は機能単位カテゴリ（ADM/SCH/TAG/LST/DET/HLW/WCL）で配置されている
- 管理者操作FR（収集起動/監視/再収集/公開運用/配信経路確認）は `01.管理画面(ADM)` に配置されている
- FR生成系要求は独立カテゴリ化されず、利用者機能カテゴリに配置されている
- 用語集（`RQ-GL-*`）にある語彙が本文でObsidianリンク化されている
- 本文中の文書ID参照（`RQ-DM-*`, `DD-API-*` など）がObsidianリンク化されている
- 本文中の文書ID参照をコード表記（`（`ID`）`）で残していない
- 用語文書（`RQ-GL-*`）は `term_en` を持ち、値がASCII `snake_case` である
- `## 変更履歴` の追記
- RQ文書の `## 変更履歴` 各行に、関連RDRリンク（`[[RQ-RDR-xxx]]`）が含まれている
- BD文書の `## 変更履歴` 各行に、関連ADRリンク（`[[BD-ADR-xxx]]`）が含まれている

## 実行
- 本文更新後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、本文用語を自動リンク化する。
- 用語文書更新時は、`## 定義` に英名（`英名: \`term_en\``）を併記する。
- 続けて `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し、`reports/doc_check.md` を更新する。

## 出力契約
- 対象文書は Frontmatter/リンク/FR配置規約に適合していること。
- 用語リンク補正とVault検証の結果が `reports/doc_check.md` に反映され、差分として確認できること。
