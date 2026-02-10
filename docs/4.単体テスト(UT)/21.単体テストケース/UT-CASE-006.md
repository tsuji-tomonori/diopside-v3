---
id: UT-CASE-006
title: 動画詳細API 単体テスト
doc_type: 単体テストケース
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-10
updated: '2026-02-10'
up:
- '[[UT-PLAN-001]]'
- '[[DD-API-007]]'
related:
- '[[IT-CASE-006]]'
tags:
- diopside
- UT
- CASE
---

## 対象API
- `GET /api/videos/{videoId}`（将来）
- MVP組み立て仕様（[[DD-API-007]]）

## テスト目的
- 動画詳細表示のデータ組み立てとURL生成を単体で検証する。

## 前提
- 索引データと[[RQ-GL-005|タグ辞書]]をテストデータで固定する。

## 手順
1. 既存 `videoId` で詳細データを組み立てる。
2. 未存在 `videoId` でエラー分岐を実行する。
3. `watchUrl/embedUrl` の生成結果を検証する。

## 期待結果
- 既存IDでタイトル、タグ、日時、再生時間が解決される。
- 未存在IDは404相当エラーに変換される。
- 生成URLに対象 `videoId` が含まれる。

## 変更履歴
- 2026-02-10: 新規作成
