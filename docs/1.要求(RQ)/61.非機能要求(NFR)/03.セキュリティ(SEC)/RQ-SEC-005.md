---
id: RQ-SEC-005
title: GitHub Actionsサプライチェーン防御
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
- '[[RQ-SEC-001]]'
- '[[RQ-DEV-005]]'
- '[[RQ-DEV-006]]'
- '[[RQ-RDR-050]]'
tags:
- diopside
- RQ
- SEC
---


## SnowCard（日本語）
- 要求ID: RQ-SEC-005
- 種別: 非機能要求
- 優先度: MUST
- 要求: 本システムは、GitHub Actions運用におけるワークフロー改ざんと資格情報漏えいを防止する統制を維持できる。
- 根拠: CI/CD経路の侵害は配備成果物へ直結するため、開発速度を維持しつつ実行基盤の防御を固定化する必要があるため。
- 受入基準:
  - サードパーティActions参照はフル長SHAで固定できる。
  - `GITHUB_TOKEN` は最小権限を既定値にし、ジョブ単位でのみ必要権限へ昇格できる。
  - Actions利用元は許可リストで制限できる。
  - クラウド認証はOIDC AssumeRoleを使用し、長期アクセスキーをSecretsへ保持しない運用ができる。
  - fork由来PRではSecrets非提供を前提に、PRワークフローをSecrets非依存で実行できる。
- 例外/エラー:
  - セキュリティ是正の緊急対応で一時的な例外設定を行う場合は、有効期限と復旧計画を同一変更へ記録できる。
  - ワークフロー改ざんが疑われる場合はデプロイを停止し、復旧完了まで `workflow_dispatch` 実行を禁止できる。
- 依存・関連:
  - [[RQ-SEC-001]]
  - [[RQ-DEV-005]]
  - [[RQ-DEV-006]]
  - [[RQ-RDR-050]]

## 変更履歴
- 2026-02-21: 新規作成（GitHub Actions運用のセキュリティ統制を独立要件として追加） [[RQ-RDR-050]]
