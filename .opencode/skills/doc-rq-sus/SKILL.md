---
name: doc-rq-sus
description: doc-rq-sus に対応するdiopsideのサステナビリティ要求（RQ-SUS）文書を規約準拠で作成・更新し、受入閾値と関連文書整合を確認する。サステナビリティ要求（RQ-SUS）文書の追加・変更・レビュー時に使う
metadata:
  short-description: RQ-SUS 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

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
- NFR文書では SnowCard の `要求` / `受入基準` / `例外/エラー` を「〜できる」基調で記述し、1項目1判定に分解する。
- サステナビリティ要求では、リソース効率（常時稼働回避・転送量最適化・冗長コピー抑制）を定量指標で記述する。
- 例外条件（障害復旧時の一時運用など）には、適用条件と解除条件を明示する。
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 使う条件
- サーバーレス前提、常時稼働回避、配信転送効率など、環境負荷低減を受入条件に持つ RQ-SUS 文書を新規作成・更新・レビューするとき。
- 監視や運用手順（`AT-RUN`/`AT-GO`）と連動して、サステナビリティKPIの判定条件を整合したいとき。

## 使わない条件
- 機能要求（FR）や、サステナビリティ以外の非機能要求（例: セキュリティ/可用性）だけを扱うとき。
- 実装コードのみを変更し、`docs/**` の RQ-SUS 文書を更新しないとき。

## 出力契約
- 更新対象の RQ-SUS 文書で、サステナビリティ指標・受入基準・例外条件・依存リンクが規約に沿っていること。
- 変更理由の要約と、実施した整合チェック（リンク/検証スクリプト）の結果。
