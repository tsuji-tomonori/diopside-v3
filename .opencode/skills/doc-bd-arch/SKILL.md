---
name: doc-bd-arch
description: BD-ARCH（アーキテクチャ概要）文書を新規作成・改訂するときに、システム境界・主要コンポーネント・配置方針をdiopside規約準拠で整理する
metadata:
  short-description: BD-ARCH 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `docs/2.基本設計(BD)/21.アーキテクチャ概要/BD-ARCH-*.md` を作成・更新するとき。
- 収集・索引生成・配信・Web UI の責務境界や接続関係を、俯瞰レベルで整理するとき。
- 要求（`RQ-*`）や設計判断（`BD-ADR-*`）を受け、全体構成の説明を更新するとき。
- Next.js App Router の Server/Client 境界、Dynamic API 利用位置、Route Handlers 境界、キャッシュ層の責務を基本設計へ反映するとき。

## このスキルを使わない条件
- 意思決定の採否や代替案比較が主目的の場合（`doc-bd-adr` を使う）。
- API仕様・UI仕様など特定領域の設計本文のみを更新する場合（`doc-bd-api` / `doc-bd-ui` などを使う）。
- 詳細設計（DD）や実装・運用手順が主目的の場合（対応する `doc-dd-*` / `doc-it-*` / `doc-at-*` を使う）。

## 出力契約
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）を満たし、`filename == id` を維持する。
- 本文には少なくとも `## 設計方針`、`## 設計要点`（または同等の境界/構成セクション）、`## 図`、`## 変更履歴` を含める。
- `## 図` は Mermaid で記述し、主要コンポーネント間のデータ/責務の流れを読み取れる状態にする。
- `up/related` で `RQ-*` / `BD-ADR-*` / 関連 `BD-*` へ辿れるようにし、複数トピック混在や本文での上位/下位セクション追加は行わない。
- Next.js を扱う場合は、Server Components優先、`"use client"` 最小化、Dynamic API波及範囲、Server->Route Handlers回避、Suspense/streaming方針を本文で明示する。

## Frontmatter運用
- `phase` は ID prefix と一致させる。
- `owner` は `RQ-SH-*` を使う。
- 意味変更時は `version` をPATCH更新する。
- `updated` は作業日へ更新する。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- Next.js を扱う場合、`cookies()` / `headers()` / `searchParams` の利用位置がRoot Layout全体動的化を引き起こしていないことを確認する。
- データ取得が Server Components 直結で設計され、Client からの更新系アクセスのみ Route Handlers を利用していることを確認する。
- `## 変更履歴` 各行に `[[BD-ADR-xxx]]` が含まれていることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
