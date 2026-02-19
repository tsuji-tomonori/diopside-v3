---
id: RQ-GL-019
title: 再確認実行
term_en: recheck_run
doc_type: 用語
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-19
updated: '2026-02-19'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-RDR-047]]'
- '[[RQ-FR-019]]'
- '[[BD-APP-API-002]]'
- '[[DD-APP-API-012]]'
- '[[DD-APP-DB-013]]'
tags:
- diopside
- RQ
- GL
---

## 定義
| 項目 | 内容 |
|---|---|
| 用語ID | `RQ-GL-019` |
| 用語名 | [[RQ-GL-019|再確認実行]] |
| 英名 | `recheck_run` |
| 定義 | 配信前後の動画メタデータを再取得し、差分有無を判定・記録する処理実行単位。 |
| 判定条件/適用範囲 | 管理画面から起動する配信前後再確認、差分判定結果記録、再試行導線に適用する。 |

## 利用ルール
- 本文では [[RQ-GL-019|再確認実行]] を使用し、`recheck` 単独表記の揺れを避ける。
- 識別子は `recheck_run_id` を使用する。

## 変更履歴
- 2026-02-19: 新規作成 [[RQ-RDR-047]]
