import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminPanel } from '../AdminPanel';
import { adminApi } from '../../lib/adminApi';

describe('AdminPanel', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('[UT-PW-FE-UI-A01-C001] A01 starts ingestion and shows accepted run id', async () => {
    const user = userEvent.setup();
    jest.spyOn(adminApi, 'startIngestion').mockResolvedValue({
      run_id: 'run-001',
      accepted_at: '2026-02-28T00:00:00Z',
    });

    render(<AdminPanel toast={() => {}} />);
    await user.click(screen.getByRole('button', { name: '収集実行を開始' }));

    expect(adminApi.startIngestion).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/run_id=run-001/)).toBeInTheDocument();
  });

  test('[UT-PW-FE-UI-A01-C003] A01 shows error toast on forbidden response', async () => {
    const user = userEvent.setup();
    const toast = jest.fn();
    jest.spyOn(adminApi, 'startIngestion').mockRejectedValue(new Error('API 403 /api/v1/ops/ingestion/runs (FORBIDDEN)'));

    render(<AdminPanel toast={toast} />);
    await user.click(screen.getByRole('button', { name: '収集実行を開始' }));

    expect(adminApi.startIngestion).toHaveBeenCalledTimes(1);
    expect(toast).toHaveBeenCalledWith(expect.stringContaining('収集実行の開始に失敗'));
  });

  test('[UT-PW-FE-UI-A02-C001] A02 refreshes run list and fetches run items', async () => {
    const user = userEvent.setup();
    jest.spyOn(adminApi, 'listRuns').mockResolvedValue([
      {
        runId: 'run-abc',
        status: 'running',
        processedCount: 1,
        succeededCount: 1,
        failedCount: 0,
        startedAt: '2026-02-28T00:00:00Z',
        retryable: false,
      },
    ]);
    jest.spyOn(adminApi, 'getRunItems').mockResolvedValue([{ videoId: 'video-001', status: 'failed', failureReasonCode: 'UPSTREAM_TIMEOUT' }]);

    render(<AdminPanel toast={() => {}} />);
    await user.click(screen.getByRole('tab', { name: 'A02 監視・履歴' }));

    await user.click(screen.getByRole('button', { name: 'run一覧を再取得' }));
    expect(await screen.findByRole('option', { name: /run-abc/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '明細を取得' }));
    expect(adminApi.getRunItems).toHaveBeenCalledWith('run-abc');
    expect(await screen.findByText('video-001')).toBeInTheDocument();
  });

  test('[UT-PW-FE-UI-A03-C010] A03 validates runId before retry', async () => {
    const user = userEvent.setup();
    const toast = jest.fn();
    jest.spyOn(adminApi, 'retryRun').mockResolvedValue({ retryRunId: 'retry-001' });

    render(<AdminPanel toast={toast} />);
    await user.click(screen.getByRole('tab', { name: 'A03 再収集' }));
    await user.click(screen.getByRole('button', { name: '再収集を開始' }));

    expect(adminApi.retryRun).not.toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith('runIdを入力してください');
  });

  test('[UT-PW-FE-UI-A04-C001] A04 converts input and calls import API', async () => {
    const user = userEvent.setup();
    jest.spyOn(adminApi, 'importTaggingJson').mockResolvedValue({
      importRunId: 'imp-001',
      validatedCount: 1,
      appliedCount: 1,
      rejectedCount: 0,
      nextAction: 'publish_required',
    });

    render(<AdminPanel toast={() => {}} />);
    await user.click(screen.getByRole('tab', { name: 'A04 配信前後確認' }));

    await user.type(screen.getByRole('textbox', { name: 'videoId' }), 'video-001');
    await user.type(screen.getByRole('textbox', { name: 'set tags (comma separated)' }), 'tag-chat,tag-game');
    await user.click(screen.getByRole('button', { name: 'JSON取込（簡易）' }));

    expect(adminApi.importTaggingJson).toHaveBeenCalledWith({
      schemaVersion: 'v1',
      items: [
        {
          videoId: 'video-001',
          set: ['tag-chat', 'tag-game'],
          unset: [],
          reason: 'manual review',
        },
      ],
    });
    expect(await screen.findByText(/importRunId=imp-001/)).toBeInTheDocument();
  });

  test('[UT-PW-FE-UI-A05-C001] A05 gets diagnostics and creates recheck with runId', async () => {
    const user = userEvent.setup();
    jest.spyOn(adminApi, 'getDiagnosticsHealth').mockResolvedValue({
      status: 'ok',
      checks: {
        dataFreshness: 'ok',
        tagMasterConsistency: 'ok',
        archivePageCompleteness: 'ok',
        distributionAvailability: 'ok',
      },
    });
    jest.spyOn(adminApi, 'createRecheck').mockResolvedValue({ recheckRunId: 'recheck-001' });

    render(<AdminPanel toast={() => {}} />);
    await user.click(screen.getByRole('tab', { name: 'A05 公開後運用' }));

    await user.click(screen.getByRole('button', { name: '診断を取得' }));
    expect(await screen.findByText(/status=ok/)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('runId for recheck'), 'run-001');
    await user.click(screen.getByRole('button', { name: '再確認runを作成' }));
    expect(adminApi.createRecheck).toHaveBeenCalledWith({ runId: 'run-001' });
  });

  test('[UT-PW-FE-UI-A06-C001] A06 starts docs publish and fetches docs run status', async () => {
    const user = userEvent.setup();
    jest.spyOn(adminApi, 'startDocsPublish').mockResolvedValue({ docsPublishRunId: 'docs-001' });
    jest.spyOn(adminApi, 'getDocsPublishRun').mockResolvedValue({
      publishRunId: 'docs-001',
      publishType: 'docs',
      status: 'running',
      startedAt: '2026-02-28T00:00:00Z',
      retryable: true,
    });

    render(<AdminPanel toast={() => {}} />);
    await user.click(screen.getByRole('tab', { name: 'A06 配信反映ジョブ' }));

    await user.click(screen.getByRole('button', { name: 'Docs配信を開始' }));
    await user.click(screen.getByRole('button', { name: '状態を取得' }));

    expect(adminApi.getDocsPublishRun).toHaveBeenCalledWith('docs-001');
    expect(await screen.findByText(/docs-001 status=running/)).toBeInTheDocument();
  });
});
