import { expect, test, type APIRequestContext } from '@playwright/test';
import { getE2EAuthToken } from './auth';

const apiBase = process.env.PW_API_BASE_URL || 'http://127.0.0.1:3001';
const e2eSecret = process.env.PW_E2E_SECRET;

if (!e2eSecret) {
  throw new Error('PW_E2E_SECRET is required for test-support endpoints');
}

let bearerToken = '';

function authHeaders(extra?: Record<string, string>) {
  return {
    authorization: `Bearer ${bearerToken}`,
    ...extra,
  };
}

async function apiGet(request: APIRequestContext, path: string, headers?: Record<string, string>) {
  return request.get(`${apiBase}${path}`, { headers: authHeaders(headers) });
}

async function apiPost(
  request: APIRequestContext,
  path: string,
  data?: unknown,
  headers?: Record<string, string>
) {
  return request.post(`${apiBase}${path}`, { data, headers: authHeaders(headers) });
}

async function apiPatch(
  request: APIRequestContext,
  path: string,
  data?: unknown,
  headers?: Record<string, string>
) {
  return request.patch(`${apiBase}${path}`, { data, headers: authHeaders(headers) });
}

async function supportPost(request: APIRequestContext, path: string, data?: unknown) {
  return apiPost(request, path, data, { 'x-e2e-secret': e2eSecret });
}

async function supportGet(request: APIRequestContext, path: string) {
  return apiGet(request, path, { 'x-e2e-secret': e2eSecret });
}

async function dbMetrics(request: APIRequestContext) {
  const res = await supportGet(request, '/api/v1/test/support/db/metrics');
  expect(res.ok()).toBeTruthy();
  return (await res.json()) as {
    connected: boolean;
    ingestion_runs: number;
    publish_runs: number;
    recheck_runs: number;
  };
}

async function attachDbMetrics(
  request: APIRequestContext,
  testInfo: { attach: (name: string, options: { body: string; contentType: string }) => Promise<void> },
  label: string,
) {
  const metrics = await dbMetrics(request);
  await testInfo.attach(label, {
    body: JSON.stringify(metrics, null, 2),
    contentType: 'application/json',
  });
}

async function setRunStatus(request: APIRequestContext, runId: string, status: 'queued' | 'running' | 'succeeded' | 'failed') {
  const update = await supportPost(request, `/api/v1/test/support/runs/${runId}/status`, {
    status,
    processed_count: status === 'succeeded' ? 2 : status === 'failed' ? 2 : 0,
    success_count: status === 'succeeded' ? 2 : 0,
    failed_count: status === 'failed' ? 2 : 0,
    error_summary: status === 'failed' ? 'simulated ingestion failure' : null,
  });
  expect(update.ok()).toBeTruthy();
}

async function setPublishStatus(
  request: APIRequestContext,
  publishRunId: string,
  status: 'running' | 'succeeded' | 'failed',
) {
  const update = await supportPost(request, `/api/v1/test/support/publish/${publishRunId}/status`, {
    status,
    error_code: status === 'failed' ? 'PUBLISH_STEP_FAILED' : null,
    error_message: status === 'failed' ? 'simulated publish failure' : null,
    retryable: status !== 'succeeded',
  });
  expect(update.ok()).toBeTruthy();
}

