---
name: doc-bd-dep
description: BD-DEP（デプロイ基本設計）文書を新規作成・改訂するときに、diopside規約準拠で作成・更新する
metadata:
  short-description: BD-DEP 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- BDフェーズのデプロイ設計（配信経路、公開手順、実行チェーン、失敗時観点）を新規作成・改訂するとき。
- 要求/ADR変更により、デプロイ構成や運用フロー（Task実行順序、CI/CD連携、配信先）を見直すとき。

## このスキルを使わない条件
- 要求定義（RQ-*）のみを更新する作業、または実装詳細中心の設計（DD-*）を更新する作業。
- API契約やUI仕様など、デプロイ方式・公開運用を主題としない文書の更新。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- デプロイの目的、対象環境、配信構成、実行順序、障害時の確認観点、関連リンク。
- CDK方針（`synth` 決定性、`cdk.context.json` 固定、環境差分のprops/Stage表現、stateful/stateless分離）。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- 対象文書は `filename == id` を満たし、Frontmatter必須キーを欠落なく保持する。
- デプロイ構成と運用フローの変更理由・適用条件が `up/related` で追跡可能で、関連する ADR/AT/DD 文書へ辿れる。
- 変更後の整合チェック結果（用語リンク補正と検証）をリポジトリ手順に沿って確認できる状態にする。
- CDKを扱う場合、`lint` / `test` / `cdk synth` / `cdk-nag` の品質ゲートと、論理ID変更レビュー観点が追跡可能である。

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
