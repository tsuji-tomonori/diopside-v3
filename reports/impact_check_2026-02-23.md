## 実施内容（パターンA: Issueラベル起動のAI実行運用）
- 対象: `OpenCode + Codex OAuth` を `issues:labeled` 起点で運用する文書体系（RQ/BD/DD/AT/RTM）。
- 変更内容:
  - RQ決定記録へ、許可ラベル + 実行者allowlistの二重条件、OAuthトークン一時復元方針を追加。
  - NFRへ、Issueラベル起動時のPR作成条件、証跡要件、最小権限要件、Secrets実行条件、停止条件を追加。
  - BD/ADRへ、Issueラベル専用ワークフロー、`share=false` 既定、OAuthトークンのジョブ内復元方針を追加。
  - DDへ、`opencode-issue.yml` のトリガー/if条件/permissions/secret復元手順/セキュリティ制約を具体化。
  - ATへ、Issueラベル起動の運用手順とGo/No-Go判定入力（issue/actor/label/PR証跡）を追加。
  - RTMを再生成し、要求-設計-運用の追跡経路を更新。

## 影響確認
- 既存の `docs-deploy`（OIDCデプロイ）経路には影響せず、Issueラベル起動ワークフローを別入口として追加した。
- 公開Issue本文を未信頼入力として扱う統制をRQ/BD/DDへ連動反映し、Prompt injection対策の追跡経路を確保した。
- OAuth利用は「ジョブ内復元 + 権限制御 + ログ非出力」に限定し、APIキー常設運用を回避する方針で整合した。
- `RQ-DEV-001-03` の文言不整合（`満たせるできる`）を修正し、判定文の曖昧性を解消した。

## 更新文書
- RQ: `RQ-RDR-029`, `RQ-RDR-050`, `RQ-DEV-001-03`, `RQ-DEV-002-01`, `RQ-DEV-005-01`, `RQ-DEV-007-01`, `RQ-SEC-005-01`, `RQ-SEC-005-03`, `RQ-SEC-005-06`, `RQ-SEC-005-08`, `RQ-UC-010`
- BD: `BD-SYS-ADR-016`, `BD-SYS-ADR-039`, `BD-DEV-PIPE-001`
- DD: `DD-INF-DEP-001`, `DD-INF-SEC-002`
- AT: `AT-REL-001`, `AT-GO-001`
- RTM: `RQ-RTM-001`, `RQ-RTM-002`

## 検証
- `task docs:trace`
- `task docs:guard`
