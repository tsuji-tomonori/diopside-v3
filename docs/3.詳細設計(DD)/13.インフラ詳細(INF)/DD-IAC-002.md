---
id: DD-IAC-002
title: IaC状態管理とドリフト検知
doc_type: インフラ詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[DD-IAC-001]]'
related:
- '[[IT-INF-ROLL-001]]'
- '[[DD-CICD-INF-001]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- state backendはロック有効で運用する。
- ドリフト検知は日次実行し、差分をチケット化する。

## 運用条件
- 手動変更検知時は即時是正またはIaC取り込みを実施する。

## 変更履歴
- 2026-02-13: 新規作成
