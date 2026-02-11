---
name: doc-bd-sec
description: BD-SEC（セキュリティ設計）文書を新規作成・改訂するときに、脅威境界・防御方針・監査観点をdiopside規約準拠で整理する
metadata:
  short-description: BD-SEC 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `docs/2.基本設計(BD)/61.セキュリティ/BD-SEC-*.md` を作成・更新するとき。
- 公開YouTubeアーカイブを扱う diopside の設計として、脅威境界・防御方針・監査方針を明文化するとき。
- 要求（`RQ-*`）や設計判断（`BD-ADR-*`）を受け、認証/認可、入力検証、シークレット管理、監査ログ方針を基本設計レベルで整理するとき。

## このスキルを使わない条件
- 実装方式やコードレベルの脆弱性対策が主目的の場合（`doc-dd-sec` を使う）。
- 障害対応手順・運用手順の整備が主目的の場合（`doc-at-run` / `doc-at-ops` を使う）。
- 意思決定の採否や代替案比較そのものを記録する場合（`doc-bd-adr` を使う）。

## 出力契約
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）を満たし、`filename == id` を維持する。
- 本文には少なくとも `## 設計方針`、`## セキュリティ設計要点`（または同等の脅威/防御方針セクション）、`## 変更履歴` を含める。
- セキュリティ対象範囲（公開データ収集・保存・配信・運用）と、対象外（非公開/限定公開データなど）を曖昧にしない。
- `up/related` で `RQ-*` / `BD-ADR-*` / 関連 `BD-*` へ辿れるようにし、複数トピック混在や本文での上位/下位セクション追加は行わない。

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
