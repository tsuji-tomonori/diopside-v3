---
name: doc-rq-pp
description: doc-rq-pp に対応するdiopsideのプロジェクト目的（PP）文書を規約準拠で作成・更新し、目的・提供価値・成功指標の整合を確認する。プロジェクト目的（PP）文書の追加・変更・レビュー時に使う
metadata:
  short-description: RQ-PP 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- PPとして、目的/提供価値/成功指標（KPI・品質ゲート・測定先）のいずれかを具体化する。
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
- PP-001/002/003間で、目的・価値指標・成功判定の記述が矛盾しないことを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 使う条件
- PP文書を新規作成・更新・レビューし、プロジェクトの目的/提供価値/成功指標を定義・改訂するとき。
- PPの変更に伴い、受入判定や関連要求への影響を同一変更で確認するとき。

## 使わない条件
- FR/SC/UC/DD/UT/IT/ATのみを更新し、プロジェクト目的や成功指標の定義を変更しないとき。
- KPIの実測値報告だけを行い、PP本文の要求定義を変更しないとき。

## 出力
- 対象PP文書の更新内容（目的・提供価値・成功指標のどこを更新したか）と変更理由。
- 実施した整合チェック結果（関連PP/受入文書との矛盾有無）。
