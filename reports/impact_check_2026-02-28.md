## 実施内容（UTペアワイズ因子定義と生成手順の追加）
- 対象: `docs/4.単体テスト(UT)` と `scripts/pairwise`、`Taskfile.yaml`。
- 変更内容:
  - 新規 `UT-PW-001` を追加し、単体テストにおけるペアワイズ因子設計ルールと運用手順を定義。
  - 新規 `UT-PW-FE-*`（9件）と `UT-PW-BE-*`（13件）を追加し、画面/バックエンドごとの因子定義を分割。
  - 新規 `scripts/pairwise/generate_pairwise_md.py` を追加し、`UT-PW-*` から `UT-CASE-*-PW.md` を自動生成可能化。
  - `Taskfile.yaml` に `docs:ut:pairwise:generate` / `docs:ut:pairwise:check` を追加。
  - `UT-PLAN-001` / `UT-PLAN-004` / `UT-PLAN-005` を更新し、UT-PW運用への接続を追加。

## 影響確認
- 要求・設計トレーサビリティ:
  - FE因子定義は `[[BD-APP-UI-001]]` および `[[DD-APP-UI-*]]` / `[[DD-APP-API-*]]` へ接続。
  - BE因子定義は `[[DD-APP-API-002]]`〜`[[DD-APP-API-015]]` へ接続。
- 運用影響:
  - 既存UTケースを即時置換せず、`UT-CASE-*-PW.md` を段階導入可能。
  - 生成物の更新漏れは `task docs:ut:pairwise:check` で検知可能。

## 更新文書
- 新規: `UT-PW-001`
- 新規（FE）: `UT-PW-FE-UI-U01`, `UT-PW-FE-UI-U02`, `UT-PW-FE-UI-U03`, `UT-PW-FE-UI-A01`, `UT-PW-FE-UI-A02`, `UT-PW-FE-UI-A03`, `UT-PW-FE-UI-A04`, `UT-PW-FE-UI-A05`, `UT-PW-FE-UI-A06`
- 新規（BE）: `UT-PW-BE-DD-APP-API-002`, `UT-PW-BE-DD-APP-API-003`, `UT-PW-BE-DD-APP-API-004`, `UT-PW-BE-DD-APP-API-005`, `UT-PW-BE-DD-APP-API-006`, `UT-PW-BE-DD-APP-API-007`, `UT-PW-BE-DD-APP-API-008`, `UT-PW-BE-DD-APP-API-009`, `UT-PW-BE-DD-APP-API-011`, `UT-PW-BE-DD-APP-API-012`, `UT-PW-BE-DD-APP-API-013`, `UT-PW-BE-DD-APP-API-014`, `UT-PW-BE-DD-APP-API-015`
- 更新: `UT-PLAN-001`, `UT-PLAN-004`, `UT-PLAN-005`, `Taskfile.yaml`
- 新規スクリプト: `scripts/pairwise/generate_pairwise_md.py`

## 検証
- `task docs:ut:pairwise:generate`
- `task docs:guard`

## 追加実施（PW因子日本語化・章順変更・スキル追加）
- 対象: `docs/4.単体テスト(UT)` と `.opencode/skills`。
- 変更内容:
  - `33.ペアワイズ(PW)` を `12.ペアワイズ(PW)` へ改番し、章順を `PW -> CASE` に調整。
  - `UT-PW-*` の `factors` / `excludes` の因子名を日本語へ統一。
  - `scripts/pairwise/generate_pairwise_md.py` の参照パスを `12.ペアワイズ(PW)` に追従。
  - 新規スキル `doc-ut-pw`（`SKILL.md` / `TEMPLATE.md`）を追加。

## 追加影響確認
- 生成整合:
  - `task docs:ut:pairwise:generate` で22モデルから `UT-CASE-*-PW.md` を再生成。
  - `task docs:ut:pairwise:check` で生成差分漏れなしを確認。
- 文書整合:
  - `task docs:guard` 実行結果で `issues: 0`, `broken_links: 0` を維持。

