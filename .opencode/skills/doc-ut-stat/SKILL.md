---
name: doc-ut-stat
description: 静的解析方針（UT-STAT）文書を追加・改訂するときに、解析ルール・実行条件・判定基準をdiopside規約準拠で整備する
metadata:
  short-description: UT-STAT 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使うとき
- `docs/4.単体テスト(UT)/42.静的解析/UT-STAT-*.md` を新規作成・更新するとき。
- 静的解析ルール（例: ESLint/TypeScript/型チェック）の適用範囲・違反時の扱いを変更するとき。
- 静的解析の実行コマンド、実行タイミング（ローカル/CI）、合否判定基準を追加・変更するとき。

## このスキルを使わないとき
- 単体テストの品質メトリクス定義や閾値のみを更新するとき（`doc-ut-met` を使う）。
- カバレッジの測定方針や除外根拠のみを更新するとき（`doc-ut-cov` を使う）。
- 単体テストの実行結果記録のみを更新するとき（`doc-ut-rpt` を使う）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 静的解析の対象範囲（対象ディレクトリ/除外対象）と採用ルール。
- 実行コマンド、実行タイミング、違反時の判定基準（失敗/警告/許容条件）。
- 関連する要求・設計・テスト文書へのリンク（`up/related`）。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

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

## 出力契約
- 最終出力では、更新対象 `UT-STAT-*` のパスと、変更した解析ルール/実行条件/判定基準を簡潔に列挙する。
- 関連文書を更新した場合は、`up/related` の整合理由を1-2行で示す。
