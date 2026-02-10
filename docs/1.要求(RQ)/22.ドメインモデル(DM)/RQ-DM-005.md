---
id: RQ-DM-005
title: 収集実行エンティティ
doc_type: ドメインモデル
phase: RQ
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[RQ-SC-001]]'
related: []
tags:
- diopside
- RQ
- DM
---


## モデル定義
- 収集実行エンティティは、1回の収集処理（run）の状態・件数・監査情報を表す。

## 属性
- 主キー: `run_id`
- 論理識別子: `idempotency_key`（指定時）
- 主要属性: `mode`, `target_types`, `status`, `accepted_at`, `started_at`, `finished_at`
- 集計属性: `processed_count`, `succeeded_count`, `failed_count`
- 監査属性: `source_run_id`, `operator`, `reason`, `trace_id`

## 関連
- 収集イベントエンティティ（`RQ-DM-006`）と一対多で関連する。
- 動画/チャンネル/タグの `*_run_id` 参照先となり、データ版の起点を提供する。
- `source_run_id` により[[RQ-GL-011|再収集]]時の親子run関係を自己参照で保持する。

## 整合条件
- 主キー/外部キーと論理識別子を明示する。
- [[RQ-GL-002|収集ジョブ]]実行履歴と追跡可能にする。
- `status` は `queued -> running -> succeeded|failed|cancelled` の遷移規則に従う。
- [[RQ-GL-011|再収集]]runは `source_run_id` を必須とし、元runへの逆引きを可能にする。

## 変更履歴
- 2026-02-10: モデル定義を具体化（run属性、自己参照、状態遷移条件を追加）
- 2026-02-10: 新規作成
