---
id: IT-PW-UC-007
title: UC-007 収集失敗調査のペアワイズ因子定義
doc_type: 結合テスト設計
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
- '[[IT-PW-001]]'
- '[[RQ-UC-007]]'
related:
- '[[IT-CASE-008]]'
- '[[IT-CASE-012]]'
tags:
- diopside
- IT
- PW
---

```pairwise
meta:
  id: IT-PW-UC-007
  uc: RQ-UC-007
  cases: [IT-CASE-008, IT-CASE-012]
factors:
  診断対象FR: [latest_run, health_checks]
  障害種別FR: [archive_missing, tag_inconsistency, freshness_delay]
  調査可能性FR: [enough_logs, limited_logs]
```

## 変更履歴
- 2026-02-28: 新規作成
