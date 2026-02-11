---
name: doc-dd-scale
description: DD-SCALE（スケーラビリティ詳細設計）文書を新規作成・改訂するときに、負荷想定・拡張戦略・縮退条件をdiopside規約準拠で整備する
metadata:
  short-description: DD-SCALE 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `DD-SCALE-*` を新規作成・改訂し、想定負荷に対する拡張方針（水平/垂直、段階拡張）を定義するとき。
- ピークアクセス、再実行集中、取り込みバーストに対する閾値・トリガー・制御手順を設計文書へ反映するとき。
- スケール時の依存先制約（外部API上限、DB接続上限、キュー滞留）を明文化し、回復導線を定義するとき。

## このスキルを使わない条件
- `DD-SCALE-*` 以外（例: `DD-PERF-*` / `DD-AV-*`）を主対象に更新するとき。
- 要求定義（`RQ-*`）のみの追加・改訂で、詳細設計の変更がないとき。
- 単発の性能測定結果の記録だけを更新し、拡張戦略や運用条件を変更しないとき。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 想定負荷プロファイル（通常/ピーク/障害復旧時）と、各状態での処理量・同時実行数・許容遅延。
- スケールアウト/スケールアップの発火条件、実施順序、ロールバック条件。
- ボトルネック発生時の縮退方針（機能制限、再試行制御、キュー排出制御）と解除条件。
- 関連要求・関連設計・運用手順へ辿れる関連リンク。
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

## 出力契約
- 出力は `DD-SCALE-*` 本文の更新結果（Frontmatter必須キー充足、本文差分、`## 変更履歴` 追記）であること。
- 出力文書だけで、負荷想定・拡張トリガー・実行手順・縮退/回復条件が追跡できること。
- 影響文書を更新した場合は、`up/related` で追跡可能なリンク整合を維持すること。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
