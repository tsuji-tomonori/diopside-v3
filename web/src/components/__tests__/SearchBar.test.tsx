import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
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
  test('shows tag suggestions and selects a tag', async () => {
    const user = userEvent.setup();
    const picked: string[] = [];
    render(<Wrapper onPickTag={(t) => picked.push(t)} />);

    const input = screen.getByPlaceholderText(/検索:/);
    await user.type(input, '企');

    expect(await screen.findByText('企画')).toBeInTheDocument();

    await user.click(screen.getByText('企画'));
    expect(picked).toEqual(['企画']);

    // query should be cleared
    expect((input as HTMLInputElement).value).toBe('');
  });
});
