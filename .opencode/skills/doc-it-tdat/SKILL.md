---
name: doc-it-tdat
description: IT-TDAT（結合テストデータ設計）文書を新規作成・改訂するときに、連携検証に必要なデータセットと前提状態をdiopside規約準拠で整備する
metadata:
  short-description: IT-TDAT 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `IT-TDAT-*` の新規作成、または既存テストデータの前提状態・投入データ・復旧データを更新するとき。
- `[[IT-PLAN-*]]` や `[[IT-CASE-*]]` の変更に追従して、結合テストで使うデータセットと投入順序を同期するとき。

## このスキルを使わない条件
- 結合テスト手順や期待結果そのものを更新する場合（`doc-it-case` を使う）。
- 結合テスト実行結果や証跡を更新する場合（`doc-it-rst` を使う）。

## 出力契約
- 出力対象は `docs/5.結合テスト(IT)/32.テストデータ設計/IT-TDAT-*.md` の単一文書とし、`filename == id` を維持する。
- 本文には少なくとも `テスト目的` `観点` を含め、必要に応じて投入順序・データ初期化条件・失敗時復旧条件を明記する。
- `up` にはテスト方針/計画（`[[BD-TST-*]]` `[[IT-PLAN-*]]` など）を設定し、`related` には受入側の接続先（`[[AT-PLAN-*]]` など）を設定する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
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
