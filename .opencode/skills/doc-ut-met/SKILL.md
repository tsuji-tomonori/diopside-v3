---
name: doc-ut-met
description: 単体テスト品質メトリクス（UT-MET）文書を追加・改訂するときに、測定定義と受入閾値をdiopside規約準拠で整備する
metadata:
  short-description: UT-MET 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使うとき
- `UT-MET-*` 文書を新規作成するとき。
- 既存の品質メトリクスの定義・閾値・測定条件を変更するとき。

## このスキルを使わないとき
- カバレッジ方針のみを変更する場合（`doc-ut-cov` を使う）。
- 静的解析ルールの変更のみを扱う場合（`doc-ut-stat` を使う）。
- 実行結果の記録のみを更新する場合（`doc-ut-rpt` を使う）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- メトリクスごとの定義（何を、どこから、どう算出するか）。
- 受入閾値と判定条件（合格/警告/失敗）。
- 閾値未達時のエスカレーション先または次アクション。
- 要求または設計の意図、関連リンク。
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
- 最終出力では、更新対象 `UT-MET-*` のパスと、変更したメトリクス定義/閾値/判定条件を簡潔に列挙する。
- 関連文書を更新した場合は、`up/related` の整合理由を1-2行で示す。
