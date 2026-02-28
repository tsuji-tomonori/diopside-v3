import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { FiltersDrawer, type DrawerFilterDraft } from '../FiltersDrawer';
import type { TagGroupMap } from '../../lib/tags';

const initialDraft: DrawerFilterDraft = {
  fromYmd: null,
  toYmd: null,
  selectedYear: null,
  cursorYear: 2024,
  cursorMonth0: 0,
  minMinutes: 0,
  maxMinutes: 240,
  tagMode: 'AND',
  sortOrder: 'desc',
  selectedTags: new Set(),
  tagSearch: '',
};

const tagGroupMap: TagGroupMap = {
  generated_at: '2026-02-28T00:00:00Z',
  ui_groups: [{ id: 'genre', label: 'ジャンル' }],
  tag_type_to_ui_group: { genre: 'genre' },
  tags: {
    企画: { tag_type: 'genre', ui_group: 'genre', video_count: 10 },
  },
};

function renderDrawer(overrides?: Partial<ComponentProps<typeof FiltersDrawer>>) {
  const onApply = jest.fn();
  const onClearAll = jest.fn();
  const onClose = jest.fn();

  render(
    <FiltersDrawer
      open
      onClose={onClose}
      totalCount={10}
      filteredCount={5}
      yearCounts={new Map([[2024, 10]])}
      videoDates={new Set(['2024-01-01'])}
      maxBoundMinutes={240}
      tagCounts={new Map([['企画', 10]])}
      tagGroupMap={tagGroupMap}
      initialDraft={initialDraft}
      onApply={onApply}
      onClearAll={onClearAll}
      {...overrides}
    />,
  );

  return { onApply, onClearAll, onClose };
}

describe('FiltersDrawer', () => {
  test('[UT-PW-FE-UI-U02-C007] applies edited draft only when 適用 is clicked', async () => {
    const user = userEvent.setup();
    const { onApply, onClose } = renderDrawer();

    await user.click(screen.getByRole('option', { name: '企画 10' }));
    const tagModeSelect = screen.getAllByRole('combobox')[0]!;
    await user.selectOptions(tagModeSelect, 'OR');
    await user.click(screen.getByRole('button', { name: '適用' }));

    expect(onApply).toHaveBeenCalledTimes(1);
    const draft = onApply.mock.calls[0][0] as DrawerFilterDraft;
    expect(draft.tagMode).toBe('OR');
    expect(draft.selectedTags.has('企画')).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('[UT-PW-FE-UI-U02-C011] clear actions call dedicated handlers', async () => {
    const user = userEvent.setup();
    const { onClearAll } = renderDrawer({ initialDraft: { ...initialDraft, selectedTags: new Set(['企画']) } });

    await user.click(screen.getByRole('button', { name: 'タグ解除' }));
    expect(screen.getByText('(なし)')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '全クリア' }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  test('[UT-PW-FE-UI-U02-C008] closing drawer does not apply draft', async () => {
    const user = userEvent.setup();
    const { onApply, onClose } = renderDrawer();

    await user.click(screen.getByRole('option', { name: '企画 10' }));
    await user.click(screen.getByRole('button', { name: '閉じる' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onApply).not.toHaveBeenCalled();
  });
});
