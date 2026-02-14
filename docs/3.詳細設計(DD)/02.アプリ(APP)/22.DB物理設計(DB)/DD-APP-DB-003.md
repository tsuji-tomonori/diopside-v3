---
id: DD-APP-DB-003
title: DB移行方針
doc_type: DB移行
phase: DD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-APP-DATA-001]]'
- '[[BD-INF-DEP-003]]'
related:
- '[[RQ-DATA-001]]'
- '[[RQ-DEV-001]]'
- '[[DD-APP-DB-002]]'
- '[[DD-APP-DB-001]]'
- '[[IT-CASE-001]]'
- '[[AT-RUN-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- MIG
---


## 詳細仕様
- DB移行は「前方互換を維持した段階適用」を原則とし、1回の配備で破壊的変更を完了させない。
- すべての移行は `expand -> backfill -> switch -> contract` の4段階で管理する。

## 移行段階
1. `expand`: 新カラム/新テーブルを追加し、既存読取互換を維持する。
2. `backfill`: 既存データを新スキーマへ補完し、欠損・重複・制約違反を検査する。
3. `switch`: アプリケーション読取先を新スキーマへ切替え、旧経路を読み取り専用化する。
4. `contract`: 互換期間終了後に不要カラム/制約を削除する。

## 互換期間ルール
- `expand` 完了から `contract` 実施までは最低1リリース以上あける。
- 互換期間中は旧新両形式で読めることを統合テストで確認する。
- 破壊的変更は `contract` 段階に限定し、リリースノートに影響範囲を明記する。

## 検証項目
- スキーマ検証: 期待DDLとの差分、制約状態、インデックス有効性。
- データ検証: 件数一致、主キー重複0件、必須項目欠損0件。
- 動作検証: 主要APIと管理操作が移行中も継続利用できること。
- 性能検証: バックフィル実行中でも p95 指標が閾値を超過しないこと。

## 本改訂での適用順序（run/recheck/publish拡張）
1. `expand`
   - `videos` へ `validation_status`, `missing_fields`, `supplement_required` を追加する。
   - `ingestion_items`, `recheck_runs`, `recheck_items`, `publish_runs`, `publish_steps`, `publish_artifacts` を新設する。
   - `ingestion_runs.status` の許容値へ `partial`, `cancelled` を追加する。
2. `backfill`
   - 既存 `ingestion_events` から run単位に動画結果を集約し、`ingestion_items` を補完する。
   - 既存配信実行ログがある場合は `publish_runs`/`publish_steps`/`publish_artifacts` へ移送する。
   - `videos.validation_status` を既存レコードに `valid` で初期化する。
3. `switch`
   - 収集結果明細APIは `ingestion_events` 参照を停止し `ingestion_items` 参照へ切替える。
   - 配信反映状態APIは新設 `publish_*` テーブル参照へ切替える。
4. `contract`
   - 旧集約経路でのみ使っていた一時列/互換ビューを削除する。
   - 語彙統一後のrun状態（`cancelled`）に移行し旧値（`canceled`）互換を終了する。

## ロールバック条件
- バックフィル失敗率が 1% を超えた場合は `switch` を中止し直前状態へ戻す。
- 切替後 30 分以内に重大障害が発生した場合は旧読取経路へ即時戻し、原因分析後に再実施する。
- `contract` 段階はバックアップ整合確認が完了するまで開始しない。

## 運用記録
- 各段階で `executor`, `startedAt`, `finishedAt`, `recordsChanged`, `verificationResult` を記録する。
- 失敗時は `failureReason`, `rollbackAction`, `recoveryAt` を追加記録する。
- 記録は受入/障害対応文書（[[AT-RUN-001]]）から参照できる形で保持する。

## I/Oまたは責務
- 入力: マイグレーション定義、現行スキーマ、バックフィル対象データ、運用承認、検証結果。
- 出力: 適用済みスキーマ、移行実行ログ、検証レポート、ロールバック記録。

## 変更履歴
- 2026-02-11: run/recheck/publish拡張の段階適用順序と `cancelled` 語彙統一の移行条件を追加
- 2026-02-11: 段階移行モデル、互換期間ルール、検証/ロールバック条件を具体化
- 2026-02-10: 新規作成
