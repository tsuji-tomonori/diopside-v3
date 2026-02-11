# video-archive-search

ローカルで動作する「動画アーカイブ（summary.json + tagging_results.json）検索 UI」を **React + TypeScript + Vite** で実装し、
**Jest による単体テスト** / **Playwright による E2E テスト** / **AWS CDK（CloudFront + S3）デプロイ** / **GitHub Actions デプロイ** まで含めたリポジトリです。

参照元（プロトタイプ）: `index.html` / `tagging_results.json` fileciteturn0file2 fileciteturn0file1

---

## ディレクトリ構成

- `web/` : フロントエンド（Vite + React + TS）
- `infra/` : AWS CDK (TypeScript) による S3 + CloudFront 構成
- `docs/` : 要件、操作マニュアル、スクリーンショット、品質チェックリスト、レビュー
- `.github/workflows/` : CI / Deploy
- `claudecode/skills/` : 実装時に用いた TS/React のベストプラクティス指針

---

## 前提

- Node.js 22+
- npm 10+

---

## ドキュメント運用（Task）

初回セットアップ:

```bash
task precommit
```

日常のdocs更新チェック:

```bash
task docs:guard
```

全体整合チェック:

```bash
task docs:check
```

個別ファイルのみ用語リンク確認:

```bash
task docs:autolink:check FILES="docs/path/to/doc.md"
```

---

## ローカル開発（Web）

```bash
cd web
npm ci
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

---

## 単体テスト（Jest）

```bash
cd web
npm test
npm run test:coverage
npm run typecheck
```

---

## E2E（Playwright）

初回のみブラウザをインストール:

```bash
cd web
npx playwright install --with-deps
```

E2E 実行:

```bash
cd web
npm run test:e2e
```

`docs/screenshots/` に正常系のスクリーンショットが出力されます。

---

## AWS へデプロイ（CDK）

> CloudFront + S3 に、`web/dist` をアップロードして配信します（SPA 対応で 404/403 を `/index.html` にフォールバック）。

```bash
cd web
npm ci
npm run build

cd ../infra
npm ci
npm run deploy
```

スタック出力に CloudFront のドメインが表示されます。

### @infra/ デプロイ手順

`infra/` は CDK から `web/dist` を参照するため、先にフロントエンドをビルドします。

```bash
cd web
npm ci
npm run build

cd ../infra
npm ci
npm run build
npm run synth
npm run deploy
```

スタック名は `cdk.json` の `VideoArchiveSearchStack` です。

`cdk deploy` が `ts-node` で失敗する場合は、`infra/` で devDependencies が入っていることを確認してください。
`NODE_ENV=production` などで devDependencies が省略される場合は、次のように明示してください。

```bash
cd infra
npm ci --include=dev
```

削除する場合:

```bash
cd infra
npm ci
npm run destroy
```

---

## GitHub Actions でのデプロイ

`deploy.yml` は **OIDC による AssumeRole** を前提にしています。
以下の GitHub Secrets を設定してください。

- `AWS_ROLE_TO_ASSUME` : GitHub Actions から Assume する IAM Role ARN
- `AWS_REGION` : 例 `ap-northeast-1`

`main` ブランチへの push（または手動実行）でデプロイが走ります。

---

## ドキュメント

- `docs/requirements.md` : SnowCards 形式の要件整理
- `docs/manual.md` : 操作手順（スクリーンショット付き）
- `docs/quality-checklist.md` : 品質基準チェックリスト
- `docs/review.md` : チェックリストに基づくセルフレビュー