async function pollRun(request: APIRequestContext, runId: string) {
  let status = 'queued';
  for (let i = 0; i < 20; i++) {
    const res = await apiGet(request, `/api/v1/ops/ingestion/runs/${runId}`);
    expect(res.ok()).toBeTruthy();
    const json = (await res.json()) as { status: string };
    status = json.status;
    if (status === 'succeeded' || status === 'failed' || status === 'partial' || status === 'cancelled') {
      return status;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return status;
}

async function resetState(request: APIRequestContext) {
  for (let i = 0; i < 12; i++) {
    try {
      const res = await supportPost(request, '/api/v1/test/support/reset');
      if (res.ok()) {
        const body = (await res.json()) as { db?: { connected?: boolean } };
        expect(body.db?.connected).toBeTruthy();
        return;
      }
    } catch {
      // retry until API boot completes
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
}

test.beforeAll(async () => {
  bearerToken = await getE2EAuthToken();
});

test.beforeEach(async ({ request }, testInfo) => {
  await resetState(request);
  await attachDbMetrics(request, testInfo, 'db-metrics-after-reset');
});

test.afterEach(async ({ request }, testInfo) => {
  await attachDbMetrics(request, testInfo, 'db-metrics-after-test');
});

test('IT-CASE-001 収集実行起動API 結合テスト', async ({ request }) => {
  const key = 'it-case-001-key';
  const payload = {
    trigger_mode: 'manual',
    run_kind: 'official_ingestion',
    target_types: ['official'],
  };

  const res1 = await apiPost(request, '/api/v1/ops/ingestion/runs', payload, { 'idempotency-key': key });
  expect(res1.status()).toBe(202);
  const body1 = (await res1.json()) as { run_id: string };
  expect(body1.run_id).toBeTruthy();
  const metricsAfterCreate = await dbMetrics(request);
  expect(metricsAfterCreate.ingestion_runs).toBeGreaterThan(0);

  const res2 = await apiPost(request, '/api/v1/ops/ingestion/runs', payload, { 'idempotency-key': key });
  expect(res2.status()).toBe(202);
  const body2 = (await res2.json()) as { run_id: string };
  expect(body2.run_id).toBe(body1.run_id);

  const conflict = await apiPost(
    request,
    '/api/v1/ops/ingestion/runs',
    payload,
    { 'idempotency-key': 'it-case-001-conflict' }
  );
  expect(conflict.status()).toBe(409);

  const invalidTarget = await apiPost(
    request,
    '/api/v1/ops/ingestion/runs',
    { ...payload, target_types: [] },
    { 'idempotency-key': 'it-case-001-invalid-target' }
  );
  expect(invalidTarget.status()).toBe(400);

  const missingIdempotency = await apiPost(request, '/api/v1/ops/ingestion/runs', payload);
  expect(missingIdempotency.status()).toBe(400);
});

test('IT-CASE-002 収集実行状態API 結合テスト', async ({ request }) => {
  const start = await apiPost(
    request,
    '/api/v1/ops/ingestion/runs',
    {
      trigger_mode: 'manual',
      run_kind: 'official_ingestion',
      target_types: ['official'],
    },
    { 'idempotency-key': 'it-case-002-start' }
  );
  const run = (await start.json()) as { run_id: string };

  const queued = await apiGet(request, `/api/v1/ops/ingestion/runs/${run.run_id}`);
  expect(queued.status()).toBe(200);
  const queuedJson = (await queued.json()) as { status: string };
  expect(queuedJson.status).toBe('queued');

  await setRunStatus(request, run.run_id, 'running');
  const running = await apiGet(request, `/api/v1/ops/ingestion/runs/${run.run_id}`);
  const runningJson = (await running.json()) as { status: string };
  expect(runningJson.status).toBe('running');

  await setRunStatus(request, run.run_id, 'succeeded');
  const status = await pollRun(request, run.run_id);
  expect(status).toBe('succeeded');

  const failedStart = await apiPost(
    request,
    '/api/v1/ops/ingestion/runs',
    {
      trigger_mode: 'manual',
      run_kind: 'appearance_supplement',
      target_types: ['appearance'],
    },
    { 'idempotency-key': 'it-case-002-failed' }
  );
  const failedRun = (await failedStart.json()) as { run_id: string };
  await setRunStatus(request, failedRun.run_id, 'failed');
  const failedStatus = await pollRun(request, failedRun.run_id);
  expect(failedStatus).toBe('failed');

  const failedGet = await apiGet(request, `/api/v1/ops/ingestion/runs/${failedRun.run_id}`);
  const failedJson = (await failedGet.json()) as { error_summary: string | null };
  expect(failedJson.error_summary).toBeTruthy();

  const notFound = await apiGet(request, '/api/v1/ops/ingestion/runs/00000000-0000-4000-8000-000000000000');
  expect(notFound.status()).toBe(404);
});

test('IT-CASE-003 アーカイブ一覧配信契約 結合テスト', async ({ page, request }) => {
  await Promise.all([
    page.waitForResponse((r) => r.url().includes('/bootstrap.json') && r.ok()),
    page.waitForResponse((r) => r.url().includes('/archive_index.p0.json') && r.ok()),
    page.goto('/'),
  ]);
  await expect(page.getByRole('heading', { name: 'アーカイブタグ検索' })).toBeVisible();

  const bootstrapRes = await request.get('/bootstrap.json');
  const bootstrap = (await bootstrapRes.json()) as { latest: unknown[] };
  expect(bootstrap.latest.length).toBeGreaterThan(0);

  const pillText = await page.locator('#pill').textContent();
  expect(pillText).toContain('/');
});

test('IT-CASE-004 タグ辞書配信契約 結合テスト', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters' }).click();
  await expect(page.getByRole('dialog', { name: 'Filters Drawer' })).toBeVisible();
  await page.getByPlaceholder('例: 雑談 / ホラー / コラボ').fill('雑談');
  const category = page.locator('details.tagCategory > summary').filter({ hasText: /^大分類から選ぶ/ });
  await category.click();
  await page.locator('.tagRow', { hasText: '雑談' }).first().click();
  await page.getByRole('button', { name: '適用' }).click();
  await expect(page.locator('#topTags').locator('.chip', { hasText: '雑談' })).toBeVisible();
});

test('IT-CASE-005 検索契約（クライアント実行）結合テスト', async ({ page }) => {
  await page.goto('/');
  await page.locator('#q').fill('麻雀');
  await page.waitForTimeout(300);
  await expect(page.locator('#pill')).toContainText('/');

  await page.getByRole('button', { name: 'Filters' }).click();
  await page.locator('select').first().selectOption('OR');
  await page.getByRole('button', { name: '閉じる' }).first().click();

  await page.getByRole('button', { name: '↑ 古い順' }).click();
  await expect(page.getByRole('button', { name: '↑ 古い順' })).toHaveClass(/active/);
  await page.getByRole('button', { name: 'クリア' }).click();
  await expect(page.getByRole('button', { name: '↓ 新しい順' })).toHaveClass(/active/);
});

test('IT-CASE-006 動画詳細表示契約 結合テスト', async ({ page }) => {
  await page.goto('/');
  const firstCard = page.locator('.grid .card').first();
  await expect(firstCard).toBeVisible();
  await firstCard.click();
  await expect(page.locator('#player')).toBeVisible();

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'YouTubeで開く' }).click(),
  ]);
  await expect(popup).toHaveURL(/youtube\.com\/watch\?v=/);
  await popup.close();
  await page.locator('#dlg').getByRole('button', { name: '閉じる' }).click();
});

