# diopside

diopside（白雪 巴/Shirayuki Tomoe の公開YouTubeアーカイブ収集・蓄積・検索Webアプリ）の
ドキュメントと実装コードを同一リポジトリで管理します。

このリポジトリは、要求/設計/テスト/受入文書を `docs/` で一元管理し、
アプリ実装を `web/` で管理します。`Taskfile.yaml` と CI で文書整合を検証します。

[docs](https://d1da9dd6gfwbw6.cloudfront.net/)

## リポジトリ構成

- `docs/`: Obsidian文書本体（RQ/BD/DD/UT/IT/AT）
- `reports/`: 影響確認記録と文書チェックレポート
- `.opencode/`: OpenCode用のスキル/エージェント/コマンド
- `Taskfile.yaml`: docs運用タスク（autolink/check/guard/deploy）
- `infra/`: ドキュメント公開用AWS CDK（CloudFront + S3）
- `.github/workflows/docs-link-check.yml`: 変更docs向けCI検証
- `web/`: フロントエンド実装（Vite + React + TypeScript）

## docs構成（フェーズ）

- `docs/1.要求(RQ)`
- `docs/2.基本設計(BD)`
- `docs/3.詳細設計(DD)`
- `docs/4.単体テスト(UT)`
- `docs/5.結合テスト(IT)`
- `docs/6.受入テスト(AT)`
- `docs/7.運用・リリース(OPS_REL)`
- `docs/8.ユーザーガイド(GUIDE)`

機能要求（FR）の管理方針と最新構成は次を参照してください。

- `docs/1.要求(RQ)/51.機能要求(FR)`
- `AGENTS.md`

## 文書運用ルール（リンク）

- `AGENTS.md`
- `docs/1.要求(RQ)/81.ドキュメント更新フローと受け入れ基準(DG)/RQ-DG-001.md`

## 変更フロー

1. 対象文書を更新
2. `up` / `related` を確認し、関連文書を更新または確認記録化
3. `reports/impact_check_YYYY-MM-DD.md` を更新
4. `task docs:guard` を実行（用語リンク補正 + 変更対象検証）
5. 必要に応じて `task docs:check` を実行（全体検証）

## Taskコマンド

初回セットアップ:

```bash
task precommit
```

日常運用:

```bash
task docs:guard
```

全体整合チェック:

```bash
task docs:check
```

ドキュメント公開（Quartz build + CDK deploy）:

```bash
task docs:deploy
```

補足:

- `quartz/` がない場合は `quartz:prepare` で自動 `git clone` されます（Git管理対象外）。
- Quartz設定の正本は `config/quartz/` 配下で管理し、`task quartz:build` 実行時に `quartz/` へ同期されます。
- AWS 認証情報（`CDK_DEFAULT_ACCOUNT` / `CDK_DEFAULT_REGION`）を設定してから実行してください。

個別ファイルの用語リンクチェック:

```bash
task docs:autolink:check FILES="docs/path/to/doc.md"
```

## CI

`Docs Link Check` ワークフローが、変更された `docs/**/*.md` を対象に次を実行します。

- 用語リンクチェック（`auto_link_glossary.py --check`）
- 文書ID/リンク整合チェック（`validate_vault.py --targets ...`）

## web（実装）

`web/` は Vite + React + TypeScript の実装コードです。

```bash
cd web
npm ci
npm run dev
```

主なコマンド:

- `npm run typecheck`
- `npm test`
- `npm run test:e2e`
