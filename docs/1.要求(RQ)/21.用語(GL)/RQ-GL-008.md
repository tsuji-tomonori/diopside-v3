---
id: RQ-GL-008
title: tag_master
term_en: tag_master_dataset
doc_type: 用語
phase: RQ
version: 1.0.4
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
- GL
---


## 定義
| 項目 | 内容 |
|---|---|
| 用語ID | `RQ-GL-008` |
| 用語名 | [[RQ-GL-008|tag_master]] |
| 英名 | `tag_master_dataset` |
| 定義 | [[RQ-GL-005|タグ辞書]]の全量とタグ種別定義を保持する `tag_master.json` の配信データ。 |
| 判定条件/適用範囲 | `bootstrap` 取得後に読込むタグ正本データ契約として適用し、タグ表示と解決処理に利用する。 |

## 利用ルール
- 文書・実装・テストで同じ意味で使用する。

## 変更履歴
- 2026-02-10: 定義を表形式（標準）へ統一
- 2026-02-10: `term_en` を追加し、定義へ英名を併記
- 2026-02-10: 定義を具体化（役割とファイル契約を明確化）
- 2026-02-10: 新規作成
