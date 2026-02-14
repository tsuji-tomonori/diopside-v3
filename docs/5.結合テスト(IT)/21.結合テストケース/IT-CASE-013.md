---
id: IT-CASE-013
title: データ不整合復旧 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-12
updated: '2026-02-12'
up:
- '[[IT-PLAN-001]]'
- '[[BD-INF-MON-001]]'
related:
- '[[AT-SCN-005]]'
- '[[DD-APP-API-009]]'
- '[[DD-APP-API-013]]'
tags:
- diopside
- IT
- CASE
- 障害
---


## テスト目的
- タグ/アーカイブのデータ不整合検知と復旧を結合環境で検証する。

## 前提条件
- 結合環境に配信データが存在する。
- 意図的な不整合を注入できる。

## 手順（タグ不整合）
1. `tag_master.json` 内に重複タグIDを注入する。
2. `GET /api/v1/ops/diagnostics/health` を実行する。
3. `tagMasterConsistency=critical` が検出されることを確認する。
4. `POST /api/v1/admin/tags` または `PATCH /api/v1/admin/tags/{tagId}` で不整合を解消する。
5. 配信反映ジョブを実行する。
6. `GET /api/v1/ops/diagnostics/health` で回復を確認する。

## 期待結果（タグ不整合）
- 重複タグIDが検知される。
- タグ修正と再公開により `tagMasterConsistency=ok` に回復する。

## 手順（アーカイブ不整合）
1. `archive_index.p0.json` と `archive_index.p1.json` に同一 `videoId` を注入する。
2. `GET /api/v1/ops/diagnostics/health` を実行する。
3. `archiveConsistency=critical` が検出されることを確認する。
4. [[RQ-GL-011|再収集]]または手動修正で不整合を解消する。
5. 配信反映ジョブを実行する。
6. `GET /api/v1/ops/diagnostics/health` で回復を確認する。

## 期待結果（アーカイブ不整合）
- 重複 `videoId` が検知される。
- 再生成により重複が解消される。
- `archiveConsistency=ok` に回復する。

## 不整合検証チェックリスト
| 検証項目 | 正常時 | 異常時 |
|---------|-------|-------|
| タグID一意性 | 全て一意 | 重複あり |
| videoId一意性 | 全ページで一意 | 複数ページに同一ID |
| ページ連続性 | p0からpNまで連番 | 欠番あり |
| 件数整合 | 全ページのtotal一致 | 不一致あり |

## 受入接続
- [[AT-SCN-005]] の障害時対応シナリオの事前検証になる。

## 変更履歴
- 2026-02-12: 新規作成（分析レポートに基づく追加）
