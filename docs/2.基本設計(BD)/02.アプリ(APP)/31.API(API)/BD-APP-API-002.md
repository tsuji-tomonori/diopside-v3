---
id: BD-APP-API-002
title: 収集API設計
doc_type: API設計
phase: BD
version: 1.1.7
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-13'
up:
- '[[RQ-SC-001]]'
- '[[RQ-FR-001]]'
- '[[RQ-FR-003]]'
- '[[RQ-FR-004]]'
- '[[RQ-FR-019]]'
related:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-SYS-ADR-021]]'
- '[[BD-SYS-ADR-023]]'
- '[[BD-SYS-ADR-025]]'
- '[[BD-APP-API-005]]'
- '[[RQ-RDR-028]]'
- '[[RQ-RDR-036]]'
- '[[RQ-RDR-034]]'
- '[[BD-APP-DATA-001]]'
- '[[DD-APP-API-001]]'
- '[[RQ-RDR-038]]'
- '[[BD-SYS-ADR-027]]'
tags:
- diopside
- BD
- API
---


## 設計方針
- 収集APIは、運用制御API（実行受付・状態確認）として定義し、取得実装のライブラリや実行基盤には依存しない。
- 収集要求は [[RQ-RDR-028]] に従い「公式取り込み」「出演補完取り込み」「差分更新」の3モードを共通契約で扱う。
- 配信前後再確認は [[RQ-FR-019]] の責務として同一run体系で追跡可能にする。
- 本APIは管理画面の更新系契約を担い、利用者向け検索参照契約（静的JSON）と混在させない。
- 実処理は単一のBackend API（Hono）内で完結し、別デプロイのworkerサービスを持たない。
- 定期実行は外部スケジューラが同一運用APIを呼び出して開始し、処理本体は同一Backend API内で実行する。
- HTTPメソッド/ステータス/ページング/エラー表現/互換性は [[BD-APP-API-005]] を共通規約として適用する。
- 実装時の入力検証・例外集約（Hono + Zod）は [[BD-APP-API-005]] と [[BD-SYS-ADR-025]] の規約に従う。

## 契約対象
| 契約 | 用途 | 対応要求 |
|---|---|---|
| 実行受付契約 | [[RQ-GL-002|収集ジョブ]]起動とモード指定 | [[RQ-FR-001]], [[RQ-FR-003]] |
| 実行状態契約 | run状態・件数・失敗理由確認 | [[RQ-FR-001]], [[RQ-FR-017]] |
| 実行結果契約 | 更新種別と取得元区分の出力 | [[RQ-FR-004]], [[RQ-DATA-001]] |
| タグ提案入力契約 | LLM貼り付け用の提案入力を生成 | [[RQ-FR-019]] |
| タグ提案取込契約 | LLM出力JSONを検証してDB反映 | [[RQ-FR-019]], [[RQ-FR-005]] |
| タグ更新契約 | [[RQ-GL-005|タグ辞書]]の追加/更新/無効化 | [[RQ-FR-005]], [[RQ-FR-009]] |
| 配信反映契約 | DB正本から配信JSON再生成を起動 | [[RQ-FR-019]], [[RQ-FR-025]] |

## 実行受付契約
- **必須入力**: `trigger_mode`, `run_kind`, `target_scope`。
- **trigger_mode定義**:
  - `manual`: 管理画面からの手動起動。
  - `scheduled`: 外部スケジューラからの定期起動。
- **run_kind定義**:
  - `official_ingestion`: 公式投稿の公開動画取り込み。
  - `appearance_supplement`: 出演判定 + 補完入力を併用した取り込み。
  - `incremental_update`: 既存データとの差分更新。
- **条件付き入力**:
  - `candidate_source_ref`: 出演補完入力の参照ID（モードが `appearance_supplement` のときのみ必須）。
  - `time_window`: 差分更新の対象期間（モードが `incremental_update` のとき任意）。
- **受付応答**: `run_id`, `accepted_at`, `trigger_mode`, `run_kind`, `requested_by` を返す。

## 実行状態契約
- **状態遷移**: `queued -> running -> succeeded|failed|partial|cancelled`。
- **必須出力**:
  - 件数: `target_count`, `success_count`, `failure_count`。
  - 更新種別件数: `new_count`, `existing_count`, `backfill_count`, `recheck_count`。
  - 取得元区分件数: `official_count`, `supplement_count`, `incremental_count`。
- **失敗情報**: `failure_reason_code`, `failure_scope`, `retryable`。

## 実行結果契約
- 正規化対象は [[RQ-FR-004]] で定義した必須/任意属性へ写像できる形式で返す。
- 結果レコードは、動画ごとに `source_type`（公式/出演補完/差分更新）と `update_type`（新規/既存/補完/再確認）を保持する。
- 追跡性を担保するため、結果レコードは `run_id` と対応付ける。

## タグ提案入力契約
- **用途**: 収集結果と再確認差分から、管理者が外部LLMへ貼り付ける入力を生成する。
- **入力例**: `run_id`, `video_ids[]`, `include_fields`（title/description/existing_tags/diff_summary）。
- **応答例**: `prompt_text`, `prompt_version`, `video_count`, `generated_at`。
- **制約**: 個人情報や秘密情報を含む拡張フィールドは出力対象外に固定する。

