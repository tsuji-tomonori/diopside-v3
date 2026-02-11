---
id: BD-BUILD-001
title: ビルド方針
doc_type: ビルド設計
phase: BD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[RQ-SC-001]]'
- '[[RQ-FR-001]]'
- '[[RQ-DEV-001]]'
related:
- '[[BD-ARCH-001]]'
- '[[BD-ADR-001]]'
- '[[BD-ADR-011]]'
- '[[DD-CODE-001]]'
tags:
- diopside
- BD
- BUILD
---


## 設計方針
- TypeScriptの型安全を、個人開発でも運用可能な静的品質ゲートとして標準化する。
- 型安全は実装規約ではなくビルド失敗条件として扱い、`tsconfig` と lint を同時に満たす構成を採用する。
- 外部入力境界からUI/運用スクリプトまで、`any` の拡散を抑止して型の一貫性を維持する。

## 設計要点
- `tsconfig` 必須設定は `strict: true` を基準とし、`noUncheckedIndexedAccess: true`、`exactOptionalPropertyTypes: true`、`useUnknownInCatchVariables: true` を標準有効化する。
- 配列/辞書アクセスは「存在しない可能性」を型へ反映し、`obj[key]` の結果を未検証で使用しない。
- optional設計は `prop?: T`（未存在）と `prop: T | undefined`（存在+未定義）を使い分け、DTO/保存データの意味差を明示する。
- 外部入力（JSON/API/env/query/localStorage）は `unknown` で受け取り、型ガードまたはバリデーション後に内部型へ変換する。
- 状態遷移は discriminated union（`kind`/`state`）を採用し、`switch` + `never` で網羅性チェックを行う。
- 型アサーション `as` は最終手段とし、設定オブジェクトや定数マップ検証では `satisfies` を優先する。
- 二重定義を避けるため、`as const`、`typeof`、`keyof`、utility types（`Pick`/`Omit`/`Partial` 等）で「値から型を導出」する。
- `interface` は拡張前提のオブジェクト形状、`type` は union/型演算中心で利用し、使い分けを規約化する。
- Genericsは「型同士の関係」を表す場合に限定し、単独出現の型パラメータは導入しない。
- 型専用importは `import type` を強制し、`@typescript-eslint/no-explicit-any` と `@typescript-eslint/consistent-type-imports` を品質ゲートに含める。

## 受入基準
- CIで `tsc --noEmit` と lint が常時成功し、上記4つの `tsconfig` オプションが有効である。
- 新規追加コードに `any` を導入する場合は、理由と除去計画をPR本文へ明記しない限り受入不可とする。
- `catch` 節、外部入力処理、union分岐で未絞り込み利用がないことをレビューで確認できる。
- 型のみ参照のimportが `import type` へ統一されている。

## 変更履歴
- 2026-02-11: TypeScript型安全方針（tsconfig厳格化、`unknown` 境界、`satisfies`、lintゲート）を追加
- 2026-02-10: 新規作成
