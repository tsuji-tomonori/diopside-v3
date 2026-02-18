---
id: BD-SYS-ADR-034
title: API契約語彙と運用ヘルス経路を統一する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-19
updated: '2026-02-19'
up:
- '[[RQ-RDR-046]]'
related:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-API-001]]'
- '[[BD-APP-API-002]]'
- '[[DD-APP-API-001]]'
- '[[DD-APP-API-002]]'
- '[[DD-APP-DB-010]]'
- '[[DD-INF-DEP-003]]'
tags:
- diopside
- BD
- ADR
---

## 決定事項
- 運用APIの外部入出力キーは `snake_case` を正本とする。
- ヘルスチェック経路は `GET /api/v1/ops/diagnostics/health` を正本経路とする。
- 収集runの `run_kind` は `official_ingestion` / `appearance_supplement` / `incremental_update` の3値に統一する。

## 理由
- BDとDDでAPI語彙（snake/camel）および経路定義が分岐し、実装判断が揺れていた。
- 収集runと再確認runは責務が異なるため、語彙を同一テーブルで拡張すると追跡性が低下する。

## 影響
- `[[BD-APP-API-001]]` / `[[BD-APP-API-002]]`: 契約表記ルールとヘルス経路正本を明記する。
- `[[DD-APP-API-002]]`: 収集起動APIのリクエスト/レスポンス/入力スキーマを `snake_case` へ統一する。
- `[[DD-APP-DB-010]]`: `run_kind` 制約を収集runの3値へ整合する。
- `[[DD-INF-DEP-003]]`: 反映確認のヘルス経路を正本へ合わせる。

## 却下した選択肢
- 外部契約を `camelCase` へ変更する案: 既存BD契約と互換しないため不採用。
- ヘルス経路を `/api/v1/health` と `/api/v1/ops/diagnostics/health` で併存する案: 運用確認の入口が分岐し誤判定を招くため不採用。

## 変更履歴
- 2026-02-19: 新規作成 [[BD-SYS-ADR-034]]
