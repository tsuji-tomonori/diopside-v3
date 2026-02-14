---
id: BD-SYS-ARCH-003
title: クラウド配置構成
doc_type: アーキテクチャ概要
phase: BD
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[RQ-SC-001]]'
- '[[RQ-FR-001]]'
related:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-SYS-ADR-014]]'
- '[[BD-SYS-ADR-021]]'
- '[[BD-INF-DEP-004]]'
- '[[BD-DEV-ENV-002]]'
tags:
- diopside
- BD
- ARCH
---

## 設計方針
- 単一CloudFront配下で経路分離し、公開面と運用面の境界を固定する。
- DB正本は非公開ネットワークに配置し、公開経路に露出させない。

## 設計要点
- `/web/*`: 利用者向けWebと静的データ配信。
- `/docs/*`: 文書とテスト結果ホスト。
- `/openapi/*`: 仕様公開（認証必須）。
- `/api/v1/*`: 管理画面向け運用API（認証必須）。
- DB正本、収集実行、配信生成は単一のBackend API（Hono）内で運用する。

## 配置ルール
- 公開オリジンはS3のみとし、DBは直接オリジンに含めない。
- 運用APIはCloudFront経由で公開するが、認証境界とrewrite禁止を維持する。
- 配信生成はBackend API内ジョブで実行し、生成完了後に公開パスを切替える。

## 図
```mermaid
flowchart TD
  USER[利用者] --> CF[CloudFront]
  ADMIN[管理者] --> CF

  CF -->|/web/*| S3WEB[S3 Web/Data]
  CF -->|/docs/*| S3DOC[S3 Docs/Test]
  CF -->|/openapi/*| S3OAS[S3 OpenAPI]
  CF -->|/api/v1/*| API[Ops API]

  API --> APP[Hono Monolith Runtime]
  APP --> DB[(DB 正本)]
  APP --> JOB[Publish Job in API]
  JOB --> S3WEB
```

## 変更履歴
- 2026-02-11: 収集/公開ジョブの実行境界を単一Backend API（Hono）内へ統一 [[BD-SYS-ADR-021]]
- 2026-02-11: DB非公開配置と経路分離のクラウド構成を具体化 [[BD-SYS-ADR-021]]
- 2026-02-10: 新規作成 [[BD-SYS-ADR-001]]
