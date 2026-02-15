---
id: RQ-INT-002
title: OpenAPI仕様の維持管理
doc_type: 非機能要求
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-16
updated: '2026-02-16'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-INT-001]]'
- '[[RQ-DEV-001]]'
- '[[RQ-SEC-001]]'
tags:
- diopside
- RQ
- INT
---


## SnowCard（日本語）
- 要求ID: RQ-INT-002
- 種別: 非機能要求
- 優先度: SHOULD
- 要求: 本システムは、管理APIのOpenAPI 3.x仕様を `/openapi/v1/` で配信し、CIでスキーマ検証を実施して実装との乖離を0件に維持すること。
- 根拠: API仕様と実装の乖離は契約破壊の原因となり、[[RQ-INT-001]] の互換性維持要件に違反するため。
- 受入基準:
  - OpenAPI 3.x仕様ファイルが `/openapi/v1/` 経路で配信される。
  - CIパイプラインでOpenAPI仕様のバリデーション（構文・参照整合）が実行される。
  - 実装のリクエスト/レスポンスがOpenAPI仕様と一致することをcontract testで検証する。
  - 仕様と実装の乖離件数が0件である。
  - API変更時にOpenAPI仕様が同一変更で更新される。
- 例外/エラー:
  - 仕様と実装の乖離を検知した場合は、次回デプロイまでに仕様または実装を是正する。
  - OpenAPI仕様の配信自体が障害の場合は、API機能には影響しないため優先度を下げて対応する。
- 依存・関連:
  - [[RQ-INT-001]]
  - [[RQ-DEV-001]]
  - [[RQ-DEV-003]]

## 変更履歴
- 2026-02-16: 新規作成
