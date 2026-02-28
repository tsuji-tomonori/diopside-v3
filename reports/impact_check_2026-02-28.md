## 実施内容（UTペアワイズ因子定義と生成手順の追加）
- 対象: `docs/4.単体テスト(UT)` と `scripts/pairwise`、`Taskfile.yaml`。
- 変更内容:
  - 新規 `UT-PW-001` を追加し、単体テストにおけるペアワイズ因子設計ルールと運用手順を定義。
  - 新規 `UT-PW-FE-*`（9件）と `UT-PW-BE-*`（13件）を追加し、画面/バックエンドごとの因子定義を分割。
  - 新規 `scripts/pairwise/generate_pairwise_md.py` を追加し、`UT-PW-*` から `UT-CASE-*-PW.md` を自動生成可能化。
  - `Taskfile.yaml` に `docs:ut:pairwise:generate` / `docs:ut:pairwise:check` を追加。
  - `UT-PLAN-001` / `UT-PLAN-004` / `UT-PLAN-005` を更新し、UT-PW運用への接続を追加。

## 影響確認
- 要求・設計トレーサビリティ:
  - FE因子定義は `[[BD-APP-UI-001]]` および `[[DD-APP-UI-*]]` / `[[DD-APP-API-*]]` へ接続。
  - BE因子定義は `[[DD-APP-API-002]]`〜`[[DD-APP-API-015]]` へ接続。
- 運用影響:
  - 既存UTケースを即時置換せず、`UT-CASE-*-PW.md` を段階導入可能。
  - 生成物の更新漏れは `task docs:ut:pairwise:check` で検知可能。

## 更新文書
- 新規: `UT-PW-001`
- 新規（FE）: `UT-PW-FE-UI-U01`, `UT-PW-FE-UI-U02`, `UT-PW-FE-UI-U03`, `UT-PW-FE-UI-A01`, `UT-PW-FE-UI-A02`, `UT-PW-FE-UI-A03`, `UT-PW-FE-UI-A04`, `UT-PW-FE-UI-A05`, `UT-PW-FE-UI-A06`
- 新規（BE）: `UT-PW-BE-DD-APP-API-002`, `UT-PW-BE-DD-APP-API-003`, `UT-PW-BE-DD-APP-API-004`, `UT-PW-BE-DD-APP-API-005`, `UT-PW-BE-DD-APP-API-006`, `UT-PW-BE-DD-APP-API-007`, `UT-PW-BE-DD-APP-API-008`, `UT-PW-BE-DD-APP-API-009`, `UT-PW-BE-DD-APP-API-011`, `UT-PW-BE-DD-APP-API-012`, `UT-PW-BE-DD-APP-API-013`, `UT-PW-BE-DD-APP-API-014`, `UT-PW-BE-DD-APP-API-015`
- 更新: `UT-PLAN-001`, `UT-PLAN-004`, `UT-PLAN-005`, `Taskfile.yaml`
- 新規スクリプト: `scripts/pairwise/generate_pairwise_md.py`

## 検証
- `task docs:ut:pairwise:generate`
- `task docs:guard`

## 追加実施（PW因子日本語化・章順変更・スキル追加）
- 対象: `docs/4.単体テスト(UT)` と `.opencode/skills`。
- 変更内容:
  - `33.ペアワイズ(PW)` を `12.ペアワイズ(PW)` へ改番し、章順を `PW -> CASE` に調整。
  - `UT-PW-*` の `factors` / `excludes` の因子名を日本語へ統一。
  - `scripts/pairwise/generate_pairwise_md.py` の参照パスを `12.ペアワイズ(PW)` に追従。
  - 新規スキル `doc-ut-pw`（`SKILL.md` / `TEMPLATE.md`）を追加。

## 追加影響確認
- 生成整合:
  - `task docs:ut:pairwise:generate` で22モデルから `UT-CASE-*-PW.md` を再生成。
  - `task docs:ut:pairwise:check` で生成差分漏れなしを確認。
