---
id: RQ-DEV-005
title: GitHub ActionsによるPR品質ゲート
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
- '[[RQ-RDR-050]]'
tags:
- diopside
- RQ
- DEV
---


## SnowCard（日本語）
- 要求ID: RQ-DEV-005
- 種別: 非機能要求
- 優先度: MUST
- 要求: 本システムは、Pull RequestごとにGitHub Actionsで品質ゲートを自動実行し、必須チェック合格前のマージを防止できる。
- 根拠: 小差分リリース運用でレビュー漏れを抑え、変更単位ごとの品質判定を安定化するため。
- 受入基準:
  - PR更新ごとに `lint` / `test` / `build` を必須ステータスチェックとして実行できる。
  - `docs` / `web` / `api` / `infra` のデプロイ単位ごとに失敗ジョブを判別できる。
  - 必須チェック未達時に保護ブランチへマージできない状態を維持できる。
  - 必須チェックで使用するjob名は一意に管理され、判定衝突を起こさない運用ができる。
- 例外/エラー:
  - CIが基盤障害で失敗した場合は再実行で復旧確認を行い、復旧確認前にマージしない運用ができる。
  - チェック定義変更時は、変更理由と影響範囲を同一PRへ記録できる。
- 依存・関連:
  - [[RQ-DEV-001]]
  - [[BD-DEV-PIPE-001]]
  - [[RQ-RDR-050]]

## 変更履歴
- 2026-02-21: 新規作成（GitHub ActionsのPR品質ゲートを独立要件として追加） [[RQ-RDR-050]]
