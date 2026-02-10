---
id: RQ-GL-010
title: 段階ロード
term_en: progressive_loading
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
| 用語ID | `RQ-GL-010` |
| 用語名 | [[RQ-GL-010|段階ロード]] |
| 英名 | `progressive_loading` |
| 定義 | `bootstrap` を先に読み込み、続けて `tag_master` と `archive_index` を取得して表示を拡張するデータ取得方式。 |
| 判定条件/適用範囲 | 読込順序を `bootstrap -> tag_master -> archive_index` に固定するWebデータ取得フローへ適用する。 |

## 利用ルール
- 文書・実装・テストで同じ意味で使用する。

## 変更履歴
- 2026-02-10: 定義を表形式（標準）へ統一
- 2026-02-10: `term_en` を追加し、定義へ英名を併記
- 2026-02-10: 定義を具体化（取得順序と目的を明確化）
- 2026-02-10: 新規作成
