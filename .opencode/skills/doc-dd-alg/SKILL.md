---
name: doc-dd-alg
description: DD-ALG（アルゴリズム詳細設計）文書を新規作成・改訂するときに、入力/処理/出力と分岐条件をdiopside規約準拠で整備する
metadata:
  short-description: DD-ALG 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使うとき
- `DD-ALG-*` の新規作成・改訂で、検索・絞り込み・並び替え・派生計算などの処理手順を定義または変更するとき。
- 処理の入力条件、分岐、例外、出力責務を本文とMermaid図で追跡可能にしたいとき。

## このスキルを使わないとき
- API契約やI/F仕様を主題に更新するとき（`doc-dd-api` を使う）。
- UI構造や画面遷移を主題に更新するとき（`doc-dd-ui` を使う）。

## 出力契約
- 対象 `DD-ALG-*` 文書が、必須frontmatter・`filename == id`・`up/related` 整合を満たして更新されていること。
- アルゴリズム本文として、少なくとも入力/処理手順/出力、主要分岐、例外時の扱いが明示されていること。
- 意味変更時は `version` PATCH更新、`updated` 当日更新、`## 変更履歴` の当日追記が反映されていること。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 検索・絞り込み・並び替え・集計など対象アルゴリズムの入力/処理/出力と責務。
- 主要分岐（条件判定）と例外系の扱い、関連する要求/設計文書へのリンク。
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
- 本文とMermaid図で、主要な処理順序と分岐条件が矛盾なく説明されていることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
