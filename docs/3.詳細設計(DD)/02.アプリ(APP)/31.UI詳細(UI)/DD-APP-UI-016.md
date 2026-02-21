---
id: DD-APP-UI-016
title: WordCloudPanel コンポーネント
doc_type: UI詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
- '[[DD-APP-UI-004]]'
- '[[DD-APP-MOD-003]]'
related:
- '[[RQ-FR-021]]'
- '[[RQ-UX-002-01]]'
- '[[RQ-UX-017-01]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- UI
---

## 詳細仕様
- `WordCloudPanel` は[[RQ-GL-017|ワードクラウド]]画像を表示し、失敗時フォールバックを提供する。
- 画像表示時は用途を示す代替テキストを必須化する。

## 入出力契約
| 種別 | 内容 |
| --- | --- |
| props | `videoId`, `videoTitle`, `onRetry` |
| emits | `onRetry()` |

## 操作制約
- 404時は未生成状態を表示し再試行を表示しない。
- 5xx/破損時のみ再試行導線を表示する。

## I/Oまたは責務
- 入力: `wordcloud/{videoId}.png`、動画タイトル、[[RQ-SH-002|利用者]]操作。
- 出力: 画像表示状態、代替表示、再試行要求。

## 変更履歴
- 2026-02-14: 新規作成
