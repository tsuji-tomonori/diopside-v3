## 実施内容（DD-INF章再編）
- 対象: `docs/3.詳細設計(DD)/03.インフラ(INF)` の章構成を、横断設計 + サービス別詳細 + 運用詳細へ再編。
- 新規追加:
  - `00.総論(OVR)/DD-INF-OVR-001`
  - `20.配信基盤(CF)/DD-INF-CF-001`, `DD-INF-CF-002`
  - `30.ストレージ(S3)/DD-INF-S3-001`
  - `40.API実行基盤(API)/DD-INF-LMB-001`, `DD-INF-DB-001`
  - `50.認証基盤(COG)/DD-INF-COG-001`
  - `70.統制と監査(GOV)/DD-INF-CFG-001`
- 既存文書の責務再定義:
  - `DD-INF-DEP-001/002/003` を「設定値正本」から「デプロイ適用条件・配備手順」へ限定。
  - `DD-INF-SEC-001` を `90.復旧(DR)` へ移設（ID維持）。
  - `DD-INF-SEC-002` を `70.統制と監査(GOV)` へ移設（ID維持）。

## 影響確認
- ObsidianリンクはID参照中心のため、移設した2文書（`DD-INF-SEC-001`, `DD-INF-SEC-002`）のリンク解決は維持される。
- CloudFront/S3/Lambda/Cognito/Config/DBの設定値正本が追加され、`BD-INF-PLAT-001` の「管理対象8サービス」とDD実装値の対応が追跡しやすくなる。
- `DD-INF-DEP-002` の内容重複を削減し、CloudFront仕様参照先を `DD-INF-CF-001/002` へ統一した。

## 検証
- `task docs:guard` でfrontmatter/リンク/章再編後の整合を確認する。
- 必要に応じて `task docs:check` を実行し、Vault全体整合を確認する。

## 実施内容（NFR記載方式統一）
- 対象: `docs/1.要求(RQ)/61.非機能要求(NFR)` の主要求34文書（`RQ-AV-001`/`RQ-PS-001`/`RQ-SEC-001`/`RQ-PRC-001`/`RQ-OBY-001`/`RQ-INT-001`/`RQ-DATA-001`/`RQ-COST-001`/`RQ-DEV-001`/`RQ-DEV-002`/`RQ-UX-001`〜`RQ-UX-024`）。
- 変更内容: SnowCardの `要求` / `受入基準` / `例外/エラー` を「〜できる」基調へ統一し、1項目1判定で読める粒度へ再記述。
- 併せて更新: `[[RQ-RDR-048]]` を新規追加し、`[[RQ-DG-001]]` のRQフロー/受入基準へNFR記載ルールを反映。
- スキル同期: `docops-orchestrator` / `skill-maintainer` / `obsidian-doc-check` / `obsidian-doc-change` / `doc-rq-av|ps|sec|prc|oby|int|data|cost|dev|ux` を同一方針で更新。

## 影響確認（NFR記載方式統一）
- 閾値・判定条件・例外境界は維持し、文体と判定粒度のみ変更したため、AT判定観点の意味変更は発生しない。
- 変更履歴は全対象NFRで `[[RQ-RDR-048]]` へ接続し、記載方式変更の判断根拠を追跡できる。
- NFR記載ルールをスキルへ同期し、以後の文書改修で同一スタイルへ収束できる。

## 実施内容（docs PDF配布仕様）
- 対象: `docs-pdf.yml` / `release-docs-pdf.yml` と、関連する設計正本 `BD-INF-DEP-003` / `DD-INF-DEP-001`。
- 変更内容:
  - PDF配布経路を「Actions Artifact（CI）」と「Release Assets（Release公開時）」へ二系統化。
  - Release配布名を `diopside-docs-{branch}-{shortsha}.pdf` へ統一。
  - Actions Artifact名を `diopside-docs-{branch}-{shortsha}.zip` とし、中身に同名PDFを格納。
  - `branch` はファイル名安全化のため `/` と空白を `-` へ置換し、`A-Za-z0-9._-` のみ許可。
  - Release添付は `--clobber` で同名Assetを置換。
- ADR: `[[BD-SYS-ADR-037]]` を新規追加し、判断根拠と却下案を記録。

## 影響確認（docs PDF配布仕様）
- PDFビルド実体（`reports/diopside-docs.pdf`）は維持し、配布前コピーで命名規則を適用するため生成処理互換性は維持される。
- Actions Artifact名を `.zip` とすることで、ダウンロード後のファイル形式誤認（ZIPをPDFとして開く事象）を回避できる。
- Release画面からは `.pdf` を直接DL可能なため、配布導線としての利用性を維持できる。

## 検証（docs PDF配布仕様）
- `task docs:guard` で文書リンク/Frontmatter整合を確認する。

