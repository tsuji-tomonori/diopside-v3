---
id: IT-CASE-008
title: 運用診断API 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-10
updated: '2026-02-28'
up:
- '[[IT-PLAN-001]]'
- '[[DD-APP-API-009]]'
related:
- '[[AT-SCN-005]]'
- '[[RQ-UC-007]]'
- '[[IT-PW-UC-007]]'
tags:
- diopside
- IT
- CASE
---

## 対象API
- `GET /api/v1/ops/ingestion/latest`
- `GET /api/v1/ops/diagnostics/health`（[[DD-APP-API-009]]）

## 対象UC
- [[RQ-UC-007]]（管理者が収集失敗を調査する）

## 生成元PWモデル
- [[IT-PW-UC-007]]

## テスト目的
- 収集結果参照と診断ヘルス契約（`ok/degraded/critical`）の連携を検証する。

## 契約化した受入条件
- `latest` が run結果と件数サマリを返却する。
- `health` が障害種別に応じて状態遷移する。
- 復旧後に `critical` から改善状態へ遷移する。

## 因子（機能要件ベース）
| 因子 | 関連要求 | 水準 |
| --- | --- | --- |
| 最新run状態 | [[RQ-FR-017]] | 成功, 失敗 |
| 障害種別 | [[RQ-FR-018]] | 欠損, 不整合, 鮮度遅延 |
| 復旧実施 | [[RQ-UC-008]] | 未実施, 実施済み |

## テストケース一覧
| case_id | 条件 | 期待結果 |
| --- | --- | --- |
| IT-CASE-008-C01 | 成功run + 障害なし | `latest` 整合 + `health=ok` |
| IT-CASE-008-C02 | 欠損障害注入 | `health=critical` |
| IT-CASE-008-C03 | 復旧後再確認 | `health` が改善状態へ遷移 |

## 手順
1. 正常run後に最新結果APIを取得する。
2. 障害状態を再現し診断APIの状態を確認する。
3. 復旧後に状態が回復することを確認する。

## 期待結果
- `targetCounts` と実データ件数が一致する。
- 状態が `ok/degraded/critical` で適切に遷移する。

## 変更履歴
- 2026-02-28: UC基準フォーマットへ再編し、診断契約のケース表を追加
- 2026-02-11: API経路を `/api/v1/ops` へ更新
- 2026-02-10: 新規作成
