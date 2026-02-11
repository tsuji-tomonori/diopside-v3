---
id: RQ-RDR-024
title: スキルメンテナンス方針を要求として標準化する決定
doc_type: 要求決定記録
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-DG-001]]'
- '[[RQ-DEV-001]]'
- '[[BD-CM-001]]'
- '[[RQ-PC-007]]'
- '[[RQ-PC-009]]'
tags:
- diopside
- RQ
- RDR
---

## 決定事項
- 文書運用規約の変更は、対応する `.opencode/skills` の `SKILL.md`/`TEMPLATE.md` を同一変更で更新する。
- 共通規約変更時は、`skill-maintainer`、`docops-orchestrator`、`obsidian-doc-*` を同時更新する。
- スキル更新を含む変更は、`reports/impact_check_YYYY-MM-DD.md` と `reports/doc_check.md` を同一変更で更新する。

## 理由
- 文書のみ更新してスキルが追従しない状態では、次回更新時に規約逸脱が再発する。
- 個人開発運用では、レビューの再現性を保つために「更新対象の最小セット」を要求として固定する必要がある。
- `[[RQ-DEV-001]]` の品質ゲートを満たすには、スキル同期と検証記録をリリース判定条件へ含める必要がある。

## 影響
- 要求文書: `[[RQ-DG-001]]` と `[[RQ-DEV-001]]` を意味変更として更新する。
- 設計文書: `[[BD-CM-001]]` と `[[BD-ADR-012]]` で、同期設計と責務分担を明文化する。
- スキル運用: `skill-maintainer` / `docops-orchestrator` / `doc-rq-dg` / `doc-bd-cm` へ同一方針を反映する。

## 変更履歴
- 2026-02-11: 新規作成
