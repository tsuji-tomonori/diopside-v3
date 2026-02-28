---
id: IT-PW-UC-003
title: UC-003 キーワード検索のペアワイズ因子定義
doc_type: 結合テスト設計
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
- '[[IT-PW-001]]'
- '[[RQ-UC-003]]'
related:
- '[[IT-CASE-005]]'
tags:
- diopside
- IT
- PW
---

```pairwise
meta:
  id: IT-PW-UC-003
  uc: RQ-UC-003
  cases: [IT-CASE-005]
factors:
  キーワードFR: [empty, single_word, multi_and]
  検索対象FR: [title_only, title_summary_tags]
  結果状態FR: [hit, no_hit]
```

## 変更履歴
- 2026-02-28: 新規作成
