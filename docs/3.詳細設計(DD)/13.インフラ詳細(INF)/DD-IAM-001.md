---
id: DD-IAM-001
title: IAM詳細設計
doc_type: インフラ詳細
phase: DD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[BD-INF-004]]'
- '[[RQ-SEC-001]]'
related:
- '[[UT-POL-001]]'
- '[[AT-OPS-INF-001]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- ロール、権限境界、クロスアカウントアクセス条件を定義する。
- 特権ロールは利用期限と承認者を必須とする。

## ロール定義
| ロール | 主体 | 主権限 | 制約 |
|---|---|---|---|
| `infra-deploy-role` | CI/CD | IaC `plan/apply`、CloudFront invalidation | 本番は手動承認後のみ `apply` 可 |
| `infra-readonly-role` | 運用監視 | CloudWatch/Config/CloudTrail参照 | 書き込み権限禁止 |
| `breakglass-admin-role` | 障害一次対応 | 期間限定の管理操作 | 60分で自動失効、二重承認必須 |

## 権限境界
- 全ロールに permission boundary を適用し、`iam:*`, `kms:ScheduleKeyDeletion`, `s3:DeleteBucket` をデフォルト拒否する。
- wildcard権限（`*`）は `Action`/`Resource` ともに禁止し、例外はRDR起票を必須化する。
- クロスアカウント許可は `Principal` 固定 + `ExternalId` 必須 + `Condition` でIP/時間帯制約を設定する。

## Secrets/KMS運用
- 機密値は Secrets Manager 管理とし、参照は `GetSecretValue` のみに限定する。
- KMSキーは年1回ローテーションを必須化し、鍵ポリシー変更は二重承認とする。
- 平文シークレットのCIログ出力を禁止し、検出時は当日中に失効・再発行する。

## 昇格条件
- 特権昇格は障害対応または緊急復旧時のみ許可し、開始時にチケットIDを必須入力する。
- 昇格セッション終了後10分以内に操作レビューを実施し、逸脱操作を監査記録へ残す。

## 監査要件
- 主要操作は監査ログへ `actor`, `role`, `resource`, `result` を記録する。

## 変更履歴
- 2026-02-13: ロール一覧・権限境界・Secrets/KMS運用・特権昇格条件を具体化
- 2026-02-13: 新規作成
