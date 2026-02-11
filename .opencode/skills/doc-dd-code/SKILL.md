---
name: doc-dd-code
description: DD-CODE（コーディング規約/実装規則）文書を新規作成・改訂するときに、diopside規約準拠で作成・更新する
metadata:
  short-description: DD-CODE 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- DDフェーズのコーディング規約・実装規則（命名、責務分割、例外処理、ログ方針、型/非同期の扱い）を新規作成・改訂するとき。
- BD-ARCH/BD-APIや要求変更を受けて、実装時の統一ルールを明文化・更新する必要があるとき。

## このスキルを使わない条件
- 要求定義（RQ-*）や基本設計（BD-*）の方針だけを更新し、実装規則を扱わない作業。
- API詳細（DD-API）やUI詳細（DD-UI）など、特定領域の詳細仕様を主題とする文書更新。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 実装ルール（命名規約、レイヤ責務、エラーハンドリング、ログ粒度、テスト容易性、禁止事項）と適用範囲。
- 防御的型付けルール（Brand/Opaque、判別可能union、境界decode、センチネル値禁止、`as any` 局所化、資源解放保証）。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- 対象文書は `filename == id` を満たし、Frontmatter必須キーを欠落なく保持する。
- 実装者が判断に迷わない粒度で、適用対象・禁止事項・例外条件を読み取れる状態にする。
- 変更理由と影響範囲を `up/related` で追跡可能にし、関連するBD/DD文書と整合した状態にする。

## Frontmatter運用
- `phase` は ID prefix と一致させる。
- `owner` は `RQ-SH-*` を使う。
- 意味変更時は `version` をPATCH更新する。
- `updated` は作業日へ更新する。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- 境界入力（API/DB/env/query/localStorage）を `unknown` 起点で受け、1回の decode/validate 後に内部型へ渡す方針を明記する。
- 裸ID（`string`/`number`）の混在回避、`boolean` 状態のunion化、`Option/Result` 相当の失敗表現を確認する。
- 非空前提処理（`head`/`mean` 相当）がある場合、`NonEmptyArray` 相当または事前検証を必須とする。
- `as any` をドメイン層へ持ち込まないルールと、例外時の根拠記録方法を定義する。
- 明示解放が必要な資源で `using` または `try/finally` を使う規約を含める。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。
