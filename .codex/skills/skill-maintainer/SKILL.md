---
name: skill-maintainer
description: docs運用の変更に合わせて `.codex/skills` を同期更新する
metadata:
  short-description: スキル保守ガイド
---

## 目的
- 1スキル=1ドキュメント種別の対応を維持する。

## 手順
1. 変更された文書種別を列挙する。
2. 対応スキルの `SKILL.md` / `TEMPLATE.md` を更新する。
3. 共通規約変更時は `docops-orchestrator` と `obsidian-doc-*` も更新する。
4. 変更内容を `RQ-DG` と `BD-CM` に反映する。

## 完了条件
- 旧案件語彙が残っていない。
- スキル記述が diopside 前提で統一されている。
