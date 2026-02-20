---
id: DD-INF-LMB-001
title: Lambda詳細設計
doc_type: インフラ詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[BD-INF-PLAT-001]]'
- '[[BD-INF-DEP-005]]'
related:
- '[[DD-INF-MON-001]]'
- '[[DD-INF-IAC-002]]'
- '[[DD-INF-SEC-002]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- Lambdaは `API`, `運用`, `配信関連` の3ワークロードを分離し、役割ごとに設定値を固定する。
- timeout/memory/concurrencyは依存先制約と運用SLOを満たす範囲で管理し、変更時は監視閾値を同時更新する。

## ワークロード定義
| ワークロード | 主用途 | 経路/起点 | 監視指標 |
|---|---|---|---|
| API | 業務API処理 | `/api/v1/*` | p95応答時間、5xx率 |
| 運用 | run管理/診断 | 管理実行/運用ジョブ | 失敗率、実行時間 |
| 配信関連 | 配信補助処理 | 配信反映フロー | 成功率、遅延 |

## 設定値方針
| 項目 | API | 運用 | 配信関連 |
|---|---|---|---|
| runtime | Node.js LTS | Node.js LTS | Node.js LTS |
| timeout | 依存先SLAに合わせる | バッチ上限に合わせる | 配信反映SLAに合わせる |
| memory | p95で飽和しない値 | 実行安定優先 | 転送量に応じて調整 |
| concurrency | 上限を明示設定 | 暴走防止上限を設定 | 反映衝突防止上限を設定 |

## セキュリティ/運用
- IAM権限は最小権限とし、シークレット参照は識別子経由のみ許可する。
- VPC接続の有無は到達要件に合わせて定義し、不要な外部到達性を付与しない。

## 監視
- Lambda p95応答時間、エラー率、スロットリングを [[DD-INF-MON-001]] で監視する。
- 構造化ログの保持期間は [[DD-INF-MON-002]] の30日を適用する。

## 変更履歴
- 2026-02-21: 新規作成（Lambda設定値をAPI実行基盤の正本として定義） [[BD-SYS-ADR-036]]
