---
id: UT-PLAN-001
title: 単体テスト計画 001
doc_type: 単体テスト計画
phase: UT
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-10'
up:
- '[[BD-TST-001]]'
- '[[DD-API-001]]'
related:
- '[[IT-PLAN-001]]'
tags:
- diopside
- UT
- PLAN
---


## テスト目的
- DD-API-002〜DD-API-009 の契約をAPI単位で検証し、実装変更時の回帰を局所化する。

## 観点
- 正常系・異常系・境界値を網羅する。
- 契約（入力/出力/エラー）を固定し、契約破壊を即時検知する。
- 実行は`npm test` / `npm run test:coverage`を基準とする。

## API単位ケース一覧
- [[UT-CASE-001]]: DD-API-002（[[RQ-GL-002|収集ジョブ]]起動API）
- [[UT-CASE-002]]: DD-API-003（[[RQ-GL-002|収集ジョブ]]状態API）
- [[UT-CASE-003]]: DD-API-004（アーカイブ一覧配信契約）
- [[UT-CASE-004]]: DD-API-005（[[RQ-GL-005|タグ辞書]]配信契約）
- [[UT-CASE-005]]: DD-API-006（検索契約）
- [[UT-CASE-006]]: DD-API-007（動画詳細API）
- [[UT-CASE-007]]: DD-API-008（[[RQ-GL-011|再収集]]API）
- [[UT-CASE-008]]: DD-API-009（運用診断API）

## 完了条件
- 上記8ケースがCIで安定実行できる。
- 契約変更時は同一変更で対応UTケースを更新する。

## 変更履歴
- 2026-02-10: 新規作成
- 2026-02-10: DD-API-002〜009に合わせてUTケースをAPI単位に再編
