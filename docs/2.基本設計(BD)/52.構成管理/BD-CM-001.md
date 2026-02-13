---
id: BD-CM-001
title: 構成管理方針
doc_type: 構成管理
phase: BD
version: 1.0.15
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-13'
up:
- '[[RQ-SC-001]]'
- '[[RQ-FR-001]]'
related:
- '[[BD-ARCH-001]]'
- '[[BD-ADR-001]]'
- '[[BD-ADR-012]]'
- '[[BD-ADR-028]]'
- '[[RQ-DG-001]]'
- '[[BD-INF-007]]'
tags:
- diopside
- BD
- CM
---


## 設計方針
- 構成管理方針として[[RQ-GL-001|diopside]]の基本設計を定義する。
- 収集対象（公式+出演）を前提に設計する。

## 設計要点
- 公開データの収集・正規化・索引生成を分離する。
- Web配信は静的JSON + フロント検索を採用する。
- 運用監視と[[RQ-GL-011|再収集]]導線を設計に含める。
- 文書更新時は用語自動リンク化（`auto_link_glossary.py`）と文書整合チェック（`validate_vault.py`）を標準手順として運用する。
- 用語文書（`RQ-GL-*`）は `term_en`（ASCII `snake_case`）を持ち、本文定義へ英名を併記する。
- スキルメンテナンスは変更分類で同期する（文書種別変更: 対応 `doc-*`、共通規約変更: `skill-maintainer`/`docops-orchestrator`/`obsidian-doc-*`）。
- `docs` と `.opencode/skills` は同一変更で更新し、片側のみの更新を許容しない。
- スキル更新を含む変更は `reports/impact_check_YYYY-MM-DD.md` へ更新理由と影響範囲を記録する。
- 検証手順の実行順は「`auto_link_glossary.py` -> `validate_vault.py`」を固定し、順序変更を禁止する。
- BD文書の `## 変更履歴` 各行には、関連ADRリンク（`[[BD-ADR-xxx]]`）を必ず記載する。
- インフラ変更は [[BD-INF-007]] の `cdk synth -> cdk diff -> review -> approve -> cdk deploy -> verify` を必須手順として実施する。

## 変更履歴
- 2026-02-13: インフラ構成管理フローをCDK標準手順（synth/diff/deploy）へ更新（関連ADR: [[BD-ADR-028]]）
- 2026-02-13: インフラ変更管理フロー（[[BD-INF-007]]）を構成管理標準へ追加（関連ADR: [[BD-ADR-028]]）
- 2026-02-11: BD文書の変更履歴へ関連ADRリンクを必須化（関連ADR: [[BD-ADR-012]]）
- 2026-02-11: スキルメンテナンス同期方針（変更分類、同一変更、影響記録、実行順固定）を追加（関連ADR: [[BD-ADR-012]]）
- 2026-02-10: 用語の英名運用（`term_en` + 本文併記）を標準手順へ追加（関連ADR: [[BD-ADR-012]]）
- 2026-02-10: 新規作成（関連ADR: [[BD-ADR-012]]）
- 2026-02-10: 用語自動リンク化と整合チェックの標準運用を追記（関連ADR: [[BD-ADR-012]]）
