---
name: doc-ut-cov
description: UT-COV（単体テストカバレッジ）文書を新規作成・改訂するときに、測定条件・閾値・除外根拠をdiopside規約準拠で整備する
metadata:
  short-description: UT-COV 文書の更新ガイド
---

## 目的
- diopside の UT-COV 文書で、単体テストカバレッジの測定前提・判定基準・追跡性を一貫して維持する。

## このスキルを使う条件
- `docs/4.単体テスト(UT)/41.カバレッジ/UT-COV-*.md` を新規作成・更新するとき。
- カバレッジ閾値（line/branch/function/statements など）や合否判定ルールを変更するとき。
- カバレッジ除外対象（生成コード・外部依存ラッパー等）の扱い、または除外根拠を追加・更新するとき。
- 実行コマンドや測定手順（例: `npm run test:coverage`）を変更するとき。

## このスキルを使わない条件
- 個別テストケースの観点・入力・期待結果のみを更新する（`UT-CASE` を使う）。
- 単体テスト計画の体制・対象範囲・実施順のみを更新する（`UT-PLAN` を使う）。
- 単体テスト実行結果の記録や集計のみを更新する（`UT-RPT` / `UT-STAT` を使う）。
- 実コードやテストコードだけを変更し、UT-COV 文書の意味変更が発生しないとき。

## 出力契約
- 対象 `UT-COV-*.md` が更新され、`id` とファイル名が一致している。
- Frontmatter 必須キー（`id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags`）が埋まっている。
- 本文に少なくとも以下が含まれる: 測定目的、測定対象範囲、実行コマンド/条件、閾値と判定基準、除外対象と根拠、関連文書リンク。
- 閾値または判定基準の意味変更時は `version` を PATCH 更新し、`updated` と `## 変更履歴` を当日に更新する。

## 何を書くべきか
- UT-COV 文書IDに対応する1トピックの内容。
- カバレッジの測定対象（どの層/モジュールを測るか）と測定条件（実行コマンド、前提環境）。
- カバレッジ閾値、判定基準、未達時の扱い。
- 除外するファイル/条件と、その除外を許容する根拠。
- `up/related` で根拠要求・設計・IT文書へ辿れるリンク。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。
- 根拠のない閾値変更、または除外理由のない対象追加。
- 実行実績（日時別の結果一覧）をUT-COV本文へ混在させること。

## Frontmatter運用
- `phase` は ID prefix と一致させる。
- `owner` は `RQ-SH-*` を使う。
- 意味変更時は `version` をPATCH更新する。
- `updated` は作業日へ更新する。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
