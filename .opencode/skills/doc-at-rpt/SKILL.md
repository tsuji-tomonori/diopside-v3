---
name: doc-at-rpt
description: AT-RPT（受入テスト報告）を作成・更新するときに、シナリオ/API単位の実行結果とGo/No-Go判定入力をdiopside規約準拠で整備する
metadata:
  short-description: AT-RPT 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `docs/6.受入テスト(AT)/61.受入テスト報告/AT-RPT-*.md` を作成・更新するとき。
- `AT-SCN-*` 実行結果をシナリオ単位で集約し、`AT-GO-*` の判定入力として記録を確定するとき。
- API単位の逆引き判定（`DD-API-*` <- `AT-SCN-*`）を報告へ追記・更新するとき。

## このスキルを使わない条件
- 受入計画（範囲/体制/判定基準）を定義・改訂するだけの場合（`doc-at-plan` を使う）。
- 個別シナリオ手順や期待結果を定義する場合（`doc-at-scn` を使う）。
- リリースの最終Go/No-Go判定文書のみを更新する場合（`doc-at-go` を使う）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- シナリオ結果サマリ（少なくともシナリオID/判定/実行日/実行者/備考）。
- API逆引きサマリ（`DD-API-*` と対応 `AT-SCN-*` の追跡関係）。
- API単位判定記録（判定/失敗時の事象ID/対応方針）と、必要な再実行・改善アクション。
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
- `AT-SCN-*` の結果が `AT-RPT-*` に集約され、`AT-GO-*` から追跡できることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 出力契約
- 出力は `AT-RPT-*` 1ファイルのみを対象とし、1トピック原則を守る。
- Frontmatter必須キーを完備し、`phase: AT`・`owner: RQ-SH-*`・`updated` 当日を満たす。
- 本文は「シナリオ結果サマリ」「API逆引きサマリ」「API単位判定記録」「変更履歴」を含み、`AT-SCN-*`/`DD-API-*`/`AT-GO-*` とのリンク整合を満たす。
