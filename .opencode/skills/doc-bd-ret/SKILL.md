---
name: doc-bd-ret
description: BD-RET（データ保持・削除方針）文書を新規作成・改訂するときに、保持期間・削除条件・例外運用をdiopside規約準拠で整備する
metadata:
  short-description: BD-RET 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `BD-RET-*`（データ保持・削除方針）文書を新規作成・更新するとき。
- 公開YouTubeアーカイブを対象に、保持期間・削除条件・削除対象外の扱いを設計として明文化するとき。
- 要求/ADR変更により、保持方針や削除運用（実行タイミング、監査観点、再実行時の扱い）を見直すとき。

## このスキルを使わない条件
- 収集対象要件や受入条件の定義だけを更新する場合（`RQ-*` を使う）。
- 実装コードやジョブ詳細手順、障害対応手順そのものを主対象にする場合（`DD-*` / `IT-*` / `AT-*` を使う）。
- API仕様やUI仕様など、保持・削除方針を主題としない文書更新。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 保持対象データ、保持期間、削除条件、例外時の扱い、監査可能性、関連リンク。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- 出力は `BD-RET-*` 1ファイルを対象とし、`filename == id` と Frontmatter必須キーを満たす。
- 本文は少なくとも「保持対象/保持期間/削除条件/例外時の扱い/変更履歴」を含み、公開YouTubeアーカイブ前提に矛盾しない。
- `up/related` で根拠要求（`RQ-*`）と関連設計（`BD-*` / `DD-*`）へ辿れ、保持・削除方針の理由を追跡できる。

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
