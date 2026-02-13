---
id: DD-UI-005
title: 検索バー
doc_type: UI詳細
phase: DD
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-14'
up:
- '[[BD-UI-002]]'
- '[[DD-UI-001]]'
related:
- '[[RQ-FR-006]]'
- '[[RQ-FR-007]]'
- '[[RQ-UX-003]]'
- '[[DD-ALG-001]]'
- '[[DD-UI-003]]'
- '[[DD-UI-012]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- UI
---


## 詳細仕様
- 検索バーはキーワード入力と即時サジェスト表示を担当し、確定時に検索実行イベントを発火する。
- 日本語入力の変換中イベント（IME）では検索を実行しない。
- [[DD-UI-003|UI-U02]] 内で利用する入力部品として、条件確定イベントは [[DD-UI-012|SearchConditionPanel]] に委譲する。

## 入力仕様
| 項目 | 仕様 |
| --- | --- |
| 最大文字数 | 100文字 |
| 禁止入力 | 制御文字、連続空白のみ |
| サジェスト | 先頭20件、200msデバウンス |
| 確定操作 | Enterキー、検索ボタン |

## アクセシビリティ
- ラベルを常時表示し、プレースホルダー依存にしない。
- 候補リストは `ArrowUp/ArrowDown` で移動、`Enter` で選択できる。
- エラー時は入力直下に理由を表示し、スクリーンリーダーへ通知する。
- 候補UIは `combobox` / `listbox` / `option` のName/Role/Valueを満たし、`aria-expanded`/`aria-controls`/`aria-activedescendant` を同期する。
- 入力エラー時は `aria-invalid="true"` を付与し、エラー文言を `aria-describedby` で関連付ける。
- 検索実行結果（ヒット件数、0件、失敗）は `role="status"` または `aria-live="polite"` で通知する。
- IME変換中はサジェスト選択状態を固定し、未確定文字列での誤読み上げを抑制する。

## 失敗時挙動
- サジェスト取得失敗時は入力自体を継続可能にし、候補欄のみ非表示とする。
- 不正入力は検索実行を中止し、フォーカスを入力へ戻す。

## I/Oまたは責務
- 入力: キーワード入力、キーボード操作、サジェストデータ。
- 出力: 検索確定イベント、候補表示状態、入力エラーメッセージ。

## 変更履歴
- 2026-02-14: [[DD-UI-003|UI-U02]] および [[DD-UI-012|SearchConditionPanel]] との責務境界リンクを追加
- 2026-02-13: 検索バーのa11y属性要件（combobox属性、`aria-invalid`/`aria-describedby`、status通知）を追加
- 2026-02-11: 入力仕様、アクセシビリティ、失敗時挙動を具体化
- 2026-02-10: 新規作成
