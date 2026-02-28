---
name: doc-ut-pw
description: UT-PW（単体テストのペアワイズ因子定義）文書を新規作成・改訂するときに、画面/バックエンド別の因子・水準・除外条件をdiopside規約準拠で整備する
metadata:
  short-description: UT-PW 文書の更新ガイド
---

## 目的
- diopsideの単体テストで、組合せ爆発を抑えながら重要な因子ペアを網羅するためのUT-PW文書を整備する。

## このスキルを使う条件
- `docs/4.単体テスト(UT)/12.ペアワイズ(PW)` 配下の `UT-PW-*` を新規作成または更新するとき。
- 画面（FE）/バックエンド（BE）ごとの因子、水準、除外条件（`excludes`）を設計するとき。
- `scripts/pairwise/generate_pairwise_md.py` で `UT-CASE-*-PW.md` を生成する前提データを更新するとき。

## このスキルを使わない条件
- 単体テストケース本文（手順/期待結果）だけを改訂する場合（`doc-ut-case` を使う）。
- 単体テスト計画（方針/範囲/完了条件）を更新する場合（`doc-ut-plan` を使う）。

## 出力契約
- 出力対象は `docs/4.単体テスト(UT)/12.ペアワイズ(PW)/**/UT-PW-*.md` とし、`filename == id` を維持する。
- 各文書には `pairwise` コードブロックを含め、以下を定義する。
  - `meta.id` / `meta.title` / `meta.target` / `meta.output`
  - `meta.up` / `meta.related`
  - `factors`（因子名は日本語）
  - `excludes`（因子名は `factors` と同名）
- `meta.output` は `docs/4.単体テスト(UT)/21.単体テストケース(CASE)/.../UT-CASE-*-PW.md` を指定する。

## 記述ルール（UT-PW）
- 因子名は日本語で記述する（例: `認可状態`, `検索キーワード`, `実行状態`）。
- 水準は意味が分かる代表値に絞る（同値分割を優先）。
- 成立しない組合せは `excludes` へ明示し、生成後フィルタに依存しない。
- 1文書1トピックを守り、画面/API単位で分割する。

## 品質チェック
- `task docs:ut:pairwise:generate` で `UT-CASE-*-PW.md` を再生成する。
- `task docs:ut:pairwise:check` で生成差分漏れを検出する。
- `task docs:guard` で frontmatter/リンク整合を検証する。