## 追加実施（UT 41以降の分割と品質集約自動生成）
- 対象: `docs/4.単体テスト(UT)/41.*`、`42.*`、`43.*`、`scripts/ut_quality`、`Taskfile.yaml`。
- 変更内容:
  - `UT-COV` を領域別へ分割（`UT-COV-002`〜`UT-COV-005`: DOC/INF/FE/BE）。
  - `UT-STAT` をツール別へ分割（`UT-STAT-002`〜`UT-STAT-008`）し、設定/対象/コマンド/失敗条件を明文化。
  - `UT-STAT-001`、`UT-COV-001`、`UT-MET-001` を集約ファイルとして自動生成化。
  - 新規 `scripts/ut_quality/generate_quality_md.py` を追加し、`UT-STAT-00x` / `UT-COV-00x` から表を生成。
  - `Taskfile.yaml` に `docs:ut:quality:generate` / `docs:ut:quality:check` を追加。
  - `UT-PLAN-001` に品質集約生成タスク運用を追記。

## 追加影響確認（UT品質集約）
- トレーサビリティ:
  - `UT-MET-001` は `UT-STAT-00x` と `UT-COV-00x` を入力とする集約文書に変更。
  - 領域別（DOC/INF/FE/BE）で静的解析とカバレッジ指標を追跡可能。
- 運用影響:
  - 閾値や対象変更はソース文書（`UT-STAT-00x` / `UT-COV-00x`）のみ更新すれば反映可能。
  - 集約文書の手編集は禁止し、`task docs:ut:quality:check` で更新漏れを検知可能。

## 追加実施（ITをUC基準へ再編、IT-PWを9本化）
- 対象: `docs/5.結合テスト(IT)` と `.opencode/skills/doc-it-case`。
- 変更内容:
  - `IT-PLAN-001` を更新し、結合テスト仕様を「UC基準 + FR因子化 + PW参照」へ変更。
  - `IT-CASE-001` から `IT-CASE-013` をUC基準フォーマットへ再編（対象UC、契約化受入条件、FR因子、ケース一覧を追加）。
  - 新規 `IT-PW-001` と `IT-PW-UC-001` から `IT-PW-UC-009` を追加し、UC001-009を対象にPWモデルを定義。
  - `RQ-UC-010` から `RQ-UC-013` は IT-PW 対象外として明示（INFIT/AT運用系で扱う）。
  - `doc-it-case` スキルの `SKILL.md` / `TEMPLATE.md` をUC基準フォーマットへ同期更新。

## 追加影響確認（IT UC基準化）
- トレーサビリティ:
  - `IT-PLAN-001` へ UC と IT-CASE の対応表を追加し、`RQ-UC-001` から `RQ-UC-009` の接続を可視化。
  - 各 `IT-CASE-*` は対応 `IT-PW-UC-*` へのリンクを保持し、因子根拠を明示。
- 運用影響:
  - ITケース設計時は API中心ではなく UC中心で設計する運用へ変更。
  - IT-PWの本数は 9本（UC001-009）を標準とし、CI/CD系UCはIT-PW対象外とする。

## 追加検証
- `task docs:guard`
- `task docs:trace`

## 追加実施（IT-PW向けスキル追加）
- 対象: `.opencode/skills/doc-it-pw`。
- 変更内容:
  - 新規 `doc-it-pw/SKILL.md` を追加し、IT-PW（UC基準）文書の適用範囲、因子設計ルール、品質チェックを定義。
  - 新規 `doc-it-pw/TEMPLATE.md` を追加し、UC・ケース・因子・除外条件の必須観点を明示。

## 追加影響確認（スキル運用）
- `doc-it-pw` により、`docs/5.結合テスト(IT)/12.ペアワイズ(PW)` の更新手順を独立運用できる。
- `doc-it-case` / `doc-it-plan` と責務分離され、UC基準IT設計の変更影響を管理しやすくなる。

## 追加実施（skills整合性の横断修正）
- 対象: `.opencode/skills/**/SKILL.md`。
- 変更内容:
  - BD文書の履歴リンク表記を `[[BD-*-ADR-xxx]]` 形式へ統一し、`AGENTS.md` の設計記述規約と同期。
  - a11y系スキルおよび `wcag22aa-scope` のfrontmatter `metadata.short-description` 欠落を補完し、スキルメタデータ形式を統一。

