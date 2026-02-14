---
id: DD-APP-UI-012
title: SearchConditionPanel コンポーネント
doc_type: UI詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
- '[[DD-APP-UI-003]]'
- '[[DD-APP-MOD-003]]'
related:
- '[[RQ-FR-006]]'
- '[[RQ-FR-008]]'
- '[[RQ-UX-012]]'
- '[[DD-APP-ALG-001]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- UI
---

## 詳細仕様
- `SearchConditionPanel` は[[RQ-GL-014|検索条件]]の編集と確定イベント送出を担当する。
- 入力中状態と確定済み状態を分離し、一覧再評価を確定操作まで遅延させる。

## 入出力契約
| 種別 | 内容 |
| --- | --- |
| props | `initialConditions`, `tagOptions`, `onApply`, `onClear` |
| emits | `onApply(conditions)`, `onValidationError(errors)` |

## 操作制約
- バリデーションエラー時は `onApply` を発火しない。
- [[RQ-GL-005|タグ辞書]]取得失敗時はタグ入力のみ無効化し他入力は維持する。

## I/Oまたは責務
- 入力: 現在条件、[[RQ-GL-005|タグ辞書]]、利用者入力イベント。
- 出力: 確定条件イベント、入力エラー状態。

## 変更履歴
- 2026-02-14: 新規作成
