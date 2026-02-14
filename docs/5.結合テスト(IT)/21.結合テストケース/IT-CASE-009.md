---
id: IT-CASE-009
title: E2E基本フロー 結合テスト
doc_type: 結合テストケース
phase: IT
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-12
updated: '2026-02-13'
up:
- '[[IT-PLAN-001]]'
- '[[BD-SYS-ARCH-001]]'
- '[[DD-APP-API-011]]'
related:
- '[[AT-SCN-001]]'
- '[[AT-SCN-004]]'
- '[[DD-APP-API-002]]'
- '[[DD-APP-API-004]]'
- '[[DD-APP-API-005]]'
tags:
- diopside
- IT
- CASE
- E2E
---


## テスト目的
- 収集run開始から配信データ生成、Web[[RQ-GL-010|段階ロード]]完了までのE2Eフローを結合環境で検証する。

## 対応フロー
- [[BD-SYS-ARCH-001]] の「更新系フロー」→「配信生成フロー」→「参照系フロー」の一連の流れ

## 前提条件
- 結合環境で[[RQ-GL-002|収集ジョブ]]ランナーが稼働している。
- 配信生成ジョブが稼働している。
- Webアプリが起動している。

## 手順
1. `POST /api/v1/ops/ingestion/runs` で収集runを起動する。
2. `GET /api/v1/ops/ingestion/runs/{runId}` で `status=succeeded` まで監視する（ポーリング間隔5秒、最大600秒）。
3. 配信生成ジョブが完了し、`bootstrap.json`, `tag_master.json`, `archive_index.p0.json` が更新されることを確認する。
4. Webトップページにアクセスし、[[RQ-GL-010|段階ロード]]を実行する。
5. `bootstrap.json` のバージョンとWebで取得したバージョンが一致することを確認する。
6. 一覧カードの表示件数が `bootstrap.json` の `total` と整合することを確認する。

## 期待結果
- 収集run完了後、配信データが更新される。
- Webの[[RQ-GL-010|段階ロード]]が `bootstrap → archive_index` の順序で実行される。
- 表示件数と配信データの整合性が確認できる。
- `archiveVersion` が収集runの `runId` と対応する。

## データ整合検証
- `archive_index.p{N}.total` が全ページで一致する。
- 重複 `videoId` が0件である。
- ページ境界の件数がスキップされない。

## ポーリング仕様
- 間隔: 5秒
- 最大待機時間: 600秒（10分）
- 期待遷移: `queued → running → succeeded`

## 受入接続
- [[AT-SCN-001]] の一覧閲覧シナリオの事前検証になる。
- [[AT-SCN-004]] の収集運用シナリオの事前検証になる。

## 変更履歴
- 2026-02-13: DD-APP-API-011への直接トレース（upリンク）を追加
- 2026-02-12: 新規作成（分析レポートに基づく追加）
