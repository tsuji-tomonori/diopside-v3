## 実施内容（UTペアワイズ生成差分の安定化）
- 対象: `scripts/pairwise/generate_pairwise_md.py`, `Taskfile.yaml`, `docs/4.単体テスト(UT)/21.単体テストケース(CASE)/**/UT-CASE-*-PW.md`。
- 変更内容:
  - `generate_pairwise_md.py` を更新し、既存生成物の `created` / `updated` / `変更履歴` を読み取って、内容変更がない場合は日付だけで差分を出さないよう修正。
  - 内容変更時のみ `updated` と `変更履歴` を当日に進めるようにし、同日再実行でも冪等になるよう調整。
  - `Taskfile.yaml` の `docs:autolink:changed` から `UT-CASE-*-PW.md` を除外し、自動生成物へ用語自動リンクが再注入される循環差分を防止。
  - モデルと生成物が不整合だった `UT-CASE-FE-UI-U03-PW` と `UT-CASE-BE-DD-APP-API-007-PW` を再生成して同期。

## 影響確認
- CI影響:
  - `task docs:ut:pairwise:check` は、モデル未変更時に日付だけで fail しない。
  - `task docs:ut:stat:check` に含まれる pairwise 生成差分チェックの恒常失敗を解消。
- 運用影響:
  - 標準フローの `task docs:guard` 実行後も、`UT-CASE-*-PW.md` が自動リンクで再汚染されず、generator 正本を維持できる。
  - モデル側因子名変更は従来通り生成物差分として検出される。

## 更新文書
- 更新: `scripts/pairwise/generate_pairwise_md.py`
- 更新: `Taskfile.yaml`
- 更新: `UT-CASE-FE-UI-U03-PW`
- 更新: `UT-CASE-BE-DD-APP-API-007-PW`

## 検証
- `task docs:ut:pairwise:check`
- `task docs:guard`
- `task docs:ut:stat:check`

## 追加実施（BD API契約の異常系明記）
- 対象: `api/src/routes/{ops,admin,public}.ts`, `api/src/schemas/common.ts`, `docs/2.基本設計(BD)/01.設計判断(ADR)/BD-SYS-ADR-023.md`, `docs/2.基本設計(BD)/03.アプリ(APP)/31.API(API)/BD-APP-API-{003,004,005}.md`, `.opencode/skills/{doc-bd-api,doc-dd-api,doc-it-plan,docops-orchestrator,obsidian-doc-check,skill-maintainer}/SKILL.md`。
- 変更内容:
  - OpenAPI正本の各 route に、認証/認可/入力検証/対象不存在/競合/内部障害に対応する Problem Details レスポンスを追加し、`BD-APP-OAS-*` 再生成時に異常系が個票へ反映されるよう更新。
  - `BD-APP-API-003` / `BD-APP-API-004` / `BD-APP-API-005` と `BD-SYS-ADR-023` を更新し、operation単位契約で異常系レスポンスを省略しない方針と、`401/403/400/404/409/429/500` の適用基準を追記。
  - 関連スキルを更新し、API契約変更時に異常系レスポンスの明記と検証を同一変更で扱うよう同期。

## 追加影響確認（BD API契約の異常系明記）
- API契約:
  - `task api:openapi:generate` / `task api:docs:generate` により、`BD-APP-OAS-*` の戻り値表へ異常系レスポンスが追加される。
  - `task api:docs:check` / `task api:openapi:check` で、OpenAPI `responses` と `BD-APP-OAS-*` の異常系整合を継続検証できる。
- docs運用:
  - `doc-bd-api` / `doc-dd-api` / `doc-it-plan` / `docops-orchestrator` / `obsidian-doc-check` / `skill-maintainer` が同一ルールで更新され、以後のAPI契約追加時にも 200 系のみの個票に戻りにくくなる。

