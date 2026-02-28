---
id: IT-PW-UC-009
title: UC-009 タグ付け実施のペアワイズ因子定義
doc_type: 結合テスト設計
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
- '[[IT-PW-001]]'
- '[[RQ-UC-009]]'
related:
- '[[IT-CASE-010]]'
- '[[IT-CASE-011]]'
- '[[IT-CASE-013]]'
tags:
- diopside
- IT
- PW
---

```pairwise
meta:
  id: IT-PW-UC-009
  uc: RQ-UC-009
  cases: [IT-CASE-010, IT-CASE-011, IT-CASE-013]
factors:
  タグ更新FR: [valid_update, invalid_payload]
  配信反映FR: [auto_publish, manual_publish, publish_fail]
  整合性FR: [consistent, inconsistent]
  復旧FR: [retry_publish, re_ingestion]
```

## 変更履歴
- 2026-02-28: 新規作成
