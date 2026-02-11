---
name: doc-dd-perf
description: DD-PERF（性能詳細設計）文書を新規作成・改訂するときに、性能目標・測定条件・ボトルネック対策をdiopside規約準拠で整備する
metadata:
  short-description: DD-PERF 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `DD-PERF-*` を新規作成・改訂し、性能詳細設計（応答時間、処理量、劣化時挙動）を定義するとき。
- 性能要求の変更に合わせて、測定条件・受入閾値・ボトルネック緩和策を設計文書へ反映するとき。
- 収集/検索/表示の主要導線で、性能劣化の検知観点と再現条件を明文化するとき。

## このスキルを使わない条件
- `DD-PERF-*` 以外（例: `DD-SEC-*` / `DD-AV-*`）を主対象に更新するとき。
- 要求定義（`RQ-*`）のみの追加・改訂で、詳細設計の変更がないとき。
- 実装コードや運用手順書のみを更新し、DD文書を変更しないとき。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 性能指標（例: 応答時間、スループット、同時実行数）と、その測定条件を判定可能な形で明記する。
- 許容閾値を超過した場合の劣化挙動（段階ロード、再試行、縮退運転など）と発火条件を明記する。
- ボトルネック候補（外部API、DB、検索索引、描画処理）ごとの観測点と対策方針を明記する。
- 性能要求・関連設計・運用確認へ辿れる関連リンク。
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

## 出力契約
- 出力は `DD-PERF-*` 本文の更新結果（Frontmatter必須キー充足、本文差分、`## 変更履歴` 追記）であること。
- 出力文書だけで、性能目標・測定条件・合否判定・劣化時挙動が追跡できること。
- 影響文書を更新した場合は、`up/related` で追跡可能なリンク整合を維持すること。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
