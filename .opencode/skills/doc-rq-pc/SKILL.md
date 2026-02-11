---
name: doc-rq-pc
description: プロジェクト制約（RQ-PC）文書を新規作成・改訂するときに、制約の適用境界と運用上の前提をdiopside規約準拠で整備する
metadata:
  short-description: RQ-PC 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `RQ-PC-*` 文書を新規作成・改訂し、法令/運用体制/コスト/リリース条件などのプロジェクト制約を明文化するとき。
- `RQ-SC-*` で定義した対象範囲に対して、実施可否や運用上の上限を追加・変更するとき。
- 制約変更に合わせて `RQ-RDR-*` や関連NFR（`RQ-PRC-*` / `RQ-COST-*` / `RQ-DEV-*` など）との整合を確認するとき。

## このスキルを使わない条件
- 機能仕様や利用者操作（`RQ-FR-*` / `RQ-UC-*` / `RQ-UX-*`）の定義が主目的のとき。
- API/画面/DBなど設計本文（`BD-*` / `DD-*`）だけを更新するとき。
- 単なる表記ゆれ修正で、制約の意味や適用範囲に変更がないとき。

## 出力契約
- 更新対象の `RQ-PC-*` 本文で、制約内容と適用対象（何に効く制約か）が第三者に判別できる。
- 制約違反時または例外時の扱い（停止条件・記録・再開条件のいずれか）を明記する。
- 最終報告では、変更した `RQ-PC-*` と整合確認した関連文書（最低1件）を示す。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 制約の対象範囲、運用前提、例外時の扱い、関連リンク。
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
- 制約文が単なる理想論ではなく、運用時の判断に使える禁止/条件/上限として読めることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
