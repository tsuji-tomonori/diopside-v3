---
id: DD-DEV-CODE-001
title: コーディング規約
doc_type: コーディング規約
phase: DD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-DEV-PIPE-001]]'
related:
- '[[RQ-DEV-001]]'
- '[[DD-APP-MOD-001]]'
- '[[DD-DEV-REV-001]]'
- '[[UT-PLAN-001]]'
- '[[BD-SYS-ADR-022]]'
tags:
- diopside
- DD
- CODE
---


## 詳細仕様
- TypeScript実装は型安全を最優先し、暗黙 `any` と未処理例外を許可しない。
- UIと運用ロジックの可読性を保つため、命名・ファイル構成・エラーハンドリングを統一する。

## 実装規約
- `strict` 前提でコンパイルし、`any` は明示理由がない限り禁止する。
- 1ファイル1責務を原則とし、300行超のファイルは分割する。
- 関数は副作用を持つ処理と純粋計算を分離して記述する。
- 非同期処理は `try/catch` で包み、`traceId` 付きで失敗を返却する。

## 防御的型付け規約
- 裸のID（`string`/`number`）を受け渡しせず、`UserId`/`VideoId` など Brand/Opaque 相当で区別する。
- 環境や状態を `boolean` で表現しない。`"Prod" | "Test"`、`"Enabled" | "Disabled"` のような union/enum を使う。
- センチネル値（`null`/`-1`/`NaN`）で失敗を表現しない。`Option/Result` 相当の判別可能unionを利用する。
- 非空前提の配列演算（平均、先頭取得、集計開始値あり）は `NonEmptyArray` 相当で前提を型に埋め込む。
- `switch` 分岐は `never` で網羅性を確認し、追加状態の見落としをコンパイルエラーで検出する。
- unsafe cast（`as any` を含む）は infrastructure 層へ限定し、理由・適用範囲・除去計画をコメントまたは設計記録へ残す。
- リソース（ファイル/接続/ストリーム）は `using` または `try/finally` で解放を保証する。

## 境界検証規約
- 外部入力（API/DB/env/query/localStorage）は `unknown` で受け取り、境界で1回だけ decode/validate する。
- 検証前データ型と検証後データ型を分離し、同一変数で上書きして混在させない。
- smart constructor または parser 関数をドメイン入口へ集約し、呼び出し側での ad-hoc な `as` を禁止する。
- 検証失敗は `Result` で返し、呼び出し側へ失敗理由を引き渡せる構造にする。

## 命名規約
- コンポーネント: `PascalCase`、関数/変数: `camelCase`、定数: `UPPER_SNAKE_CASE`。
- boolean は `is/has/can` 接頭辞を使用する。
- イベントハンドラは `handleXxx`、propsイベントは `onXxx` を使用する。

## 禁止事項
- `console.log` の恒久残置を禁止する（デバッグ用は削除）。
- 同一意味の型定義を複数ファイルに重複定義しない。
- UI層でAPIレスポンスを未検証のまま描画しない。
- `as any` をドメイン層/アプリケーション層へ持ち込まない。
- `boolean` のみで意味が判別できない引数（例: `doX(true, false)`）を追加しない。
- センチネル値の返却契約（`-1`、`null`、空文字）を新規APIで採用しない。

## I/Oまたは責務
- 入力: 実装コード、型定義、ビルド設定、レビュー指摘。
- 出力: 統一実装スタイル、型安全性、保守可能なコード構造。

## 変更履歴
- 2026-02-11: 防御的型付け規約（Brand/union/Result/NonEmpty/境界decode/資源解放）を追加
- 2026-02-11: 型安全、命名、禁止事項を含む実装規約を具体化
- 2026-02-10: 新規作成
