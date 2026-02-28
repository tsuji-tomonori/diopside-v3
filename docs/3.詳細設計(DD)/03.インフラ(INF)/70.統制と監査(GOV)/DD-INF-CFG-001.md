---
id: DD-INF-CFG-001
title: AWS Config詳細（required-tags）
doc_type: インフラ詳細
phase: DD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-28'
up:
- '[[BD-INF-PLAT-001]]'
- '[[BD-SYS-ADR-015]]'
related:
- '[[DD-SYS-COST-001]]'
- '[[DD-INF-SEC-003]]'
- '[[AT-OPS-001]]'
- '[[RQ-RDR-049]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- AWS Config `required-tags` は「検出」の正本として運用し、未設定タグの自動是正は行わない。
- 検出結果は日次で確認し、是正チケット起票までを必須運用とする。

## 対象と評価
| 項目 | 設計値 | 根拠 |
|---|---|---|
| ルール | `required-tags` | タグ統制違反を継続検出するため。 |
| 評価頻度 | 日次 | 運用遅延を抑えるため。 |
| 対象 | 管理対象8サービスに紐づく主要リソース（6必須タグ） | コスト按分と監査追跡を成立させるため。 |

## 環境別適用
| 環境 | 適用方針 | 根拠 |
|---|---|---|
| Development | 標準無効（任意有効） | 固定費抑制を優先し、検証用途の最小構成を維持するため。 |
| Production | 必須有効 | 監査証跡とタグ統制の継続検知を担保するため。 |

## 必須タグ
- `Project`
- `Environment`
- `Owner`
- `CostCenter`
- `ManagedBy`
- `Description`

## 是正フロー
1. Config違反を日次バッチで収集する。
2. 違反リソースごとに運用チケットを起票する。
3. 是正完了後に再評価し、未解消は次回運用判定でエスカレーションする。

## 運用制約
- Configは検出のみで防止機能ではないため、デプロイ承認ゲートと併用する。
- 本番で未是正違反が継続する場合は、次回 `cdk deploy` の承認条件に反映する。

## 変更履歴
- 2026-02-28: 環境別適用（dev任意/prod必須）を追加し、コスト最小構成と統制要件を両立
- 2026-02-28: OPSINF廃止に合わせ、受入参照を [[AT-OPS-001]] へ更新
- 2026-02-21: `Description` と `ManagedBy` を必須タグへ追加し、required-tags評価対象を6キーへ更新
- 2026-02-21: 新規作成（Config required-tagsの検出/是正運用を詳細化） [[BD-SYS-ADR-036]]
