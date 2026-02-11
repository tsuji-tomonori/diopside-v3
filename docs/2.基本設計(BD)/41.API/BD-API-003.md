---
id: BD-API-003
title: エラーモデル
doc_type: API設計
phase: BD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[RQ-SC-001]]'
- '[[RQ-FR-001]]'
related:
- '[[BD-ARCH-001]]'
- '[[BD-ADR-021]]'
- '[[BD-API-001]]'
- '[[BD-API-002]]'
- '[[DD-ERR-001]]'
tags:
- diopside
- BD
- API
---

## 設計方針
- エラーは「入力/契約/実行/公開」の4分類で管理し、再試行可否を明示する。
- 管理APIと利用者向け参照契約でエラー表現を分離し、誤解を防ぐ。

## 共通エラー契約
- 必須項目: `code`, `message`, `category`, `retryable`, `trace_id`, `occurred_at`。
- 任意項目: `details`, `hint`, `related_run_id`, `related_publish_run_id`。
- `trace_id` はログ/監視で相関できる形式（UUID）を採用する。

## エラー分類
| 分類 | 主対象 | 説明 | 代表コード |
|---|---|---|---|
| 入力エラー | 管理API | リクエスト不正、必須値不足 | `INVALID_INPUT`, `MISSING_REQUIRED_FIELD` |
| 契約エラー | 参照契約/更新契約 | 契約不一致、版不一致 | `SCHEMA_MISMATCH`, `VERSION_MISMATCH` |
| 実行エラー | 収集/更新 | 上流失敗、整合違反 | `UPSTREAM_FAILURE`, `NORMALIZATION_CONFLICT` |
| 公開エラー | 配信生成/公開切替 | 生成失敗、切替失敗 | `PUBLISH_GENERATION_FAILED`, `PUBLISH_SWITCH_FAILED` |

## 更新系APIの応答方針
- 4xx: 入力エラー/契約エラーを返し、管理画面で修正可能な状態を提示する。
- 5xx: 実行エラー/公開エラーを返し、`retryable` で再試行可否を示す。
- 公開失敗時は直前公開版を維持し、`related_publish_run_id` を返す。

## 参照系契約の応答方針
- 静的配信はHTTPステータス（200/404/5xx）を優先し、UIはフォールバック表示へ遷移する。
- 参照系エラーで管理系の内部情報（DB接続情報、内部パス、秘密値）を返さない。

## 変更履歴
- 2026-02-11: 更新系/参照系を分離した共通エラーモデルを追加 [[BD-ADR-021]]
- 2026-02-10: 新規作成 [[BD-ADR-001]]
