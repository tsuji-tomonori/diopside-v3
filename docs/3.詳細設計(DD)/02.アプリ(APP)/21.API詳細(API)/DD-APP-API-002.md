---
id: DD-APP-API-002
title: 収集ジョブ起動API
doc_type: API詳細
phase: DD
version: 1.0.7
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-14'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-API-002]]'
related:
- '[[RQ-FR-001]]'
- '[[RQ-FR-022]]'
- '[[RQ-FR-023]]'
- '[[BD-SYS-ADR-027]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- 手動またはスケジュール起点で[[RQ-GL-002|収集ジョブ]]を開始し、実行単位（run）を採番する。
- 収集対象区分（公式投稿/[[RQ-GL-004|出演動画]]）をジョブ起動時に明示できるようにする。

## エンドポイント
- `POST /api/v1/ops/ingestion/runs`

## リクエスト
- ヘッダー: `Content-Type: application/json`
- Body:
  - `triggerMode`: `manual` | `scheduled`
  - `runKind`: `official_ingestion` | `appearance_supplement` | `incremental_update`
  - `targetTypes`: `official` / `appearance` の配列
  - `fromPublishedAt`（任意）: ISO8601
  - `dryRun`（任意）: true/false

## レスポンス
- `202 Accepted`
  - `runId`: 実行ID
  - `acceptedAt`: 受理時刻
  - `triggerMode`: 起動文脈（手動/定期）
  - `runKind`: 収集種別
  - `targetTypes`: 対象区分
- `409 Conflict`
  - 同種ジョブが実行中で重複起動を拒否した場合

## バリデーション
- `targetTypes` が空の場合は `400 INVALID_TARGET`。
- `fromPublishedAt` が不正形式の場合は `400 INVALID_TIMESTAMP`。
- `targetTypes` は `official|appearance` のみ許可し、未知値は `400 INVALID_TARGET`。
- 収集入力に `Idempotency-Key` がない場合は `400 MISSING_IDEMPOTENCY_KEY`。

## 入力スキーマ（バッチ実行）
- run起動入力（JSON）
  - `triggerMode`: `manual|scheduled`
  - `runKind`: `official_ingestion|appearance_supplement|incremental_update`
  - `targetTypes[]`: `official|appearance`
  - `fromPublishedAt?`: ISO8601
  - `dryRun?`: boolean
  - `traceId`: string
- 補助データ生成入力（内部イベント）
  - `videoId`: string
  - `channelId`: string
  - `records[]`: `meta_type`, `message_text`, `published_at`
  - `pattern?`: 既定 `草|w|くさ|kusa`

## 処理ロジック
1. 認証済みJWTを検証し、`operator` を解決する。
2. 入力構文を検証し、`triggerMode/runKind/targetTypes/fromPublishedAt` の型不整合を拒否する。
3. 同時実行制約を評価し、同種run実行中なら `409 RUN_ALREADY_ACTIVE` を返す。
4. `Idempotency-Key` が既存要求と一致する場合は既存 `runId` を再返却する。
5. runレコードを `queued` で作成し、同一Backend API内ジョブ実行モジュールへ登録する。
6. 応答として `runId/acceptedAt/triggerMode/runKind/targetTypes` を返却する。

## 状態遷移
- 受付直後: `queued`
- Backend API内ジョブ開始後: `running`
- 終了時: `succeeded|failed|partial|cancelled`

## エラーマッピング
| エラーコード | HTTPステータス | 意味 |
| --- | --- | --- |
| `INVALID_TARGET` | 400 | `targetTypes` が空、または許可外値を含み、収集対象を解決できない。 |
| `INVALID_TIMESTAMP` | 400 | `fromPublishedAt` がISO8601として解釈できない。 |
| `INVALID_TRIGGER_MODE` | 400 | `triggerMode` が許可値（`manual`/`scheduled`）に一致しない。 |
| `INVALID_RUN_KIND` | 400 | `runKind` が許可値（`official_ingestion`/`appearance_supplement`/`incremental_update`）に一致しない。 |
| `MISSING_IDEMPOTENCY_KEY` | 400 | 更新系リクエストに必須の `Idempotency-Key` が未指定。 |
| `UNAUTHORIZED` | 401 | JWTが未指定または無効で、実行要求を受理できない。 |
| `RUN_ALREADY_ACTIVE` | 409 | 同種の収集runが進行中で、重複起動を拒否した。 |
| `UPSTREAM_QUOTA_LIMIT` | 429 | 上流APIの日次クォータ枯渇により処理継続できない。 |
| `UPSTREAM_RATE_LIMIT` | 429 | 上流APIの短期レート制限に到達し、一時的に受付を抑制した。 |
| `UPSTREAM_INVALID_RESPONSE` | 502 | 上流API応答が契約不一致で、処理結果を確定できない。 |
| `UPSTREAM_TIMEOUT` | 503 | 上流API応答待ちがタイムアウトし、一時的障害として扱う。 |
| `INTERNAL_ERROR` | 500 | サーバ内部例外によりrun登録または応答生成に失敗した。 |

## 上流API障害時の判定表
| 条件 | 応答/状態 | 再試行 | 備考 |
| --- | --- | --- | --- |
| quota枯渇（daily） | `429 UPSTREAM_QUOTA_LIMIT` | 翌日再開のみ | 同日内自動再実行禁止 |
| 一時rate limit | `429 UPSTREAM_RATE_LIMIT` | 可 | 指数バックオフ（1s, 2s, 4s, 最大30s） |
| timeout/5xx | `503 UPSTREAM_TIMEOUT` | 可 | 最大3回 |
| 不正レスポンス | `502 UPSTREAM_INVALID_RESPONSE` | 不可 | 手動調査へ切替 |

## 冪等性
- `Idempotency-Key` が同一の場合は同一`runId`を返す。
- 同一キーの有効期限は24時間とする。
- 保存先は `idempotency_keys`（DynamoDB TTL）を正本とし、`expires_at` 到達後に自動削除する。
- キーの重複判定は `operator + endpoint + payload_hash` の複合で実施する。

## 監査・ログ
- 起動操作は監査ログへ記録する（`runId`, `operator`, `targetTypes`, `traceId`）。

## 受入観点
- `AT-SCN-004` で manual 実行開始から runId 取得まで再現できること。
- 重複起動時に 409 応答となり、既存runの状態確認へ誘導できること。

## 変更履歴
- 2026-02-14: エラーマッピングを表形式へ統一し、各エラーコードの意味を明記
- 2026-02-13: `triggerMode`（manual/scheduled）と `runKind`（official/appearance/incremental）へ実行種別を分離し、BD-APP-API-002と語彙統一 [[BD-SYS-ADR-027]]
- 2026-02-13: バッチ入力スキーマ、上流APIクォータ/レート制御、DynamoDB TTLによる冪等性保存を追加 [[BD-SYS-ADR-027]]
- 2026-02-11: 実行要求の登録先を「同一Backend API内ジョブ実行モジュール」へ明確化 [[BD-SYS-ADR-021]]
- 2026-02-11: `/api/v1` 統一、処理ロジック/状態遷移/エラーマッピングを追加 [[BD-SYS-ADR-021]]
- 2026-02-10: 新規作成
- 2026-02-10: [[RQ-GL-002|収集ジョブ]]起動APIの入出力、冪等性、監査仕様を追加
