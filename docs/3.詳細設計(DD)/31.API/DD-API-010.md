---
id: DD-API-010
title: API経路バージョニング詳細
doc_type: API詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[BD-API-004]]'
- '[[BD-ADR-014]]'
related:
- '[[RQ-FR-025]]'
- '[[DD-API-002]]'
- '[[DD-API-003]]'
- '[[DD-API-008]]'
- '[[DD-API-009]]'
- '[[AT-SCN-006]]'
tags:
- diopside
- DD
- API
---

## 目的
- 業務API経路を `/api/v1/*` に統一し、OpenAPI配布経路との版対応を固定する。

## 経路仕様
- [[DD-API-002]]: `POST /api/v1/ops/ingestion/runs`
- [[DD-API-003]]: `GET /api/v1/ops/ingestion/runs/{runId}`
- [[DD-API-008]]: `POST /api/v1/ops/ingestion/runs/{runId}/retry`
- [[DD-API-009]]:
  - `GET /api/v1/ops/ingestion/latest`
  - `GET /api/v1/ops/diagnostics/health`

## OpenAPI版対応
- OpenAPI仕様は `/openapi/v1/openapi.json` を正本とする。
- `/api/v1/*` の変更は同一変更でOpenAPI仕様を更新する。

## 認証
- `/api/v1/*` はJWT必須。
- 未認証アクセスは 401 を返却し、処理を実行しない。

## 受入観点
- `/api/v1/*` と `/openapi/v1/openapi.json` の版が一致すること。
- 未認証で `/api/v1/*` にアクセスした場合に 401 を返すこと。

## 変更履歴
- 2026-02-11: 新規作成
