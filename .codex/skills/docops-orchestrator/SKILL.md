---
name: docops-orchestrator
description: diopside文書の変更を、影響分析・関連更新・整合チェックまで一気通貫で実行する
metadata:
  short-description: 変更→影響確認→更新→検証
---

## 目的
- 依頼を起点に docs 全体の整合を崩さず更新する。

## 実行フロー
1. 対象文書IDを特定する。
2. 対応 `doc-*` スキルを特定し更新する。
3. 要求変更なら RDR、設計変更なら ADR を同一変更で更新する。
4. `up/related` を辿って上位・下位文書を更新または影響確認記録を作成する。
5. `reports/impact_check_YYYY-MM-DD.md` を更新する。
6. `python3 .codex/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行して `reports/doc_check.md` を更新する。

## 出力
- 変更済み docs
- 影響確認レポート
- doc_check レポート
