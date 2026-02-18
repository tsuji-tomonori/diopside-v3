---
id: IT-INF-NET-001
title: ネットワーク到達性・境界テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-19'
up:
- '[[IT-PLAN-001]]'
- '[[DD-INF-NET-001]]'
related:
- '[[BD-INF-NET-001]]'
tags:
- diopside
- IT
- INF
---

## 目的
- 許可通信のみ到達可能で、禁止経路が遮断されることを検証する。

## 手順
1. allowlist経路（`/web`, `/docs`, `/openapi`, `/api/v1/ops/diagnostics/health`）への接続試験を実施する。
2. deny経路（未許可ポート、未許可送信先）への接続試験を実施する。
3. TLSハンドシェイク条件（TLS1.2以上）を確認する。
4. セキュリティログで拒否イベントが記録されることを確認する。

## 証跡項目
- 接続元、接続先、ポート、プロトコル、結果（allow/deny）。
- TLSバージョン、失敗時エラーコード、ログイベントID。

## 失敗時判定
- allowlist経路の失敗が1件でもあればNG。
- deny経路の成功が1件でもあればCritical NG。
- TLS1.1以下で接続可能な場合は即時リリース停止。

## 期待結果
- allowlist経路は成功、deny経路は失敗となる。

## 変更履歴
- 2026-02-19: allowlistのヘルスチェック経路を `/api/v1/ops/diagnostics/health` へ統一
- 2026-02-13: 手順、証跡項目、失敗時判定を追加
- 2026-02-13: 新規作成
