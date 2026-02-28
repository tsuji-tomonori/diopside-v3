---
id: IT-PW-UC-001
title: UC-001 収集実行のペアワイズ因子定義
doc_type: 結合テスト設計
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
- '[[IT-PW-001]]'
- '[[RQ-UC-001]]'
related:
- '[[IT-CASE-001]]'
- '[[IT-CASE-002]]'
tags:
- diopside
- IT
- PW
---

```pairwise
meta:
  id: IT-PW-UC-001
  uc: RQ-UC-001
  cases: [IT-CASE-001, IT-CASE-002]
factors:
  起動モードFR: [manual, scheduled, invalid]
  対象区分FR: [official_only, official_and_appearance, invalid_empty]
  冪等性FR: [new_key, duplicate_key, missing_key]
  実行競合FR: [no_active_run, active_run_exists]
```

## 変更履歴
- 2026-02-28: 新規作成
