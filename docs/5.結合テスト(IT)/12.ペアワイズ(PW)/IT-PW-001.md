---
id: IT-PW-001
title: 結合テストにおけるUC基準ペアワイズ因子定義ガイド
doc_type: 結合テスト設計
phase: IT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
- '[[IT-PLAN-001]]'
related:
- '[[RQ-UC-001]]'
- '[[RQ-UC-009]]'
tags:
- diopside
- IT
- PW
---

## 目的
- 結合テストをAPI単位ではなくUC単位で設計し、各UCの機能要求を因子化して組合せ網羅する。

## 適用範囲
- IT-PW対象UCは [[RQ-UC-001]] から [[RQ-UC-009]] とする。
- [[RQ-UC-010]] から [[RQ-UC-013]] は IT-PW 対象外とし、INFIT/AT運用系で扱う。

## 因子設計ルール
- 主因子は `RQ-FR-*`（機能要求）を採用する。
- APIパラメータ、データ状態、外部依存は補助因子として扱う。
- 標準強度は 2-wise とし、冪等性/競合/復旧導線のみ 3-way 補完を許可する。
- 異常系は 1ケース1異常要因を原則とする。

## 運用
1. UC変更時は対応する `IT-PW-UC-*` を更新する。
2. `IT-CASE-*` では対応 `IT-PW-UC-*` の因子から実行ケースを抽出する。
3. 文書更新後は `task docs:guard` と `task docs:trace` を実行する。

## 変更履歴
- 2026-02-28: 新規作成
