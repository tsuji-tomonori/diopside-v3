---
name: doc-bd-inf
description: BD-INF（インフラアーキテクチャ）文書を新規作成・改訂するときに、基盤構成・責務境界・非機能要件対応をdiopside規約準拠で整理する
metadata:
  short-description: BD-INF 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `docs/2.基本設計(BD)/22.インフラアーキテクチャ(INF)/BD-INF-*.md` を作成・更新するとき。
- ネットワーク、IAM、監視、可用性、デプロイ経路などの基盤構成を基本設計レベルで整理するとき。
- 要求（`RQ-*`）や設計判断（`BD-ADR-*`）を受け、インフラ責務境界を更新するとき。

## このスキルを使わない条件
- 意思決定の採否や代替案比較が主目的の場合（`doc-bd-adr` を使う）。
- 実装手順・具体設定値など詳細設計（`DD-*`）が主目的の場合（対応する `doc-dd-*` を使う）。

## 出力契約
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）を満たし、`filename == id` を維持する。
- 本文には少なくとも `## 設計方針`、`## 設計要点`、`## 図`、`## 変更履歴` を含める。
- `## 図` は Mermaid で記述し、構成要素間の依存とデータ/制御経路を読み取れる状態にする。
- `up/related` で `RQ-*` / `BD-ADR-*` / 関連 `BD-*` へ辿れるようにする。

## Frontmatter運用
- `phase` は ID prefix と一致させる。
- `owner` は `RQ-SH-*` を使う。
- 意味変更時は `version` をPATCH更新する。
- `updated` は作業日へ更新する。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- `## 変更履歴` 各行に `[[BD-ADR-xxx]]` が含まれていることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
