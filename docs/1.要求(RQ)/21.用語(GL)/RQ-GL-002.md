---
id: RQ-GL-002
title: 収集実行
term_en: ingestion_run
doc_type: 用語
phase: RQ
version: 1.0.8
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-19'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-RDR-047]]'
deprecated_terms:
- 収集ジョブ
- ingestion_job
deprecated_terms_allow_in:
- docs/1.要求(RQ)/41.要求決定記録(RDR)/RQ-RDR-040.md
tags:
- diopside
- RQ
- GL
---


## 定義
| 項目 | 内容 |
|---|---|
| 用語ID | `RQ-GL-002` |
| 用語名 | [[RQ-GL-002|収集実行]] |
| 英名 | `ingestion_run` |
| 定義 | 公開YouTubeアーカイブを収集し、動画メタデータを正規化し、配信用成果物を生成する一連の処理実行単位。旧称「収集ジョブ」。 |
| 判定条件/適用範囲 | 収集開始から成果物生成（`bootstrap/tag_master/archive_index`）までの運用処理に適用する。起動契約は手動/定期とも運用APIで統一する。 |

## 利用ルール
- 文書・実装・テストで同じ意味で使用する。

## 変更履歴
- 2026-02-19: 用語定義から実装基盤依存（Backend API/Hono）を分離し、要求抽象度を是正 [[RQ-RDR-047]]
- 2026-02-14: 廃止語（`収集ジョブ`/`ingestion_job`）をfrontmatter管理へ移行し、GL正本から検証可能化 [[RQ-RDR-040]]
- 2026-02-14: 用語を「[[RQ-GL-002|収集実行]]（[[RQ-GL-002|ingestion_run]]）」へ統一し、旧称「収集ジョブ」を互換表現として明記 [[RQ-RDR-040]]
- 2026-02-11: 単一Backend API（Hono）内実行と手動/定期の運用API起動統一を明記 [[RQ-RDR-034]]
- 2026-02-10: 定義を表形式（標準）へ統一
- 2026-02-10: `term_en` を追加し、定義へ英名を併記
- 2026-02-10: 定義を具体化（処理範囲と実行単位を明確化）
- 2026-02-10: 新規作成
