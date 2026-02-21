---
id: RQ-DEV-007
title: GitHub Actions証跡の保持と参照
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
- '[[BD-DEV-PIPE-001]]'
- '[[AT-GO-001]]'
- '[[RQ-RDR-050]]'
tags:
- diopside
- RQ
- DEV
---


## SnowCard（日本語）
- 要求ID: RQ-DEV-007
- 種別: 非機能要求
- 優先度: MUST
- 要求: 本システムは、GitHub Actionsで生成される品質証跡を保持し、リリース判定文書から参照できる状態を維持できる。
- 根拠: Go/No-Go判定時に、実行ログと検査結果を同一リリース単位で追跡可能にするため。
- 受入基準:
  - a11y検査結果を含むArtifactsをアップロードし、保持期間を明示できる。
  - a11y検査結果は90日以上保持できる。
  - リリース判定時に対象Artifactsの参照先を記録できる。
  - 単位別CI結果とデプロイ結果を同一実行IDで突合できる。
- 例外/エラー:
  - Artifacts保持期限を超過した場合は、判定文書側へ期限超過を記録し再実行で証跡を再取得できる。
  - 証跡欠落が判明したリリース候補はNo-Goとして扱い、証跡再取得まで公開しない運用ができる。
- 依存・関連:
  - [[RQ-DEV-001]]
  - [[BD-DEV-PIPE-001]]
  - [[AT-GO-001]]
  - [[RQ-RDR-050]]

## 変更履歴
- 2026-02-21: 新規作成（GitHub Actions証跡保持を独立要件として追加） [[RQ-RDR-050]]
