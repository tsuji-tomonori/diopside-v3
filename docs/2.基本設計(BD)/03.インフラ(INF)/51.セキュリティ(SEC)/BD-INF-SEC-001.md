---
id: BD-INF-SEC-001
title: IAM・Secrets・鍵管理方針
doc_type: インフラアーキテクチャ
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[BD-INF-PLAT-001]]'
related:
- '[[RQ-SEC-001]]'
- '[[DD-INF-SEC-002]]'
- '[[AT-OPS-INF-001]]'
- '[[BD-SYS-ADR-028]]'
tags:
- diopside
- BD
- INF
---

## 方針
- ロールベースで最小権限を適用し、共有資格情報を禁止する。
- 秘密情報はSecrets管理サービスで保管し、平文保管を禁止する。

## 運用ルール
- 特権操作は期限付き昇格を採用し、監査ログを必須化する。

## 変更履歴
- 2026-02-13: 新規作成（IAM/Secrets/鍵管理の基本方針を定義） [[BD-SYS-ADR-028]]
