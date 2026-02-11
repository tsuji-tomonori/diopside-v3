---
name: doc-rq-dev
description: diopsideのRQ-DEV（DevOps非機能要求）文書を追加・改訂するときに、SnowCardと運用受入条件を規約準拠で整備する
metadata:
  short-description: RQ-DEV 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `RQ-DEV-*` 文書を新規作成・改訂し、DevOps観点の非機能要求（CI/CD、デプロイ、ロールバック、運用手順整合）を定義・更新するとき。
- 受入基準を、実行可能な品質ゲート（例: `lint/test/build`、配信確認、復旧時間）として明確化したいとき。
- CDK運用の決定性（`synth` 副作用ゼロ、`cdk.context.json` 固定、props注入）を要求として追加・更新するとき。

## このスキルを使わない条件
- 利用者機能の機能要求（FR）や、DevOps以外の非機能要求（例: セキュリティ、可用性、コスト）を更新するとき。
- RQ以外の設計/試験文書（BD/DD/UT/IT/AT）のみを更新するとき。

## 出力契約
- 変更後の `RQ-DEV-*` は SnowCard 必須項目を満たし、受入基準が運用で検証可能な粒度で記述されている。
- 要求の追加または意味変更がある場合、関連 `RQ-RDR-*` を同一変更で更新し、`up/related` のトレーサビリティを維持する。
- 変更後に用語リンク補正と Vault 整合チェックを実施し、結果を `reports/doc_check.md` に反映する。
- CDKを扱う場合、`lint` / `test` / `cdk synth` / `cdk-nag`、`cdk.context.json` 差分管理、stateful置換防止観点が受入基準へ反映されている。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
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
