---
name: doc-ut-mock
description: UT-MOCK（単体テストのモック方針）文書を新規作成・改訂するときに、モック採用基準・代替手段・保守ルールをdiopside規約準拠で整備する
metadata:
  short-description: UT-MOCK 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使うとき
- `UT-MOCK-*` 文書を新規作成・改訂するとき。
- 単体テストで「何をモック化し、何を実体で検証するか」の判断基準を明文化したいとき。

## このスキルを使わないとき
- 単体テスト計画やテストケース自体（`UT-PLAN-*` / `UT-CASE-*`）を中心に更新するとき。
- 実装コードだけを変更し、モック方針文書の意味変更がないとき。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- モック適用対象（外部I/O、時刻、乱数、外部APIなど）と採用理由。
- モックを使わない条件（実体依存で検証すべき境界）と例外条件。
- モック更新時の追従ルール（契約変更時の修正責務、失敗時の見直し条件）。
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
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 出力契約
- 出力は `UT-MOCK-*` のMarkdown 1ファイル（必要時のみ関連文書更新）とし、`1トピック=1ファイル` を守る。
- Frontmatter必須キーと `phase: UT` / `owner: RQ-SH-*` / `updated: 作業日` を満たす。
- 本文は「モック適用範囲・非適用範囲・運用ルール」を第三者が再利用できる粒度で記述する。
