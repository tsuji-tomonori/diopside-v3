# OpenCode実行指示書（DDD全量対応 / 2026-02-14）

## 実行目的
`reports/ddd-parallel-prompts-2026-02-14.md` の定義に従い、DDD全量対応（S1〜S8、T1〜T11）を実施する。

## 正本ドキュメント
- `reports/ddd-parallel-prompts-2026-02-14.md`
- `reports/ddd-execution-plan-2026-02-14.md`
- `reports/ddd-review-report.html`
- `reports/ddd-strategy-report.html`

## 実行方針
- 5並列（Worker 1〜5）で作業し、最後に Integrator が統合する。
- 各Workerは担当ファイル以外を編集しない。
- 規約（AGENTS.md）を厳守する。
  - 1トピック=1ファイル
  - ファイル名=ドキュメントID
  - frontmatter必須キー維持
  - 意味変更時 version PATCH更新、updated当日更新
  - 変更履歴にRDR/ADRリンクを付与

## 実行手順
1. Worker 1〜5 を同時実行
2. 各Workerは完了時に以下を報告
   - 変更ファイル一覧
   - 実施内容
   - 未解決事項
3. Integrator が全差分を統合
4. 最終検証を実施
   - `task docs:guard`
   - 必要に応じて `task docs:check`
5. 完了判定を記録
   - `reports/ddd-execution-plan-2026-02-14.md` の進捗反映
   - `reports/impact_check_2026-02-14.md` 更新

## 完了条件
- S1〜S8 / T1〜T11 の状態が追跡可能
- 重大なリンク不整合なし
- docs:guard 成功
- 変更判断の根拠が RDR/ADR に記録済み

## 出力フォーマット（最終報告）
- 完了/未完了一覧（S1〜S8, T1〜T11）
- 変更ファイル一覧
- 検証コマンド実行結果要約
- 残課題と次アクション
