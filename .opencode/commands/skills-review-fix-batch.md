---
description: スキルを1件ずつ検査・修正し、5並列で一括処理する
---

次の順で実施する。
1. `python3 .opencode/skills/skill-maintainer/scripts/skills_batch_review_fix.py --workers 5 $ARGUMENTS` を実行する（内部で各スキルごとに `opencode run --command skills-review-fix-one` を呼ぶ）。
2. 出力されたレポート（`reports/skills_batch_fix_*.md`）を確認する。
3. 必要なら `/skills-review-next` で個別の再レビューに進む。

引数例:
- `--dry-run`
- `--prefix doc-rq-`
- `--only obsidian-doc-new obsidian-doc-check`
- `--max-changed-lines 80`
