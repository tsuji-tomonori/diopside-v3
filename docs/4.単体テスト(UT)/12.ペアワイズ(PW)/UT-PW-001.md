---
id: UT-PW-001
title: 単体テストにおけるペアワイズ因子定義ガイド
doc_type: 単体テスト設計
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-28
updated: '2026-02-28'
up:
  - '[[UT-PLAN-001]]'
related:
  - '[[UT-PLAN-004]]'
  - '[[UT-PLAN-005]]'
  - '[[DD-APP-API-001]]'
  - '[[BD-APP-UI-001]]'
tags:
  - diopside
  - UT
  - PW
---

## 目的
- 単体テストで条件分岐の組合せ爆発を抑えるため、2-wise（ペアワイズ）で因子組合せを抽出する。
- 画面（FE）とバックエンド（BE）の因子定義を `UT-PW-*` に分離し、同じ手順でケース生成できるようにする。

## 因子設計ルール
- 因子は 5-8 個、水準は 2-5 個を目安とする。
- 同値分割で水準を代表値へ畳み込み、過剰な列挙を避ける。
- 成立しない組合せは `excludes` に明示し、生成前提で除外する。
- 境界値、過去障害、3因子相互作用は別途追加ケースで補完する。

## 因子の観点
- FE: 入力（[[RQ-GL-014|検索条件]]）、UI状態（loading/success/empty/error）、操作種別（初回/再試行/モーダル操作）、権限表示。
- BE: 認証/認可、入力妥当性（path/query/body）、前提状態、依存戻り値、重複実行・冪等、ページング。

## モデル記法
- 各 `UT-PW-*.md` に `pairwise` フェンスブロックを置く。
- `meta` に出力先とリンク情報、`factors` に因子水準、`excludes` に除外条件を記載する。

```pairwise
meta:
  id: UT-PW-EXAMPLE
  title: サンプル
  target: FE
  output: docs/4.単体テスト(UT)/21.単体テストケース(CASE)/03.フロントエンド(FE)/UT-CASE-FE-EXAMPLE-PW.md
  up:
    - UT-PLAN-004
    - DD-APP-UI-002
  related:
    - DD-APP-API-006
factors:
  因子A: [水準1, 水準2]
  因子B: [水準1, 水準2, 水準3]
excludes:
  - { 因子A: 水準1, 因子B: 水準3 }
```

## 動的生成手法
- 標準: `scripts/pairwise/generate_pairwise_md.py` で `UT-PW-*.md` を入力に `UT-CASE-*-PW.md` を生成する。
- 生成器は 2-wise の未被覆ペアを貪欲に埋める方式を採用し、`excludes` 適用後の被覆率を検証する。
- 代替: 制約記述が複雑な場合は PICT モデルへ変換し、CIで PICT 実行に切り替える。

## 運用
1. 対象の `UT-PW-*` の `factors/excludes` を仕様に合わせて更新する。
2. `task docs:ut:pairwise:generate` で `UT-CASE-*-PW.md` を再生成する。
3. `task docs:guard` を実行し、リンク整合とfrontmatter整合を確認する。

## 変更履歴
- 2026-02-28: 新規作成
