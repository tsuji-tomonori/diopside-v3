---
description: 指定した1つのスキルを詳細レビューする
---

次の順で実施する。
1. `python3 .opencode/skills/skill-maintainer/scripts/skills_review.py inspect --name $ARGUMENTS` を実行する。
2. 結果の `frontmatter_issues` / `body_checks` / `review_hints` を根拠に、修正方針を決める。
3. 必要なら対象スキルの `SKILL.md` を更新し、変更理由を短く整理する。
4. 判定後に `/skills-review-log --name <skill-name> --result <pass|revise> --note "..."` で記録する。

対象: $ARGUMENTS
