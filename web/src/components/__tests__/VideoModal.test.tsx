import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VideoModal } from '../VideoModal';
import type { VideoItem } from '../../lib/data';

const item: VideoItem = {
  videoId: 'abc123def45',
  title: 'テスト動画',
  description: '',
  publishedAt: '2026-01-01T00:00:00Z',
  tags: ['企画'],
  durationIso: 'PT1H',
  ymd: '2026-01-01',
  dayNum: 1,
  year: 2026,
  dateNum: 20260101,
  durationSec: 3600,
  searchText: 'テスト動画 abc123def45 企画',
};

beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function showModal() {
      this.setAttribute('open', '');
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function close() {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  }
});

describe('VideoModal', () => {
  test('[UT-PW-FE-UI-U03-C001] has dialog aria attributes and focuses close button on open', async () => {
    render(
      <VideoModal
        item={item}
        onClose={() => {}}
        onToggleTag={() => {}}
        selectedTags={new Set()}
        toast={() => {}}
      />,
    );

    const dialog = document.querySelector('dialog');
    expect(dialog).toHaveAttribute('role', 'dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'dlgTitle');
    expect(dialog).toHaveAttribute('aria-describedby', 'dlgMeta');

    const closeButton = await screen.findByRole('button', { name: '閉じる' });
    await waitFor(() => expect(closeButton).toHaveFocus());
  });

  test('[UT-PW-FE-UI-U03-C004] closes and restores focus when modal is dismissed', async () => {
    const user = userEvent.setup();
    const opener = document.createElement('button');
    opener.textContent = 'open';
    document.body.appendChild(opener);

    const onClose = jest.fn();
    const { rerender } = render(
      <VideoModal
        item={null}
        onClose={onClose}
        onToggleTag={() => {}}
        selectedTags={new Set()}
        toast={() => {}}
      />,
    );

    opener.focus();
    rerender(
      <VideoModal
        item={item}
        onClose={onClose}
        onToggleTag={() => {}}
        selectedTags={new Set()}
        toast={() => {}}
      />,
    );

    await user.click(await screen.findByRole('button', { name: '閉じる' }));
    expect(onClose).toHaveBeenCalled();

    rerender(
      <VideoModal
        item={null}
        onClose={onClose}
        onToggleTag={() => {}}
        selectedTags={new Set()}
        toast={() => {}}
      />,
    );

    await waitFor(() => expect(opener).toHaveFocus());
    opener.remove();
  });

  test('[UT-PW-FE-UI-U03-C008] copy buttons report success and failure via toast', async () => {
    const user = userEvent.setup();
    const toast = jest.fn();
    const writeText = jest.fn<Promise<void>, [string]>();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    writeText.mockResolvedValueOnce(undefined);
    writeText.mockRejectedValueOnce(new Error('copy error'));

    render(
      <VideoModal
        item={item}
        onClose={() => {}}
        onToggleTag={() => {}}
        selectedTags={new Set()}
        toast={toast}
      />,
    );

    await user.click(await screen.findByRole('button', { name: 'URLコピー' }));
    await user.click(screen.getByRole('button', { name: 'IDコピー' }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('URLをコピーしました');
      expect(toast).toHaveBeenCalledWith('コピーに失敗しました');
    });
  });
});
