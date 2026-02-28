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