## 追加影響確認（skills規約同期）
- 規約整合:
  - `skill-maintainer` / `docops-orchestrator` / `obsidian-doc-*` / BD系スキルのADRリンク規約が `AGENTS.md` と一致。
  - 既存の `name == ディレクトリ名`、frontmatter YAML 構文、必須キーは維持。
- 未解消事項:
  - 実体ファイルとして存在する `doc-it-pw` / `doc-ut-pw` は、ランタイムの `skill` ローダー公開リストに未登録（リポジトリ外設定由来のため、今回変更対象外）。

## 追加検証（skills）
- `python3` スクリプトで `.opencode/skills/*/SKILL.md` を横断検査:
  - frontmatter欠落: 0
  - frontmatter必須キー欠落: 0
  - `name` とディレクトリ名不一致: 0
  - `metadata.short-description` 欠落: 0（補完後）
  - `[[BD-ADR-xxx]]` / `[[BD-ADR-*]]` 残存: 0（置換後）

## 追加実施（AT章最終形固定とOPSINF廃止）
- 対象: `docs/6.受入テスト(AT)`、AT参照を持つ `docs/1.要求(RQ)` / `docs/2.基本設計(BD)` / `docs/3.詳細設計(DD)`。
- 変更内容:
  - `AT-PLAN-001` に AT章正本順序（`PLAN -> SCN -> OPS -> RCHK -> RPT -> GO`）と `UT/IT根拠（証拠）運用方針` を追加。
  - `AT-SCN-001` から `AT-SCN-009` を共通テンプレ（目的/範囲/前提/対応DD-API/対応要求/テストデータ/手順/期待結果/記録/切り分け/参照UT-IT/履歴）へ統一。
  - `AT-RPT-001` に `UT/IT実施証跡サマリ` を追加し、AT未実施時の代替範囲記録ルールを明文化。
  - `AT-GO-001` の判定入力に `UT/IT実施証跡サマリ` 参照を追加。
  - `81.運用受入インフラ(OPSINF)` の `AT-OPSINF-001` / `AT-OPSINF-DR-001` / `AT-OPSINF-SLO-001` を廃止。
  - OPSINF参照を `AT-OPS-001` / `AT-RPT-001` / `AT-GO-001` / `AT-RUN-001` へ再配線（`RQ-RTM-002`, `BD-DEV-TEST-001`, `BD-INF-SEC-001`, `BD-INF-MON-004`, `DD-INF-CFG-001`, `DD-INF-MON-001`, `DD-INF-NET-001`, `DD-INF-SEC-001`, `DD-INF-SEC-002`）。

## 追加影響確認（AT章固定）
- トレーサビリティ:
  - `AT-SCN-001` から `AT-SCN-009` の欠番不可前提を `AT-PLAN-001` と整合。
  - API逆引きとUT/IT証跡運用を `AT-PLAN-001` / `AT-RPT-001` / `AT-GO-001` で連結。
- 運用影響:
  - インフラ受入観点はAT本線（OPS/RPT/GO/RUN）へ統合し、別ゲート文書の二重管理を解消。

## 追加実施（NAT常設禁止とネットワーク設計反映）
- 対象: `infra/lib/quartz-site-stack.ts`、`docs/1.要求(RQ)/12.プロジェクトの制約(PC)/RQ-PC-006.md`、`docs/2.基本設計(BD)/04.インフラ(INF)/13.ネットワーク(NET)/BD-INF-NET-001.md`、`docs/3.詳細設計(DD)/03.インフラ(INF)/12.ネットワーク詳細(NET)/DD-INF-NET-001.md`、`RQ-RDR-053`、`BD-SYS-ADR-042`。
- 変更内容:
  - CDK実装から `NatGateway` / `EIP` / Private app subnetのデフォルトルートを削除。
  - `RQ-PC-006` に「NAT Gateway常設禁止」と例外運用条件（期限・撤去条件必須）を追記。
  - `BD-INF-NET-001` / `DD-INF-NET-001` のルート設計をNAT非依存へ更新。
  - 要求判断 `[[RQ-RDR-053]]` と設計判断 `[[BD-SYS-ADR-042]]` を追加。

