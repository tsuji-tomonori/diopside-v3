---
name: skill-maintainer
description: docs運用規約や文書種別の変更時に、`.opencode/skills` を関連文書・検証手順と同期更新する
metadata:
  short-description: スキル保守ガイド
---

## 目的
- 1スキル=1ドキュメント種別の対応を維持する。

## 使う条件
- docs配下の運用規約変更に合わせて、`.opencode/skills` と実行手順を同一変更で保守するとき。
- 文書種別の追加・改名・統廃合に伴い、対応 `SKILL.md` / `TEMPLATE.md` の整合を取り直すとき。
- バリデータやFR編成規約の変更を、関連スキル・エージェント・CI設定へ波及反映するとき。

## 使わない条件
- 単一文書の本文修正のみで、スキル定義や運用フローに変更が発生しないとき。
- 実装コードのみの変更で、docs運用規約・文書種別・検証手順に影響しないとき。

## 手順
1. 変更された文書種別を列挙する。
2. 対応スキルの `SKILL.md` / `TEMPLATE.md` を更新する。
3. 共通規約変更時は `docops-orchestrator` と `obsidian-doc-*` も更新する。
4. 用語規約変更時は `RQ-GL-*` の `term_en`（ASCII `snake_case`）必須化と本文英名併記ルールを、関連スキルへ同時反映する。
5. 文書参照規約変更時は、本文中の文書ID参照をObsidianリンク（`[[ID]]`）で統一するルールを関連スキルへ同時反映する。
6. スキル追加・更新時は `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス...>` と `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` の実行順を各スキルへ反映する。
7. バリデータ変更時は `.pre-commit-config.yaml` と `.github/workflows/docs-link-check.yml` を同時更新し、ローカル/CIの判定条件を一致させる。
8. `validate_vault.py` の fail 条件（`issues` / `nonlinked_doc_ids` / `broken_links` / `backlink_issues`）を各スキル記述へ反映する。
9. 文書運用変更は `docs` と `.opencode/skills` を同一変更で更新し、片側のみの変更を許容しない。
10. 変更内容を `RQ-DG` と `BD-CM` に反映し、要求変更時は `RDR`、設計変更時は `ADR` を同一変更で更新する。
11. スキル更新を含む変更は `reports/impact_check_YYYY-MM-DD.md` へ更新理由と影響範囲を記録する。
12. FR編成規約変更時は `doc-rq-fr` / `docops-orchestrator` / `obsidian-doc-*` / 関連エージェントを同一変更で更新する。
13. FRカテゴリ正本（ING/SCH/TAG/LST/DET/HLW/WCL/OPS）を維持し、実装工程単位カテゴリへの回帰を禁止する。
14. 生成系FRは独立カテゴリ化せず、利用者機能カテゴリに配置する規則を関連スキルへ同期する。

## 完了条件
- 旧案件語彙が残っていない。
- スキル記述が diopside 前提で統一されている。
- `RQ-DG` / `BD-CM` / `RDR` / `ADR` のトレースが辿れる。
- FR編成規約が `AGENTS.md` / `doc-rq-fr` / `docops-orchestrator` / `obsidian-doc-*` / 関連エージェントで一致している。

## 出力
- 同期更新したスキル/文書/設定ファイルの一覧と、同一変更で反映した理由。
- 実施した検証（`auto_link_glossary.py` / `validate_vault.py` / 必要時のCI設定同期）の結果。
- `reports/impact_check_YYYY-MM-DD.md` に記録した影響範囲と追跡先（`RQ-DG` / `BD-CM` / `RDR` / `ADR`）。
