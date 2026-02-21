---
name: doc-rq-ux
description: doc-rq-ux に対応するdiopsideのユーザー体験要求（RQ-UX）文書を規約準拠で作成・更新し、UX受入条件と関連文書整合を確認する。ユーザー体験要求（RQ-UX）文書の追加・変更・レビュー時に使う
metadata:
  short-description: RQ-UX 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- SnowCard（日本語）の必須項目（要求ID/種別/優先度/要求/根拠/受入基準/例外/依存・関連）。
- UX成立条件を判断できる受入基準（例: 到達性・操作負荷・可読性・アクセシビリティ）と関連リンク。
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
- NFR文書では SnowCard の `要求` / `受入基準` / `例外/エラー` を「〜できる」基調で記述し、1項目1判定に分解する。
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- RQ-UX追加・意味変更時に、同一変更でRDRへ判断根拠を追記する。
- アクセシビリティ観点の要求では、関連するAT/UT文書へ受入確認導線を張る。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 使う条件
- RQ-UX文書を新規作成・更新・レビューし、UXの受入基準や例外条件を具体化するとき。
- UI設計/受入テストと接続するため、RDR・BD-UI・AT系文書との整合を同一変更で確認するとき。

## 使わない条件
- UX以外の要求（例: RQ-SEC/RQ-PS/RQ-AV）だけを更新し、UX受入条件の判断が発生しないとき。
- UI実装詳細（DD-UI）やテスト手順詳細（AT-SCN/UT）だけを更新し、RQ-UX本文を変更しないとき。

## 出力
- 対象RQ-UX文書の更新内容、追加・変更した受入基準、関連リンク更新結果。
- 要求追加・意味変更時に同一変更で更新したRDR記録と整合チェック結果。
