---
id: BD-APP-OAS-000
title: OpenAPI IF一覧
doc_type: API設計
phase: BD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-03-06
updated: '2026-03-07'
up:
- '[[BD-APP-API-004]]'
- '[[BD-APP-API-001]]'
related:
- '[[DD-APP-API-001]]'
- '[[BD-SYS-ADR-025]]'
- '[[UT-PLAN-005]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- BD
- API
- OpenAPI
---

## 方針
- 本一覧および `BD-APP-OAS-*` は OpenAPI 正本から自動生成する。
- 各文書は HTTP I/F のみを表形式で記載し、処理フロー・制約・オラクルは `DD-APP-API-*` を参照する。

## 一覧
| doc_id | title | method | path | 処理詳細 |
| --- | --- | --- | --- | --- |
| [[BD-APP-OAS-001]] | [[RQ-GL-002\|収集実行]]起動API契約 | `POST` | `/api/v1/ops/ingestion/runs` | [[DD-APP-API-002]] |
| [[BD-APP-OAS-002]] | [[RQ-GL-002\|収集実行]]状態取得API契約 | `GET` | `/api/v1/ops/ingestion/runs/{runId}` | [[DD-APP-API-003]] |
| [[BD-APP-OAS-003]] | 収集結果明細取得API契約 | `GET` | `/api/v1/ops/ingestion/runs/{runId}/items` | [[DD-APP-API-011]] |
| [[BD-APP-OAS-004]] | [[RQ-GL-011\|再収集]]起動API契約 | `POST` | `/api/v1/ops/ingestion/runs/{runId}/retry` | [[DD-APP-API-008]] |
| [[BD-APP-OAS-005]] | 最新収集結果取得API契約 | `GET` | `/api/v1/ops/ingestion/latest` | [[DD-APP-API-009]] |
| [[BD-APP-OAS-006]] | 運用ヘルス診断API契約 | `GET` | `/api/v1/ops/diagnostics/health` | [[DD-APP-API-009]] |
| [[BD-APP-OAS-007]] | 再確認起動API契約 | `POST` | `/api/v1/ops/rechecks` | [[DD-APP-API-012]] |
| [[BD-APP-OAS-008]] | 再確認状態取得API契約 | `GET` | `/api/v1/ops/rechecks/{recheckRunId}` | [[DD-APP-API-012]] |
| [[BD-APP-OAS-009]] | タグ作成API契約 | `POST` | `/api/v1/admin/tags` | [[DD-APP-API-013]] |
| [[BD-APP-OAS-010]] | タグ更新API契約 | `PATCH` | `/api/v1/admin/tags/{tagId}` | [[DD-APP-API-013]] |
| [[BD-APP-OAS-011]] | 動画タグ更新API契約 | `PATCH` | `/api/v1/admin/videos/{videoId}/tags` | [[DD-APP-API-013]] |
| [[BD-APP-OAS-012]] | タグ提案プロンプト生成API契約 | `POST` | `/api/v1/admin/tagging/prompts` | [[DD-APP-API-013]] |
| [[BD-APP-OAS-013]] | タグ提案JSON取込API契約 | `POST` | `/api/v1/admin/tagging/imports` | [[DD-APP-API-013]] |
| [[BD-APP-OAS-014]] | ドキュメント公開起動API契約 | `POST` | `/api/v1/admin/docs/publish` | [[DD-APP-API-014]] |
| [[BD-APP-OAS-015]] | ドキュメント公開状態取得API契約 | `GET` | `/api/v1/admin/docs/publish/{docsPublishRunId}` | [[DD-APP-API-014]] |
| [[BD-APP-OAS-016]] | [[RQ-GL-008\|タグマスター]]公開起動API契約 | `POST` | `/api/v1/admin/publish/tag-master` | [[DD-APP-API-015]] |
| [[BD-APP-OAS-017]] | 配信反映起動API契約 | `POST` | `/api/v1/admin/publish/runs` | [[DD-APP-API-015]] |
| [[BD-APP-OAS-018]] | 配信反映状態取得API契約 | `GET` | `/api/v1/admin/publish/{publishRunId}` | [[DD-APP-API-015]] |
| [[BD-APP-OAS-019]] | [[RQ-GL-007\|bootstrap]]契約取得API | `GET` | `/api/v1/public/bootstrap` | [[DD-APP-API-004]] |
| [[BD-APP-OAS-020]] | [[RQ-GL-008\|タグマスター]]契約取得API | `GET` | `/api/v1/public/tag-master` | [[DD-APP-API-005]] |
| [[BD-APP-OAS-021]] | archive index契約取得API | `GET` | `/api/v1/public/archive-index` | [[DD-APP-API-004]] |
| [[BD-APP-OAS-022]] | 動画検索API契約 | `GET` | `/api/v1/search` | [[DD-APP-API-006]] |
| [[BD-APP-OAS-023]] | 動画詳細API契約 | `GET` | `/api/v1/videos/{videoId}` | [[DD-APP-API-007]] |

## 変更履歴
- 2026-03-07: OpenAPI 正本から表形式のI/F一覧を自動生成 [[BD-SYS-ADR-023]]
