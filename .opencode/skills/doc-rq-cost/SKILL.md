---
name: doc-rq-cost
description: doc-rq-cost に対応するdiopsideの要求（RQ）文書を規約準拠で作成・更新し、関連文書との整合を確認する。要求（RQ）文書の追加・変更・レビュー時に使う
metadata:
  short-description: RQ-COST 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- コスト要件の意図、受入条件（上限値・予兆閾値・抑制SLA）、関連リンク。
- 根拠として `RQ-PC-*` 系の上限制約や、運用記録先（例: `AT-OPS-*`）との接続。
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
- SnowCard の `受入基準` が計測可能な数値・期限を含み、運用抑制手順へ辿れることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 使う条件
- RQ-COST系文書の新規作成・更新・レビューを行うとき。
- 月額上限、超過予兆、抑制施策の受入条件を要求として明確化したいとき。

## 使わない条件
- コード実装のみで、docs/Obsidian文書を更新しないとき。
- コスト要件ではなく、性能/可用性/セキュリティなど別カテゴリの要求を更新するとき。

## 出力
- 更新対象の要約（どのコスト要件を、なぜ変更したか）。
- 実施した整合確認（`up/related`、RDR連携、検証コマンド）と結果。
