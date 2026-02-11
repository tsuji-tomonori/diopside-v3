---
name: doc-rq-dg
description: doc-rq-dg（ドキュメント更新フローと受入基準）文書を新規作成・改訂するときに、diopside規約準拠で作成・更新する
metadata:
  short-description: RQ-DG 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `RQ-DG-*`（ドキュメント更新フロー/受入基準）を新規作成または改訂する。
- 文書運用規約の変更を、`docs` 本文と `.opencode/skills` の同一変更で反映する必要がある。
- 共通規約変更時の同時更新対象（`skill-maintainer` / `docops-orchestrator` / `obsidian-doc-*`）を受入基準へ明記したい。

## このスキルを使わない条件
- 主対象が機能要求（`RQ-FR-*`）や他要求カテゴリ（`RQ-SC-*` など）で、DG文書を直接更新しない。
- 主対象が BD/DD/UT/IT/AT 文書であり、要求文書の更新フロー定義そのものは変更しない。
- 既存文書のリンク整合チェックのみが目的で、本文改訂を伴わない（`obsidian-doc-check` を優先）。

## 出力契約（このスキルの成果物）
- `RQ-DG-*` 本文が 1トピック原則・必須Frontmatter・`## 変更履歴` 更新を満たしている。
- 文書運用の意味変更がある場合、同一変更内で `RDR` と `reports/impact_check_YYYY-MM-DD.md` への反映方針が明示されている。
- 変更後に実行すべき検証（用語自動リンク化と vault 検証）のコマンドと合否観点が本文で追跡可能になっている。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- スキルメンテナンス方針（`docs` と `.opencode/skills` の同一変更、共通スキル同時更新）。
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
- 共通規約変更時は `skill-maintainer` / `docops-orchestrator` / `obsidian-doc-*` の同時更新を受入条件へ含める。
- スキル更新を伴う変更では `reports/impact_check_YYYY-MM-DD.md` へ更新理由と影響範囲が記録されていることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
