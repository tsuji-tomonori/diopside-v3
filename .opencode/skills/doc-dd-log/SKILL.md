---
name: doc-dd-log
description: DD-LOG（ログ詳細設計）文書を新規作成・改訂するときに、diopside規約準拠で作成・更新する
metadata:
  short-description: DD-LOG 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- DDフェーズで、アプリ/バッチ/APIのログ出力仕様（出力タイミング、レベル、項目、相関ID、マスキング方針）を新規作成・改訂するとき。
- 障害調査や運用監視の観点から、どの操作・失敗をどの粒度で記録するかを具体化するとき。

## このスキルを使わない条件
- 監視指標やSLO/アラート設計（BD-MON）を主題にした更新。
- API契約やDB制約など、ログ仕様以外の詳細設計を主題にした更新。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- ログイベントごとの出力条件、レベル、必須項目（例: timestamp/request_id/job_id）、機微情報の除外・マスキング条件。
- 障害時に必要な追跡情報（失敗理由、再実行判断に必要な識別子、関連処理との突合キー）。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- 対象文書は `filename == id` を満たし、Frontmatter必須キーを欠落なく保持する。
- ログ詳細設計として、出力条件・項目・マスキング方針・追跡キーが読み手に再現可能な粒度で記述されている。
- `up/related` で要求/設計とのトレーサビリティを維持し、変更理由を辿れる状態にする。

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