## 追加影響確認（NAT除去）
- コスト影響:
  - 常時課金リソースのうちNAT関連固定費を除去し、[[RQ-PC-006]] の月額上限制約に整合。
- 通信影響:
  - Private app subnetはインターネット向けデフォルトルートを持たず、VPC Endpoint経由通信を前提化。
- 検証影響:
  - `infra` の `npm run build` / `npm test` / `npm run synth` で差分整合を確認。

## 追加実施（定額課金最小構成の両環境適用）
- 対象: `infra/lib/quartz-site-stack.ts`、`RQ-PC-006`、`BD-INF-NET-001`、`DD-INF-NET-001`、`RQ-RDR-054`、`BD-SYS-ADR-043`。
- 変更内容:
  - `LogsInterfaceEndpoint` を削除し、VPC Endpointは `S3 Gateway` のみを初期採用。
  - CloudWatchアラームを `CloudFront5xxCriticalAlarm` の1本へ集約。
  - AWS Config関連リソースを `prod` のみ作成する条件分岐へ変更。
  - 制約/設計文書へ「定額課金リソース最小構成」方針を反映し、RDR/ADRで判断根拠を追加。

## 追加影響確認（定額課金最小化）
- コスト影響:
  - NAT除去に続き、Interface Endpoint常設とアラーム多重化を解消し、固定費を追加削減。
- 運用影響:
  - 監視はCloudFront 5xxを基線に維持し、Lambda詳細監視は段階導入へ移行。
  - 統制（Config）はprod必須、dev任意の環境差分を明確化。

## 追加実施（全体コスト見積のDD反映）
- 対象: `DD-SYS-COST-001`、`DD-INF-MON-001`、`DD-INF-CFG-001`、`BD-SYS-ADR-043`。
- 変更内容:
  - `DD-SYS-COST-001` に現行構成（NATなし、Logs Interface Endpointなし、Configはprodのみ）を前提としたシナリオ別月額見積（低/中/高）を追加。
  - 見積式、構成別内訳、準固定費（Alarm/Config）を追加し、月次判定入力を定量化。
  - `DD-INF-MON-001` に初期実装監視（CloudFront 5xx単一）と段階導入方針を追加。
  - `DD-INF-CFG-001` に環境別適用（dev任意/prod必須）を追加。
  - `BD-SYS-ADR-043` にDDコスト見積モデル反映を影響範囲として追記。

## 追加影響確認（見積運用）
- トレーサビリティ:
  - コスト制約 `RQ-PC-006` から ADR/DD へ見積根拠が連結され、運用判定の説明可能性を強化。
- 運用影響:
  - 月次レビューで為替/単価更新を行う前提を明文化し、見積精度の継続改善が可能。

## 追加実施（UT-STAT-002〜008 一括実行導入）
- 対象: `Taskfile.yaml`、`.github/workflows/ut-static-analysis.yml`、`docs/4.単体テスト(UT)/21.単体テストケース(CASE)`。
- 変更内容:
  - `task docs:ut:stat:check` を追加し、UT-STAT-002〜008 の7ツールを単一入口で実行可能化。
  - PR/push 向けに `.github/workflows/ut-static-analysis.yml` を追加し、Python + Node + Task セットアップ後に上記タスクを実行するCIゲートを導入。
  - 実行結果に基づき `task docs:ut:pairwise:generate` と `task docs:guard` を適用し、`UT-CASE-FE-UI-U03-PW` / `UT-CASE-BE-DD-APP-API-007-PW` の生成差分・用語リンク差分を解消。

## 追加影響確認（UT静的解析導入）
- 実行結果:
  - `task docs:ut:stat:check` 再実行で、UT-STAT-002〜008 がすべて PASS（`issues: 0`, `broken_links: 0`, `changed=0`, `tsc_errors=0`, `generated_diff=0`）を確認。
