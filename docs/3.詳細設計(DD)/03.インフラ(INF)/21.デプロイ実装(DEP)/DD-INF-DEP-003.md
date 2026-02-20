---
id: DD-INF-DEP-003
title: インフラデプロイ詳細（領域分割）
doc_type: デプロイ詳細
phase: DD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-21'
up:
  - '[[BD-INF-DEP-005]]'
  - '[[BD-SYS-ADR-014]]'
related:
  - '[[BD-INF-DEP-004]]'
  - '[[DD-INF-DEP-002]]'
  - '[[DD-INF-CF-001]]'
  - '[[BD-SYS-ADR-034]]'
  - '[[AT-REL-001]]'
  - '[[AT-RUN-001]]'
tags:
  - diopside
  - DD
  - DEP
---

## 詳細仕様
- Behavior順序とrewrite対象の設定値は [[DD-INF-CF-001]] / [[DD-INF-CF-002]] を正本とし、本書は領域分割配備と反映確認を扱う。
- 配備は `docs -> front -> backend -> infra verify` の順で実行する。
- 経路別behaviorの正本順序は `/api/*` -> `/openapi/*` -> `/docs/*` -> `/web/*` -> `/*`。
- `/docs/*` のみ rewrite を許可し、`/api/*` と `/openapi/*` は rewrite 禁止。

## 実行手順
1. `task docs:guard` で文書整合を確認する。
2. docs/front成果物をビルドし、静的アセットを分離配置する。
3. backendを配備し、`/api/v1/ops/diagnostics/health` 応答を確認する。
4. `task infra:deploy` でCloudFront/S3設定を反映する。
5. 経路別invalidationを実行し、到達確認を行う。

## 反映確認
| 確認対象 | 期待値 | 失敗時対応 |
|---|---|---|
| `/docs/` | 200で公開トップ表示 | docs再配備 |
| `/web/` | 200で画面表示 | front再配備 |
| `/openapi/` | 認証必須で閲覧可能 | 認証設定再確認 |
| `/api/v1/ops/diagnostics/health` | 200でヘルス応答 | backend再配備 |

## ロールバック条件
- docs/front: 反映後5分以内に主要導線が復帰しない場合は直前版へ切戻す。
- backend: 互換性エラーが継続する場合は直前API版へ戻す。
- infra: behavior順序または認証境界の崩れを検知した場合は即時切戻す。

## 監視観点
- 経路別4xx/5xx率の急増を検知する。
- invalidation完了遅延を監視し、10分超過でWarningを発報する。

## 変更履歴
- 2026-02-21: CloudFront設定値の正本参照を配信基盤詳細へ移管し、本書の責務を配備手順へ限定 [[BD-SYS-ADR-036]]
- 2026-02-19: ヘルスチェック確認経路を `/api/v1/ops/diagnostics/health` へ統一 [[BD-SYS-ADR-034]]
- 2026-02-11: 新規作成（領域分割配備とロールバック条件を追加） [[BD-SYS-ADR-014]]
- 2026-02-11: ADR参照を配信経路境界の決定へ整理 [[BD-SYS-ADR-014]]
