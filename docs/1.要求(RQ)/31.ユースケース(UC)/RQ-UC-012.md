---
id: RQ-UC-012
title: 管理者が本番承認ゲートを通過してデプロイする
doc_type: ユースケース
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-DEV-006-01]]'
- '[[AT-GO-001]]'
- '[[RQ-RDR-050]]'
bounded_context: Administration
subdomain: Supporting
tags:
- diopside
- RQ
- UC
---

## 概要
- [[RQ-SH-001|管理者]]がGitHub Environmentの承認ゲートを通過し、本番デプロイとGo/No-Go判定記録を完了する利用シナリオ。

## 基本フロー
1. [[RQ-SH-001|管理者]]が本番対象のワークフローを起動する。
2. GitHub Environmentの承認者が内容を確認し、実行承認する。
3. ワークフローが本番デプロイを完了する。
4. [[RQ-SH-001|管理者]]が証跡を確認し、[[AT-GO-001]]へGo/No-Go判定を記録する。

## 代替/例外フロー
- 承認拒否: 変更内容にリスクがある場合はNo-Goとし、修正後に再申請する。
- 証跡不足: 必須Artifactsやステータスが欠落した場合は判定を保留し、再実行で証跡を補完する。
- 判定未達: 非機能ゲート閾値未達の場合は公開せず、改善計画を記録する。

## 変更履歴
- 2026-02-21: 新規作成（本番承認ゲート運用のユースケースを追加） [[RQ-RDR-050]]
