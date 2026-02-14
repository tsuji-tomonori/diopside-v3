---
name: doc-dd-av
description: DD-AV（可用性詳細設計）文書を新規作成・改訂するときに、diopside規約準拠で作成・更新する
metadata:
  short-description: DD-AV 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- DDフェーズで、可用率/MTTR/計画停止時間の閾値を満たすための実装責務（復旧導線、縮退動作、障害区分）を具体化・改訂するとき。
- `[[RQ-AV-001]]` や `[[BD-SYS-QUAL-001]]` の変更を受けて、`DD-AV-*` の詳細仕様へ追記・修正が必要なとき。

## このスキルを使わない条件
- 可用性の要求値そのもの（MUST/受入閾値）の定義・合意だけを変更する作業（`RQ-AV-*` の更新）。
- 運用監視ルールや障害対応手順を主題に更新する作業（`BD-MON-*` / `AT-RUN-*` の更新）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- `[[RQ-AV-001]]` の可用率/MTTR/計画停止時間の受入観点に対して、システム側で担保する実装責務と判定根拠。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- `DD-AV-*` 文書が `filename == id` とFrontmatter必須キーを満たし、可用性詳細の変更点を単一トピックで説明できること。
- `up/related` で `RQ-AV-*` / `BD-QUAL-*` / 検証系文書（`AT-PLAN-*` など）へ追跡でき、影響範囲が辿れること。
- 外部要因の障害区分、一次復旧までの判断手順、可用性判定の記録先が本文から解釈できること。

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
