import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../SearchBar';
import type { VideoItem } from '../../lib/data';

function Wrapper({ onPickTag }: { onPickTag: (t: string) => void }) {
  const [q, setQ] = useState('');
  const tagCounts = new Map<string, number>([
    ['企画', 10],
    ['トーク', 5],
  ]);

  const items: VideoItem[] = [
    {
      videoId: 'x',
      title: 'テスト動画',
      description: '',
      publishedAt: '',
      tags: ['企画'],
      durationIso: null,
      ymd: '',
      dayNum: null,
      year: null,
      dateNum: 0,
      durationSec: null,
      searchText: 'テスト動画 x 企画',
    },
  ];

  return <SearchBar query={q} onChangeQuery={setQ} pillText="1 / 1" tagCounts={tagCounts} items={items} onPickTag={onPickTag} />;
}

describe('SearchBar', () => {
  test('[UT-PW-FE-UI-U02-C005] combobox aria is synchronized by suggestion open/close', async () => {
    const user = userEvent.setup();
    render(<Wrapper onPickTag={() => {}} />);

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-controls', 'suggestions');
    expect(input).toHaveAttribute('aria-expanded', 'false');

    await user.type(input, '企');
    expect(await screen.findByText('企画')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  test('[UT-PW-FE-UI-U02-C014] keyboard selection sets active descendant and picks tag', async () => {
    const user = userEvent.setup();
    const picked: string[] = [];
    render(<Wrapper onPickTag={(t) => picked.push(t)} />);

    const input = screen.getByRole('combobox');
    await user.type(input, '企');
    await screen.findByText('企画');

    await user.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant', 'suggestion-0');

    await user.keyboard('{Enter}');
    expect(picked).toEqual(['企画']);
    expect(input).toHaveValue('');
  });

  test('[UT-PW-FE-UI-U02-C012] IME composition blocks Enter selection', async () => {
    const user = userEvent.setup();
    const picked: string[] = [];
    render(<Wrapper onPickTag={(t) => picked.push(t)} />);

    const input = screen.getByRole('combobox');
    await user.type(input, '企');
    await screen.findByText('企画');
    await user.keyboard('{ArrowDown}');

    fireEvent.compositionStart(input);
    await user.keyboard('{Enter}');
    expect(picked).toEqual([]);

    fireEvent.compositionEnd(input);
    await user.keyboard('{Enter}');
    expect(picked).toEqual(['企画']);
  });
});
