---
description: スキルを1件ずつ検査・修正し、5並列で一括処理する
---

次の順で実施する。
1. `--only` / `--prefix` 指定時は対象スキル名を先に確認し、意図しない一括修正を避ける。
2. `python3 .opencode/skills/skill-maintainer/scripts/skills_batch_review_fix.py --workers 5 --timeout-sec 900 $ARGUMENTS` を実行する（内部で各スキルごとに `opencode run --command skills-review-fix-one` を呼ぶ）。
3. エラーが出た場合は全体再実行せず、`--only <skill-name>` で失敗対象のみ再実行する。
4. 出力されたレポート（`reports/skills_batch_fix_*.md`）を確認する。
5. 必要なら `/skills-review-next` で個別の再レビューに進む。

引数例:
- `--dry-run`
- `--prefix doc-rq-`
- `--only obsidian-doc-new obsidian-doc-check`
- `--timeout-sec 900`
- `--max-changed-lines 80`
