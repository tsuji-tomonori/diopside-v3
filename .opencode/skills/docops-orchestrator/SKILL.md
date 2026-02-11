---
name: docops-orchestrator
description: diopside文書を変更するときに、影響分析・関連更新・整合チェックまで一気通貫で実行する
metadata:
  short-description: 変更→影響確認→更新→検証
---

## 目的
- 依頼を起点に docs 全体の整合を崩さず更新する。

## このスキルを使うとき
- `docs/**` と `.opencode/skills/**` にまたがる文書変更を、影響確認から検証まで一連で実施するとき。
- FR配置・RDR/ADR同時更新・影響確認レポート更新を、同一変更で取りこぼしなく実施したいとき。

## このスキルを使わないとき
- 単一文書の軽微な誤字修正など、`up/related` 追跡やチェックレポート更新が不要なとき。
- スキル本文の品質監査のみを行い、docs本体の更新や検証実行を伴わないとき。

## 実行フロー
1. 対象文書IDを特定する。
2. 対応 `doc-*` スキルを特定し更新する。
3. 要求変更なら RDR、設計変更なら ADR を同一変更で更新する。
4. 規約変更時は `skill-maintainer` / `docops-orchestrator` / `obsidian-doc-*` を同一変更で更新する。
5. `up/related` を辿って上位・下位文書を更新または影響確認記録を作成する。
6. FR（`docs/1.要求(RQ)/51.機能要求(FR)`）を変更する場合は、機能単位カテゴリ（ING/SCH/TAG/LST/DET/HLW/WCL/OPS）で配置する。
7. FRの生成系要求は独立カテゴリ化せず、利用者機能カテゴリへ配置する。
8. FR配置の判断が分かれる場合は RDR に配置理由を同一変更で記録する。
9. `reports/impact_check_YYYY-MM-DD.md` を更新する。
10. `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス...>` を実行して本文用語をWikiリンク化する。
11. `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md --targets <対象Markdownパス...>` を実行して `reports/doc_check.md` を更新する。
12. 用語文書（`RQ-GL-*`）を変更した場合は、`term_en`（ASCII `snake_case`）と本文英名併記（`英名: \`term_en\``）を確認する。
13. 本文中の文書ID参照（`RQ-DM-*`, `DD-API-*` など）がObsidianリンク（`[[ID]]`）で記述されていることを確認する。
14. `issues` / `nonlinked_doc_ids` / `broken_links` / `backlink_issues` のいずれかが 1 件でもあれば fail とし、修正が完了するまで次工程へ進まない。
15. スキル更新を伴う変更では、`docs` と `.opencode/skills` が同一変更で更新されていることを確認する。

## 出力契約
- 変更済み docs
- 影響確認レポート
- doc_check レポート