- 運用影響:
  - 既存 `docs:guard` と独立して、設計上定義した静的解析セットを定常的に実行可能。
  - ペアワイズ生成物（`*-PW.md`）は `UT-STAT-003` のチェック対象から除外し、生成物と用語自動補正の循環差分を防止。

## 追加実施（api正本化とbackend廃止）
- 対象: `api/src/**`、`.github/workflows/api-ci.yml`、`backend/**`、`docs/2.基本設計(BD)/04.インフラ(INF)/31.コンピュートと配備(CMP_DEP)/BD-INF-DEP-005.md`、`docs/3.詳細設計(DD)/03.インフラ(INF)/21.デプロイ実装(DEP)/DD-INF-DEP-003.md`、`docs/4.単体テスト(UT)/41.カバレッジ(COV)/UT-COV-005.md`。
- 変更内容:
  - `api` に運用API実装（`ops/admin/public`）と共通ミドルウェア（trace/auth/error）を移植し、`createServer` を `buildApp` ベースへ統一。
  - `.github/workflows/backend-ci.yml` を廃止し、`api` 専用の `api-ci` ワークフローを追加。
  - `backend` ディレクトリを削除し、API実装の正本を `api` へ一本化。
  - BD/DD/UT文書中の配備手順・実行レポート表記を `backend` から `api` へ更新。

## 追加影響確認（api一本化）
- 実装影響:
  - `web/src/lib/adminApi.ts` が利用する `/api/v1/*` 経路の実装主体を `api` へ統合。
  - API CI の対象ディレクトリが `backend/**` から `api/**` へ移行。
- 文書影響:
  - 配備責務マップ（BD）と領域分割配備手順（DD）が実装実態に整合。
  - BE領域のUTカバレッジソース表記を `api unit execution report` へ更新。

## 追加実施（api/web本番デプロイ自動化）
- 対象: `Taskfile.yaml`、`.github/workflows/docs-deploy.yml`、`infra/lib/quartz-site-stack.ts`、`api/src/lambda.ts`、`docs/**`（RDR/ADR/BD/DD/AT-RUN/AT-REL）。
- 変更内容:
  - `docs-deploy.yml` の main push トリガーへ `web/**` と `api/**` を追加し、timeoutを60分へ拡張。
  - `Taskfile.yaml` に `web:install/build` と `api:install/build` を追加し、`infra:deploy(:ci)` で docs/web/api を同一チェーン配備化。
  - CDK contextに `webAssetPath` / `apiAssetPath` を追加し、配備時に `siteAssetPath` と合わせて固定化。
  - `QuartzSiteStack` のAPIを inline Lambda から `api` 成果物（`dist/lambda.handler`）へ移行。
  - `DeployWebPlaceholder` を廃止し、`web/dist` を `/web/*` へ配備する `DeployWebAssets` を追加。
  - `api/src/lambda.ts` を追加し、HonoアプリをLambdaハンドラーとして公開。
  - 関連設計書（`RQ-RDR-050`, `BD-SYS-ADR-039`, `BD-DEV-PIPE-001`, `DD-INF-DEP-001`, `AT-REL-001`, `AT-RUN-001`）へ運用手順を反映。

## 追加影響確認（api/web本番デプロイ自動化）
- デプロイ運用:
  - docsのみでなく web/api 変更時も main push で本番配備が自動実行される。
  - `task docs:deploy:ci` 1入口で docs/web/api の build/test/deploy が完了し、失敗単位の切り分けが可能。
- 配信経路:
  - `/web/*` は placeholder ではなく `web/dist` 成果物を配信。
  - `/api/v1/*` と `/openapi/*` は `api` 実装成果物をLambda経由で配信。

## 追加実施（静的解析除外条件の設計反映）
- 対象: `UT-STAT-003`、`UT-STAT-001`。
- 変更内容:
  - `UT-STAT-003` に `exclude_targets` を追加し、`docs/4.単体テスト(UT)/21.単体テストケース(CASE)/**/*-PW.md` を `auto_link_glossary --check` 対象外として明記。
  - 除外理由として、`task docs:ut:pairwise:generate` の生成物を用語自動補正対象へ含めると `task docs:ut:pairwise:check` と循環差分が発生する点を追記。
  - `task docs:ut:quality:generate` を実行し、`UT-STAT-001` 集約表へ除外条件を反映。

