---
name: doc-bd-erd
description: BD-ERD（ER図）文書を新規作成・改訂するときに、主要エンティティ・関係・キー制約をdiopside規約準拠で整理する
metadata:
  short-description: BD-ERD 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `docs/2.基本設計(BD)/31.データアーキテクチャ/BD-ERD-*.md` を新規作成・更新するとき。
- 収集データの主要エンティティ、関連、識別子（主キー/外部キー相当）を設計として明示するとき。
- 要求変更や設計判断の更新に伴い、データ構造の関係性説明を見直すとき。

## このスキルを使わない条件
- データの対象境界や保持/配信方針が主題で、ER図の関係定義が中心でない場合（`doc-bd-data` を使う）。
- API契約やUI仕様など、データ構造以外の設計本文を主に更新する場合（`doc-bd-api` / `doc-bd-ui` などを使う）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- エンティティ、属性の要点、エンティティ間の関係（1:1/1:N/N:M など）と識別子の扱い。
- 要求または設計判断（`RQ-*` / `BD-ADR-*`）との対応づけ、関連リンク。
- `## 図` セクションでMermaidにより関係性を読める記述。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- Frontmatter必須キーを満たし、`filename == id` を維持した `BD-ERD-*` を出力する。
- 本文に、少なくとも関係性を説明するセクションと `## 図`（Mermaid）と `## 変更履歴` を含める。
- `up/related` で `RQ-*` / `BD-ADR-*` / 関連 `BD-*` へ辿れる状態にし、変更理由と影響範囲を追跡可能にする。

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
