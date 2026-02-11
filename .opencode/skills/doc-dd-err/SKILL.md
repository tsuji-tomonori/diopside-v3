---
name: doc-dd-err
description: DD-ERR（エラーコード詳細設計）文書を新規作成・改訂するときに、エラー分類・通知方針・復旧導線をdiopside規約準拠で整備する
metadata:
  short-description: DD-ERR 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使うとき
- `DD-ERR-*` の新規作成・改訂で、エラーコード体系、発生条件、利用者/運用者向けの対応方針を定義または変更するとき。
- API/バッチ/運用導線で発生する異常系の扱いを、要求・設計文書へトレース可能な形で整理したいとき。

## このスキルを使わないとき
- APIの正常系I/Fやスキーマ定義が主題の更新をするとき（`doc-dd-api` を使う）。
- 障害時の運用手順や初動フローが主題の更新をするとき（`doc-at-run` を使う）。

## 出力契約
- 対象 `DD-ERR-*` 文書が、必須frontmatter・`filename == id`・`up/related` 整合を満たして更新されていること。
- 本文に、少なくともエラー分類、発生条件、通知/表示方針、復旧または再試行方針が明示されていること。
- 意味変更時は `version` PATCH更新、`updated` 当日更新、`## 変更履歴` の当日追記が反映されていること。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- エラーコードごとの発生条件、検知方法、利用者向け表示/返却方針、運用者向け対応方針。
- 関連する要求・設計・テスト文書へのリンク（`up/related` と本文の整合）。
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
- エラーコードの粒度と命名が一貫し、同一原因に重複コードが乱立していないことを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
