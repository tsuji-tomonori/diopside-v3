## 実施内容（GitHub ActionsのCI/CD再設計）
- 対象: `.github/workflows/{docs-link-check,ut-static-analysis,api-ci,docs-pdf,production-delivery}.yml`, `Taskfile.yaml`, `infra/lib/quartz-site-stack.ts`。
- 変更内容:
  - 各ブランチ push / Pull Request で安定した必須チェックを返すよう、workflow 名と job 名を `CI Docs` / `ci-docs`、`CI Platform` / `ci-platform`、`CI API` / `ci-api` へ整理し、branch/path 依存の起動制限を外した。
  - `docs:ut:stat:check` に `npm --prefix web run test` を追加し、branch push 時の platform 系品質ゲートへ web test を含めた。
  - docs専用配備 workflow を廃止し、`Production Delivery` を新設した。`main` 反映時に `apply-delivery`（OIDC配備）と `build-docs-pdf`（PDF artifact生成）を同一 workflow で実行する。
  - 手動PDF生成は `Docs PDF Preview` の `workflow_dispatch` 専用へ変更し、branch push では不要な PDF build を走らせない構成へ整理した。
  - Task の標準入口を `task delivery:apply` / `task delivery:apply:ci` へ改称し、`task docs:deploy` / `task docs:deploy:ci` は互換 alias として残した。
  - OIDC の GitHub Environment 名を `delivery-prod` へ変更し、CDK 側の `githubEnvironment` 既定値も同期した。

## 影響確認
- ブランチ保護:
  - `main` の required status checks は `ci-docs` / `ci-platform` / `ci-api` を正本として設計した。
  - `main` 反映は branch protection 経由の merge を前提とし、直接 push を許容しない運用へ整理した。
- Environment / OIDC:
  - GitHub Environment `delivery-prod` を `main` 限定・承認付きの本番配信境界として扱う設計へ更新した。
  - IAM Trust Policy の `sub` は `repo:tsuji-tomonori/diopside-v3:environment:delivery-prod` を正本とした。
- 配信手順:
  - 各ブランチ push で CI を先行実行し、`main` 反映後は `Production Delivery` により本番配備と PDF artifact 生成を自動実行する手順へ更新した。
  - PDF artifact は `diopside-docs-{branch}-{shortsha}.zip` 命名で 90 日保持とした。

## 更新文書
- 要求/決定: `RQ-RDR-025`, `RQ-RDR-050`, `RQ-DEV-001-11`, `RQ-DEV-005-01`, `RQ-DEV-006-01`, `RQ-DEV-006-03`, `RQ-DEV-007-01`, `RQ-RTM-001`, `RQ-RTM-002`
- 基本設計/ADR: `BD-SYS-ADR-013`, `BD-SYS-ADR-038`, `BD-SYS-ADR-039`, `BD-SYS-ARCH-003`, `BD-INF-DEP-003`, `BD-INF-DEP-005`, `BD-DEV-ENV-001`, `BD-DEV-ENV-002`, `BD-DEV-PIPE-001`
- 詳細設計/運用: `DD-INF-DEP-001`, `DD-INF-SEC-002`, `AT-PLAN-001`, `AT-REL-001`, `AT-RUN-001`

## 検証
- `task docs:guard`
  - `reports/doc_check.md`: `issues: 0`, `broken_links: 0`
  - `reports/infra_resource_check.md`: `PASS`
- workflow YAML parse
  - `.github/workflows/docs-link-check.yml`
  - `.github/workflows/ut-static-analysis.yml`
  - `.github/workflows/api-ci.yml`
  - `.github/workflows/docs-pdf.yml`
  - `.github/workflows/release-docs-pdf.yml`
  - `.github/workflows/production-delivery.yml`
- `task --list`
  - `delivery:apply` / `delivery:apply:ci` と互換 alias `docs:deploy` / `docs:deploy:ci` の登録を確認

## 補足
- `git diff --check` は既存差分 `api/openapi/openapi.v1.generated.yaml` の末尾空行で fail した。今回の変更対象外のため未修正。
