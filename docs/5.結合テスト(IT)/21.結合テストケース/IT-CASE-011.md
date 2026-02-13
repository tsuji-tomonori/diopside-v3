---
id: IT-CASE-011
title: 配信反映全体フロー 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-12
updated: '2026-02-13'
up:
- '[[IT-PLAN-001]]'
- '[[BD-ARCH-001]]'
- '[[DD-API-013]]'
- '[[DD-API-014]]'
- '[[DD-API-015]]'
related:
- '[[AT-SCN-007]]'
- '[[DD-API-013]]'
- '[[DD-API-015]]'
tags:
- diopside
- IT
- CASE
---


## テスト目的
- タグ更新→配信反映ジョブ→`tag_master.json`/`archive_index.pN.json` 更新までの連携を検証する。

## 対応フロー
- [[BD-ARCH-001]] の「配信生成フロー」
- [[DD-API-013]] → [[DD-API-015]] の連携

## 前提条件
- 結合環境に[[RQ-GL-005|タグ辞書]]と配信データが存在する。
- 配信反映ジョブが稼働している。

## 手順
1. `PATCH /api/v1/admin/tags/{tagId}` で既存タグの `tag_name` を更新する。
2. `GET /api/v1/admin/publish/{publishRunId}` で配信反映ジョブが `queued` になることを確認する。
3. 配信反映ジョブの完了を監視する（ステップ: `generate → validate → switch → post_check`）。
4. `tag_master.json` を取得し、更新後のタグ名が反映されていることを確認する。
5. タグを使用している動画の `archive_index.pN.json` でタグ情報が更新されていることを確認する。

## 期待結果
- タグ更新後に `propagation_state=pending_publish` が設定される。
- 配信反映ジョブが自動または手動でトリガーされる。
- `tag_master.json` の該当タグが更新される。
- `archive_index` 内の動画タグ情報が整合する。

## ステップ状態検証
- `generate`: [[RQ-GL-005|タグ辞書]]JSON生成
- `validate`: スキーマと整合性検証
- `switch`: 配信先への切り替え
- `post_check`: 配信後の疎通確認

## エラー時の検証
- `validate` 失敗時: `switch` に進まない
- `switch` 失敗時: ロールバック実行を確認

## 受入接続
- [[AT-SCN-007]] の配信前後確認シナリオの事前検証になる。

## 変更履歴
- 2026-02-13: [[DD-API-013]]/[[DD-API-014]]/[[DD-API-015]] への直接トレース（upリンク）を追加
- 2026-02-12: 新規作成（分析レポートに基づく追加）
