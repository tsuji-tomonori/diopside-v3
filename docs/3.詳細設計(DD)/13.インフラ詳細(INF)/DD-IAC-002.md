---
id: DD-IAC-002
title: IaC状態管理とドリフト検知
doc_type: インフラ詳細
phase: DD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[DD-IAC-001]]'
- '[[RQ-DEV-001]]'
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

## state backend設計
- backend種別: S3 + DynamoDB lock（単一リージョン）。
- state保存: SSE-KMS有効、バケットバージョニング有効、公開アクセス禁止。
- lock timeout: 10分、強制解除は二重承認 + 実施記録を必須化。

## ドリフト検知SLA
| レベル | 条件 | 対応SLA |
|---|---|---|
| P1 | 認証境界/公開設定のドリフト | 2時間以内に是正 |
| P2 | 監視/通知設定のドリフト | 当日中に是正 |
| P3 | タグ/説明情報のみのドリフト | 3営業日以内に是正 |

## 証跡
- 日次検知結果は `reports/` 配下へ保存し、変更IDと紐付ける。
- 未是正のドリフトがある場合、`apply` は禁止し `plan` のみ許可する。

## 運用条件
- 手動変更検知時は即時是正またはIaC取り込みを実施する。

## 変更履歴
- 2026-02-13: state backend構成、lock運用、ドリフト対応SLAを追加
- 2026-02-13: 新規作成