## 追加影響確認（除外妥当性）
- 判定: 妥当。
  - 除外対象は手書き設計文書ではなく自動生成成果物（`*-PW.md`）に限定されている。
  - 生成元（`UT-PW-*`）と主要設計文書（RQ/BD/DD/UT-STAT）は引き続き静的解析対象であり、設計品質ゲートの抜け漏れは生じない。
  - `task docs:ut:quality:check` と `task docs:ut:pairwise:check` で更新漏れなしを確認。

## 追加実施（OpenAPI正本化と設計/スキル同期）
- 対象: `api/scripts/*`, `api/openapi/*`, `Taskfile.yaml`, `docs/2.*BD-APP-API-004`, `docs/3.*DD-APP-API-001/004/006/007`, `docs/5.*IT-PLAN-001`, `.opencode/skills/*`。
- 変更内容:
  - Hono実装から OpenAPI YAML/JSON を生成する `api/scripts/generate-openapi.ts` を追加。
  - OpenAPI（`/api/v1/*`）と DD API文書のエンドポイント差分を検証する `api/scripts/check-openapi-vs-dd.ts` を追加し、`reports/api_openapi_contract_check.md` を出力。
  - `api/package.json` に `openapi:generate` / `openapi:check` を追加し、`yaml` 依存を導入。
  - `Taskfile.yaml` に `api:openapi:generate` / `api:openapi:check` を追加し、`docs:deploy(:ci)` の前段で契約チェックを必須化。
  - `IT-PLAN-001` の契約正本定義を「HTTP API=OpenAPI正本、静的JSON=JSON Schema正本、DD=フロー/制約/オラクル入力」へ更新。
  - `BD-APP-API-004` で「HTTP API契約の正本は Hono生成OpenAPI」を明文化。
  - `DD-APP-API-001/004/006/007` に `/api/v1/public/*`、`/api/v1/search`、`/api/v1/videos/{videoId}` を反映し、実装契約と一致化。
  - `doc-bd-api` / `doc-dd-api` / `doc-it-plan` / `docops-orchestrator` / `obsidian-doc-check` / `skill-maintainer` のスキル記述を OpenAPI正本運用へ同期。

## 追加影響確認（OpenAPI正本運用）
- 契約整合:
  - `npm --prefix api run openapi:generate` 実行で `api/openapi/openapi.v1.generated.yaml/json` を生成。
  - `npm --prefix api run openapi:check` が PASS し、`reports/api_openapi_contract_check.md` で差分なしを確認。
- 文書整合:
  - `task docs:guard` 実行で対象6文書の `issues: 0`, `broken_links: 0` を確認。
- 運用影響:
  - HTTP API変更時に「実装→OpenAPI生成→DD照合」の順で機械検証でき、手書き契約とのドリフトをCI前段で検出可能。

## 追加実施（全スコープ受入判定チェックリスト整備）
- 対象: `AT-RCHK-001`, `AT-RPT-001`, `AT-GO-001`。
- 変更内容:
  - `AT-RCHK-001` を最小記述から拡張し、`[[RQ-SC-001]]` から `[[RQ-SC-008]]` までのスコープ判定テンプレートを追加。
  - スコープごとに対応FR、主要受入シナリオ、補助証跡、判定、未達理由/対応を記録できる表を追加。
  - `AT-RPT-001` に「スコープ判定サマリ（記入テンプレート）」を追加し、実行結果の集約先を明確化。
  - `AT-GO-001` にスコープ判定入力（`AT-RCHK-001`/`AT-RPT-001`）と最終転記表を追加し、Go/No-Go条件へスコープ判定を組み込み。

## 追加影響確認（全スコープ受入判定）
- トレーサビリティ:
  - `RQ-SC`（全体/エピック）→ `AT-RCHK`（チェック）→ `AT-RPT`（結果集約）→ `AT-GO`（最終判定）の導線を確立。
