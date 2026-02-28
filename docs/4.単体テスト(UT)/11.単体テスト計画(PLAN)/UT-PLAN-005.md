---
id: UT-PLAN-005
title: 単体テスト計画 005（バックエンド）
doc_type: 単体テスト計画
phase: UT
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-28'
up:
- '[[UT-PLAN-001]]'
- '[[BD-DEV-TEST-001]]'
- '[[DD-APP-API-001]]'
related:
- '[[UT-CASE-BE-001]]'
- '[[UT-CASE-BE-002]]'
- '[[UT-CASE-BE-003]]'
- '[[UT-CASE-BE-004]]'
- '[[UT-CASE-BE-005]]'
- '[[UT-CASE-BE-006]]'
- '[[UT-CASE-BE-007]]'
- '[[UT-CASE-BE-008]]'
- '[[UT-CASE-BE-009]]'
- '[[UT-CASE-BE-010]]'
- '[[UT-CASE-BE-011]]'
- '[[UT-CASE-BE-012]]'
- '[[UT-CASE-BE-013]]'
- '[[UT-PW-001]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- UT
- PLAN
---


## テスト目的
- API契約（入力/出力/エラー）をAPI単位で固定し、バックエンド変更時の契約破壊を局所検知する。

## 観点
- 正常系・異常系・境界値を網羅する。
- 契約（入力/出力/エラー）を固定し、互換性破壊を即時検知する。
- 運用API（[[RQ-GL-011|再収集]]/診断）の状態遷移と拒否条件を検証する。

## API単位ケース一覧
- [[UT-CASE-BE-001]]: [[DD-APP-API-002]]（[[RQ-GL-002|収集実行]]起動API）
- [[UT-CASE-BE-002]]: [[DD-APP-API-003]]（[[RQ-GL-002|収集実行]]状態API）
- [[UT-CASE-BE-003]]: [[DD-APP-API-004]]（アーカイブ一覧配信契約）
- [[UT-CASE-BE-004]]: [[DD-APP-API-005]]（[[RQ-GL-005|タグ辞書]]配信契約）
- [[UT-CASE-BE-005]]: [[DD-APP-API-006]]（検索契約）
- [[UT-CASE-BE-006]]: [[DD-APP-API-007]]（[[DD-APP-API-007|動画詳細API]]）
- [[UT-CASE-BE-007]]: [[DD-APP-API-008]]（[[RQ-GL-011|再収集]]API）
- [[UT-CASE-BE-008]]: [[DD-APP-API-009]]（[[DD-APP-API-009|運用診断API]]）
- [[UT-CASE-BE-009]]: [[DD-APP-API-011]]（[[DD-APP-API-011|収集結果明細API]]）
- [[UT-CASE-BE-010]]: [[DD-APP-API-012]]（[[DD-APP-API-012|配信前後再確認API]]）
- [[UT-CASE-BE-011]]: [[DD-APP-API-013]]（[[DD-APP-API-013|タグ管理API]]）
- [[UT-CASE-BE-012]]: [[DD-APP-API-014]]（[[DD-APP-API-014|ドキュメント公開実行API]]）
- [[UT-CASE-BE-013]]: [[DD-APP-API-015]]（[[DD-APP-API-015|配信反映ジョブ状態API]]）

## 実行方針
- API単位で対象ケースを選択実行し、変更範囲外ケースへの影響を切り分ける。
- 主要変更時は全13ケースを再実行し、IT計画への引き渡し品質を確認する。
- `UT-PW-BE-*` を更新した場合は `task docs:ut:pairwise:generate` を実行し、ペアワイズ抽出ケースを再生成する。

## 完了条件
- 上記13ケースが安定実行できる。
- 契約変更時は同一変更で対応UTケースを更新する。
- 主要APIについて `UT-PW-BE-*` の因子定義と生成ケースが同期している。

## 変更履歴
- 2026-02-28: バックエンド向けペアワイズ因子定義（UT-PW）と生成運用を追加
- 2026-02-13: API単位ケースを [[DD-APP-API-011]]〜[[DD-APP-API-015]] / [[UT-CASE-BE-009]]〜[[UT-CASE-BE-013]] へ拡張し、実行方針と完了条件を13ケース基準へ更新
- 2026-02-11: 新規作成（単体テスト方針の領域分割: BE）
