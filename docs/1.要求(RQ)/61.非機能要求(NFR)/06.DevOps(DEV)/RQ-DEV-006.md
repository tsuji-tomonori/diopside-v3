---
id: RQ-DEV-006
title: GitHub Actionsによるデプロイ制御
doc_type: 非機能要求
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-DEV-001]]'
- '[[AT-REL-001]]'
- '[[AT-GO-001]]'
- '[[RQ-RDR-050]]'
tags:
- diopside
- RQ
- DEV
---


## SnowCard（日本語）
- 要求ID: RQ-DEV-006
- 種別: 非機能要求
- 優先度: MUST
- 要求: 本システムは、GitHub Actionsでデプロイ環境ごとの排他制御と承認ゲートを維持し、失敗時のロールバック入口を固定化できる。
- 根拠: 単一環境への並列反映や承認漏れを防ぎ、反映15分以内・復旧10分以内の運用閾値を維持するため。
- 受入基準:
  - デプロイは環境単位の `concurrency` 制御で同時実行を防止できる。
  - 本番環境はEnvironment保護ルールで承認を必須化できる。
  - `workflow_dispatch` で明示的にデプロイを起動できる。
  - 直前版へのロールバック手順をGitHub Actionsの手動入口として実行できる。
- 例外/エラー:
  - デプロイ失敗時は `Quartz build失敗` / `CDK deploy失敗` / `反映遅延` の3系統で切り分け、復旧手順へ遷移できる。
  - 承認者不在で反映できない場合はNo-Goとして判定し、承認経路確保までデプロイを延期できる。
- 依存・関連:
  - [[RQ-DEV-001]]
  - [[RQ-RDR-025]]
  - [[AT-REL-001]]
  - [[AT-GO-001]]
  - [[RQ-RDR-050]]

## 変更履歴
- 2026-02-21: 新規作成（GitHub Actionsの排他・承認・ロールバック制御を独立要件として追加） [[RQ-RDR-050]]
