---
id: RQ-RTM-001
title: 要求トレーサビリティビュー
doc_type: 要求トレーサビリティマトリックス
phase: RQ
version: 1.0.5
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-FR-001]]'
- '[[RQ-AV-001]]'
- '[[RQ-RDR-031]]'
- '[[BD-ADR-020]]'
- '[[BD-TST-001]]'
tags:
- diopside
- RQ
- RTM
---


## 方針
- 本ドキュメントはDataviewで要求トレーサビリティを可視化する。
- 手更新マトリックスは作成しない。

## Dataview例
```dataview
TABLE id, doc_type, phase
FROM "docs"
WHERE contains(string(related), "RQ-FR")
```

```dataview
TABLE id, title, phase, file.path
FROM "docs"
WHERE id = "RQ-RDR-031" OR id = "BD-ADR-020" OR id = "DD-API-011" OR id = "IT-CASE-009" OR id = "AT-SCN-007"
SORT id ASC
```

```dataview
TABLE id, related
FROM "docs/1.要求(RQ)"
WHERE id = "RQ-FR-005" OR id = "RQ-FR-009" OR id = "RQ-UC-004" OR id = "RQ-GL-005"
SORT id ASC
```

## 変更履歴
- 2026-02-11: [[RQ-RDR-031]] / [[BD-ADR-020]] を起点とした追加文書（[[DD-API-011]] / [[IT-CASE-009]] / [[AT-SCN-007]]）と関連RQ文書の追跡ビューを追記 [[RQ-RDR-031]]
- 2026-02-10: 新規作成
