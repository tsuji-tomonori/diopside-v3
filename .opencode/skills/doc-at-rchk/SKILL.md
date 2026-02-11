---
name: doc-at-rchk
description: リリース可否判定前後に、AT-RCHK（受入テストのリリースチェックリスト）文書を規約準拠で作成・更新する
metadata:
  short-description: AT-RCHK 文書の更新ガイド
---

## 目的
- diopside の受入テスト成果物として、リリース判定に使うチェック観点と判定基準を AT-RCHK 文書に整理する。

## このスキルを使う条件
- `AT-RCHK-*`（リリースチェックリスト）を新規作成・更新するとき。
- `AT-GO-*` のGo/No-Go判定に必要な確認項目や、判定基準の見直しを反映するとき。
- 受入結果（AT-RPT）や運用手順の変更を、リリース前確認観点へ取り込むとき。

## このスキルを使わない条件
- 受入シナリオ自体の定義を変更するだけの場合（`doc-at-scn` を使う）。
- 受入実行の手順詳細を変更するだけの場合（`doc-at-run` を使う）。
- 実行結果・証跡の記録が主目的の場合（`doc-at-rpt` を使う）。

## 出力契約
- 出力先は `docs/6.受入テスト(AT)/51.リリースチェックリスト/AT-RCHK-*.md` とし、1トピック=1ファイルを守る。
- Frontmatter は必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）を満たし、`phase: AT` と `id` の整合を取る。
- 本文は少なくとも「受入目的」「判定基準」「変更履歴」を含め、判定者がGo/No-Goを判断できる具体性を持たせる。

## Frontmatter運用
- `phase` は `AT`、`id` は `AT-RCHK-*` と一致させる。
- `owner` は `RQ-SH-*` を使う。
- 意味変更時は `version` をPATCH更新する。
- `updated` は作業日へ更新する。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
