---
id: DD-ERR-001
title: エラーコード設計
doc_type: エラー設計
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-ARCH-001]]'
- '[[BD-API-004]]'
related:
- '[[RQ-SEC-001]]'
- '[[RQ-OBY-001]]'
- '[[DD-LOG-001]]'
- '[[DD-API-001]]'
- '[[DD-API-010]]'
- '[[AT-SCN-006]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- ERR
---


## 詳細仕様
- API/運用処理/UI通知で同一コード体系を利用し、障害原因の切り分けを一意化する。
- エラー応答は `code`, `message`, `details`, `traceId`, `occurredAt` を共通項目とする。

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

## 利用者向けメッセージ方針
- `message` は 80 文字以内の短文で、次操作（再試行、設定見直し、運用連絡）を含める。
- `details` は管理画面のみ表示し、公開UIには内部構造や秘密情報を露出しない。
- `traceId` はすべての失敗応答に付与し、ログ検索キーとして再利用する。

## 再試行ポリシー
- `VALIDATION` / `AUTH` / `CONFLICT` は自動再試行しない。
- `DEPENDENCY` / `TIMEOUT` は指数バックオフで最大 3 回再試行し、失敗時は運用アラートへ昇格する。
- 同一 `traceId` で 3 回連続失敗した場合はインシデント候補として記録する。

## ログ連携
- 失敗イベントは `code`, `httpStatus`, `traceId`, `resource`, `operator`, `retryCount` を必須記録する。
- エラーコード別件数を日次集計し、増加傾向（前週比 +20%以上）を監視する。
- 重大コード（`*-INTERNAL-*`, `*-AUTH-*`）は即時通知対象とする。

## I/Oまたは責務
- 入力: アプリケーション例外、バリデーション結果、認可判定、外部依存エラー、再試行結果。
- 出力: 標準化エラー応答、ログイベント、通知イベント、インシデント判定材料。

## 変更履歴
- 2026-02-11: エラーコード体系、HTTPマッピング、再試行ポリシー、ログ連携を具体化
- 2026-02-10: 新規作成
