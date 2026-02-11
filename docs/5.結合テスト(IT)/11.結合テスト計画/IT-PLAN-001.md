---
id: IT-PLAN-001
title: 結合テスト計画 001
doc_type: 結合テスト計画
phase: IT
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-TST-001]]'
- '[[UT-PLAN-001]]'
related:
- '[[AT-PLAN-001]]'
tags:
- diopside
- IT
- PLAN
---


## テスト目的
- [[DD-API-002]]〜[[DD-API-009]] の契約が、実行基盤・配信データ・Web表示・運用導線で一貫して成立することを検証する。

## 観点
- API契約の入出力と、実データ連携結果が一致する。
- データ連携順序（[[RQ-GL-007|bootstrap]]→[[RQ-GL-008|tag_master]]→archive）を検証する。
- 障害時の[[RQ-GL-011|再収集]]と診断導線を検証する。

## API単位ケース一覧
- [[IT-CASE-001]]: [[DD-API-002]]（[[RQ-GL-002|収集ジョブ]]起動API）
- [[IT-CASE-002]]: [[DD-API-003]]（[[RQ-GL-002|収集ジョブ]]状態API）
- [[IT-CASE-003]]: [[DD-API-004]]（アーカイブ一覧配信契約）
- [[IT-CASE-004]]: [[DD-API-005]]（[[RQ-GL-005|タグ辞書]]配信契約）
- [[IT-CASE-005]]: [[DD-API-006]]（検索契約）
- [[IT-CASE-006]]: [[DD-API-007]]（動画詳細API）
- [[IT-CASE-007]]: [[DD-API-008]]（[[RQ-GL-011|再収集]]API）
- [[IT-CASE-008]]: [[DD-API-009]]（運用診断API）

## 完了条件
- 8ケースが受入シナリオ（[[AT-SCN-001]]〜[[AT-SCN-005]]）へ接続可能な結果を出す。
- 障害系ケースで復旧導線が確認できる。

## 変更履歴
- 2026-02-11: API参照ID（DD-API系/AT-SCN系）をObsidianリンクへ統一
- 2026-02-10: 新規作成
- 2026-02-10: [[DD-API-002]]〜[[DD-API-009]]に合わせてITケースをAPI単位に再編
