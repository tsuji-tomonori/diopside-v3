---
id: IT-CASE-013
title: データ不整合復旧 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-12
updated: '2026-02-28'
up:
- '[[IT-PLAN-001]]'
- '[[BD-INF-MON-001]]'
related:
- '[[AT-SCN-005]]'
- '[[DD-APP-API-009]]'
- '[[DD-APP-API-013]]'
- '[[RQ-UC-009]]'
- '[[IT-PW-UC-009]]'
tags:
- diopside
- IT
- CASE
- 障害
---


## テスト目的
- タグ/アーカイブのデータ不整合検知と復旧を結合環境で検証する。

## 対象UC
- [[RQ-UC-009]]（管理者がタグ付けを実施する）

## 対象契約
- `GET /api/v1/ops/diagnostics/health`（[[DD-APP-API-009]]）
- `POST /api/v1/admin/tags` / `PATCH /api/v1/admin/tags/{tagId}`（[[DD-APP-API-013]]）

## 生成元PWモデル
- [[IT-PW-UC-009]]

## 契約化した受入条件
- タグ不整合とアーカイブ不整合を `health` で検知できる。
- 不整合解消後に `tagMasterConsistency` / `archiveConsistency` が `ok` へ遷移する。
- 再公開後の配信データが整合状態を維持する。

## 因子（機能要件ベース）
| 因子 | 関連要求 | 水準 |
| --- | --- | --- |
| 不整合種別 | [[RQ-FR-005]] | タグ重複, videoId重複 |
| 解消方式 | [[RQ-FR-019]] | 管理API修正, [[RQ-GL-011|再収集]] |
| 配信再反映 | [[RQ-FR-024]] | 実施, 未実施 |

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
- [[AT-SCN-005]] の[[AT-SCN-005|障害時対応シナリオ]]の事前検証になる。

## 変更履歴
- 2026-02-28: UC基準フォーマットへ再編し、不整合復旧契約のFR因子を追加
- 2026-02-12: 新規作成（分析レポートに基づく追加）