test('IT-CASE-007 再収集API 結合テスト', async ({ request }) => {
  const failed = await apiPost(
    request,
    '/api/v1/ops/ingestion/runs',
    {
      trigger_mode: 'manual',
      run_kind: 'appearance_supplement',
      target_types: ['appearance'],
    },
    { 'idempotency-key': 'it-case-007-failed' }
  );
  const failedRun = (await failed.json()) as { run_id: string };
  await setRunStatus(request, failedRun.run_id, 'failed');
  await pollRun(request, failedRun.run_id);

  const retry = await apiPost(request, `/api/v1/ops/ingestion/runs/${failedRun.run_id}/retry`, undefined, {
    'idempotency-key': 'it-case-007-retry',
  });
  expect(retry.status()).toBe(202);
  const retryBody = (await retry.json()) as { run_id: string };
  expect(retryBody.run_id).toBeTruthy();

  await setRunStatus(request, retryBody.run_id, 'succeeded');
  const retryStatus = await pollRun(request, retryBody.run_id);
  expect(retryStatus).toBe('succeeded');
});

test('IT-CASE-008 運用診断API 結合テスト', async ({ request }) => {
  const ok = await apiGet(request, '/api/v1/ops/diagnostics/health');
  expect(ok.status()).toBe(200);
  const okBody = (await ok.json()) as { status: string };
  expect(okBody.status).toBe('ok');

  await supportPost(request, '/api/v1/test/support/faults', { archive_missing: true });
  const critical = await apiGet(request, '/api/v1/ops/diagnostics/health');
  const criticalBody = (await critical.json()) as { status: string };
  expect(criticalBody.status).toBe('critical');

  await supportPost(request, '/api/v1/test/support/faults', { archive_missing: false });
  const recovered = await apiGet(request, '/api/v1/ops/diagnostics/health');
  const recoveredBody = (await recovered.json()) as { status: string };
  expect(recoveredBody.status).toBe('ok');
});

test('IT-CASE-009 E2E基本フロー 結合テスト', async ({ request, page }) => {
  const runStart = await apiPost(
    request,
    '/api/v1/ops/ingestion/runs',
    {
      trigger_mode: 'manual',
      run_kind: 'official_ingestion',
      target_types: ['official', 'appearance'],
    },
    { 'idempotency-key': 'it-case-009-start' }
  );
  const run = (await runStart.json()) as { run_id: string };
  await setRunStatus(request, run.run_id, 'succeeded');
  const status = await pollRun(request, run.run_id);
  expect(status).toBe('succeeded');

  await page.goto('/');
  await expect(page.locator('.grid .card').first()).toBeVisible();
  const pillText = await page.locator('#pill').textContent();
  expect(pillText).toContain('/');
});

