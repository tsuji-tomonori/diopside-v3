---
id: BD-DEP-005
title: インフラデプロイ設計（配信境界）
doc_type: デプロイ設計
phase: BD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
  - '[[RQ-FR-025]]'
  - '[[RQ-DEV-001]]'
related:
  - '[[BD-ADR-014]]'
  - '[[BD-DEP-004]]'
  - '[[DD-DEP-003]]'
  - '[[AT-REL-001]]'
  - '[[AT-RUN-001]]'
tags:
  - diopside
  - BD
  - DEP
---

## 目的
- インフラ配備の責務を docs/front/backend/infra の4領域で分離し、障害時の再実行範囲を限定する。

## 配備責務マップ
| 領域 | 主成果物 | 主経路 | 主失敗時の再実行 |
|---|---|---|---|
| docs | Quartz静的成果物 | `/docs/*` | `task quartz:build` -> `task infra:deploy` |
| front | SPA静的成果物 | `/web/*` | front build -> `task infra:deploy` |
| backend | API実行バイナリ | `/api/v1/*` | backend deploy |
| infra | CloudFront/S3/配備設定 | 全経路 | `task infra:deploy` |

## 実行方針
- 標準入口は `task docs:deploy` を維持し、内部で領域別タスクへ分岐する。
- CloudFront behavior順序は `/api/*` -> `/openapi/*` -> `/docs/*` -> `/web/*` -> `/*` を固定する。
- invalidationは経路別（`/docs/*` `/web/*` `/openapi/*`）で実施し、`/*` は緊急時のみ許可する。

## ロールバック方針
- docs/frontは直前の静的成果物へ戻す。
- backendは直前の安定版へ戻し、API契約互換を破らない版を選ぶ。
- infra設定変更は差分単位で戻し、CloudFront behavior順序と認証境界を最優先で復旧する。

## 品質ゲート
- 配備前に `docs:guard` を通過し、リンク・参照不整合を解消する。
- infra配備は `lint` / `test` / `cdk synth` / `cdk-nag` を通過条件とする。
- 配備後は `/docs/` `/web/` `/openapi/` `/api/v1/health` の到達を確認する。

## 変更履歴
- 2026-02-11: 新規作成（領域分割型インフラデプロイ設計） [[BD-ADR-014]]
- 2026-02-11: ADR参照を配信経路境界の決定へ整理 [[BD-ADR-014]]
