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
| IT結合(E2E) | Pass | 13 passed / 13 total |

## 改善内容（IT結合）
- Prisma migration `0003_check_constraints` を idempotent 化し、重複制約追加で失敗しないよう修正。
- E2E test-support のレート上限を実行件数に見合う値へ調整し、`/api/v1/test/support/db/metrics` の `429` を解消。
- 上記適用後に `[[IT-CASE-001]]`〜`[[IT-CASE-013]]` を再実行し、全件Passを確認。

## スコープ別テスト実装・Pass確認
| スコープ | 主な対応テスト | 実装有無 | 全Pass判定 |
| --- | --- | --- | --- |
| [[RQ-SC-001]] | [[IT-CASE-001]]〜[[IT-CASE-013]], Web/API単体 | あり | Yes |
| [[RQ-SC-002]] | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-012]] | あり | Yes |
| [[RQ-SC-003]] | [[IT-CASE-004]], [[IT-CASE-011]], [[IT-CASE-013]] | あり | Yes |
| [[RQ-SC-004]] | [[IT-CASE-010]], [[IT-CASE-011]] | あり | Yes |
| [[RQ-SC-005]] | [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], Web単体 | あり | Yes |
| [[RQ-SC-006]] | [[IT-CASE-006]], Web単体 | あり | Yes |
| [[RQ-SC-007]] | [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-012]] | あり | Yes |
| [[RQ-SC-008]] | [[IT-CASE-006]]（詳細導線の前提） | あり | Yes |

## 判定
- 全スコープで「テスト実装あり」を確認済み。
- IT結合（13/13）を含め、全スコープで「全Pass」を達成。