## タグ提案取込契約
- **用途**: 外部LLM出力JSONを管理画面から取込み、DB正本へ反映する。
- **入力例**: `import_payload`（`items[].video_id`, `items[].tags[]`, `items[].reason`）, `source`（`chatgpt`）, `requested_by`。
- **応答例**: `import_run_id`, `validated_count`, `applied_count`, `rejected_count`, `errors[]`。
- **検証**: 必須キー、型、重複、未知動画ID、未知タグID、無効タグIDを検証し、エラー明細を返す。
- **反映条件**: 検証成功レコードのみ反映し、失敗レコードは未反映で保持する。

## タグ提案取込のフォールバック
- LLM API障害（タイムアウト/レート制限/不正応答）時は、提案取込を中断して手動タグ更新へ縮退する。
- フォールバック時の応答は `degraded=true`, `fallback=manual_tagging` を返し、管理画面へ再実行導線を表示する。
- フォールバック発生時でも既存タグ正本は変更しない。

## タグ更新契約
- **用途**: 管理画面から[[RQ-GL-005|タグ辞書]]を更新する。
- **入力例**: `tag_id`, `tag_name`, `tag_type_id`, `synonyms`, `is_active`。
- **応答例**: `tag_id`, `updated_at`, `propagation_state`。
- **制約**: `tag_id` の再利用禁止、重複slug拒否、削除要求は論理無効化へ変換。

## 配信反映契約
- **用途**: DB正本更新後に `tag_master.json` / `archive_index.pN.json` の再生成を起動する。
- **入力例**: `trigger_type`（manual/scheduled）, `scope`（tags/index/all）。
- **応答例**: `publish_run_id`, `started_at`, `target_artifacts`。
- **失敗時**: 再生成失敗は直前公開版を維持し、失敗理由と再試行可否を返す。

## エラーモデル（収集系）
- `INVALID_MODE`: 未定義モード指定。
- `MISSING_MODE_INPUT`: モード必須入力不足。
- `CANDIDATE_SOURCE_UNAVAILABLE`: 補完入力参照不能。
- `UPSTREAM_QUOTA_LIMIT`: 上流APIクォータ制限。
- `NORMALIZATION_CONFLICT`: 正規化時の整合不一致。

## 上流APIクォータ制御
- 収集開始前に当日残クォータを確認し、閾値未満（既定 10%）なら `QUOTA_LOW` で起動を拒否する。
- 実行中に `UPSTREAM_QUOTA_LIMIT` を受けた場合は無限リトライせず `partial` または `failed` で終了する。
- `retryable=true` の場合のみ翌日再開候補として記録し、同日内の自動再実行は行わない。
- クォータ関連エラーは `quota_snapshot`（使用量/残量/判定時刻）をrunへ保存する。

## 共通契約適用（要約）
- **メソッド意味論**: 実行受付は `POST`、状態取得は `GET`、更新は `PUT/PATCH`、削除は `DELETE` を原則とし、`GET` にボディを載せない。
- **一覧取得**: run一覧/結果一覧を返す場合は `limit` + `cursor` を必須とし、`cursor` は opaque 値で返す。
- **エラー形式**: HTTPエラーは `application/problem+json` を標準とし、`type`/`title`/`status`/`detail`/`instance` を必須化する。
- **レート制限**: スロットリング時は `429` + `Retry-After` を返し、運用画面に再試行可能時刻を表示できるようにする。
- **可観測性**: `X-Request-Id` と `traceparent` を受け取り、応答/ログへ引き継ぐ。

## 非対象（本設計で固定しない事項）
- 外部API呼び出しライブラリ、実行言語、ジョブスケジューラ製品。
- 補完入力の具体ファイル形式（TSV/JSON/DB等）。
- 実行基盤のインフラ実装詳細（DD層で定義）。
- 将来追加する高度検索APIの検索アルゴリズムとランキング詳細。

## 変更履歴
- 2026-02-13: 実行起動文脈（`trigger_mode`）と収集種別（`run_kind`）を分離し、run状態語彙へ `cancelled` を追加 [[BD-SYS-ADR-027]]
- 2026-02-13: LLM提案取込の手動フォールバックと上流APIクォータ制御ルールを追加 [[BD-SYS-ADR-027]]
- 2026-02-11: 単一Backend API（Hono）モノリス前提（手動/定期とも同一API起動）を明記 [[BD-SYS-ADR-021]]
- 2026-02-11: 入力検証/例外集約の実装準拠先（[[BD-APP-API-005]] / [[BD-SYS-ADR-025]]）を追記 [[BD-SYS-ADR-025]]
- 2026-02-11: HTTP API共通契約（メソッド意味論、Problem Details、ページング、429運用）の適用方針を追加 [[BD-SYS-ADR-023]]
- 2026-02-11: LLM支援タグ運用向けにタグ提案入力契約/タグ提案取込契約を追加 [[BD-SYS-ADR-021]]
- 2026-02-11: 管理画面向け更新契約（タグ更新/配信反映）を追加し参照系と責務分離 [[BD-SYS-ADR-021]]
- 2026-02-11: 取得3モード、実行契約、更新種別/取得元区分の出力契約を追加 [[BD-SYS-ADR-021]]
- 2026-02-10: 新規作成 [[BD-SYS-ADR-021]]
