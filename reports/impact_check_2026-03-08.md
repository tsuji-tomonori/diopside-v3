## 実施内容（GitHub ActionsのCI/CD再設計）
- 対象: `.github/workflows/{docs-link-check,ut-static-analysis,api-ci,docs-pdf,production-delivery}.yml`, `Taskfile.yaml`, `infra/lib/quartz-site-stack.ts`。
- 変更内容:
  - 各ブランチ push / Pull Request で安定した必須チェックを返すよう、workflow 名と job 名を `CI Docs` / `ci-docs`、`CI Platform` / `ci-platform`、`CI API` / `ci-api` へ整理し、branch/path 依存の起動制限を外した。
  - `docs:ut:stat:check` に `npm --prefix web run test` を追加し、branch push 時の platform 系品質ゲートへ web test を含めた。
  - docs専用配備 workflow を廃止し、`Production Delivery` を新設した。`main` 反映時に `apply-delivery`（OIDC配備）と `build-docs-pdf`（PDF artifact生成）を同一 workflow で実行する。
  - 手動PDF生成は `Docs PDF Preview` の `workflow_dispatch` 専用へ変更し、branch push では不要な PDF build を走らせない構成へ整理した。
  - Task の標準入口を `task delivery:apply` / `task delivery:apply:ci` へ改称し、`task docs:deploy` / `task docs:deploy:ci` は互換 alias として残した。
  - OIDC の GitHub Environment 名を `delivery-prod` へ変更し、CDK 側の `githubEnvironment` 既定値も同期した。
  - GitHub Actions 配備ロールの物理名を `diopside-delivery-prod-github-actions` へ固定し、workflow は `AWS_ACCOUNT_ID` からAssume先ARNを解決する設計へ変更した。`AWS_ROLE_ARN` は互換overrideへ縮退した。

## 影響確認
- ブランチ保護:
  - `main` の required status checks は `ci-docs` / `ci-platform` / `ci-api` を正本として設計した。
  - `main` 反映は branch protection 経由の merge を前提とし、直接 push を許容しない運用へ整理した。
- Environment / OIDC:
  - GitHub Environment `delivery-prod` を `main` 限定・承認付きの本番配信境界として扱う設計へ更新した。
  - IAM Trust Policy の `sub` は `repo:tsuji-tomonori/diopside-v3:environment:delivery-prod` を正本とした。
  - Environment 変数は `AWS_ACCOUNT_ID` / `AWS_REGION` を標準とし、Stack Output の手動転記がなくても OIDC Assume できる構成へ見直した。
- 配信手順:
  - 各ブランチ push で CI を先行実行し、`main` 反映後は `Production Delivery` により本番配備と PDF artifact 生成を自動実行する手順へ更新した。
  - 初回ローカル `task infra:deploy` 後は `AWS_ACCOUNT_ID` 設定のみで GitHub Actions 側のAssume先ARNが確定し、`AWS_ROLE_ARN` の手動転記が不要になった。
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

---

## 実施内容（管理画面入口のURL直指定化）
- 対象:
  - 要求/設計: `RQ-FR-025`, `RQ-RDR-055`, `BD-SYS-ADR-045`, `BD-APP-UI-001`, `BD-INF-DEP-004`, `DD-APP-UI-001`, `AT-SCN-006`, `RQ-RTM-001`, `RQ-RTM-002`
  - Web実装: `web/src/App.tsx`, `web/src/lib/routes.ts`, `web/src/__tests__/App.test.tsx`, `web/src/lib/__tests__/routes.test.ts`
- 変更内容:
  - 管理画面入口を `/web/admin` の予約URL直指定へ固定し、公開UIから管理画面への遷移ボタン/リンクを置かない要求へ更新した。
  - 要求決定 `RQ-RDR-055` と設計決定 `BD-SYS-ADR-045` を追加し、UI境界と配信経路設計へ同一方針を反映した。
  - `task docs:trace` により `RQ-RTM-001` / `RQ-RTM-002` を再生成し、`RQ-FR-025` と新規 RDR/ADR の追跡を同期した。
  - Web実装は `viewMode` 切替を廃止し、`pathname` 判定で `/web/admin` のみ管理UIを描画する構成へ変更した。
  - ベースパス解決を `pathname` 由来へ寄せ、`/web/*` 配下の公開資産読込を維持したままテスト可能にした。

## 影響確認
- 公開導線:
  - `/web/` では公開UIのみ表示し、管理画面導線が露出しない。
  - `/web/admin` 直アクセス時のみ管理認証/管理画面を表示する。
- ドキュメント整合:
  - `RQ-FR-025 -> RQ-RDR-055 -> BD-SYS-ADR-045 -> BD/DD/AT本文` の追跡経路を追加した。
  - `RQ-RTM-001` / `RQ-RTM-002` に新規 RDR/ADR と更新文書の関連が反映された。
- 実装境界:
  - 公開UI操作群と管理UI操作群を同一画面ボタンで切り替えない構成へ変更した。
  - 既存の管理API認証処理は admin route 上でのみ初期化する構成へ絞った。

## 検証
- `task docs:trace`
  - `RQ-RTM-001` / `RQ-RTM-002` を再生成し、`RQ-FR-025` に `RQ-RDR-055` / `BD-SYS-ADR-045` が反映された。
- `task docs:guard`
  - `reports/doc_check.md`: `issues: 0`, `broken_links: 0`
- `npm --prefix web run test -- --runInBand src/__tests__/App.test.tsx src/lib/__tests__/routes.test.ts`
  - `2 passed, 2 total`
- `npm --prefix web run typecheck`
  - `tsc -p tsconfig.json --noEmit` 成功

## 補足
- 既存の未整理差分 `api/openapi/openapi.v1.generated.yaml` と `reports/api_openapi_contract_check.md` は今回の変更対象外として未変更扱いにした。
