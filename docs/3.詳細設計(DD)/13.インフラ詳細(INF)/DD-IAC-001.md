---
id: DD-IAC-001
title: IaCモジュール設計
doc_type: インフラ詳細
phase: DD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[BD-INF-007]]'
related:
- '[[DD-IAC-002]]'
- '[[UT-IAC-001]]'
- '[[UT-POL-001]]'
- '[[RQ-DEV-001]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- IaCは環境共通モジュールと環境別スタックに分離する。
- モジュールI/Oは型定義し、暗黙依存を禁止する。

## ルール
- 命名規則: `<domain>-<resource>-<env>`。
- 変更は `plan` 出力をレビュー証跡として保存する。

## 変更履歴
- 2026-02-13: 設計別RTMの根拠追跡を補強するため、[[RQ-DEV-001]] を関連へ追加 [[BD-ADR-028]]
- 2026-02-13: 新規作成
