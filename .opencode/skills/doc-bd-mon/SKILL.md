---
name: doc-bd-mon
description: BD-MON（監視設計）文書を追加・改訂する際に、監視対象・SLI/SLO・アラート/再実行導線をdiopside規約準拠で整備する
metadata:
  short-description: BD-MON 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `BD-MON-*`（監視設計）文書を新規作成・更新する。
- 収集/正規化/索引生成/配信の監視対象、SLI/SLO、しきい値アラートを受入可能な形で定義する。

## このスキルを使わない条件
- 障害時の初動手順や復旧フローを主対象にする場合（`AT-RUN-*` を使う）。
- 実装コード単位の監視ライブラリ設定や関数仕様を主対象にする場合（`DD-CODE-*` / `DD-LOG-*` を使う）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- 監視対象ごとのSLI定義（計測指標/収集粒度/測定区間）とSLO目標値。
- 検知条件（しきい値/連続失敗回数）と通知先、`[[RQ-GL-011]]` 再収集導線との接続条件。
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
- SLI/SLOを記載した場合、数値目標と測定区間（例: 7日/30日）が明記されていることを確認する。
- アラートを記載した場合、通知経路と再実行判断条件が本文内で追跡可能であることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 出力契約
- 出力は `BD-MON-*` 1ファイルのみを対象とし、1トピック原則を守る。
- Frontmatter必須キーを完備し、`phase: BD`・`owner: RQ-SH-*`・`updated` 当日を満たす。
- 本文は「監視対象/SLI-SLO/アラートと再収集導線」の3点を含み、運用判断に必要な数値条件とリンクが追跡可能である。