## 追加実施（BD-INFリソース一覧と `cdk synth` の自動照合）
- 対象: `scripts/docs_infra/check_bd_resource_inventory.py`, `Taskfile.yaml`, `README.md`, `.github/workflows/ut-static-analysis.yml`, `docs/2.基本設計(BD)/01.設計判断(ADR)/BD-SYS-ADR-044.md`, `docs/2.基本設計(BD)/04.インフラ(INF)/31.コンピュートと配備(CMP_DEP)/BD-INF-DEP-005.md`, `docs/2.基本設計(BD)/04.インフラ(INF)/52.IaCと構成管理(IAC_CM)/BD-INF-IAC-001.md`。
- 変更内容:
  - `BD-INF-DEP-005` の管理対象AWSリソース一覧を現行 prod IaC に合わせて見直し、同一文書内へ selector 付き比較定義を追加。
  - `check_bd_resource_inventory.py` を追加し、fixture asset path を使って prod 条件の `cdk synth` を実行し、主リソースの過不足と未記載リソースを `reports/infra_resource_check.md` へ出力するよう実装。
  - `docs:infra:check` / `docs:infra:check:changed` を追加し、`docs:check` / `docs:guard` / `docs:ut:stat:check` から自動実行するよう統合。
  - ADR `BD-SYS-ADR-044` と `BD-INF-IAC-001` を更新し、synth フェーズの必須出力へ「管理対象リソース照合レポート」を追加。

## 追加影響確認（BD-INFリソース一覧と `cdk synth` の自動照合）
- docs運用:
  - `task docs:guard` は関連INF文書または `infra/**` の変更を含む場合に、`BD-INF-DEP-005` と prod `cdk synth` の過不足を自動検知できる。
  - `task docs:check` は Vault整合に加えて `reports/infra_resource_check.md` を生成し、主リソース未記載や設計個数の乖離を fail とする。
- CI影響:
  - `UT Static Analysis` は `scripts/docs_infra/**` の変更でも起動し、docs側比較ロジック単体の変更漏れを見逃さない。
  - 比較は `infra/test/fixtures/site` を使うため、Quartz build や AWS 認証に依存せず再現可能。

## 追加実施（`/web/*` 配信修正）
- 対象: `infra/lib/quartz-site-stack.ts`, `infra/functions/web-spa-rewrite.js`, `infra/test/{quartz-site-stack,web-spa-rewrite}.test.ts`, `infra/test/fixtures/web/index.html`, `web/vite.config.ts`, `Taskfile.yaml`, `scripts/docs_infra/check_bd_resource_inventory.py`, `docs/2.基本設計(BD)/01.設計判断(ADR)/BD-SYS-ADR-014.md`, `docs/2.基本設計(BD)/04.インフラ(INF)/31.コンピュートと配備(CMP_DEP)/BD-INF-DEP-005.md`, `docs/3.詳細設計(DD)/03.インフラ(INF)/20.配信基盤(CF)/DD-INF-CF-002.md`。
- 変更内容:
  - CloudFront の `/web/*` に viewer-request Function を追加し、`/web/` と拡張子なし deep link を `/web/index.html` へ収束させる SPA fallback を実装。
  - CDK の Web 配備物を placeholder から `web/dist` へ切り替え、`task infra:synth` / `task infra:deploy` / CI 配備で `webAssetPath` を渡すよう更新。
  - Vite build に `VITE_PUBLIC_BASE=/web/` を注入し、配備後の JS/CSS/静的 JSON が `/web/*` 配下から解決されるよう調整。
  - `docs_infra` の synth fixture に `web` 側アセットを追加し、CloudFront Function 数と SPA fallback の設計文書を現行 IaC に同期。

## 追加影響確認（`/web/*` 配信修正）
- 配信影響:
  - `https://<distribution>/web/` は匿名で `index.html` を返し、`/web/<deep-path>` 直叩きでも SPA 表示を継続できる。
  - `/web/bootstrap.json` や `/web/assets/*` は拡張子付き静的アセットとして rewrite 対象外のまま配信される。
- ビルド/運用影響:
  - `task infra:synth` / `task infra:deploy` は `web/dist` のビルドを前提に動作し、`docs:verify` は `/web/` の到達も検証する。
  - `task docs:infra:check` は `infra/test/fixtures/web` を用いて、Web ビルド前でも CloudFront 構成差分を再現検証できる。
