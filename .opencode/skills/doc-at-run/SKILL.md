---
name: doc-at-run
description: AT-RUN（障害対応手順書）を新規作成・改訂するときに、障害分類・初動・復旧手順・判定基準をdiopside規約準拠で整備する
metadata:
  short-description: AT-RUN 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `docs/7.運用・リリース(OPS_REL)/21.障害対応手順書/AT-RUN-*.md` を作成・更新するとき。
- デプロイ/公開導線（Quartz build, CDK deploy, CloudFront反映, API認証など）の障害切り分けと復旧手順を更新するとき。
- `AT-GO` / `AT-REL` / `BD-DEP-*` と整合する運用時の復旧判断基準を定義・改訂するとき。

## このスキルを使わない条件
- 受入シナリオ個別手順のみを更新する場合（`doc-at-scn` を使う）。
- 実行結果レポートのみを更新する場合（`doc-at-rpt` を使う）。
- Go/No-Go 判定資料のみを更新する場合（`doc-at-go` を使う）。

## 出力契約
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）を満たし、`filename == id` を維持する。
- 本文には少なくとも、受入目的、障害分類と初動、復旧手順、判定基準、関連文書リンク、`## 変更履歴` を含める。
- 障害対応の根拠が `AT-*` / `BD-DEP-*` / `IT-*` へ Obsidian リンクで追跡可能である。
- 複数トピック混在、本文での上位/下位セクション追加、Mermaid以外の図表形式は行わない。

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
