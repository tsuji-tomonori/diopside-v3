## 実施内容（OpenAPI正本からAPI別Markdownを自動生成）
- 対象: `api/scripts/*`, `api/package.json`, `Taskfile.yaml`, `docs/2.基本設計(BD)/**API**`, `docs/3.詳細設計(DD)/**API**`, `docs/4.単体テスト(UT)`, `docs/5.結合テスト(IT)`, `.opencode/skills/*`.
- 変更内容:
  - 新規 `api/scripts/openapi-doc-metadata.ts` を追加し、operationId と生成先文書ID（`BD-APP-OAS-*`）の対応を定義。
  - 新規 `api/scripts/generate-openapi-docs.ts` を追加し、OpenAPI 正本から `docs/2.基本設計(BD)/03.アプリ(APP)/32.OpenAPI IF(IF)` 配下の Markdown を自動生成可能化。
  - 新規 `BD-APP-OAS-000` と `BD-APP-OAS-001`〜`BD-APP-OAS-023` を生成し、`1 operation = 1 markdown` の参照粒度を追加。
  - 生成本文は raw YAML を載せず、メソッド/パス/パラメータ/リクエストボディ/戻り値を表形式で出力する。
  - OpenAPI に説明がないパラメータ/フィールドも、日本語の説明文を自動補完して表へ出力する。
  - `api/package.json` と `Taskfile.yaml` に `docs:generate` / `docs:check`、`api:docs:generate` / `api:docs:check` を追加。
  - `BD-SYS-ADR-023`, `BD-APP-API-001`, `BD-APP-API-004`, `BD-APP-API-005`, `DD-APP-API-001`, `UT-PLAN-001`, `UT-PLAN-005`, `IT-PLAN-001` を更新し、OpenAPI正本・自動生成文書・既存DDフロー文書の責務分離を明文化。
  - `.opencode/skills/doc-bd-api`, `.opencode/skills/doc-dd-api`, `.opencode/skills/docops-orchestrator` を更新し、自動生成運用へ同期。

## 影響確認
- 契約正本:
  - HTTP API の正本は引き続き OpenAPI（Hono 生成）であり、`BD-APP-OAS-*` はその生成ビューとして扱う。
  - `DD-APP-API-*` はフロー/制約/オラクルの設計入力として維持し、I/F の手書き正本に戻さない。
- テスト影響:
  - UT は I/F 観点を OpenAPI / `BD-APP-OAS-*`、因子抽出と分岐観点を `DD-APP-API-*` に分離。
  - IT は I/F 判定を OpenAPI / `BD-APP-OAS-*`、シナリオ/オラクル判定を `DD-APP-API-*` に分離。
- 運用影響:
  - API変更時は `task api:docs:generate` / `task api:docs:check` を追加で実行する。
  - `docs:deploy(:ci)` は OpenAPI生成後に API別Markdown を生成し、その同期チェックを通過してから配備する。

## 更新文書
- 新規スクリプト: `api/scripts/openapi-doc-metadata.ts`, `api/scripts/generate-openapi-docs.ts`
- 新規生成文書: `BD-APP-OAS-000`, `BD-APP-OAS-001`〜`BD-APP-OAS-023`
- 更新: `api/package.json`, `Taskfile.yaml`
- 更新: `BD-SYS-ADR-023`, `BD-APP-API-001`, `BD-APP-API-004`, `BD-APP-API-005`, `DD-APP-API-001`, `UT-PLAN-001`, `UT-PLAN-005`, `IT-PLAN-001`
- 更新スキル: `doc-bd-api`, `doc-dd-api`, `docops-orchestrator`

## 検証予定
- `npm --prefix api run docs:generate`
- `npm --prefix api run docs:check`
- `npm --prefix api run openapi:check`
- `task docs:guard`
