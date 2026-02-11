---
name: obsidian-doc-check
description: diopsideのObsidian文書を追加・更新・レビューするときに、Frontmatter/リンク/FR配置規約の整合を検査する
metadata:
  short-description: Obsidian文書支援
---

## 目的
- diopsideドキュメントをFrontmatter規約とリンク規約に沿って管理する。

## 使う条件
- `docs/**` 配下の文書を追加・改訂し、規約適合を機械検証したいとき。
- FR配置（ING/SCH/TAG/LST/DET/HLW/WCL/OPS）や用語リンクの逸脱有無を確認したいとき。

## 使わない条件
- 文書の内容設計（要求追加方針、設計判断、文面レビュー）を行うだけで、規約検査を実行しないとき。
- Obsidian Vault外の成果物（アプリ実装コード、非Markdown資産）の検査をしたいとき。

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
- RQ文書の `## 変更履歴` 各行に、関連RDRリンク（`[[RQ-RDR-xxx]]`）が含まれている
- BD文書の `## 変更履歴` 各行に、関連ADRリンク（`[[BD-ADR-xxx]]`）が含まれている

## 実行
- 必要に応じて `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を先に実行する。
- 用語文書更新時は `term_en` と本文英名併記（`英名: \`term_en\``）を確認する。
- `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し、`reports/doc_check.md` を更新する。
- 差分ファイルのみ検査する場合は `--targets <対象Markdownパス...>` を併用する。
- RQ/BDの変更履歴リンク規約を差分文書で検査する場合は `--require-history-links --targets <対象Markdownパス...>` を使用する。
- 検査は fail-fast 運用とし、`issues` / `nonlinked_doc_ids` / `broken_links` / `backlink_issues` のいずれかが 1 件でもあれば失敗とする。
- CI（`.github/workflows/docs-link-check.yml`）と pre-commit（`.pre-commit-config.yaml`）で同一検査を必須化する。

## 出力契約
- 検査結果は `reports/doc_check.md` に出力し、検査対象・失敗理由・修正要否を追跡可能にする。
- 失敗時は fail-fast の結果をそのまま返し、`issues` / `nonlinked_doc_ids` / `broken_links` / `backlink_issues` の該当項目を修正対象として明示する。
