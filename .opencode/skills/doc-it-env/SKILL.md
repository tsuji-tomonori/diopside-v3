---
name: doc-it-env
description: IT-ENV（結合テスト環境）文書を新規作成・改訂するときに、diopside規約準拠で作成・更新する
metadata:
  short-description: IT-ENV 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `docs/5.結合テスト(IT)/31.結合テスト環境/IT-ENV-*.md` を新規作成または改訂する。
- 結合テストで利用する環境の前提、依存、復旧観点を IT フェーズ文書として整理する。

## このスキルを使わない条件
- `IT-PLAN-*` / `IT-CASE-*` / `IT-RST-*` など、結合テスト環境以外の IT 文書を更新する。
- `BD-*` / `DD-*` / `AT-*` など、結合テスト環境設計ではない文書を更新する。

## 出力契約
- 更新対象は `IT-ENV-*` 単一トピック文書とし、`filename == id`、必須 Frontmatter、`## 変更履歴` の当日追記を満たす。
- `up/related` のリンク整合を満たし、必要に応じて影響先文書または確認記録を同一変更で更新する。
- 用語リンク補正と Vault 検証を実行し、検証結果を `reports/doc_check.md` に反映する。

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
