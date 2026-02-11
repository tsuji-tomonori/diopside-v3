---
name: doc-dd-sec
description: DD-SEC（セキュリティ詳細設計）文書を新規作成・改訂するときに、認証/認可・入力検証・秘密情報保護・監査ログの実装方針をdiopside規約準拠で作成・更新する
metadata:
  short-description: DD-SEC 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- DDフェーズでセキュリティ詳細設計（認証/認可の適用点、入力検証、秘密情報保護、監査ログ/検知）を新規作成・改訂するとき。
- 要求（`RQ-*`）や基本設計（`BD-SEC-*` / `BD-API-*`）を受けて、実装レベルの防御制御と失敗時の挙動を具体化するとき。

## このスキルを使わない条件
- セキュリティ方針や脅威境界を基本設計レベルで整理するだけの作業（`doc-bd-sec` を使う）。
- API仕様詳細やDB移行手順など、セキュリティ詳細設計を主題としない文書更新。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 認証/認可の判定点、入力検証・サニタイズ規則、秘密情報の保管/参照制約、監査ログと検知・遮断条件。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## 出力契約
- 対象文書は `filename == id` とFrontmatter必須キーを満たし、`phase: DD` のセキュリティ詳細として追跡可能であること。
- `up/related` で少なくとも `RQ-*` と関連設計（`BD-SEC-*` / `BD-API-*` / 関連 `DD-*`）へ辿れること。
- セキュリティ制御の適用条件と失敗時挙動（拒否・記録・通知・復旧）が本文で曖昧なく記述されていること。

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
