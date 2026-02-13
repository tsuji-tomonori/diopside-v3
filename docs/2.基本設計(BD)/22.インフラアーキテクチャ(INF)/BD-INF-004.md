---
id: BD-INF-004
title: IAM・Secrets・鍵管理方針
doc_type: インフラアーキテクチャ
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[BD-INF-001]]'
related:
- '[[RQ-SEC-001]]'
- '[[DD-IAM-001]]'
- '[[AT-OPS-INF-001]]'
- '[[BD-ADR-028]]'
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
- 2026-02-13: 新規作成（IAM/Secrets/鍵管理の基本方針を定義） [[BD-ADR-028]]
