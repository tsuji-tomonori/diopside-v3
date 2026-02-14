---
id: DD-INF-IAC-003
title: IaC状態管理とドリフト検知
doc_type: インフラ詳細
phase: DD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[DD-INF-IAC-002]]'
- '[[RQ-DEV-001]]'
related:
- '[[IT-INF-ROLL-001]]'
- '[[DD-INF-IAC-001]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- CloudFormationスタック状態とCDK生成物（`cdk.out`）を状態管理の正本とする。
- ドリフト検知は日次実行し、差分をチケット化する。

## 章構成
1. 状態管理対象
2. ドリフト判定
3. 是正フロー

## 1. 状態管理対象
| 対象リソース | 正本 | 管理値 | 根拠 |
|---|---|---|---|
| VPC/Route/SG/NACL | CloudFormation + `cdk.out` | CIDR、経路、許可通信 | ネットワーク境界は変更影響が大きく、手動変更を禁止するため。 |
| IAM/Boundary | CloudFormation + `cdk.out` | ロール、境界、条件句 | 権限逸脱を差分で即時検知するため。 |
| Alarm/Notification | CloudFormation + `cdk.out` | 閾値、通知先、通知条件 | SLO判定と通知遅延の回帰を防止するため。 |
| Pipeline | CloudFormation + `cdk.out` | 承認条件、artifact固定化条件 | 承認済み差分以外の反映を防止するため。 |

## 2. ドリフト判定
- 生成管理: `cdk synth` で生成したテンプレートとcontext（`cdk.context.json`）を差分管理する。
- 反映管理: `cdk deploy` は承認済み差分に対してのみ実行し、実行ログと変更セットを証跡化する。
- 実行制御: 本番反映は承認済みパイプラインからのみ許可し、手動CLI直実行を禁止する。

## ドリフト検知SLA
| レベル | 条件 | 対応SLA |
|---|---|---|
| P1 | 認証境界/公開設定のドリフト | 2時間以内に是正 |
| P2 | 監視/通知設定のドリフト | 当日中に是正 |
| P3 | タグ/説明情報のみのドリフト | 3営業日以内に是正 |

## 3. 是正フロー
- P1/P2ドリフトは是正完了まで `cdk deploy` を禁止し、`cdk synth` / `cdk diff` のみ許可する。
- P3ドリフトは次回承認バッチで是正可能とするが、3営業日以内のクローズを必須化する。

## 証跡
- 日次検知結果は `reports/` 配下へ保存し、変更IDと紐付ける。
- 未是正のドリフトがある場合、`cdk deploy` は禁止し `cdk synth` / `cdk diff` のみ許可する。

## 運用条件
- 手動変更検知時は即時是正またはIaC取り込みを実施する。

## 変更履歴
- 2026-02-13: 状態管理対象をリソース別に追加し、是正フローをP1/P2/P3で章分割
- 2026-02-13: CDK状態管理（synth/diff/deploy証跡）へ更新し、`cdk deploy` 制御条件を追加
- 2026-02-13: state backend構成、lock運用、ドリフト対応SLAを追加
- 2026-02-13: 新規作成
