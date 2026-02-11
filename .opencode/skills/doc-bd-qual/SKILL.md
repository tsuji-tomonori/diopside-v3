---
name: doc-bd-qual
description: BD-QUAL（品質特性）文書を新規作成・改訂するときに、品質特性ごとの設計方針と受入観点をdiopside規約準拠で整理する
metadata:
  short-description: BD-QUAL 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `BD-QUAL-*`（品質特性）文書を新規作成・更新する。
- 可用性/性能/セキュリティ/可観測性/コストなど、非機能要求（`RQ-AV-*`/`RQ-PS-*`/`RQ-SEC-*`/`RQ-OBY-*`/`RQ-COST-*`）に対応する基本設計の方針を整理する。

## このスキルを使わない条件
- API仕様やUI仕様など、特定領域の機能設計が主目的の場合（`doc-bd-api` / `doc-bd-ui` などを使う）。
- 実装手順・コード構造・運用手順が主目的の場合（対応する `doc-dd-*` / `doc-it-*` / `doc-at-*` を使う）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- 品質特性ごとの設計方針（例: 可用性/性能/可観測性）と、ATで検証可能な判定観点。
- Next.js App Router 前提の品質観点（RSC/Client境界、ウォーターフォール回避、Streaming/Suspense）。
- キャッシュ戦略（Data/Route/Router Cache、`fetch` の `cache`/`revalidate`/`tags`、`revalidatePath`/`revalidateTag`）。
- 本番品質検証（`next build` + `next start`、Lighthouse + Web Vitals、bundle analyzer、`next/image`）
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
- `up/related` から品質特性に対応する要求（`RQ-*`）と関連設計（`BD-ARCH-*` / `BD-ADR-*` など）を辿れることを確認する。
- Next.js を扱う場合、性能判定がシミュレーション値のみでなく Web Vitals を含むことを確認する。
- キャッシュ再検証方針（TTL/オンデマンド/動的化条件）が要求・設計・受入で一貫していることを確認する。
- `## 変更履歴` 各行に `[[BD-ADR-xxx]]` が含まれていることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 出力契約
- 出力は `BD-QUAL-*` 1ファイルのみを対象とし、1トピック原則を守る。
- Frontmatter必須キーを完備し、`phase: BD`・`owner: RQ-SH-*`・`updated` 当日を満たす。
- 本文は品質特性ごとの設計方針と受入観点を含み、`up/related` から対応する `RQ-*` と関連 `BD-*` へ追跡できる状態にする。
- Next.js を扱う場合は、キャッシュ・再検証・体感性能・本番検証の判定軸が文書内で明示されている状態にする。