- 運用影響:
  - 従来のシナリオ/API中心判定に加えて、スコープ単位の判定漏れを防止可能。
  - `Conditional` 記録時に未達理由/期限/担当を残す運用を強制し、判定根拠の再現性を向上。

## 追加実施（全スコープ判定の初期記入）
- 対象: `AT-RCHK-001`, `AT-RPT-001`, `AT-GO-001`。
- 変更内容:
  - 現行のシナリオ実施結果（`AT-SCN-001`〜`AT-SCN-009`）を基に、`RQ-SC-001`〜`RQ-SC-008` の初期判定を記入。
  - `AT-RCHK-001` に初期判定表（Pass/Fail/Conditional + 未達理由）を追加。
  - `AT-RPT-001` にスコープ判定サマリの初期記入例を追加。
  - `AT-GO-001` にスコープ最終判定転記の初期値を追加し、現時点のNo-Go根拠を明示。

## 追加影響確認（初期記入結果）
- 判定結果:
  - Pass: `[[RQ-SC-006]]`, `[[RQ-SC-008]]`
  - Conditional: `[[RQ-SC-003]]`, `[[RQ-SC-004]]`, `[[RQ-SC-005]]`
  - Fail: `[[RQ-SC-001]]`, `[[RQ-SC-002]]`, `[[RQ-SC-007]]`
- リリース判定影響:
  - 未受容Fail/Conditionalが残存するため、`AT-GO-001` 初期転記時点ではNo-Go。

## 追加実施（No-Go解除に向けた再実行ゲート整備）
- 対象: `AT-RCHK-001`, `AT-RPT-001`, `AT-GO-001`。
- 変更内容:
  - `AT-RCHK-001` に未達解消チェックリストを追加し、`AT-SCN-005`〜`AT-SCN-009` の必須実施項目と証跡ID記録欄を定義。
  - `AT-RPT-001` に再実行待ちシナリオ表を追加し、結果反映先（RPT/API判定/GO）を明示。
  - `AT-GO-001` に再判定ゲートを追加し、No-Go解除条件（受容可否No=0件）を明確化。

## 追加影響確認（再判定運用）
- 判定運用影響:
  - 未実施/Failの解消に必要な入力（runId/recheckRunId/publishRunId/ci_run_id）を統一フォーマットで収集可能。
  - 再判定時の更新順序（RCHK/RPT更新→GO転記）を固定し、判定の不整合を抑止。

## 追加実施（スコープ別テスト実装/実行結果の検証記録）
- 対象: `reports/scope_test_verification_2026-02-28.md`, `AT-RPT-001`, `AT-GO-001`。
- 変更内容:
  - 全スコープ（`[[RQ-SC-001]]`〜`[[RQ-SC-008]]`）に対して、対応テスト実装有無と実行結果を検証したレポートを追加。
  - API単体（`api`）とWeb単体（`web`）は実行してPassを確認。
  - IT結合（`web/e2e/it-cases.spec.ts`）は Compose 環境で実行し、`[[IT-CASE-001]]`〜`[[IT-CASE-013]]` が全件Failであることを記録。
  - Fail要因（Prisma migrate `P3018`, 既存制約重複）を `AT-RPT-001` と `AT-GO-001` の判定入力へ反映。

## 追加影響確認（テスト検証）
- 実装確認:
  - 全スコープで対応テスト実装は存在（UT/Web-UT/IT-case）。
- 実行確認:
  - API単体: Pass（2/2）、Web単体: Pass（53/53）、IT結合: Fail（13/13）。
- 判定影響:
  - 全スコープで「全Pass」は未達のため、No-Go解除条件を満たさない。

## 追加実施（インフラ命名ルールと実装名の整合）
- 対象: `DD-INF-IAC-002`, `DD-INF-SEC-002`。
- 変更内容:
  - `DD-INF-IAC-002` に「物理リソース名は `<domain>-<resource>-<env>`、CloudFormation Stack/Construct ID は PascalCase」を明記し、docs配備スタックID `DiopsideDeliveryStack` を正本化。
  - `DD-INF-SEC-002` に IAMロール識別子の正本を CloudFormation Logical ID とするルールを追記。
  - GitHub Actions配備ロール表記を `github-actions-docs-deploy-role` から実装準拠の `GithubActionsDeployRole` へ統一。

