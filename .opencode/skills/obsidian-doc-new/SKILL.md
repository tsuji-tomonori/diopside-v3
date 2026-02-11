---
name: obsidian-doc-new
description: diopsideのObsidian文書を新規作成・初回整備するときに、Frontmatter/リンク/用語運用を規約準拠で成立させる
metadata:
  short-description: Obsidian文書支援
---

## 目的
- diopsideドキュメントをFrontmatter規約とリンク規約に沿って管理する。

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
- 新規作成・本文更新後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、本文用語を自動リンク化する。
- 変更をコミットする前に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py --docs-root docs --check <対象Markdownパス...>` を実行し、未リンク用語が残っていないことを確認する。
- 開発環境では `pre-commit` を導入し、docs変更時に上記チェックを必須ゲート化する。
- 用語文書更新時は、`## 定義` に英名（`英名: \`term_en\``）を併記する。
- 続けて `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し、`reports/doc_check.md` を更新する。

## 使う条件
- 新規文書を追加し、必須Frontmatter/リンク/変更履歴を初回から規約どおりに整えるとき。
- FR文書を新規追加し、機能単位カテゴリ（ADM/SCH/TAG/LST/DET/HLW/WCL）への配置妥当性を確認するとき。
- 用語や文書ID参照を含む本文を作成し、Obsidianリンク化を一括で整備するとき。

## 使わない条件
- 既存文書の差分確認やリンク整合チェックのみが目的で、新規作成を伴わないとき（`obsidian-doc-check` を使う）。
- 実装コードや設定ファイルのみを変更し、`docs/**` を更新しないとき。

## 出力
- 規約準拠で作成した対象文書（Frontmatter/本文/`## 変更履歴` を含む）。
- 実行した用語自動リンク化と検査コマンド、および `reports/doc_check.md` 更新結果。
