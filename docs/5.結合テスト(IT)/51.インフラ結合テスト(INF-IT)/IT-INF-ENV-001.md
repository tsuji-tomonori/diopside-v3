---
id: IT-INF-ENV-001
title: 一時環境構築/破棄テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[IT-PLAN-001]]'
- '[[BD-INF-002]]'
related:
- '[[DD-IAC-002]]'
tags:
- diopside
- IT
- INF
---

## 目的
- ephemeral環境が構築・検証・破棄まで一連で成功することを確認する。

## 手順
1. `plan` を実行し、破壊的差分がないことを確認する。
2. `apply` で一時環境を構築し、出力値（endpoint/role/state）を保存する。
3. `IT-INF-SMK-001` を実行して疎通を確認する。
4. `destroy` を実行し、残存リソースを棚卸しする。

## 証跡項目
- 実行ID、対象コミット、実行時間、残存リソース件数。
- 失敗時は失敗フェーズ（plan/apply/smoke/destroy）を必須記録。

## 失敗時判定
- `destroy` 後の残存リソースが1件でもあればNG。
- 同一原因で2回連続失敗した場合、`DD-IAC-002` の修正を必須化する。

## 期待結果
- apply/destroyともに成功し、残存リソースがない。

## 変更履歴
- 2026-02-13: 手順、証跡項目、失敗時判定を追加
- 2026-02-13: 新規作成
