---
id: BD-APP-API-001
title: API一覧
doc_type: API設計
phase: BD
version: 1.0.9
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-14'
up:
- '[[RQ-SC-001]]'
- '[[RQ-FR-001]]'
related:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-SYS-ADR-001]]'
- '[[BD-SYS-ADR-021]]'
- '[[BD-SYS-ADR-023]]'
- '[[BD-SYS-ADR-009]]'
- '[[BD-SYS-ADR-010]]'
- '[[BD-APP-API-005]]'
- '[[RQ-FR-020]]'
- '[[RQ-FR-022]]'
- '[[RQ-FR-021]]'
- '[[RQ-RDR-038]]'
- '[[BD-SYS-ADR-027]]'
tags:
- diopside
- BD
- API
---


## 設計方針
- 本システムは利用者向け参照を静的配信で提供し、管理画面の更新系APIと責務分離して管理する。
- 原本はDB正本とし、`tag_master.json` を含む配信成果物は生成結果として扱う。
- [[RQ-FR-020]] に対応する見どころ導線は、[[RQ-GL-016|コメント密度波形]]の静的JSON配信で提供する。
- [[RQ-FR-021]] に対応する[[RQ-GL-017|ワードクラウド]]は、動的生成APIではなく事前生成済み画像の静的配信で提供する。
- 静的配信契約のHTTPステータス/キャッシュ/エラーフォールバック方針は [[BD-APP-API-005]] の共通規約に従う。

## 設計要点
- 一覧・検索用データは `bootstrap.json` / `tag_master.json` / `archive_index.pN.json` を継続利用する。
- 管理画面の更新系（タグ更新、反映トリガ、[[RQ-GL-011|再収集]]）は Backend API で受け、利用者向け参照契約へ直接混在させない。
- 収集後の生成処理は単一Backend API（Hono）内バッチで実行し、別デプロイのworkerサービスを前提にしない。
- 動画詳細の補助表示データ（[[RQ-GL-016|コメント密度波形]]）は `highlights/{videoId}.json` 契約で配信する。
- 動画詳細の補助表示データ（[[RQ-GL-017|ワードクラウド]]）は `wordcloud/{videoId}.png` 契約で配信する。
- クライアントは静的アセット取得失敗時に代替表示へフォールバックし、詳細モーダルを継続表示する。

## 契約境界
- **利用者向け参照契約**: 静的JSON/静的画像（本書で定義）。
- **管理画面向け更新契約**: [[BD-APP-API-002]] を正本とし、本書では契約名と接続点のみ定義する。
- **将来拡張契約**: API検索エンドポイントは将来追加予定として予約し、現時点で契約詳細は固定しない。

## 正本ルール
- 本書（[[BD-APP-API-001]]）は「API一覧の正本」として、契約ID・用途・要求対応・詳細設計参照を管理する。
- 入出力スキーマ、状態遷移、エラーコード、再試行条件の正本は [[BD-APP-API-002]] 以降の個別API設計に集約する。
- 一覧と個別設計に差異がある場合は、個別設計を優先して本書を同一変更で更新する。

## API一覧
| 区分 | パス/契約 | 用途 | 主な利用要求 | 詳細設計 |
|---|---|---|---|---|
| 配信契約 | `bootstrap.json` / `archive_index.p{page}.json` | 初期表示と[[RQ-GL-010|段階ロード]]一覧 | [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-FR-015]] | [[DD-APP-API-004]] |
| 配信契約 | `tag_master.json` / `highlights/{videoId}.json` / `wordcloud/{videoId}.png` | [[RQ-GL-005|タグ辞書]]と詳細補助表示（波形/[[RQ-GL-017|ワードクラウド]]） | [[RQ-FR-005]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-FR-022]] | [[DD-APP-API-005]] |
| 運用API | `POST /api/v1/ops/ingestion/runs` | [[RQ-GL-002|収集実行]]起動 | [[RQ-FR-001]], [[RQ-FR-003]] | [[DD-APP-API-002]] |
| 運用API | `GET /api/v1/ops/ingestion/runs/{runId}` | 収集run状態確認 | [[RQ-FR-017]] | [[DD-APP-API-003]] |
| 運用API | `GET /api/v1/ops/ingestion/runs/{runId}/items` | 収集結果明細確認 | [[RQ-FR-004]], [[RQ-FR-017]] | [[DD-APP-API-011]] |
| 運用API | `POST /api/v1/ops/ingestion/runs/{runId}/retry` | [[RQ-GL-011|再収集]]実行 | [[RQ-FR-018]] | [[DD-APP-API-008]] |
| 運用API | `GET /api/v1/ops/ingestion/latest` / `GET /api/v1/ops/diagnostics/health` | 最新結果/運用診断確認 | [[RQ-FR-016]], [[RQ-FR-017]] | [[DD-APP-API-009]] |
| 運用API | `POST /api/v1/ops/rechecks` / `GET /api/v1/ops/rechecks/{recheckRunId}` | 配信前後再確認 | [[RQ-FR-019]] | [[DD-APP-API-012]] |
| 運用API | `POST /api/v1/admin/tags` / `PATCH /api/v1/admin/tags/{tagId}` / `PATCH /api/v1/admin/videos/{videoId}/tags` | タグ更新/手動タグ付け | [[RQ-FR-005]], [[RQ-FR-009]], [[RQ-FR-019]] | [[DD-APP-API-013]] |
| 運用API | `POST /api/v1/admin/publish/tag-master` / `GET /api/v1/admin/publish/{publishRunId}` | 配信反映run監視 | [[RQ-FR-024]], [[RQ-FR-025]] | [[DD-APP-API-015]] |
| 運用API | `POST /api/v1/admin/docs/publish` / `GET /api/v1/admin/docs/publish/{docsPublishRunId}` | docs公開run監視 | [[RQ-FR-024]] | [[DD-APP-API-014]] |

