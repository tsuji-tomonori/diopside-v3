---
id: UT-STAT-004
title: '静的解析方針 004（INF: TypeScript）'
doc_type: 静的解析方針
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-003]]'
related:
  - '[[UT-STAT-001]]'
  - '[[UT-MET-001]]'
tags:
  - diopside
  - UT
  - STAT
  - INF
---

## ツール概要
- ツール: TypeScript compiler（`tsc`）
- 目的: IaC実装の型不整合とビルド不能状態を事前検知する。

## 設定
| 項目 | 値 |
| --- | --- |
| config | `infra/tsconfig.json` |
| strict | `true` |
| module | `CommonJS` |
| include | `bin/**/*.ts`, `lib/**/*.ts` |

## 対象
- `infra/bin/**/*.ts`
- `infra/lib/**/*.ts`

## 実行コマンド
- `npm --prefix infra run build`

## 失敗条件
- 終了コード `!= 0`。
- TypeScriptエラーが1件以上。

```ut-static
tool_id: UT-STAT-004
tool_name: TypeScript (infra)
domain: INF
target: infra/bin/**/*.ts, infra/lib/**/*.ts
command: npm --prefix infra run build
settings:
  tsconfig: infra/tsconfig.json
  strict: true
  module: CommonJS
gate: exit_code == 0 and tsc_errors == 0
```

## 変更履歴
- 2026-02-28: 新規作成
