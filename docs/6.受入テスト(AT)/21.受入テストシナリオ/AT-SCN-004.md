---
id: AT-SCN-004
title: 収集運用シナリオ
doc_type: 受入テストシナリオ
phase: AT
version: 1.0.5
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-DEV-TEST-001]]'
- '[[IT-PLAN-001]]'
related:
- '[[AT-GO-001]]'
- '[[DD-APP-API-002]]'
- '[[DD-APP-API-003]]'
- '[[DD-APP-API-009]]'
tags:
- diopside
- AT
- SCN
---

## シナリオ目的
- 収集開始から結果確認までの運用フローが実行可能であることを確認する。

## 対応DD-API
- `DD-APP-API-002`（[[RQ-GL-002|収集ジョブ]]起動API）
- `DD-APP-API-003`（[[RQ-GL-002|収集ジョブ]]状態API）
- `DD-APP-API-009`（運用診断API）

## 前提条件
- 管理者権限で `/api/v1/ops` API を実行できる。
- 実行対象期間または対象区分が決定済み。

## 手順
1. `POST /api/v1/ops/ingestion/runs` を実行し `runId` を取得する。
2. `GET /api/v1/ops/ingestion/runs/{runId}` で進捗を監視する。
3. 完了後に `GET /api/v1/ops/ingestion/latest` で最新結果を確認する。
4. 公式投稿/[[RQ-GL-004|出演動画]]の件数が期待範囲であることを確認する。

## 期待結果
- 起動、進捗確認、結果確認が単一運用フローで完結する。
- 成功時に `lastSuccessAt` が更新される。
- 区分件数が0異常値とならない。

## 判定基準対応
- 機能判定: Must FR（収集実行・結果確認）Pass。
- データ判定: 区分誤分類重大件数=0。

## 記録項目
- runId
- 実行時間
- official/appearance/total 件数
- warnings 有無
- 対応DD-API（`DD-APP-API-002`, `DD-APP-API-003`, `DD-APP-API-009`）
- 判定（Pass/Fail）

## 変更履歴
- 2026-02-11: API経路を `/api/v1/ops` へ更新
- 2026-02-10: 新規作成
- 2026-02-10: AT-PLAN-001の判定基準に合わせて収集運用手順を具体化
- 2026-02-10: 対応DD-API番号を明示
- 2026-02-10: ステークホルダー2者（管理者/利用者）に合わせて主体表現を修正
