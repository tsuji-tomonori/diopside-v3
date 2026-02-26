---
id: IT-PLAN-001
title: 結合テスト計画 001
doc_type: 結合テスト計画
phase: IT
version: 1.0.5
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-20'
up:
- '[[BD-DEV-TEST-001]]'
- '[[UT-PLAN-001]]'
related:
- '[[AT-PLAN-001]]'
tags:
- diopside
- IT
- PLAN
---


## テスト目的
- [[DD-APP-API-002]]〜[[DD-APP-API-015]] の契約が、実行基盤・配信データ・Web表示・運用導線で一貫して成立することを検証する。

## 観点
- API契約の入出力と、実データ連携結果が一致する。
- データ連携順序（[[RQ-GL-007|bootstrap]]→[[RQ-GL-008|タグマスター]]→archive）を検証する。
- 障害時の[[RQ-GL-011|再収集]]と診断導線を検証する。

## 結合テスト設計（境界・契約・連携順序）
- 契約境界は `DD-APP-API-*` の入出力スキーマを正本とし、仕様差分はITで検出してATへ持ち込まない。
- 連携順序は `bootstrap -> tag_master -> archive` の依存順を固定し、前段Fail時は後段ケースを停止する。
- 障害系は [[DD-APP-API-008]] / [[DD-APP-API-009]] を起点に、再実行・診断・復旧可否までを1セットで判定する。
- 配信経路と認証境界は [[IT-CASE-010]] と [[AT-SCN-006]] の接続前提を維持し、境界崩れの早期検出をITで担保する。

## API単位ケース一覧
- [[IT-CASE-001]]: [[DD-APP-API-002]]（[[RQ-GL-002|収集実行]]起動API）
- [[IT-CASE-002]]: [[DD-APP-API-003]]（[[RQ-GL-002|収集実行]]状態API）
- [[IT-CASE-003]]: [[DD-APP-API-004]]（アーカイブ一覧配信契約）
- [[IT-CASE-004]]: [[DD-APP-API-005]]（[[RQ-GL-005|タグ辞書]]配信契約）
- [[IT-CASE-005]]: [[DD-APP-API-006]]（検索契約）
- [[IT-CASE-006]]: [[DD-APP-API-007]]（[[DD-APP-API-007|動画詳細API]]）
- [[IT-CASE-007]]: [[DD-APP-API-008]]（[[RQ-GL-011|再収集]]API）
- [[IT-CASE-008]]: [[DD-APP-API-009]]（[[DD-APP-API-009|運用診断API]]）
- [[IT-CASE-009]]: [[DD-APP-API-011]]（[[DD-APP-API-011|収集結果明細API]]）
- [[IT-CASE-010]]: [[DD-APP-API-012]]（[[DD-APP-API-012|配信前後再確認API]]）
- [[IT-CASE-011]]: [[DD-APP-API-013]], [[DD-APP-API-014]], [[DD-APP-API-015]]（タグ管理/公開実行/公開状態）
- [[IT-CASE-012]]: [[DD-APP-API-008]], [[DD-APP-API-009]]（障害復旧・[[RQ-GL-011|再収集]]導線）
- [[IT-CASE-013]]: [[DD-APP-API-013]]（タグ管理と公開反映整合）

## 完了条件
- 13ケースが受入シナリオ（[[AT-SCN-001]]〜[[AT-SCN-009]]）へ接続可能な結果を出す。
- 障害系ケースで復旧導線が確認できる。

## 変更履歴
- 2026-02-20: テスト章再編に合わせ、結合テスト設計（契約境界・連携順序・障害系判定）の方針を追記
- 2026-02-13: API対象を [[DD-APP-API-015]] まで拡張し、[[IT-CASE-009]]〜[[IT-CASE-013]] と受入接続条件を追加
- 2026-02-11: API参照ID（DD-API系/AT-SCN系）をObsidianリンクへ統一
- 2026-02-10: 新規作成
- 2026-02-10: [[DD-APP-API-002]]〜[[DD-APP-API-009]]に合わせてITケースをAPI単位に再編
