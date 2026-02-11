---
id: RQ-GL-018
title: 配信反映実行
term_en: publish_run
doc_type: 用語
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-RDR-034]]'
- '[[BD-ARCH-001]]'
- '[[BD-ARCH-004]]'
- '[[BD-DATA-001]]'
- '[[BD-UI-003]]'
tags:
- diopside
- RQ
- GL
---

## 定義
| 項目 | 内容 |
|---|---|
| 用語ID | `RQ-GL-018` |
| 用語名 | [[RQ-GL-018|配信反映実行]] |
| 英名 | `publish_run` |
| 定義 | DB正本から配信用成果物（`bootstrap`/`tag_master`/`archive_index`）を再生成し、公開切替までを一連で実行する処理単位。 |
| 判定条件/適用範囲 | 管理画面での反映実行、生成進行管理、失敗時ロールバック判定に適用する。 |

## 利用ルール
- 本文では [[RQ-GL-018|配信反映実行]] を使用し、`publish run` 表記の揺れを避ける。
- 識別子は `publish_run_id` を使用する。

## 変更履歴
- 2026-02-11: 新規作成 [[RQ-RDR-034]]
