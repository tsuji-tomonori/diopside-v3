---
id: RQ-PC-002
title: YouTube利用規約制約
doc_type: プロジェクトの制約
phase: RQ
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-22'
up:
- '[[RQ-SC-001]]'
related: []
tags:
- diopside
- RQ
- PC
---


## 制約
- YouTube Data API v3の利用規約およびDeveloper Policiesに準拠して収集を行う。
- 公式APIで取得できる範囲のみを利用し、スクレイピング等の非推奨手段で補完しない。
- APIクォータ超過時は収集頻度を自動で落とし、規約順守を優先して再実行する。

## 変更履歴
- 2026-02-10: 新規作成 [[RQ-RDR-010]]
- 2026-02-10: 制約の重複を解消し、YouTube利用規約順守の具体条件を追加 [[RQ-RDR-010]]
