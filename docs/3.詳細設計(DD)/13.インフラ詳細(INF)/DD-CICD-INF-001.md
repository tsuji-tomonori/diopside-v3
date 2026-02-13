---
id: DD-CICD-INF-001
title: インフラCI/CD詳細
doc_type: インフラ詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[BD-INF-007]]'
related:
- '[[BD-BUILD-001]]'
- '[[DD-IAC-001]]'
- '[[IT-INF-ROLL-001]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- パイプラインは `lint/validate -> policy -> plan -> approve -> apply -> smoke` の順で実行する。
- 破壊的差分は手動承認を必須とする。

## 失敗時運用
- `apply` 失敗時は自動でロールバック手順を起動し、失敗証跡を保管する。

## 変更履歴
- 2026-02-13: 新規作成
