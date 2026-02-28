---
id: IT-PW-UC-002
title: UC-002 一覧閲覧のペアワイズ因子定義
doc_type: 結合テスト設計
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
- '[[IT-PW-001]]'
- '[[RQ-UC-002]]'
related:
- '[[IT-CASE-003]]'
- '[[IT-CASE-009]]'
tags:
- diopside
- IT
- PW
---

```pairwise
meta:
  id: IT-PW-UC-002
  uc: RQ-UC-002
  cases: [IT-CASE-003, IT-CASE-009]
factors:
  段階ロードFR: [all_success, archive_retryable_fail]
  ページングFR: [initial_only, load_more]
  件数整合FR: [consistent, inconsistent]
  配信更新FR: [updated, stale]
```

## 変更履歴
- 2026-02-28: 新規作成
