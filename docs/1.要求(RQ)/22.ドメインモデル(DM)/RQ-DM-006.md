---
id: RQ-DM-006
title: 収集イベントエンティティ
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
- 収集イベントエンティティは、run内で発生した処理単位の監査ログを保持する。

## 属性
- 主キー: `event_id`
- 論理識別子: `run_id + sequence_no`
- 主要属性: `occurred_at`, `level`, `event_code`, `message`, `payload_json`, `trace_id`
- 参照属性: `run_id`, `video_id`, `channel_id`, `tag_id`

## 関連
- `run_id` を外部キーとして収集実行エンティティ（`RQ-DM-005`）へ必須参照する。
- 対象種別に応じて動画（`RQ-DM-001`）/チャンネル（`RQ-DM-002`）/タグ（`RQ-DM-003`）を任意参照する。

## 整合条件
- 主キー/外部キーと論理識別子を明示する。
- [[RQ-GL-002|収集ジョブ]]実行履歴と追跡可能にする。
- 同一 `run_id` 内の `sequence_no` 重複を禁止し、時系列再現性を保証する。
- `level=error` のイベントは `event_code` と `trace_id` を必須とする。

## 変更履歴
- 2026-02-10: モデル定義を具体化（監査属性、対象参照、時系列整合条件を追加）
- 2026-02-10: 新規作成
