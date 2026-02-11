---
description: 1件レビューした結果を状態ファイルへ記録する
---

次の順で実施する。
1. `python3 .opencode/skills/skill-maintainer/scripts/skills_review.py log $ARGUMENTS` を実行する。
2. `reports/skills_review_state.json` と `reports/skills_review_notes.md` が更新されたことを確認する。
3. 次のレビュー対象を `/skills-review-next` で取得する。

引数例:
- `--name doc-rq-fr --result revise --note "descriptionにWhen条件を追加する"`
- `--name a11y-keyboard-focus --result pass --note "境界条件と出力が明確"`
