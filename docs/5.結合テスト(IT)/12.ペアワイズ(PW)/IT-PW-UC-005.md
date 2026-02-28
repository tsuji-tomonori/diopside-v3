---
id: IT-PW-UC-005
title: UC-005 日付・再生時間絞り込みのペアワイズ因子定義
doc_type: 結合テスト設計
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
- '[[IT-PW-001]]'
- '[[RQ-UC-005]]'
related:
- '[[IT-CASE-005]]'
tags:
- diopside
- IT
- PW
---

```pairwise
meta:
  id: IT-PW-UC-005
  uc: RQ-UC-005
  cases: [IT-CASE-005]
factors:
  公開日範囲FR: [none, valid_range, invalid_range]
  再生時間範囲FR: [none, valid_range, invalid_range]
  欠損値対応FR: [exclude_missing, include_when_no_filter]
```

## 変更履歴
- 2026-02-28: 新規作成
