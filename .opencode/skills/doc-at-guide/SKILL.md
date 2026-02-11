---
name: doc-at-guide
description: AT-GUIDE文書（受入テストの利用者向けガイド）を追加・改訂・レビューする際に、diopside規約準拠で作成・更新する
metadata:
  short-description: AT-GUIDE 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `docs/6.受入テスト(AT)/71.ユーザーガイド/AT-GUIDE-*.md` を新規作成・更新するとき。
- 受入テストの利用者向け案内として、受入目的・判定基準・実施時の参照先を整備するとき。

## このスキルを使わない条件
- 受入テストの実行手順や結果記録（AT-RUN/AT-RPT）を主対象に更新するとき。
- 受入シナリオ自体（AT-SCN）や Go/No-Go 判定（AT-GO）を主対象に更新するとき。
- 要求/基本設計/詳細設計文書（RQ/BD/DD）を主対象に更新するとき。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 利用者が受入判定を実施できる情報（受入目的、判定基準、必要に応じて事前条件・参照先・連絡先）。
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
- 対象 `AT-GUIDE-*.md` を1ファイル単位で更新し、Frontmatter必須キーと `filename == id` を満たす。
- `up/related` で受入テスト計画・判定文書（例: `BD-TST-*`/`IT-PLAN-*`/`AT-GO-*`）への到達性を維持する。
- 更新内容に対応した `updated` と `## 変更履歴` を反映した状態で完了報告する。
