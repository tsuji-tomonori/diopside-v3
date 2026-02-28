---
id: UT-STAT-006
title: '静的解析方針 006（FE: TypeScript）'
doc_type: 静的解析方針
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-004]]'
related:
  - '[[UT-STAT-001]]'
  - '[[UT-MET-001]]'
tags:
  - diopside
  - UT
  - STAT
  - FE
---

## ツール概要
- ツール: TypeScript compiler（`tsc --noEmit`）
- 目的: フロントエンド実装の型不整合と危険な変更を単体前に検出する。

## 設定
| 項目 | 値 |
| --- | --- |
| config | `web/tsconfig.json` |
| strict | `true` |
| noEmit | `true` |
| noFallthroughCasesInSwitch | `true` |
| include | `web/src/**` |

## 対象
- `web/src/**/*.{ts,tsx}`

## 実行コマンド
- `npm --prefix web run typecheck`

## 失敗条件
- 終了コード `!= 0`。
- 型エラーが 1 件以上。

```ut-static
tool_id: UT-STAT-006
tool_name: TypeScript (web)
domain: FE
target: web/src/**/*.{ts,tsx}
command: npm --prefix web run typecheck
settings:
  tsconfig: web/tsconfig.json
  strict: true
  noEmit: true
  noFallthroughCasesInSwitch: true
gate: exit_code == 0 and tsc_errors == 0
```

## 変更履歴
- 2026-02-28: 新規作成
