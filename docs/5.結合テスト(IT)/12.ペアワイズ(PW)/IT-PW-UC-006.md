---
id: IT-PW-UC-006
title: UC-006 動画詳細確認のペアワイズ因子定義
doc_type: 結合テスト設計
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
- '[[IT-PW-001]]'
- '[[RQ-UC-006]]'
related:
- '[[IT-CASE-006]]'
tags:
- diopside
- IT
- PW
---

```pairwise
meta:
  id: IT-PW-UC-006
  uc: RQ-UC-006
  cases: [IT-CASE-006]
factors:
  詳細表示FR: [full, partial]
  波形FR: [available, unavailable]
  ワードクラウドFR: [available, unavailable]
  外部遷移FR: [valid_url, invalid_url]
```

## 変更履歴
- 2026-02-28: 新規作成
