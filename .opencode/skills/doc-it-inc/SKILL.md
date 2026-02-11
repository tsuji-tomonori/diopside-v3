---
name: doc-it-inc
description: 結合テスト中に発生した不具合・手順逸脱を記録する IT-INC 文書を、diopside規約準拠で作成・更新する
metadata:
  short-description: IT-INC 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- 結合テスト実行中に、期待結果との差分・不具合・手順逸脱を IT-INC として記録するとき。
- 既存の IT-INC 文書に、再現条件・影響範囲・対処状況の追記/更新を行うとき。

## このスキルを使わない条件
- 結合テスト計画/環境/テストデータの整備が目的で、インシデント記録そのものが主目的でないとき。
- RQ/BD/DD の意味変更が主目的で、要求・設計文書の更新が必要なとき。

## 出力契約
- 対象は1トピック1ファイル、`filename == id` の IT-INC 文書であること。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）を満たすこと。
- 本文に、少なくとも「発生事象」「発生条件/再現手順」「影響範囲」「暫定対処または恒久対応」「クローズ判断」を記載すること。
- `## 変更履歴` に当日の更新内容を追記すること。

## 記載しないこと
- 複数インシデントの混在。
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