test('IT-CASE-010 差分更新フロー 結合テスト', async ({ request }) => {
  const beforeBootstrap = await request.get('/bootstrap.json');
  const before = (await beforeBootstrap.json()) as { archiveVersion: string };

  const start = await apiPost(
    request,
    '/api/v1/ops/ingestion/runs',
    {
      trigger_mode: 'manual',
      run_kind: 'incremental_update',
      target_types: ['official', 'appearance'],
    },
    { 'idempotency-key': 'it-case-010-start' }
  );
  const run = (await start.json()) as { run_id: string };
  await setRunStatus(request, run.run_id, 'succeeded');
  const status = await pollRun(request, run.run_id);
  expect(status).toBe('succeeded');

  const itemsRes = await apiGet(request, `/api/v1/ops/ingestion/runs/${run.run_id}/items`);
  const items = (await itemsRes.json()) as { items: Array<{ update_type: string }> };
  expect(items.items.length).toBeGreaterThan(0);
  expect(items.items.some((it) => it.update_type === 'new' || it.update_type === 'existing')).toBeTruthy();

  const afterBootstrap = await request.get('/bootstrap.json');
  const after = (await afterBootstrap.json()) as { archiveVersion: string };
  expect(after.archiveVersion).toBeTruthy();
  expect(before.archiveVersion).toBeTruthy();
});

test('IT-CASE-011 配信反映全体フロー 結合テスト', async ({ request }) => {
  const patch = await apiPatch(request, '/api/v1/admin/tags/tag-game', { tag_name: 'ゲーム更新' });
  expect(patch.status()).toBe(200);
  const patched = (await patch.json()) as { propagation_state: string };
  expect(patched.propagation_state).toBe('pending_publish');

  const publish = await apiPost(request, '/api/v1/admin/publish/runs', { scope: 'all' });
  expect(publish.status()).toBe(202);
  const publishRun = (await publish.json()) as { publish_run_id: string };
  const publishMetrics = await dbMetrics(request);
  expect(publishMetrics.publish_runs).toBeGreaterThan(0);
  await setPublishStatus(request, publishRun.publish_run_id, 'running');
  await setPublishStatus(request, publishRun.publish_run_id, 'succeeded');

  let finalStatus = 'queued';
  for (let i = 0; i < 20; i++) {
    const st = await apiGet(request, `/api/v1/admin/publish/${publishRun.publish_run_id}`);
    const body = (await st.json()) as { status: string };
    finalStatus = body.status;
    if (finalStatus === 'succeeded' || finalStatus === 'failed') break;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  expect(finalStatus).toBe('succeeded');
});

test('IT-CASE-012 障害検知と復旧シナリオ 結合テスト', async ({ request }) => {
  await supportPost(request, '/api/v1/test/support/faults', { archive_missing: true });
  const degraded = await apiGet(request, '/api/v1/ops/diagnostics/health');
  const degradedBody = (await degraded.json()) as { status: string; checks: { archive_page_completeness: string } };
  expect(degradedBody.status).toBe('critical');
  expect(degradedBody.checks.archive_page_completeness).toBe('critical');

  const failed = await apiPost(
    request,
    '/api/v1/ops/ingestion/runs',
    {
      trigger_mode: 'manual',
      run_kind: 'official_ingestion',
      target_types: ['official'],
    },
    { 'idempotency-key': 'it-case-012-failed' }
  );
  const failedRun = (await failed.json()) as { run_id: string };
  await setRunStatus(request, failedRun.run_id, 'failed');
  await pollRun(request, failedRun.run_id);

  await supportPost(request, '/api/v1/test/support/faults', { archive_missing: false });
  const retry = await apiPost(request, `/api/v1/ops/ingestion/runs/${failedRun.run_id}/retry`, undefined, {
    'idempotency-key': 'it-case-012-retry',
  });
  const retryBody = (await retry.json()) as { run_id: string };
  await setRunStatus(request, retryBody.run_id, 'succeeded');
  await pollRun(request, retryBody.run_id);

  const recovered = await apiGet(request, '/api/v1/ops/diagnostics/health');
  const recoveredBody = (await recovered.json()) as { status: string };
  expect(recoveredBody.status).toBe('ok');
});

test('IT-CASE-013 データ不整合復旧 結合テスト', async ({ request }) => {
  await supportPost(request, '/api/v1/test/support/faults', { tag_master_inconsistent: true });
  const bad = await apiGet(request, '/api/v1/ops/diagnostics/health');
  const badBody = (await bad.json()) as { checks: { tag_master_consistency: string } };
  expect(badBody.checks.tag_master_consistency).toBe('critical');

  const patch = await apiPatch(request, '/api/v1/admin/tags/tag-chat', { tag_name: '雑談(修正)' });
  expect(patch.status()).toBe(200);

  const publish = await apiPost(request, '/api/v1/admin/publish/tag-master', { scope: 'all' });
  expect(publish.status()).toBe(202);
  const publishRun = (await publish.json()) as { publish_run_id: string };
  await setPublishStatus(request, publishRun.publish_run_id, 'succeeded');

  await supportPost(request, '/api/v1/test/support/faults', { tag_master_inconsistent: false });
  const ok = await apiGet(request, '/api/v1/ops/diagnostics/health');
  const okBody = (await ok.json()) as { checks: { tag_master_consistency: string } };
  expect(okBody.checks.tag_master_consistency).toBe('ok');
});
