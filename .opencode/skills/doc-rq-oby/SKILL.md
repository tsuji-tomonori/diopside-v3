---
name: doc-rq-oby
description: doc-rq-oby に対応するdiopsideの可観測性要求（RQ-OBY）文書を規約準拠で作成・更新し、ログ/メトリクス/アラートの受入条件と関連文書整合を確認する。可観測性要求（RQ-OBY）文書の追加・変更・レビュー時に使う
metadata:
  short-description: RQ-OBY 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- ログ/メトリクス/アラートの観測項目、通知閾値、保存期間といった可観測性の受入条件。
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
- 可観測性要求の受入基準に、観測対象（例: `run_id`、成功/失敗件数、応答時間）、通知条件、保存期間が含まれていることを確認する。
- `[[BD-MON-001]]` / `[[DD-LOG-001]]` / `[[RQ-COST-001]]` など、監視設計・ログ設計・コスト制約との整合リンクを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 使う条件
- RQ-OBY 文書で、ログ/メトリクス/アラートの要件や通知閾値、保持期間を新規定義または更新するとき。
- 監視運用（再収集判断、障害切り分け、通知時間）に関わる受入基準をレビューし、関連文書との整合を確認するとき。

## 使わない条件
- 可観測性以外の要求（例: 可用性、性能、セキュリティ）だけを更新し、RQ-OBY の受入条件を扱わないとき。
- 実装コードのみを変更し、`docs/**` の RQ-OBY 文書を更新しないとき。

## 出力契約
- 更新対象の RQ-OBY 文書で、可観測性要件（観測対象/通知条件/保持方針）と例外条件が規約に沿って記述されていること。
- 変更理由の要約と、実施した整合チェック（リンク確認・検証スクリプト実行）の結果。
