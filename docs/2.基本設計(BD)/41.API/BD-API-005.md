---
id: BD-API-005
title: HTTP API契約共通方針
doc_type: API設計
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[RQ-INT-001]]'
- '[[RQ-SEC-001]]'
- '[[RQ-OBY-001]]'
- '[[RQ-DEV-001]]'
related:
- '[[BD-ADR-023]]'
- '[[BD-API-002]]'
- '[[BD-API-003]]'
- '[[BD-API-004]]'
- '[[DD-ERR-001]]'
- '[[DD-API-001]]'
- '[[DD-API-010]]'
tags:
- diopside
- BD
- API
---

## 設計方針
- 管理画面向け更新系APIは、利用者視点の予測可能性を優先し、命名・HTTPセマンティクス・エラー表現・ページングを全契約で統一する。
- HTTP APIは RFC 9110 の意味論に従い、メソッドの安全性/冪等性/ステータス運用を契約として固定する。
- 互換性は「破壊せず追加で進化」を原則とし、廃止は段階的に告知して移行期間を確保する。
- OpenAPI を契約の正本とし、実装より先に更新してCIで破壊的変更を検知する。

## URI/命名規約
- URIは名詞中心で設計し、操作動詞を含むパス（例: `/create-*`）を採用しない。
- コレクションは `/resources`、単体は `/resources/{resourceId}` を基本形とする。
- 親子表現は必要最小限に留め、深い入れ子を避ける。
- 同一概念には同一語彙を使い、`userId`/`customerId` の混在を禁止する。

## HTTPメソッド/ステータス規約
- `GET` は取得専用とし、安全メソッドとして副作用を持たせない。
- `PUT`/`DELETE` は冪等性を満たす契約に固定する。
- `GET` にリクエストボディを載せない。複雑検索は `GET + query` または `POST /resources:search` を利用する。
- 新規作成成功は `201 Created` + `Location` ヘッダ返却を標準とする。

## 一覧取得/検索規約
- 一覧APIは初版からページング必須とし、無制限取得を禁止する。
- 大規模データはカーソル方式を優先し、`cursor` は opaque 値としてクライアント解釈を禁止する。
- `filter`/`sort`/`limit`/`cursor`/`fields`/`expand` の利用作法をAPI群で統一する。
- ページレスポンスは `items` とナビゲーション情報（`self`/`next` 等）を含める。

## エラー契約規約
- HTTP APIエラーは `application/problem+json` を標準とし、`type`/`title`/`status`/`detail`/`instance` を必須化する。
- フィールド単位の検証失敗は拡張メンバー（例: `errors[]`）で機械可読に返す。
- `detail` の文字列パースを前提にせず、機械判定に必要な情報は拡張フィールドへ分離する。
- 内部例外、スタックトレース、秘密情報は応答へ含めない。

## 互換性/バージョニング/廃止規約
- 互換変更は追加で実施し、既存フィールドの削除・型変更・意味変更を避ける。
- OpenAPI `info.version` は SemVer（MAJOR.MINOR.PATCH）で管理する。
- 廃止対象は OpenAPI に `deprecated: true` を明記し、移行先・移行手順・サンセット日を記載する。
- 可能な範囲で `Deprecation`/`Sunset` ヘッダを返し、クライアント側で検知可能にする。

## セキュリティ/信頼性/可観測性規約
- 認可はオブジェクト単位で実施し、ID指定APIでは対象リソースへのアクセス可否を必ず検証する。
- レート制限超過は `429 Too Many Requests` とし、`Retry-After` を返す。
- キャッシュ対象レスポンスは `Cache-Control` を明示し、意図しない共有キャッシュを防ぐ。
- リクエスト相関は `X-Request-Id` と `traceparent` を利用し、Problem Details の `instance` とログ/トレースを相互参照可能にする。

## 契約運用規約（Contract-first）
- OpenAPIを契約正本とし、仕様更新なしの実装先行を禁止する。
- CIでスキーマLint、破壊的変更検知、コントラクトテストを実行する。
- 破壊的変更が検出された場合は、版追加または互換層追加が完了するまでリリースを停止する。

## 変更履歴
- 2026-02-11: 新規作成（HTTPセマンティクス、Problem Details、互換性、運用規約を定義） [[BD-ADR-023]]
