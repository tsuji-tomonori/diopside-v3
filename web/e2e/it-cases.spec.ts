import { expect, test, type APIRequestContext } from '@playwright/test';

const apiBase = process.env.PW_API_BASE_URL || 'http://127.0.0.1:3001';

async function apiGet(request: APIRequestContext, path: string) {
  return request.get(`${apiBase}${path}`);
}

async function apiPost(
  request: APIRequestContext,
  path: string,
  data?: unknown,
  headers?: Record<string, string>
) {
  return request.post(`${apiBase}${path}`, { data, headers });
}

async function apiPatch(
  request: APIRequestContext,
  path: string,
  data?: unknown,
  headers?: Record<string, string>
) {
  return request.patch(`${apiBase}${path}`, { data, headers });
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
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return status;
}

test.beforeEach(async ({ request }) => {
  await apiPost(request, '/api/v1/test/e2e/reset');
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

  const res2 = await apiPost(request, '/api/v1/ops/ingestion/runs', payload, { 'idempotency-key': key });
  expect(res2.status()).toBe(202);
  const body2 = (await res2.json()) as { run_id: string };
  expect(body2.run_id).toBe(body1.run_id);

  const invalidTarget = await apiPost(
    request,
    '/api/v1/ops/ingestion/runs',
    { ...payload, target_types: [] },
    { 'idempotency-key': 'it-case-001-invalid-target' }
  );
  expect(invalidTarget.status()).toBe(400);

  const missingIdempotency = await apiPost(request, '/api/v1/ops/ingestion/runs', payload);
  expect(missingIdempotency.status()).toBe(400);

  const conflict = await apiPost(
    request,
    '/api/v1/ops/ingestion/runs',
    payload,
    { 'idempotency-key': 'it-case-001-conflict' }
  );
  expect(conflict.status()).toBe(409);
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

  const status = await pollRun(request, run.run_id);
  expect(['running', 'succeeded']).toContain(status);

  await apiPost(request, '/api/v1/test/e2e/faults', { ingestion_fail: true });
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
  const failedStatus = await pollRun(request, failedRun.run_id);
  expect(failedStatus).toBe('failed');

  const failedGet = await apiGet(request, `/api/v1/ops/ingestion/runs/${failedRun.run_id}`);
  const failedJson = (await failedGet.json()) as { error_summary: string | null };
  expect(failedJson.error_summary).toBeTruthy();

  const notFound = await apiGet(request, '/api/v1/ops/ingestion/runs/00000000-0000-4000-8000-000000000000');
  expect(notFound.status()).toBe(404);
});

test('IT-CASE-003 アーカイブ一覧配信契約 結合テスト', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'アーカイブタグ検索' })).toBeVisible();

  await page.waitForResponse((r) => r.url().includes('/bootstrap.json') && r.ok());
  await page.waitForResponse((r) => r.url().includes('/archive_index.p0.json') && r.ok());

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
  await page.getByRole('button', { name: '閉じる' }).first().click();
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
  await apiPost(request, '/api/v1/test/e2e/faults', { ingestion_fail: true });
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
  await pollRun(request, failedRun.run_id);

  await apiPost(request, '/api/v1/test/e2e/faults', { ingestion_fail: false });
  const retry = await apiPost(request, `/api/v1/ops/ingestion/runs/${failedRun.run_id}/retry`);
  expect(retry.status()).toBe(202);
  const retryBody = (await retry.json()) as { run_id: string };
  expect(retryBody.run_id).toBeTruthy();

  const retryStatus = await pollRun(request, retryBody.run_id);
  expect(retryStatus).toBe('succeeded');
});

test('IT-CASE-008 運用診断API 結合テスト', async ({ request }) => {
  const ok = await apiGet(request, '/api/v1/ops/diagnostics/health');
  expect(ok.status()).toBe(200);
  const okBody = (await ok.json()) as { status: string };
  expect(okBody.status).toBe('ok');

  await apiPost(request, '/api/v1/test/e2e/faults', { archive_missing: true });
  const critical = await apiGet(request, '/api/v1/ops/diagnostics/health');
  const criticalBody = (await critical.json()) as { status: string };
  expect(criticalBody.status).toBe('critical');

  await apiPost(request, '/api/v1/test/e2e/faults', { archive_missing: false });
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

  const publish = await apiPost(request, '/api/v1/admin/publish/tag-master', { scope: 'all' });
  expect(publish.status()).toBe(202);
  const publishRun = (await publish.json()) as { publish_run_id: string };

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
  await apiPost(request, '/api/v1/test/e2e/faults', { archive_missing: true });
  const degraded = await apiGet(request, '/api/v1/ops/diagnostics/health');
  const degradedBody = (await degraded.json()) as { status: string; checks: { archive_page_completeness: string } };
  expect(degradedBody.status).toBe('critical');
  expect(degradedBody.checks.archive_page_completeness).toBe('critical');

  await apiPost(request, '/api/v1/test/e2e/faults', { ingestion_fail: true });
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
  await pollRun(request, failedRun.run_id);

  await apiPost(request, '/api/v1/test/e2e/faults', { ingestion_fail: false, archive_missing: false });
  const retry = await apiPost(request, `/api/v1/ops/ingestion/runs/${failedRun.run_id}/retry`);
  const retryBody = (await retry.json()) as { run_id: string };
  await pollRun(request, retryBody.run_id);

  const recovered = await apiGet(request, '/api/v1/ops/diagnostics/health');
  const recoveredBody = (await recovered.json()) as { status: string };
  expect(recoveredBody.status).toBe('ok');
});

test('IT-CASE-013 データ不整合復旧 結合テスト', async ({ request }) => {
  await apiPost(request, '/api/v1/test/e2e/faults', { tag_master_inconsistent: true });
  const bad = await apiGet(request, '/api/v1/ops/diagnostics/health');
  const badBody = (await bad.json()) as { checks: { tag_master_consistency: string } };
  expect(badBody.checks.tag_master_consistency).toBe('critical');

  const patch = await apiPatch(request, '/api/v1/admin/tags/tag-chat', { tag_name: '雑談(修正)' });
  expect(patch.status()).toBe(200);

  const publish = await apiPost(request, '/api/v1/admin/publish/tag-master', { scope: 'all' });
  expect(publish.status()).toBe(202);

  await apiPost(request, '/api/v1/test/e2e/faults', { tag_master_inconsistent: false });
  const ok = await apiGet(request, '/api/v1/ops/diagnostics/health');
  const okBody = (await ok.json()) as { checks: { tag_master_consistency: string } };
  expect(okBody.checks.tag_master_consistency).toBe('ok');
});
