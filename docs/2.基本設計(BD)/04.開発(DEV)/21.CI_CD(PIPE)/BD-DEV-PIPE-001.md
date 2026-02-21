---
id: BD-DEV-PIPE-001
title: ビルド方針（デプロイ単位分離）
doc_type: ビルド設計
phase: BD
version: 1.0.8
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-21'
up:
- '[[RQ-SC-001]]'
- '[[RQ-FR-001]]'
- '[[RQ-DEV-001]]'
related:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-SYS-ADR-001]]'
- '[[BD-SYS-ADR-011]]'
- '[[BD-SYS-ADR-022]]'
- '[[BD-SYS-ADR-024]]'
- '[[BD-SYS-ADR-016]]'
- '[[BD-SYS-ADR-019]]'
- '[[BD-INF-DEP-003]]'
- '[[BD-INF-DEP-004]]'
- '[[BD-APP-API-004]]'
- '[[DD-DEV-CODE-001]]'
- '[[RQ-DEV-005]]'
- '[[RQ-DEV-006]]'
- '[[RQ-DEV-007]]'
- '[[RQ-SEC-005]]'
- '[[BD-SYS-ADR-039]]'
tags:
- diopside
- BD
- BUILD
---


## 設計方針
- ビルド責務を「ドキュメント」「フロントエンド」「バックエンド」「インフラ」の4つのデプロイ単位で分離し、単位ごとに成果物と失敗条件を固定する。
- 共通品質ゲート（`lint` / `test` / `build`）に加え、単位固有ゲートを必須化し、どの単位で失敗したかを即時判別できる構成を採用する。
- TypeScriptの型安全は実装規約ではなくビルド失敗条件として扱い、`tsconfig` と lint を同時に満たす。
- CDKの `synth` を決定的に保ち、同一コミットから同一テンプレートを再現できるビルド構成を採用する。

## 設計要点
### デプロイ単位別ビルド方針
| デプロイ単位 | 主成果物 | 主配信経路/配置先 | 単位固有ゲート | 失敗時の扱い |
|---|---|---|---|---|
| ドキュメント | `quartz/public` | `/docs/*`（CloudFront + S3） | `task docs:guard`、`npx quartz build -d ../docs`、`siteAssetPath` 整合確認 | docs配信のみ停止し、他単位の成果物を流用しない |
| フロントエンド | `web/dist` | `/web/*` | `npm --prefix web run typecheck`、`npm --prefix web run test`、`npm --prefix web run build` | `/web/*` 更新を中断し、直前成果物を維持 |
| バックエンド | API/OpenAPI配信アセット | `/api/v1/*`、`/openapi/v1/openapi.json` | API版とOpenAPI版の一致確認、`/api/v1/*` と `/openapi/*` へのrewrite非適用確認 | 版不整合時は `/api` と `/openapi` の公開を停止 |
| インフラ | CDK template、CloudFront/S3設定 | 配信基盤全体 | `npm --prefix infra run build`、`npm --prefix infra run test`、`npm --prefix infra run synth`、`cdk-nag` | 基盤変更を中断し、配信経路設定を切り戻す |

### 共通TypeScript品質ゲート
- `tsconfig` 必須設定は `strict: true` を基準とし、`noUncheckedIndexedAccess: true`、`exactOptionalPropertyTypes: true`、`useUnknownInCatchVariables: true` を標準有効化する。
- ドメインID/単位/環境識別は裸の `string`/`number` で受け渡しせず、Brand/Opaque 相当で型を分離する。
- 配列/辞書アクセスは「存在しない可能性」を型へ反映し、`obj[key]` の結果を未検証で使用しない。
- optional設計は `prop?: T`（未存在）と `prop: T | undefined`（存在+未定義）を使い分け、DTO/保存データの意味差を明示する。
- 外部入力（JSON/API/env/query/localStorage）は `unknown` で受け取り、型ガードまたはバリデーション後に内部型へ変換する。
- 外部入力の検証は境界で1回だけ実施し、未検証データと検証済みデータを同一型で混在させない。
- 状態遷移は discriminated union（`kind`/`state`）を採用し、`switch` + `never` で網羅性チェックを行う。
- センチネル値（`null`/`-1`/`NaN`）で失敗を表現せず、判別可能union（`Option/Result` 相当）で分岐を強制する。
- boolean blindness を避けるため、ドメイン状態は `boolean` ではなく union/enum を優先する。
- 空配列を許容しない計算は `NonEmptyArray` 相当で事前条件を型へ反映する。
- 型アサーション `as` は最終手段とし、設定オブジェクトや定数マップ検証では `satisfies` を優先する。
- `as any` を含む unsafe cast は層境界（infrastructure）へ限定し、理由と除去計画を記録する。
- 二重定義を避けるため、`as const`、`typeof`、`keyof`、utility types（`Pick`/`Omit`/`Partial` 等）で「値から型を導出」する。
- `interface` は拡張前提のオブジェクト形状、`type` は union/型演算中心で利用し、使い分けを規約化する。
- Genericsは「型同士の関係」を表す場合に限定し、単独出現の型パラメータは導入しない。
- 型専用importは `import type` を強制し、`@typescript-eslint/no-explicit-any` と `@typescript-eslint/consistent-type-imports` を品質ゲートに含める。
- リソース解放は `using`（利用可能な環境）または `try/finally` を必須とし、解放漏れを受入不可とする。