## [[RQ-GL-016|コメント密度波形]]静的配信契約
- **命名規約**: `highlights/{videoId}.json`（`videoId` はYouTube動画ID、拡張子は `json` 固定）。
- **データ内容**: 動画ID、生成時刻、波形系列（経過秒/密度値）、[[RQ-GL-015|盛り上がり区間]]（開始秒/終了秒/密度指標/コメント件数）を保持する。
- **生成タイミング**: 収集run完了後にBackend API内バッチで [[RQ-FR-022]] の生成処理を実行し、Web配信領域へ配置する。
- **HTTPステータス運用**:
  - `200`: 波形表示と区間クリック遷移を有効化。
  - `404`: 未生成扱いとして「[[RQ-GL-015|盛り上がり区間]]なし」を表示。
  - `5xx`/ネットワーク失敗: 再試行導線付きの取得失敗表示。
- **フォールバック方針**: 波形データ不正・破損時は波形描画を中断し、モーダル機能（タグ、遷移、閉じる）を維持する。

## [[RQ-GL-017|ワードクラウド]]静的配信契約
- **命名規約**: `wordcloud/{videoId}.png`（`videoId` はYouTube動画IDそのまま、拡張子は `png` 固定）。
- **生成タイミング**: 収集/前処理run完了後にBackend API内バッチで事前生成し、Web配信領域へ配置する。
- **取得方式**: クライアントは詳細モーダル表示時に動画IDからURLを組み立てて取得する。
- **HTTPステータス運用**:
  - `200`: 画像表示。
  - `404`: 未生成扱いとして「[[RQ-GL-017|ワードクラウド]]なし」を表示。
  - `5xx`/ネットワーク失敗: 再試行導線付きの取得失敗表示。
- **キャッシュ方針**: 画像は `Cache-Control` を付与して配信し、更新はファイル差し替えで反映する。
- **フォールバック方針**: 画像不正・破損時は表示を中断し、モーダル機能（タグ、遷移、閉じる）を維持する。

## 変更履歴
- 2026-02-13: API一覧正本と個別API正本（[[BD-APP-API-002]]）の責務分離ルールを追加 [[BD-SYS-ADR-027]]
- 2026-02-11: API一覧表へ詳細設計リンク列を追加し、運用API契約を個別API単位で整理 [[BD-SYS-ADR-021]]
- 2026-02-11: 生成タイミングを「単一Backend API（Hono）内バッチ実行」へ明確化 [[BD-SYS-ADR-021]]
- 2026-02-11: 利用者向け参照契約にHTTP API共通方針の参照を追加 [[BD-SYS-ADR-023]]
- 2026-02-11: DB正本前提の契約境界（参照系/更新系分離）を追記 [[BD-SYS-ADR-021]]
- 2026-02-11: `archive_index.p{page}.json` 契約の用語参照を [[RQ-GL-009]] に統一し、主な利用要求へ [[RQ-FR-006]] を追加
- 2026-02-10: 新規作成
- 2026-02-11: [[RQ-FR-021]] 対応として[[RQ-GL-017|ワードクラウド]]静的配信契約（`wordcloud/{videoId}.png`）を追加
- 2026-02-11: [[RQ-FR-020]] 意味変更に合わせ、[[RQ-GL-016|コメント密度波形]]の静的配信契約（`highlights/{videoId}.json`）を追加
