## 実施内容（UTペアワイズ生成差分の安定化）
- 対象: `scripts/pairwise/generate_pairwise_md.py`, `Taskfile.yaml`, `docs/4.単体テスト(UT)/21.単体テストケース(CASE)/**/UT-CASE-*-PW.md`。
- 変更内容:
  - `generate_pairwise_md.py` を更新し、既存生成物の `created` / `updated` / `変更履歴` を読み取って、内容変更がない場合は日付だけで差分を出さないよう修正。
  - 内容変更時のみ `updated` と `変更履歴` を当日に進めるようにし、同日再実行でも冪等になるよう調整。
  - `Taskfile.yaml` の `docs:autolink:changed` から `UT-CASE-*-PW.md` を除外し、自動生成物へ用語自動リンクが再注入される循環差分を防止。
  - モデルと生成物が不整合だった `UT-CASE-FE-UI-U03-PW` と `UT-CASE-BE-DD-APP-API-007-PW` を再生成して同期。

## 影響確認
- CI影響:
  - `task docs:ut:pairwise:check` は、モデル未変更時に日付だけで fail しない。
  - `task docs:ut:stat:check` に含まれる pairwise 生成差分チェックの恒常失敗を解消。
- 運用影響:
  - 標準フローの `task docs:guard` 実行後も、`UT-CASE-*-PW.md` が自動リンクで再汚染されず、generator 正本を維持できる。
  - モデル側因子名変更は従来通り生成物差分として検出される。

## 更新文書
- 更新: `scripts/pairwise/generate_pairwise_md.py`
- 更新: `Taskfile.yaml`
- 更新: `UT-CASE-FE-UI-U03-PW`
- 更新: `UT-CASE-BE-DD-APP-API-007-PW`

## 検証
- `task docs:ut:pairwise:check`
- `task docs:guard`
- `task docs:ut:stat:check`