## 追加影響確認（命名整合）
- 設計整合:
  - `Taskfile.yaml` の `STACK=DiopsideDeliveryStack` と IaC命名規則文書の解釈差分を解消。
  - `infra/lib/quartz-site-stack.ts` の Logical ID と IAM詳細設計のロール識別子が一致。
- 運用影響:
  - 命名整合の文書修正のみで、デプロイ対象リソース名やCloudFormationスタック実体への変更はなし。

## 追加実施（新規スタック作成へ切替）
- 対象: `infra/bin/quartz-site.ts`, `Taskfile.yaml`, `BD-INF-DEP-003`, `BD-SYS-ADR-038`, `DD-INF-IAC-002`。
- 変更内容:
  - CDKエントリポイントのスタックIDを `QuartzSiteStack` から `DiopsideDeliveryStack` へ変更。
  - Task標準引数 `STACK` を `DiopsideDeliveryStack` へ更新し、`task infra:deploy` / `task docs:deploy(:ci)` が新規スタックを作成するように変更。
  - IaC命名規則文書の正本スタックIDを `DiopsideDeliveryStack` へ同期。

## 追加影響確認（新規スタック切替）
- 配備影響:
  - 既存 `QuartzSiteStack` は残置したまま、次回デプロイで `DiopsideDeliveryStack` が別スタックとして新規作成される。
- 運用影響:
  - `GithubActionsDeployRoleArn` などのOutput参照先は新スタック側へ切り替えが必要。

## 追加実施（受入条件の再判定対応）
- 対象: `api/prisma/migrations/0003_check_constraints/migration.sql`, `api/src/routes/test-support.ts`, `reports/scope_test_verification_2026-02-28.md`, `AT-RCHK-001`, `AT-RPT-001`, `AT-GO-001`。
- 変更内容:
  - Prisma migration `0003_check_constraints` を idempotent 化し、`chk_videos_source_type` 重複で `prisma migrate deploy` が失敗しないよう修正。
  - E2E test-support のレート制限上限を実行件数に合わせて調整し、`/api/v1/test/support/db/metrics` の `429 TOO_MANY_REQUESTS` を解消。
  - Compose環境で `web/e2e/it-cases.spec.ts`（[[IT-CASE-001]]〜[[IT-CASE-013]]）を再実行し、全件Passを確認。
  - `AT-RPT-001` / `AT-RCHK-001` / `AT-GO-001` に再実行結果を反映し、スコープ判定と最終判定を更新。

## 追加影響確認（受入条件再判定）
- テスト影響:
  - IT結合は `13 passed / 13 total` へ回復し、従来の `Prisma P3018` 起因Failを解消。
- 受入判定影響:
  - [[AT-SCN-005]]〜[[AT-SCN-009]] を完了扱いに更新し、`AT-RCHK -> AT-RPT -> AT-GO` の転記整合を確保。
  - [[RQ-SC-001]]〜[[RQ-SC-008]] の受容可否は全件 `Yes` へ更新。

## 追加実施（OpenAPI契約差分の是正）
- 対象: `DD-APP-API-001`, `DD-APP-API-015`。
- 変更内容:
  - `DD-APP-API-015` に `POST /api/v1/admin/publish/runs` を追加し、`POST /api/v1/admin/publish/tag-master` を後方互換経路として併記。
  - `DD-APP-API-001` の運用API一覧に `POST /api/v1/admin/publish/runs` を反映し、OpenAPI生成契約と一致化。

## 追加影響確認（OpenAPI契約差分是正）
- 契約整合:
  - `Only In OpenAPI` に出ていた `POST /api/v1/admin/publish/runs` の差分を解消。
- CI影響:
  - `task api:openapi:check` が期待する `OpenAPI <=/=> DD-APP-API-*` のエンドポイント一致条件を満たす構成へ復帰。