## 実施内容（docs-deploy OIDC自動配備）
- 対象: `infra/lib/quartz-site-stack.ts`, `.github/workflows/docs-deploy.yml`, `BD-INF-DEP-003`, `DD-INF-DEP-001`, `DD-INF-SEC-002`, `AT-REL-001`。
- 変更内容:
  - CDKで GitHub OIDC Provider（`token.actions.githubusercontent.com`）と Assume先ロール `GithubActionsDeployRole` を構築する。
  - Trust Policy を `aud=sts.amazonaws.com` + `sub=repo:tsuji-tomonori/diopside-v3:environment:prod` に固定する。
  - Stack Output に `GithubActionsDeployRoleArn` / `GithubOidcProviderArn` を追加する。
  - `docs-deploy.yml` を新設し、`push(main)` と `workflow_dispatch` で `task docs:deploy` を OIDC で実行する。
  - 初回はローカル `task infra:deploy`、2回目以降はGitHub Actions実行へ移行する運用へ統一する。
  - ADRとして `[[BD-SYS-ADR-038]]` を追加し、判断根拠を記録する。

## 影響確認（docs-deploy OIDC自動配備）
- Assume先ロールをCDK管理に統一したため、Trust条件と権限変更をIaC差分で追跡可能になった。
- `environment: prod` により、`sub` 条件とGitHub保護ルールの二段で実行境界を固定できる。
- 初回ブートストラップ順序（ロール未作成）をローカル1回実行で解消できる。

## 検証（docs-deploy OIDC自動配備）
- `npm --prefix infra run test` でCDKテンプレート変更とcdk-nag検査の回帰確認を実施する。
- `task docs:guard` で文書リンク/Frontmatter整合を確認する。

## 実施内容（インフラ説明情報の必須化）
- 対象: `infra/lib/quartz-site-stack.ts`, `infra/test/quartz-site-stack.test.ts`, `RQ-COST-001`, `RQ-RDR-049`, `BD-SYS-ADR-015`, `DD-SYS-COST-001`, `DD-INF-CFG-001`, `DD-INF-IAC-002`, `DD-INF-IAC-003`, `DD-INF-SEC-002`。
- 変更内容:
  - タグ統制の必須キーへ `Description` を追加し、6キー（`CostCenter` / `Environment` / `Owner` / `Project` / `ManagedBy` / `Description`）を正本化。
  - 説明設定可能なインフラ構成要素へ `description/comment` を必須化する要件と設計判断を追加。
  - CDK実装で CloudFront Distribution/Function と CloudFormation Output に説明文を追加。
  - インフラ単体テストを更新し、必須タグセットと説明プロパティを検証対象へ追加。

## 影響確認（インフラ説明情報の必須化）
- タグ一覧表示と詳細画面の両方で用途を即時判別できるため、運用時の調査時間短縮が見込める。
- 既存の required-tags 検知フローへ `Description` を追加するだけで運用可能であり、監査運用の追加コストは限定的。
- 説明欠落はP3ドリフトとして既存SLA（3営業日以内是正）に統合できる。

## 検証（インフラ説明情報の必須化）
- `npm --prefix infra run test` でテンプレートとタグ/説明検証の回帰確認を実施する。
- `task docs:guard` でFrontmatter/リンク/文書整合を確認する。

## 実施内容（GitHub Actions 設定値の文書化）
- 対象: `DD-INF-DEP-001`, `AT-REL-001`。
- 変更内容:
  - `DD-INF-DEP-001` に `docs-deploy.yml` のパラメータ/設定値一覧（trigger, permissions, concurrency, environment variables, action versions, 実行コマンド）を追加。
  - OIDC信頼条件（Provider URL / `aud` / `sub` / Assume先ロール取得元）を固定値として明記。
  - `AT-REL-001` に GitHub Environment `prod` の設定手順（`AWS_ROLE_ARN`, `AWS_REGION`, 任意 `DOCS_SITE_URL`）と設定不備時の確認手順を追加。

## 影響確認（GitHub Actions 設定値の文書化）
- 詳細設計と運用手順書で同一パラメータ名・設定値を参照できるため、設定漏れと名称誤りを削減できる。
- 初回導入（ローカル配備）から通常運用（GitHub OIDC配備）までの移行手順が連続した手順として参照可能になった。

## 検証（GitHub Actions 設定値の文書化）
- `task docs:guard` でFrontmatter/リンク整合を確認する。

## 実施内容（CI向けdocs配備の直列化）
- 対象: `Taskfile.yaml`, `.github/workflows/docs-deploy.yml`, `DD-INF-DEP-001`, `AT-REL-001`。
- 変更内容:
  - Taskfileに `quartz:build:ci`, `infra:deploy:ci`, `docs:deploy:ci` を追加し、Quartz準備/依存導入/設定同期/ビルド/配備を直列化。
  - `docs-deploy.yml` の実行コマンドを `task docs:deploy` から `task docs:deploy:ci` へ変更。
  - 詳細設計と配信手順書へ、CIでは直列タスクを使う運用を追記。

