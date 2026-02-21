---
name: doc-rq-prc
description: doc-rq-prc に対応するdiopsideのプライバシー要求（RQ-PRC）文書を規約準拠で作成・更新し、保存対象/除外対象と保持回避条件の整合を確認する。プライバシー要求の追加・変更・レビュー時に使う
metadata:
  short-description: RQ-PRC 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- 公開アーカイブにおける保存対象（メタデータ/非可逆派生物）と、保存禁止対象（コメント本文/チャット本文/個人識別情報）。
- 削除・非公開化の反映期限、検出時の停止/削除フローなどの運用条件。
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
- NFR文書では SnowCard の `要求` / `受入基準` / `例外/エラー` を「〜できる」基調で記述し、1項目1判定に分解する。
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- 保存禁止対象の恒久保持件数を 0件 とする受入基準が明記されていることを確認する。
- 派生物を許容する場合は、非可逆性と中間データ破棄条件が受入基準に含まれていることを確認する。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 使う条件
- RQ-PRC文書を新規作成・更新・レビューし、収集/保持できるデータ範囲を定義または変更するとき。
- プライバシー制約の変更に伴い、RDR・セキュリティ設計・運用受入文書との整合を同一変更で確認するとき。

## 使わない条件
- プライバシー要求の意味変更がなく、文言整形や表記修正だけを行うとき。
- FR/DD/UT/IT/ATのみを更新し、保存対象/除外対象の判断を伴わないとき。

## 出力
- 対象RQ-PRC文書の更新内容（保存対象、保存禁止対象、保持回避条件、削除反映条件）。
- 関連文書（RDR/BD-SEC/AT-OPS など）との整合確認結果と、同時更新があればその要点。
