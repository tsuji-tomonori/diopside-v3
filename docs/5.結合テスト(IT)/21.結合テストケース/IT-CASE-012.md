---
id: IT-CASE-012
title: 障害検知と復旧シナリオ 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-12
updated: '2026-02-12'
up:
- '[[IT-PLAN-001]]'
- '[[BD-MON-001]]'
related:
- '[[AT-SCN-005]]'
- '[[DD-API-008]]'
- '[[DD-API-009]]'
tags:
- diopside
- IT
- CASE
- 障害
---


## テスト目的
- 障害検知（diagnostics API）と復旧（[[RQ-GL-011|再収集]]API）の連携を結合環境で検証する。

## 対応フロー
- [[BD-MON-001]] の「障害検知→復旧導線」
- [[DD-API-009]] → [[DD-API-008]] の連携

## 前提条件
- 結合環境で意図的な障害状態を再現できる。
- 運用診断APIが稼働している。

## 手順（障害検知）
1. `archive_index.p2.json` を意図的に削除または破損させる。
2. `GET /api/v1/ops/diagnostics/health` を実行する。
3. `status=critical` または `status=degraded` が返されることを確認する。
4. `checks[]` 内に該当する障害項目が含まれることを確認する。

## 期待結果（障害検知）
- ページ欠損が検知され、`archiveConsistency` が `critical` になる。
- 障害箇所と推奨アクションが応答に含まれる。

## 手順（復旧）
1. 障害検知後、`POST /api/v1/ops/ingestion/runs/{runId}/retry` で[[RQ-GL-011|再収集]]を実行する。
2. [[RQ-GL-011|再収集]]runの完了を監視する。
3. `archive_index.p2.json` が再生成されることを確認する。
4. `GET /api/v1/ops/diagnostics/health` で `status=ok` または `status=degraded` に回復することを確認する。

## 期待結果（復旧）
- [[RQ-GL-011|再収集]]により欠損ページが再生成される。
- `health` ステータスが `critical` から改善される。
- 復旧後のデータ整合性が維持される。

## 障害再現方法
| 障害種別 | 再現方法 | 期待検知 |
|---------|---------|---------|
| ページ欠損 | `archive_index.p{N}.json` 削除 | `archiveConsistency=critical` |
| 鮮度遅延 | 最終収集から24時間以上経過 | `freshness=degraded` |
| タグ不整合 | `tag_master.json` 内のタグID重複 | `tagMasterConsistency=critical` |

## 受入接続
- [[AT-SCN-005]] の障害時対応シナリオの事前検証になる。

## 変更履歴
- 2026-02-12: 新規作成（分析レポートに基づく追加）
