---
id: BD-API-005
title: HTTP API契約共通方針
doc_type: API設計
phase: BD
version: 1.0.1
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
- '[[BD-ADR-025]]'
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

## Hono + Zod 実装規約
- 入力は不正を前提に、ルート境界で `param/query/header/cookie/json/form` を部位別に検証する。
- `json`/`form` 検証は `Content-Type` の一致を必須とし、欠落時は入力不正として扱う。
- `header` 検証時のキーは小文字で扱い、HTTPヘッダ名の大文字小文字差異を吸収する。
- 検証済み入力は `c.req.valid(...)` から取得し、ハンドラ内部で未検証入力を参照しない。
- ルート定義は型推論維持のため直後にハンドラを記述する。分離が必要な場合のみ `factory.createHandlers()` を利用する。
- サブ機能分割は controller 増殖ではなく `app.route('/prefix', subApp)` を優先する。

## Hono + Zod エラー統一規約
- バリデーション失敗は `HTTPException(400, { cause: zodError })` で送出し、個別ルートで返却形式を分岐させない。
- 404は `app.notFound`、未捕捉例外は `app.onError` でトップレベル集約する。
- `app.onError` では `HTTPException` を優先処理し、Zod起因の失敗は `z.flattenError()` または `z.treeifyError()` で機械可読詳細を返す。
- エラー応答は Problem Details を基本にし、検証項目詳細は拡張フィールドへ格納する。

## Zod v4 運用規約
- 失敗を制御フローで扱う箇所は `safeParse`/`safeParseAsync` を標準とする。
- 非同期 `refine`/`transform` を含むスキーマは `safeParseAsync` を使用する。
- `transform` 利用時は `z.input<T>` と `z.output<T>` の型境界を設計時に明記する。
- 未知キー方針は API種別で固定し、更新系は strict 寄り、参照系は loose 寄りで運用する。
- スキーマ合成は `.merge()` ではなく `.extend()` または shape 展開を優先する。

## RPC 型共有規約
- RPC連携を採用するAPIは `AppType` を export し、`hc<AppType>(...)` でクライアント型を共有する。
- 型推論の安定化のため、RPC対象ルートはメソッドチェーンで定義する。

## 変更履歴
- 2026-02-11: Hono + Zod 実装規約（入力検証、`HTTPException`/`onError` 集約、RPC型共有、Zod v4運用）を追加 [[BD-ADR-025]]
- 2026-02-11: 新規作成（HTTPセマンティクス、Problem Details、互換性、運用規約を定義） [[BD-ADR-023]]
