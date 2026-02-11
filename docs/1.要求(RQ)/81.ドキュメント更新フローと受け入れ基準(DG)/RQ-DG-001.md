---
id: RQ-DG-001
title: ドキュメント更新フロー
doc_type: ドキュメント運用ガイド
phase: RQ
version: 1.0.18
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[RQ-SC-001]]'
related:
- '[[BD-CM-001]]'
- '[[RQ-RTM-001]]'
- '[[RQ-RDR-024]]'
tags:
- diopside
- RQ
- DG
---


## 改修フロー
1. RQ更新時はRDRを同一変更で更新する。
2. BD/DD更新時はADR経路を確認する。
3. 文書更新で規約・テンプレート・運用手順に変更がある場合は、同一変更で `.opencode/skills` の対応スキル（`SKILL.md`/`TEMPLATE.md`）を更新する。
4. 共通運用規約変更時は、`skill-maintainer`、`docops-orchestrator`、`obsidian-doc-*` を同一変更で更新する。
5. 本文更新後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス...>` を実行し、用語（`RQ-GL-*`）をWikiリンク化する。
6. 変更後に整合チェック（`python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md --targets <対象Markdownパス...>`）を実行する。
7. docs変更を含むコミットでは `.pre-commit-config.yaml` のリンク検査ゲートを通過させる。
8. PRでは `.github/workflows/docs-link-check.yml` のリンク検査ゲートを通過するまでマージしない。

## 受入基準
- 用語集に定義された語彙（`RQ-GL-*`）が本文でObsidianリンク化されている。
- 本文中の文書ID参照（`RQ-DM-*`, `DD-API-*` など）がObsidianリンク（`[[ID]]`）で記載されている。
- 用語文書（`RQ-GL-*`）は frontmatter に `term_en` を持ち、値は ASCII `snake_case` とする。
- 用語文書の `## 定義` は表形式（`用語ID/用語名/英名/定義/判定条件/適用範囲`）で記載する。
- タクソノミ系用語（例: [[RQ-GL-013|タグ種別]]）は、`タグ種別/説明/付与ルール` の表を持つ。
- frontmatter、既存Wikiリンク、インラインコード、コードブロックは自動リンク化の対象外である。
- 文書運用変更時は、該当 `doc-*` スキルの `SKILL.md`/`TEMPLATE.md` が同一変更で更新されている。
- 共通規約変更時は、`skill-maintainer`/`docops-orchestrator`/`obsidian-doc-*` の同時更新と、`reports/impact_check_YYYY-MM-DD.md` への記録が存在する。
- 文書更新とスキル更新の実行順は「自動リンク化 -> 整合チェック」を満たす。
- `validate_vault.py` の `issues` / `nonlinked_doc_ids` / `broken_links` / `backlink_issues` が1件でもある場合はFailとする。

## 変更履歴
- 2026-02-11: pre-commit/CIのリンク検査ゲートとFail基準（`nonlinked_doc_ids` 含む）を追加
- 2026-02-11: スキルメンテナンス方針（同一変更での同期更新、共通スキル同時更新、受入基準）を追加
- 2026-02-10: タクソノミ系用語の表記基準（種別/説明/付与ルール）を受入基準へ追加
- 2026-02-10: 本文中の文書ID参照をObsidianリンクで統一する受入基準を追加
- 2026-02-10: 用語定義の表形式（標準）を受入基準へ追加
- 2026-02-10: 用語の英名運用（`term_en` + 本文併記）を受入基準へ追加
- 2026-02-10: 新規作成
- 2026-02-10: 用語自動リンク化スクリプトの実行手順と受入基準を追加
