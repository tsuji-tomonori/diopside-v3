---
id: UT-STAT-008
title: '静的解析方針 008（BE: ペアワイズモデル整合）'
doc_type: 静的解析方針
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-005]]'
  - '[[UT-PW-001]]'
related:
  - '[[UT-STAT-001]]'
  - '[[UT-MET-001]]'
tags:
  - diopside
  - UT
  - STAT
  - BE
---

## ツール概要
- ツール: `scripts/pairwise/generate_pairwise_md.py --strict --check`
- 目的: バックエンド向け `UT-PW-BE-*` の因子定義と生成ケース同期を静的に検証する。

## 設定
| 項目 | 値 |
| --- | --- |
| source_root | `docs/4.単体テスト(UT)/12.ペアワイズ(PW)` |
| model_selector | `UT-PW-BE-*.md` |
| strict | `true`（2-wise被覆率100%必須） |
| check_mode | `true`（差分検出のみ） |

## 対象
- `docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)/UT-PW-BE-*.md`
- 対応する `UT-CASE-BE-*-PW.md` 生成物。

## 実行コマンド
- `task docs:ut:pairwise:check`

## 失敗条件
- 終了コード `!= 0`。
- 生成差分が存在する。
- いずれかモデルで被覆率 `< 100%`。

```ut-static
tool_id: UT-STAT-008
tool_name: pairwise generator check (BE)
domain: BE
target: UT-PW-BE-* models and generated UT-CASE-BE-*-PW
command: task docs:ut:pairwise:check
settings:
  strict: true
  check_mode: true
  model_root: docs/4.単体テスト(UT)/12.ペアワイズ(PW)/04.バックエンド(BE)
gate: exit_code == 0 and generated_diff == 0 and pairwise_coverage == 100%
```

## 変更履歴
- 2026-02-28: 新規作成
