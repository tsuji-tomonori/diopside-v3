---
name: doc-dd-cost
description: DD-COST（コスト運用詳細）文書を新規作成・改訂するときに、月額上限・超過予兆・抑制手順をdiopside規約準拠で整備する
metadata:
  short-description: DD-COST 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `DD-COST-*` を新規作成・改訂し、コスト運用詳細を定義するとき。
- `[[RQ-COST-001]]` や `[[RQ-PC-006]]` の変更を受けて、閾値・抑制方針・運用手順を更新するとき。
- コスト超過予兆の検知条件や、運用記録（`[[AT-OPS-001]]`）への反映方法を具体化するとき。

## このスキルを使わない条件
- `DD-COST-*` 以外（例: `DD-PERF-*` / `DD-SEC-*`）を主対象に更新するとき。
- 要求定義（`RQ-*`）のみの追加・改訂で、詳細設計の変更がないとき。
- 実装コードや運用手順書のみを更新し、DD文書を変更しないとき。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 月額上限値、予兆しきい値、抑制施策の適用期限など、コスト制御条件を判定可能な形で明記する。
- 抑制施策（例: 収集頻度・キャッシュ期間・保持期間の見直し）の適用順序と例外条件を明記する。
- `[[RQ-COST-001]]` / `[[RQ-PC-006]]` / `[[AT-OPS-001]]` との整合が追える関連リンク。
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
- 出力は `DD-COST-*` 本文の更新結果（Frontmatter必須キー充足、本文差分、`## 変更履歴` 追記）であること。
- 出力文書だけで、コスト上限超過時の判定条件・実施手順・記録先が追跡できること。
- 影響文書を更新した場合は、`up/related` で追跡可能なリンク整合を維持すること。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
