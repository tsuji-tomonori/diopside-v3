---
id: BD-SYS-ADR-011
title: TypeScript型安全をtsconfigとlintで標準化する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[RQ-RDR-017]]'
related:
- '[[RQ-DEV-001]]'
- '[[RQ-PC-007]]'
- '[[RQ-PC-009]]'
- '[[BD-DEV-PIPE-001]]'
- '[[DD-DEV-CODE-001]]'
tags:
- diopside
- BD
- ADR
---

## 決定事項
- TypeScript型安全は「推奨スタイル」ではなく、ビルド通過条件として標準化する。
- `tsconfig` は `strict: true` を前提に、`noUncheckedIndexedAccess: true`、`exactOptionalPropertyTypes: true`、`useUnknownInCatchVariables: true` を常時有効とする。
- 外部入力境界は `unknown` 起点で扱い、絞り込み前の利用を禁止する。
- lint品質ゲートに `@typescript-eslint/no-explicit-any` と `@typescript-eslint/consistent-type-imports` を含める。

## 理由
- 個人開発でも、小差分リリース時の型崩れを早期検知できる体制が必要である。
- `any` や曖昧なoptional運用は、レビューでは見逃しやすく実行時障害へ直結する。
- `tsconfig` と lint の二重ゲート化により、設計意図をコードベース全体へ継続適用できる。

## 影響
- ビルド設計: [[BD-DEV-PIPE-001]] に型安全設定、禁止事項、受入基準を追加する。
- [[DD-DEV-CODE-001|コーディング規約]]: [[DD-DEV-CODE-001]] で `unknown` 境界、`switch` 網羅性、`import type` を明文化する。
- 運用/受入: [[RQ-DEV-001]] の `lint` / `test` / `build` 判定に型安全ゲートを含める。

## 却下した選択肢
- `strict` のみ有効化する最小運用: optional・indexアクセスの曖昧さが残るため不採用。
- `any` 許容を前提にレビューで吸収する運用: 属人化リスクが高く、継続運用に不向きなため不採用。
- lintのみで型方針を担保する運用: コンパイラ設定差異を吸収できないため不採用。

## 変更履歴
- 2026-02-11: 新規作成
