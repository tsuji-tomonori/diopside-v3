---
id: RQ-OBY-002
title: ヘルスチェックエンドポイント
doc_type: 非機能要求
phase: RQ
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-16
updated: '2026-02-19'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-OBY-001]]'
- '[[RQ-AV-001]]'
- '[[RQ-INT-001]]'
- '[[RQ-RDR-046]]'
tags:
- diopside
- RQ
- OBY
---


## SnowCard（日本語）
- 要求ID: RQ-OBY-002
- 種別: 非機能要求
- 優先度: SHOULD
- 要求: 本システムは、管理API `/api/v1/ops/diagnostics/health` でバックエンドサービスの接続状態を返却し、CloudFrontカスタムエラーページを設定すること。
- 根拠: 障害検知の迅速化と[[RQ-SH-002|利用者]]向けエラー表示の改善により、[[RQ-AV-001]] のMTTR要件達成を支援するため。
- 受入基準:
  - `/api/v1/ops/diagnostics/health` エンドポイントがDB正本・S3への接続状態を含むヘルスステータスを返却する。
  - レスポンスに `status`（`healthy` / `degraded` / `unhealthy`）と各依存サービスの状態を含む。
  - ヘルスチェックの応答時間が5秒以内である。
  - CloudFrontで4xx/5xxエラー時のカスタムエラーページが設定されている。
  - ヘルスチェック結果を [[RQ-OBY-001]] の監視対象に含める。
- 例外/エラー:
  - ヘルスチェック自体が応答不能な場合は、CloudFrontカスタムエラーページで[[RQ-SH-002|利用者]]に通知する。
  - DB正本またはS3の一方のみ障害の場合は `degraded` ステータスを返却し、利用可能な機能を明示する。
- 依存・関連:
  - [[RQ-OBY-001]]
  - [[RQ-AV-001]]
  - [[RQ-SEC-001]]

## 変更履歴
- 2026-02-19: ヘルスチェック経路を `/api/v1/ops/diagnostics/health` へ統一し、依存表記をDB正本へ更新 [[RQ-RDR-046]]
- 2026-02-16: 新規作成
