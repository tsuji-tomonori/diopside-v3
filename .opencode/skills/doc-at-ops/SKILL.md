---
name: doc-at-ops
description: 運用受入チェックリスト（AT-OPS）を新規作成・更新する際に、判定基準と運用異常時の確認観点を規約準拠で整備する
metadata:
  short-description: AT-OPS 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `AT-OPS-*`（運用受入チェックリスト）文書を新規作成・更新するとき。
- 受入判定基準や、異常時に運用手順が機能するかの確認観点を追加・変更するとき。

## このスキルを使わない条件
- 手順の実行シナリオ本文を整備するだけの場合（`AT-RUN-*` を優先する）。
- 受入結果の記録・報告本文を整備するだけの場合（`AT-RPT-*` を優先する）。
- 回帰観点の定義・見直しが主目的の場合（`AT-RCHK-*` を優先する）。

## 出力契約
- `AT-OPS-*` 文書として、受入目的・判定基準・関連リンクが更新されていること。
- 判定基準に、重要FR/NFRの再現可能性と異常時運用の成立可否を確認する記述が含まれること。
- Frontmatter必須キーと `## 変更履歴` の当日追記が整合していること。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 受入目的、判定基準（通常時/異常時の運用観点）、関連リンク。
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
- 判定基準が、対象FR/NFRまたは上位文書（`BD-TST-*` / `IT-PLAN-*`）と辿れることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