### インフラ決定性ゲート
- CDK変更を含む場合は `cdk synth` を必須ゲートに追加し、生成テンプレートが副作用なく再現できることを確認する。
- `fromLookup()` 等の結果を含む `cdk.context.json` は成果物の再現性のため差分管理し、コミット対象とする。
- `aws-cdk-lib` と `constructs` はメジャーバージョン整合を維持し、依存更新時は `synth` とテストで互換性を検証する。
- Construct/Stack内部で `process.env` を直接参照せず、設定は型付きpropsで注入する。

### Next.js本番品質ゲート
- App Router構成では `next build` 成功後に `next start` で本番相当起動を確認し、開発時挙動との差分を[[AT-GO-001|リリース判定]]に含める。
- ウォーターフォール検知のため、Server Components の逐次 await をレビュー対象にし、並列取得/preload/Suspense適用有無を確認する。
- Dynamic API（`cookies()` / `headers()` / `searchParams`）利用箇所を記録し、Root Layout で全体動的化を起こしていないことを検証する。
- `fetch` は `cache` / `next.revalidate` / `next.tags` を意図的に指定し、再検証は `revalidatePath` / `revalidateTag` のどちらを使うかを設計に明示する。
- 画像とスクリプトは `next/image` と `<Script>` を標準利用し、リモート画像の `width/height` 指定漏れを受入不可とする。
- `@next/bundle-analyzer` による依存肥大検知を定期実行し、主要導線の Core Web Vitals は `useReportWebVitals` で収集する。
- [[BD-DEV-ENV-001|開発環境]]では Turbopack 前提を維持し、巨大barrel importや過剰な再エクスポートによる開発遅延を品質レビュー対象にする。

### アクセシビリティCIゲート（[[RQ-UX-021]]）
- Pull Requestごとにアクセシビリティ自動検査を必須実行し、`npm --prefix web run test:a11y` を共通入口とする。
- 重大度判定は `Critical/High` をリリースブロッカーとし、1件以上でCIジョブを失敗させる。
- `Moderate/Low` は警告として記録するが、同一指摘が3回連続で残存した場合は改善計画未記載で受入不可とする。
- 誤検知の一時除外は有効期限付き（最大30日）で管理し、例外ID・期限・改善チケットIDを検査ログへ記録する。
- 検査結果はArtifactsまたは監査ログとして90日以上保持し、`AT-RPT-001` と `AT-GO-001` で参照可能にする。
- 自動検査だけで代替せず、リリース前にキーボード操作とスクリーンリーダーの手動確認を補助ゲートとして運用する。

### GitHub Actions実装補足
- PR品質ゲートはGitHub Actions `ci` ワークフローで実行し、必須ステータスチェック名は `ci-docs` / `ci-web` / `ci-api` / `ci-infra` を正本とする。
- 必須ステータスチェック名とjob名は1対1で管理し、別ワークフローで同名jobを作成しない。
- 単位別ジョブの実行条件は `paths` を基準に制御し、共有設定変更時は影響単位を拡張実行する。
- デプロイ系ワークフローは環境単位 `concurrency` を必須設定とし、同一環境への並列反映を禁止する。
- 本番デプロイはGitHub Environment `prod` の承認ゲートを必須とし、`workflow_dispatch` 実行時も同じ保護ルールを適用する。
- Artifacts命名は `<単位>-<branch>-<shortsha>` で統一し、a11y結果を含む判定証跡は90日以上保持する。

