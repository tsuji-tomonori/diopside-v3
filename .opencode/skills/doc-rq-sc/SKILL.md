---
name: doc-rq-sc
description: プロジェクトスコープ（RQ-SC）文書を新規作成・改訂するときに、対象/非対象境界と収集対象判定ルールをdiopside規約準拠で整備する
metadata:
  short-description: RQ-SC 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `RQ-SC-*` 文書を新規作成・改訂し、diopside の対象/非対象境界（In Scope / Out of Scope）を定義または更新するとき。
- 収集対象判定ルール（公開状態、公式投稿動画/出演動画の区分）やMVP境界を追加・変更するとき。
- スコープ変更に伴い、`RQ-PP-*` / `RQ-PC-*` / `RQ-FR-*` / `AT-PLAN-*` との整合を確認するとき。

## このスキルを使わない条件
- 画面仕様やユースケース詳細（`RQ-FR-*` / `RQ-UC-*` / `RQ-UX-*`）の定義が主目的のとき。
- API/画面/DBなど設計本文（`BD-*` / `DD-*`）だけを更新するとき。
- 表記ゆれ修正のみで、スコープ境界や判定ルールの意味変更がないとき。

## 出力契約
- 更新後の `RQ-SC-*` で、対象（In Scope）/非対象（Out of Scope）/MVP境界が第三者に判別できる。
- 収集対象判定ルールに、公開状態の扱いと「公式投稿動画/出演動画」の区分条件が明記される。
- 最終報告では、変更した `RQ-SC-*` と整合確認した関連文書（最低1件）を示す。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- スコープ境界（In Scope / Out of Scope）、収集対象判定ルール、MVP境界、関連リンク。
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
- In Scope / Out of Scope の境界が重複せず、除外項目が判定可能な粒度で書かれていることを確認する。
- 収集対象判定ルールが「公開YouTubeアーカイブのみ」を満たし、非公開/限定公開が除外されていることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
