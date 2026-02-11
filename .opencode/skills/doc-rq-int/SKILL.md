---
name: doc-rq-int
description: doc-rq-int に対応するdiopsideの相互運用性要求（RQ-INT）文書を規約準拠で作成・更新し、外部連携のデータ契約整合を確認する。相互運用性要求（RQ-INT）文書の追加・変更・レビュー時に使う
metadata:
  short-description: RQ-INT 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- 外部連携のデータ契約（JSON構造、ID形式、日時形式、版管理）に関する互換性条件。
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
- 受入基準に、契約破壊時の扱い（並行提供・告知期間・切り戻し条件）が含まれていることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 使う条件
- RQ-INT文書を新規作成・更新・レビューし、外部連携の契約互換性を要求として定義するとき。
- APIや配信JSONの形式変更に伴い、後方互換や版対応の受入基準を明確化するとき。

## 使わない条件
- 相互運用性ではなく、可用性/性能/セキュリティなど別NFRのみを更新するとき。
- 実装や運用手順だけを変更し、要求文書（RQ）自体の更新が発生しないとき。

## 出力
- 更新したRQ-INT文書の変更要点（対象契約、互換性条件、受入基準）。
- 影響を受ける関連文書（RDR/BD-API/DD-API/AT-SCN）との整合確認結果。
