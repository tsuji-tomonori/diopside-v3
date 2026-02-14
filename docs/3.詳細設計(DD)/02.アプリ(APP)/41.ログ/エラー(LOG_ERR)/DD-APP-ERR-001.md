---
id: DD-APP-ERR-001
title: エラーコード設計
doc_type: エラー設計
phase: DD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-API-004]]'
- '[[BD-APP-API-003]]'
- '[[BD-APP-API-005]]'
related:
- '[[RQ-SEC-001]]'
- '[[RQ-OBY-001]]'
- '[[DD-APP-LOG-001]]'
- '[[DD-APP-API-001]]'
- '[[DD-APP-API-010]]'
- '[[AT-SCN-006]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- ERR
---


## 詳細仕様
- HTTP APIエラー応答は Problem Details（`application/problem+json`）を正本とし、API/運用処理/UI通知の判定情報を同一形式で扱う。
- エラーコード体系は Problem Details の拡張メンバーとして運用し、文字列解析に依存しない機械判定を維持する。

## Problem Details 基本契約
- 必須メンバー: `type`, `title`, `status`, `detail`, `instance`。
- 拡張メンバー: `code`, `category`, `retryable`, `trace_id`, `occurred_at`, `errors[]`, `hint`, `related_run_id`, `related_publish_run_id`。
- `trace_id` は UUID 形式とし、`DD-APP-LOG-001` の `trace_id` と相関可能にする。
- `instance` は要求単位で一意となる識別子（例: `/api/v1/ops/ingestion/runs/{runId}#<request_id>`）を採用する。

## コード体系
- 形式: `<domain>-<category>-<nnn>`（例: `OPS-AUTH-001`, `INGEST-VALIDATION-002`）。
- `domain`: `WEB`, `API`, `OPS`, `INGEST`, `DEPLOY`, `DATA`。
- `category`: `AUTH`, `VALIDATION`, `CONFLICT`, `DEPENDENCY`, `TIMEOUT`, `INTERNAL`。
- 同一コードは恒久的に意味固定し、意味変更は新コード追加で対応する。

## HTTPマッピング
- `VALIDATION`: `400`（入力形式不正、必須欠落）。
- `AUTH`: `401` または `403`（未認証/権限不足）。
- `CONFLICT`: `409`（重複起動、状態競合）。
- `DEPENDENCY` / `TIMEOUT`: `502` / `504`（外部依存障害）。
- `INTERNAL`: `500`（想定外例外）。

## バリデーション詳細（`errors[]`）
- フィールド単位の検証失敗は `errors[]` に格納し、`field`, `reason`, `rejected_value`（機密除外）を返す。
- `detail` は人間向け要約に限定し、クライアント判定は `code` と `errors[]` を使用する。
- Zod検証失敗は `app.onError` で集約し、`errors[]` へ正規化して返す。

## 利用者向けメッセージ方針
- `title` と `detail` は 80 文字以内の短文を基本とし、次操作（再試行、設定見直し、運用連絡）を含める。
- 公開UIへ内部構造や秘密情報を露出しない。詳細情報は `hint` と監査ログ側へ分離する。
- `trace_id` はすべての失敗応答に付与し、ログ検索キーとして再利用する。

## 再試行ポリシー
- `VALIDATION` / `AUTH` / `CONFLICT` は自動再試行しない。
- `DEPENDENCY` / `TIMEOUT` は指数バックオフで最大 3 回再試行し、失敗時は運用アラートへ昇格する。
- 同一 `trace_id` で 3 回連続失敗した場合はインシデント候補として記録する。

## ログ連携
- 失敗イベントは `code`, `http_status`, `trace_id`, `resource`, `operator`, `retry_count` を必須記録する。
- エラーコード別件数を日次集計し、増加傾向（前週比 +20%以上）を監視する。
- 重大コード（`*-INTERNAL-*`, `*-AUTH-*`）は即時通知対象とする。

## I/Oまたは責務
- 入力: アプリケーション例外、バリデーション結果、認可判定、外部依存エラー、再試行結果。
- 出力: 標準化エラー応答、ログイベント、通知イベント、インシデント判定材料。

## 変更履歴
- 2026-02-11: Problem Details（`application/problem+json`）を正本化し、必須/拡張メンバーと `errors[]` 正規化方針を追加
- 2026-02-11: エラーコード体系、HTTPマッピング、再試行ポリシー、ログ連携を具体化
- 2026-02-10: 新規作成
