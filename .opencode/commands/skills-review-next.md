---
description: スキル見直し対象を1件選び、レビュー観点を提示する
---

次の順で実施する。
1. `python3 .opencode/skills/skill-maintainer/scripts/skills_review.py next $ARGUMENTS` を実行し、次に見るスキルを1件選ぶ。
2. 表示された `SKILL.md` を読み、descriptionの発見性（What + When）と誤用防止（使う/使わない条件）を確認する。
3. 続けて `/skills-review-one <skill-name>` を実行して詳細レビューする。

引数例:
- `--prefix doc-rq-`
