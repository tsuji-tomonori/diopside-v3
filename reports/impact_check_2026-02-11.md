# 影響確認レポート

- 日付: 2026-02-11
- 対象: `docs/1.要求(RQ)/61.非機能要求(NFR)` 配下10文書、`RQ-RDR-017`
- 判定: NFRテンプレート文をカテゴリ別・数値閾値付きの要求へ具体化。

## 実施内容
- `RQ-AV-001`〜`RQ-DATA-001` の SnowCard を個別化し、受入基準へ測定可能な閾値を追加。
- 各NFRの `related` を設計/運用文書に合わせて見直し、一律参照を解消。
- 意味変更の決定記録として `RQ-RDR-017` を新規追加。

## 影響確認
- 要求整合: `[[RQ-SC-001]]` のMVP完了条件（NFR受入確認）に対して、判定可能な閾値が定義された。
- 設計整合: `[[BD-QUAL-001]]` / `[[BD-SEC-001]]` / `[[DD-AV-001]]` / `[[DD-PERF-001]]` / `[[DD-LOG-001]]` / `[[DD-COST-001]]` へのトレースを付与。
- 受入整合: `[[AT-PLAN-001]]` / `[[AT-RPT-001]]` / `[[AT-GO-001]]` で閾値判定結果を記録できる構成を維持。

## 検証
- `python3 .codex/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し、リンク/整合性に問題がないことを確認。
