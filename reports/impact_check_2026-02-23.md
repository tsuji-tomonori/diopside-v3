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

## 追加同期（workflow実装との差分反映）
- 対象: `.github/workflows/opencode-codex-issue.yml` と設計本文の整合。
- 同期内容:
  - DD/BD/ATの記載を `opencode-issue.yml` から `opencode-codex-issue.yml` へ名称統一。
  - トリガーを `issues:labeled`（主）+ `issues:assigned`（補助）で明確化。
  - `plan -> build` 二段階、IssueコメントPATCH更新、workflow改変ブロック（`.github/workflows/` 差分Fail）を設計へ追記。
  - `OPENCODE_ALLOWED_ACTORS` / `OPENCODE_TRIGGER_LABEL` / `OPENCODE_ASSIGNEE` の変数化運用を設計へ追記。

## 実施内容（方式A: 憲法ページ埋め込み集約）
- 対象: `docs/index.md` のホーム導線と、既存正本を集約する新規文書 `RQ-PP-002`。
- 変更内容:
  - `RQ-PP-002` を新規作成し、`RQ-PP-001` / `RQ-SC-001` / `BD-SYS-ARCH-001` / `AT-GO-001` / `RQ-RTM-001` / `RQ-RTM-002` の見出しを `![[...#...]]` で埋め込み集約。
  - `docs/index.md` に折りたたみcalloutで `![[RQ-PP-002]]` を配置し、ホームから機械的集約ビューを参照可能化。
  - `docs/index.md` の `related` / `入口` / `更新日` / `変更履歴` を整合更新。

## 影響確認（方式A）
- 憲法本文の正本は既存文書側に保持され、ホームは埋め込み参照のみのため重複記述を回避できる。
- 既存の推奨読書順・入口導線を壊さず、折りたたみ展開で閲覧負荷を抑制できる。
- RQ文書として新規追加した `RQ-PP-002` は frontmatter 必須キーと変更履歴（RDRリンク付き）を満たす。

## 更新文書（方式A）
- RQ: `docs/1.要求(RQ)/01.プロジェクトの目的(PP)/RQ-PP-002.md`
- HM: `docs/index.md`

## 実施内容（OpenCode OAuthシークレット運用分離）
- 対象: OpenCode Issue Runnerで使用する `~/.opencode/auth/openai.json` の登録運用。
- 変更内容:
  - 配信手順書を分離し、Environment `opencode` の Secret `OPENCODE_OPENAI_OAUTH_JSON_B64` 登録/更新手順を新規作成。
  - 既存の `AT-REL-001` は概要導線へ縮約し、詳細を `AT-REL-002` へ参照委譲。
  - 詳細設計 `DD-INF-DEP-001` の設定表を Environment Secret運用へ更新。
  - 実装workflow `opencode-codex-issue.yml` に `environment: opencode` を追加し、文書と実装を同期。

## 更新文書（OpenCode OAuthシークレット運用分離）
- AT: `AT-REL-001`, `AT-REL-002`
- DD: `DD-INF-DEP-001`
- Workflow: `.github/workflows/opencode-codex-issue.yml`

## 実施内容（BD章再編・品質特性分割）
- 対象: `docs/2.基本設計(BD)` の章構成および SYS/APP/INF の正本配置。
- 変更内容:
  - `01.設計判断(ADR)` をトップレベルへ昇格し、`02.全体構成(SYS)` の直下を `11.アーキテクチャ概要(ARCH)` のみに整理。
  - ドメイン境界 `BD-SYS-DOM-001` を ARCH 配下へ移設し、全体構成直下の `13/21/22` を廃止。
  - `BD-SYS-QUAL-001` を廃止し、`BD-APP-QUAL-001` / `BD-INF-QUAL-001` を新規作成して品質特性を分割。
  - 統合済み `BD-SYS-SEC-001` を削除し、参照を `BD-INF-SEC-001` へ統一。
  - ADR `BD-SYS-ADR-040` を追加し、章再編と正本分割の判断根拠を記録。

## 影響確認（BD章再編・品質特性分割）
- BDトップレベル章番号を `01:設計判断 / 02:全体構成 / 03:アプリ / 04:インフラ / 05:開発` へ順繰りに再編し、依頼条件を満たす。
- SYS直下をARCH単独へ整理し、DOMはSYS内（ARCH配下）に維持したため、構成方針の一貫性を確保。
- RTM/RDR/DD/ADR の旧参照（`BD-SYS-QUAL-001`, `BD-SYS-SEC-001`）を置換し、削除後のリンク切れを回避。
