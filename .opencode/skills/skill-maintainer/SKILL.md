---
name: skill-maintainer
description: docs運用の変更に合わせて `.opencode/skills` を同期更新する
metadata:
  short-description: スキル保守ガイド
---

## 目的
- 1スキル=1ドキュメント種別の対応を維持する。

## 手順
1. 変更された文書種別を列挙する。
2. 対応スキルの `SKILL.md` / `TEMPLATE.md` を更新する。
3. 共通規約変更時は `docops-orchestrator` と `obsidian-doc-*` も更新する。
4. 用語規約変更時は `RQ-GL-*` の `term_en`（ASCII `snake_case`）必須化と本文英名併記ルールを、関連スキルへ同時反映する。
5. 文書参照規約変更時は、本文中の文書ID参照をObsidianリンク（`[[ID]]`）で統一するルールを関連スキルへ同時反映する。
6. スキル追加・更新時は `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス...>` と `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` の実行順を各スキルへ反映する。
7. 文書運用変更は `docs` と `.opencode/skills` を同一変更で更新し、片側のみの変更を許容しない。
8. 変更内容を `RQ-DG` と `BD-CM` に反映し、要求変更時は `RDR`、設計変更時は `ADR` を同一変更で更新する。
9. スキル更新を含む変更は `reports/impact_check_YYYY-MM-DD.md` へ更新理由と影響範囲を記録する。

## 完了条件
- 旧案件語彙が残っていない。
- スキル記述が diopside 前提で統一されている。
- `RQ-DG` / `BD-CM` / `RDR` / `ADR` のトレースが辿れる。
