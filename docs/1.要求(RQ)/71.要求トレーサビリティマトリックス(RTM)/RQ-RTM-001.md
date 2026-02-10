---
id: RQ-RTM-001
title: 要求トレーサビリティビュー
doc_type: 要求トレーサビリティマトリックス
phase: RQ
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-FR-001]]'
- '[[RQ-AV-001]]'
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

## 変更履歴
- 2026-02-10: 新規作成
