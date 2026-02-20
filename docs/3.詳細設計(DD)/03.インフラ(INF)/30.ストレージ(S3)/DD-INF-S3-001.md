---
id: DD-INF-S3-001
title: S3詳細設計
doc_type: インフラ詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[BD-INF-DEP-004]]'
- '[[BD-INF-DEP-006]]'
related:
- '[[DD-INF-CF-001]]'
- '[[DD-INF-DEP-001]]'
- '[[DD-INF-SEC-003]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- 静的配信は単一S3バケットのprefix分離（`web/`, `docs/`, `openapi/`）を正本とする。
- バケットはCloudFront OAC経由アクセスのみ許可し、公開バケット設定を禁止する。

## prefix設計
| prefix | 用途 | 配信経路 | 備考 |
|---|---|---|---|
| `web/` | 画面配信成果物 | `/web/*` | 静的JSONを含む |
| `docs/` | Quartz成果物 | `/docs/*` | rewrite対象 |
| `openapi/` | OpenAPI UI/仕様 | `/openapi/*` | 認証境界あり |

## 保護設定
| 項目 | 設定値 | 根拠 |
|---|---|---|
| 暗号化 | SSE-S3（既定） | 保存データの基準保護を満たすため。 |
| Versioning | 有効 | 誤更新/誤削除から復元可能にするため。 |
| Lifecycle | 非現行版30日で削除 | バックアップ保持とコスト制約を両立するため。 |
| Public Access | 全面ブロック | 直公開を防止するため。 |

## 復元要件
- 配信データ復元は [[BD-INF-DEP-006]] のRTO/RPO基準を適用する。
- 復元後はCloudFront invalidationを実行し、到達確認を行う。

## 運用
- prefix追加・変更は配信経路との整合を確認し、[[DD-INF-CF-001]] と同一変更で更新する。
- versioning無効化は破壊的変更として禁止する。

## 変更履歴
- 2026-02-21: 新規作成（S3設定値をサービス別詳細として分離） [[BD-SYS-ADR-036]]
