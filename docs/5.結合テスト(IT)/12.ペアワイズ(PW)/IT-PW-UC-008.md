---
id: IT-PW-UC-008
title: UC-008 再収集実施のペアワイズ因子定義
doc_type: 結合テスト設計
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
- '[[IT-PW-001]]'
- '[[RQ-UC-008]]'
related:
- '[[IT-CASE-007]]'
- '[[IT-CASE-012]]'
tags:
- diopside
- IT
- PW
---

```pairwise
meta:
  id: IT-PW-UC-008
  uc: RQ-UC-008
  cases: [IT-CASE-007, IT-CASE-012]
factors:
  再収集対象FR: [failed_run, partial_run, invalid_run]
  競合FR: [no_conflict, conflict]
  実行結果FR: [succeeded, failed]
```

## 変更履歴
- 2026-02-28: 新規作成