## 影響確認（CI向けdocs配備の直列化）
- `quartz:prepare` の同時実行競合（clone/checkout競合）を回避し、`quartz:sync-config` の失敗確率を低減できる。
- ローカル運用（`docs:deploy`）は維持しつつ、CIだけを安全実行経路へ切り替えられる。

## 検証（CI向けdocs配備の直列化）
- `task docs:guard` でFrontmatter/リンク整合を確認する。

## 実施内容（CIのQuartz復旧性強化）
- 対象: `Taskfile.yaml`, `.github/workflows/docs-deploy.yml`, `DD-INF-DEP-001`, `AT-REL-001`。
- 変更内容:
  - `quartz:prepare` に不整合ディレクトリ検知（`.git` / `package-lock.json` / `quartz/styles`）を追加し、検知時は削除再cloneする自己修復を実装。
  - `quartz:build:ci` は lockfile 有無で `npm ci` / `npm install` を切替えるフォールバックを追加。
  - `docs-deploy.yml` の Node を `22` へ更新し、実行前に `rm -rf quartz` を追加。
  - 詳細設計/手順書へ Node 22固定とQuartz初期化・自己修復フローを追記。

## 影響確認（CIのQuartz復旧性強化）
- 過去失敗で残った壊れたQuartzディレクトリがあっても、次回実行で自動復旧できる。
- Quartzのengine要件未達による実行失敗を回避し、CI再現性を向上できる。

## 検証（CIのQuartz復旧性強化）
- `task docs:guard` でFrontmatter/リンク整合を確認する。

## 実施内容（DevOps要件の原子分割とGHA基盤要件追加）
- 対象:
  - 新規要求: `RQ-DEV-005` / `RQ-DEV-006` / `RQ-DEV-007` / `RQ-SEC-005`
  - 新規ユースケース: `RQ-UC-010` / `RQ-UC-011` / `RQ-UC-012` / `RQ-UC-013`
  - 新規記録: `RQ-RDR-050` / `BD-SYS-ADR-039`
  - 追記更新: `RQ-DEV-001` / `RQ-SEC-001` / `BD-DEV-PIPE-001` / `AT-REL-001` / `AT-GO-001`
- 変更内容:
  - 「既存要件更新」ではなく「新規要件追加」でGitHub Actions運用要件を分離し、要件原子性を維持。
  - PR品質ゲート、デプロイ排他/承認/ロールバック、証跡保持、Actionsサプライチェーン防御を独立要件化。
  - 設計側は `BD-DEV-PIPE-001` の実装補足と `BD-SYS-ADR-039` で反映し、運用判定は `AT-REL-001` / `AT-GO-001` に接続。

## 影響確認（DevOps要件の原子分割とGHA基盤要件追加）
- 既存 `RQ-DEV-001` / `RQ-SEC-001` の受入基準本体は変更せず、基底要件として参照関係のみ拡張した。
- 要件追加により、CI/CD基盤固有の変更は `RQ-DEV-005..007` / `RQ-SEC-005` のみ改訂すればよい構造へ分離できた。
- 追加ユースケースにより、PR判定・docs公開・本番承認・ロールバックの運用導線を `[[RQ-SH-001|管理者]]` 主体で追跡可能になった。

## 検証（DevOps要件の原子分割とGHA基盤要件追加）
- `task docs:guard` でFrontmatter/リンク整合を確認する。

## 実施内容（スコープ文書のエピック再編）
- 対象: `RQ-SC-001`、新規 `RQ-SC-002` 〜 `RQ-SC-008`、新規 `RQ-RTM-003`、新規 `RQ-RDR-051`。
- 変更内容:
  - `RQ-SC-001` を「エピック総覧」へ再編し、In Scope/Out of Scope/判定ルール/MVP/DoDの意味を維持したまま構造化。
  - エピック詳細7文書（EPIC-01〜07相当）を `SC` 配下へ追加し、1トピック1ファイルで分割。
  - FR-001〜FR-025の割当を `RQ-RTM-003` に静的表として追加。
  - 変更根拠として `RQ-RDR-051` を追加。

## 影響確認（スコープ文書のエピック再編）
- `RQ-SC-001` の境界条件（収集対象判定、Out of Scope、MVP、DoD）は維持し、表現をエピック単位へ再配置した。
- FR番号の新規追加・廃止はなく、既存FRの意味変更は発生していない。
- スコープ変更時の追跡入口を `RQ-SC-001` + `RQ-RTM-003` + `RQ-RDR-051` で明示できる構造へ更新した。

## 検証（スコープ文書のエピック再編）
- `task docs:guard` でFrontmatter/リンク整合を確認する。
