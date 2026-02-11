---
id: BD-API-002
title: 収集API設計
doc_type: API設計
phase: BD
version: 1.1.0
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[RQ-SC-001]]'
- '[[RQ-FR-001]]'
- '[[RQ-FR-003]]'
- '[[RQ-FR-004]]'
- '[[RQ-FR-019]]'
related:
- '[[BD-ARCH-001]]'
- '[[RQ-RDR-028]]'
- '[[BD-DATA-001]]'
- '[[DD-API-001]]'
tags:
- diopside
- BD
- API
---


## 設計方針
- 収集APIは、運用制御API（実行受付・状態確認）として定義し、取得実装のライブラリや実行基盤には依存しない。
- 収集要求は `[[RQ-RDR-028]]` に従い「公式取り込み」「出演補完取り込み」「差分更新」の3モードを共通契約で扱う。
- 配信前後再確認は `[[RQ-FR-019]]` の責務として同一run体系で追跡可能にする。

## 契約対象
| 契約 | 用途 | 対応要求 |
|---|---|---|
| 実行受付契約 | [[RQ-GL-002|収集ジョブ]]起動とモード指定 | `[[RQ-FR-001]]`, `[[RQ-FR-003]]` |
| 実行状態契約 | run状態・件数・失敗理由確認 | `[[RQ-FR-001]]`, `[[RQ-FR-017]]` |
| 実行結果契約 | 更新種別と取得元区分の出力 | `[[RQ-FR-004]]`, `[[RQ-DATA-001]]` |

## 実行受付契約
- **必須入力**: `mode`, `target_scope`。
- **mode定義**:
  - `official_ingestion`: 公式投稿の公開動画取り込み。
  - `appearance_supplement`: 出演判定 + 補完入力を併用した取り込み。
  - `incremental_update`: 既存データとの差分更新。
- **条件付き入力**:
  - `candidate_source_ref`: 出演補完入力の参照ID（モードが `appearance_supplement` のときのみ必須）。
  - `time_window`: 差分更新の対象期間（モードが `incremental_update` のとき任意）。
- **受付応答**: `run_id`, `accepted_at`, `mode`, `requested_by` を返す。

## 実行状態契約
- **状態遷移**: `queued -> running -> succeeded|failed|partial`。
- **必須出力**:
  - 件数: `target_count`, `success_count`, `failure_count`。
  - 更新種別件数: `new_count`, `existing_count`, `backfill_count`, `recheck_count`。
  - 取得元区分件数: `official_count`, `supplement_count`, `incremental_count`。
- **失敗情報**: `failure_reason_code`, `failure_scope`, `retryable`。

## 実行結果契約
- 正規化対象は `[[RQ-FR-004]]` で定義した必須/任意属性へ写像できる形式で返す。
- 結果レコードは、動画ごとに `source_type`（公式/出演補完/差分更新）と `update_type`（新規/既存/補完/再確認）を保持する。
- 追跡性を担保するため、結果レコードは `run_id` と対応付ける。

## エラーモデル（収集系）
- `INVALID_MODE`: 未定義モード指定。
- `MISSING_MODE_INPUT`: モード必須入力不足。
- `CANDIDATE_SOURCE_UNAVAILABLE`: 補完入力参照不能。
- `UPSTREAM_QUOTA_LIMIT`: 上流APIクォータ制限。
- `NORMALIZATION_CONFLICT`: 正規化時の整合不一致。

## 非対象（本設計で固定しない事項）
- 外部API呼び出しライブラリ、実行言語、ジョブスケジューラ製品。
- 補完入力の具体ファイル形式（TSV/JSON/DB等）。
- 実行基盤のインフラ実装詳細（DD層で定義）。

## 変更履歴
- 2026-02-11: 取得3モード、実行契約、更新種別/取得元区分の出力契約を追加
- 2026-02-10: 新規作成
