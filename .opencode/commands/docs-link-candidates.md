---
description: 指定Markdownの未リンク候補を分類付きJSONLで出力する
---

次の順で実施する。
1. 引数で渡された `--doc <path/to/file.md>` を対象にする。
2. `python3 .opencode/skills/obsidian-doc-check/scripts/docs_link_candidates.py $ARGUMENTS` を実行する。
3. 生成されたJSONLを確認し、`status=missing_target` の行はリンク先候補作成を検討する。

引数例:
- `--doc docs/1.要求(RQ)/31.ユースケース(UC)/RQ-UC-008.md --out reports/link_candidates/RQ-UC-008.jsonl`
- `--doc docs/2.基本設計(BD)/02.アプリ(APP)/31.API(API)/BD-APP-API-002.md --docs-root docs --out reports/link_candidates/BD-APP-API-002.jsonl`
