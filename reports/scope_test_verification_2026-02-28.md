# Scope Test Verification Report (2026-02-28)

## 対象
- 全スコープ: [[RQ-SC-001]]〜[[RQ-SC-008]]
- 判定対象テスト:
  - API単体: `api/src/**/*.test.ts`
  - Web単体: `web/src/**/__tests__/*.test.ts`
  - IT結合(E2E): `web/e2e/it-cases.spec.ts`（[[IT-CASE-001]]〜[[IT-CASE-013]]）

## 実行コマンド
```bash
# API単体
cd api
npm ci
npm run prisma:generate
npm test

# Web単体
cd web
npm ci
npm test -- --runInBand

# IT結合(E2E)
cd web
npm run test:e2e:compose:up
PW_USE_COMPOSE=1 PW_BASE_URL=http://127.0.0.1:5173 PW_API_BASE_URL=http://127.0.0.1:3001 \
  PW_E2E_SECRET=e2e-secret PW_E2E_PRIVATE_JWK=<generated-jwk> \
  npm exec playwright test e2e/it-cases.spec.ts --project=pc
npm run test:e2e:compose:down
```

## 実行結果サマリ
| 区分 | 結果 | 詳細 |
| --- | --- | --- |
| API単体 | Pass | 2 passed / 2 total |
| Web単体 | Pass | 53 passed / 53 total |
| IT結合(E2E) | Fail | 13 failed / 13 total |

## 失敗原因（IT結合）
- `docker compose` 上のAPI起動時に Prisma migrate が失敗し、APIコンテナが起動継続できない。
- 主要エラー:
  - `P3018`
  - `ERROR: constraint "chk_videos_source_type" for relation "videos" already exists`
- 影響: `[[IT-CASE-001]]`〜`[[IT-CASE-013]]` は事前メトリクス取得（`/api/v1/test/support/db/metrics`）で `ECONNREFUSED` となり全件失敗。

## スコープ別テスト実装・Pass確認
| スコープ | 主な対応テスト | 実装有無 | 全Pass判定 |
| --- | --- | --- | --- |
| [[RQ-SC-001]] | [[IT-CASE-001]]〜[[IT-CASE-013]], Web/API単体 | あり | No |
| [[RQ-SC-002]] | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-012]] | あり | No |
| [[RQ-SC-003]] | [[IT-CASE-004]], [[IT-CASE-011]], [[IT-CASE-013]] | あり | No |
| [[RQ-SC-004]] | [[IT-CASE-010]], [[IT-CASE-011]] | あり | No |
| [[RQ-SC-005]] | [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], Web単体 | あり | No |
| [[RQ-SC-006]] | [[IT-CASE-006]], Web単体 | あり | No |
| [[RQ-SC-007]] | [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-012]] | あり | No |
| [[RQ-SC-008]] | [[IT-CASE-006]]（詳細導線の前提） | あり | No |

## 判定
- 全スコープで「テスト実装あり」は確認済み。
- ただしIT結合が全件Failのため、全スコープで「全Pass」は未達。
