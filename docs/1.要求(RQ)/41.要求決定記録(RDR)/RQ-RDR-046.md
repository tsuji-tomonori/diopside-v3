---
id: RQ-RDR-046
title: データ正本をRDBへ統一しAPI契約語彙を整合する決定
doc_type: 要求決定記録
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-19
updated: '2026-02-19'
up:
  - '[[RQ-SC-001]]'
related:
  - '[[RQ-SUS-001-01]]'
  - '[[RQ-AV-003-01]]'
  - '[[RQ-SEC-003-01]]'
  - '[[RQ-OBY-002-01]]'
  - '[[RQ-DEV-001-01]]'
  - '[[BD-APP-API-001]]'
  - '[[BD-APP-API-002]]'
  - '[[DD-APP-API-002]]'
  - '[[DD-APP-DB-010]]'
  - '[[DD-INF-DEP-003]]'
tags:
  - diopside
  - RQ
  - RDR
---

## 決定事項
- データ正本はRDBへ統一し、要求・設計・詳細設計で同一前提を使用する。
- ヘルスチェック経路は `/api/v1/ops/diagnostics/health` を正本経路として統一する。
- 運用APIの外部入出力キーは `snake_case` を正本とし、DD層の契約記述も同語彙へ揃える。
- `run_kind` の語彙は `official_ingestion` / `appearance_supplement` / `incremental_update` を正本とし、run種別拡張は別runテーブルで表現する。

## 理由
- 上から順に文書を読む導線で、DynamoDB前提とRDB前提が混在し、実装判断が分岐していた。
- API経路とキー命名の不一致により、BDとDDの契約参照が二重化していた。

## 影響
- RQ: `RQ-SUS-001-01` / `RQ-AV-003-01` / `RQ-SEC-003-01` / `RQ-OBY-002-01` / `RQ-DEV-001-01` を更新する。
- BD: `BD-APP-API-001` / `BD-APP-API-002` にヘルス経路・外部契約語彙の正本を追記する。
- DD: `DD-APP-API-002` / `DD-APP-DB-010` / `DD-INF-DEP-003` を正本語彙へ整合する。

## 却下した選択肢
- DynamoDB正本へ再統一する案: 既存DDのDDL正本と乖離が大きく、実装直前情報の再構築コストが高いため不採用。
- camelCaseを外部契約の正本にする案: 既存BDのAPI契約記述（snake_case）との互換コストが高く不採用。

## 変更履歴
- 2026-02-19: 新規作成 [[RQ-RDR-046]]
