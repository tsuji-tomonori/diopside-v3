---
id: DD-APP-UI-018
title: 管理画面共通操作コンポーネント
doc_type: UI詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
- '[[DD-APP-UI-007]]'
- '[[DD-APP-UI-008]]'
- '[[DD-APP-UI-009]]'
- '[[DD-APP-UI-010]]'
- '[[DD-APP-UI-011]]'
related:
- '[[RQ-FR-016]]'
- '[[RQ-UX-017]]'
- '[[DD-APP-MOD-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- UI
---

## 詳細仕様
- 本文書は管理画面横断で再利用する共通操作部品を定義する。
- 対象は確認ダイアログ、トースト通知、障害バナー、監査ログ送信フックとする。

## 共通部品
| 部品 | 用途 | 適用画面 |
| --- | --- | --- |
| `ConfirmDialog` | 破壊的操作の二段階確認 | [[DD-APP-UI-007]], [[DD-APP-UI-008]], [[DD-APP-UI-009]], [[DD-APP-UI-010]] |
| `StatusToast` | 成功/失敗通知 | 全管理画面 |
| `IncidentBanner` | 重大障害通知 | [[DD-APP-UI-006]], [[DD-APP-UI-011]] |
| `AuditActionHook` | 監査ログ送信 | 全管理画面 |

## 操作制約
- 破壊的操作は必ず `ConfirmDialog` を経由する。
- 一時通知は3秒未満で自動消去しない。

## I/Oまたは責務
- 入力: 操作結果イベント、障害通知イベント、監査対象イベント。
- 出力: 統一通知表示、監査ログ送信、確認結果イベント。

## 変更履歴
- 2026-02-14: 新規作成
