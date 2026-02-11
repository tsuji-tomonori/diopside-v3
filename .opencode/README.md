# OpenCode A11y Pack

このディレクトリは、WCAG 2.2 AA 相当の運用を OpenCode で使うための移植版です。

- Agents: `.opencode/agents/*.md`
- Skills: `.opencode/skills/<name>/SKILL.md`
- Commands: `.opencode/commands/*.md`

運用メモ:
- OpenCode は Agent Teams の公式機能が弱いため、`@agent` 呼び出しと `/command` を組み合わせて運用します。
- ルールはリポジトリ直下 `AGENTS.md` を正本として扱います。