## 受入基準
- CIで `tsc --noEmit` と lint が常時成功し、上記4つの `tsconfig` オプションが有効である。
- 新規追加コードに `any` を導入する場合は、理由と除去計画をPR本文へ明記しない限り受入不可とする。
- `catch` 節、外部入力処理、union分岐で未絞り込み利用がないことをレビューで確認できる。
- 外部入力境界に decode/validate の実装が存在し、未検証値がドメイン層へ直接流入していない。
- センチネル値に依存した分岐が新規追加されていない（`Option/Result` 相当へ置換されている）。
- `boolean` 引数/戻り値で状態意味が不明瞭なAPIが新規追加されていない（union/enumへ置換されている）。
- 非空前提の配列処理に空配列の暗黙許容がなく、`NonEmptyArray` 相当または事前検証が実装されている。
- `as any` など unsafe cast が層境界外へ拡散していない。
- ファイル/接続など明示解放が必要な資源で、`using` または `try/finally` による解放保証がある。
- 型のみ参照のimportが `import type` へ統一されている。
- CDK変更時は `lint` / `test` / `cdk synth` / `cdk-nag` が同一パイプラインで成功する。
- `cdk.context.json` の更新がある場合は差分の根拠をPRへ記載し、未コミット状態を受入不可とする。
- ドキュメント単位は `task docs:guard` と `quartz build` が成功し、`siteAssetPath` が `quartz/public` と一致する。
- フロントエンド単位は `web` の `typecheck` / `test` / `build` が成功し、成果物が `/web/*` 配信前提を満たす。
- バックエンド単位は `/api/v1/*` と `/openapi/v1/openapi.json` の版対応が一致し、`/api` と `/openapi` でrewrite/fallbackが無効である。
- 単位別失敗時は対象単位のみ再実行可能であり、未検証単位の成果物を混在配備しない。
- Next.js 対象単位では `next build` + `next start` が連続成功し、App Router 主要導線で Suspense/Loading による待機表示が成立する。
- Dynamic API の利用が設計記載と一致し、意図しない全体Dynamic Rendering化がない。
- `fetch` のキャッシュ/再検証方針（`cache`/`revalidate`/`tags`）が文書化され、更新導線に `revalidatePath` または `revalidateTag` が接続されている。
- LCP寄与画像は `next/image` で配信され、リモート画像ではCLS防止のため寸法指定がある。
- 主要導線のCWV（LCP/INP/CLS）を `useReportWebVitals` で記録し、Lighthouse結果のみで合否を決めない。
- PRごとに `npm --prefix web run test:a11y` が実行され、`Critical/High` が0件である。
- a11y例外は有効期限付きで記録され、期限超過または改善チケット未紐付けの例外が存在しない。
- a11y検査結果が90日以上保持され、`AT-RPT-001` と `AT-GO-001` から参照可能である。

## 変更履歴
- 2026-02-21: GitHub Actions採用に伴う実装補足（必須チェック名、paths、concurrency、Environment承認、Artifacts命名）を追加 [[BD-SYS-ADR-039]]
- 2026-02-13: [[RQ-UX-021]] 対応としてアクセシビリティCIゲート（重大度閾値、期限付き例外、90日保持、手動補助ゲート）を追加 [[BD-SYS-ADR-024]]
- 2026-02-11: Next.js App Router向け品質ゲート（build/start、Dynamic API、fetch再検証、画像/Script、Web Vitals）を追加 [[BD-SYS-ADR-024]]
- 2026-02-11: 防御的型付けゲート（Brand、境界decode、センチネル禁止、NonEmpty、資源解放）を追加 [[BD-SYS-ADR-022]]
- 2026-02-11: デプロイ単位（docs/web/api/infra）別のビルド方針と単位固有ゲートを追加 [[BD-SYS-ADR-019]]
- 2026-02-11: CDK決定性ゲート（`cdk synth`、`cdk.context.json`、props注入、依存整合）を追加 [[BD-SYS-ADR-016]]
- 2026-02-11: TypeScript型安全方針（tsconfig厳格化、`unknown` 境界、`satisfies`、lintゲート）を追加 [[BD-SYS-ADR-011]]
- 2026-02-10: 新規作成 [[BD-SYS-ADR-001]]
