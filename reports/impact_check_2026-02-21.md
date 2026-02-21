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
