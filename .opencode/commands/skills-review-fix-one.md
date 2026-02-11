---
description: 指定した1つのスキルを文脈に沿ってレビューし、必要最小限で修正する
---

次の順で実施する。
1. 引数 `--name <skill-name>` から対象を特定し、`.opencode/skills/<skill-name>/SKILL.md` を読む。
2. 次の観点でレビューする（機械的な定型追記は禁止）。
   - frontmatter: `name/description` の妥当性（特に description は What + When）
   - 本文: 使う条件/使わない条件/出力契約が、そのスキル固有の内容として成立しているか
   - 冗長性: 既存の高品質記述を汎用文で上書きしないこと
3. `--dry-run` が引数に含まれる場合は、修正せずレビュー結果のみ返す。
4. `--dry-run` がない場合のみ、必要な場合に対象 `SKILL.md` を最小差分で修正する。
   - 既存の専門的な説明を優先し、汎用テンプレ文へ置換しない
   - 追記はスキル固有の文脈を明示できる場合に限る
5. 出力は以下を簡潔に返す。
   - `skill`, `path`, `changed(yes/no)`
   - 変更した場合は理由を 1-3 点

引数例:
- `--name doc-rq-fr`
- `--name obsidian-doc-check --dry-run`