- 文書整合:
  - `task docs:guard` 実行結果で `issues: 0`, `broken_links: 0` を維持。

## 追加実施（UT 41以降の分割と品質集約自動生成）
- 対象: `docs/4.単体テスト(UT)/41.*`、`42.*`、`43.*`、`scripts/ut_quality`、`Taskfile.yaml`。
- 変更内容:
  - `UT-COV` を領域別へ分割（`UT-COV-002`〜`UT-COV-005`: DOC/INF/FE/BE）。
  - `UT-STAT` をツール別へ分割（`UT-STAT-002`〜`UT-STAT-008`）し、設定/対象/コマンド/失敗条件を明文化。
  - `UT-STAT-001`、`UT-COV-001`、`UT-MET-001` を集約ファイルとして自動生成化。
  - 新規 `scripts/ut_quality/generate_quality_md.py` を追加し、`UT-STAT-00x` / `UT-COV-00x` から表を生成。
  - `Taskfile.yaml` に `docs:ut:quality:generate` / `docs:ut:quality:check` を追加。
  - `UT-PLAN-001` に品質集約生成タスク運用を追記。

## 追加影響確認（UT品質集約）
- トレーサビリティ:
  - `UT-MET-001` は `UT-STAT-00x` と `UT-COV-00x` を入力とする集約文書に変更。
  - 領域別（DOC/INF/FE/BE）で静的解析とカバレッジ指標を追跡可能。
- 運用影響:
  - 閾値や対象変更はソース文書（`UT-STAT-00x` / `UT-COV-00x`）のみ更新すれば反映可能。
  - 集約文書の手編集は禁止し、`task docs:ut:quality:check` で更新漏れを検知可能。

## 追加実施（ITをUC基準へ再編、IT-PWを9本化）
- 対象: `docs/5.結合テスト(IT)` と `.opencode/skills/doc-it-case`。
- 変更内容:
  - `IT-PLAN-001` を更新し、結合テスト仕様を「UC基準 + FR因子化 + PW参照」へ変更。
  - `IT-CASE-001` から `IT-CASE-013` をUC基準フォーマットへ再編（対象UC、契約化受入条件、FR因子、ケース一覧を追加）。
  - 新規 `IT-PW-001` と `IT-PW-UC-001` から `IT-PW-UC-009` を追加し、UC001-009を対象にPWモデルを定義。
  - `RQ-UC-010` から `RQ-UC-013` は IT-PW 対象外として明示（INFIT/AT運用系で扱う）。
  - `doc-it-case` スキルの `SKILL.md` / `TEMPLATE.md` をUC基準フォーマットへ同期更新。

## 追加影響確認（IT UC基準化）
- トレーサビリティ:
  - `IT-PLAN-001` へ UC と IT-CASE の対応表を追加し、`RQ-UC-001` から `RQ-UC-009` の接続を可視化。
  - 各 `IT-CASE-*` は対応 `IT-PW-UC-*` へのリンクを保持し、因子根拠を明示。
- 運用影響:
  - ITケース設計時は API中心ではなく UC中心で設計する運用へ変更。
  - IT-PWの本数は 9本（UC001-009）を標準とし、CI/CD系UCはIT-PW対象外とする。

## 追加検証
- `task docs:guard`
- `task docs:trace`

## 追加実施（IT-PW向けスキル追加）
- 対象: `.opencode/skills/doc-it-pw`。
- 変更内容:
  - 新規 `doc-it-pw/SKILL.md` を追加し、IT-PW（UC基準）文書の適用範囲、因子設計ルール、品質チェックを定義。
  - 新規 `doc-it-pw/TEMPLATE.md` を追加し、UC・ケース・因子・除外条件の必須観点を明示。

## 追加影響確認（スキル運用）
- `doc-it-pw` により、`docs/5.結合テスト(IT)/12.ペアワイズ(PW)` の更新手順を独立運用できる。
- `doc-it-case` / `doc-it-plan` と責務分離され、UC基準IT設計の変更影響を管理しやすくなる。
