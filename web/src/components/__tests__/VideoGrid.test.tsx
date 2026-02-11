import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VideoGrid } from '../VideoGrid';
import type { VideoItem } from '../../lib/data';

const mockItems: VideoItem[] = [
  {
    videoId: 'video1',
    title: 'テスト動画1',
    description: '',
    publishedAt: '2024-01-15T10:00:00Z',
    tags: ['企画', 'トーク', 'ゲーム'],
    durationIso: 'PT1H30M',
    ymd: '2024-01-15',
    dayNum: 1,
    year: 2024,
    dateNum: 20240115,
    durationSec: 5400,
    searchText: 'テスト動画1 video1 企画 トーク ゲーム',
  },
  {
    videoId: 'video2',
    title: 'テスト動画2',
    description: '',
    publishedAt: '2024-01-16T10:00:00Z',
    tags: ['企画', '雑談'],
    durationIso: 'PT2H',
    ymd: '2024-01-16',
    dayNum: 2,
    year: 2024,
    dateNum: 20240116,
    durationSec: 7200,
    searchText: 'テスト動画2 video2 企画 雑談',
  },
];

describe('VideoGrid', () => {
  test('renders empty message when no items', () => {
    render(
      <VideoGrid
        items={[]}
        onOpen={() => {}}
        onToggleTag={() => {}}
        selectedTags={new Set()}
        hasMore={false}
        onLoadMore={() => {}}
      />
    );

    expect(screen.getByText('該当なし')).toBeInTheDocument();
  });

  test('renders video cards', () => {
    render(
      <VideoGrid
        items={mockItems}
        onOpen={() => {}}
        onToggleTag={() => {}}
        selectedTags={new Set()}
        hasMore={false}
        onLoadMore={() => {}}
      />
    );

    expect(screen.getByText('テスト動画1')).toBeInTheDocument();
    expect(screen.getByText('テスト動画2')).toBeInTheDocument();
  });

  test('tags have data-selected="true" when selected', () => {
    const selectedTags = new Set(['企画', 'ゲーム']);

    render(
      <VideoGrid
        items={mockItems}
        onOpen={() => {}}
        onToggleTag={() => {}}
        selectedTags={selectedTags}
        hasMore={false}
        onLoadMore={() => {}}
      />
    );

    // Find all tag buttons
    const allTagButtons = screen.getAllByRole('button').filter((btn) => btn.classList.contains('tag'));

    // Check that selected tags have data-selected="true"
    const selectedTagButtons = allTagButtons.filter((btn) => btn.getAttribute('data-selected') === 'true');
    const unselectedTagButtons = allTagButtons.filter((btn) => btn.getAttribute('data-selected') === 'false');

    // '企画' appears in both videos, 'ゲーム' appears in video1
    expect(selectedTagButtons.length).toBeGreaterThan(0);
    expect(unselectedTagButtons.length).toBeGreaterThan(0);

    // Verify specific tags
    selectedTagButtons.forEach((btn) => {
      expect(['企画', 'ゲーム']).toContain(btn.textContent);
    });
  });

  test('tags have data-selected="false" when not selected', () => {
    const selectedTags = new Set(['企画']);

    render(
      <VideoGrid
        items={mockItems}
        onOpen={() => {}}
        onToggleTag={() => {}}
        selectedTags={selectedTags}
        hasMore={false}
        onLoadMore={() => {}}
      />
    );

    // Find tag button for 'トーク' which is not selected
    const talkTag = screen.getByRole('button', { name: 'トーク' });
    expect(talkTag).toHaveAttribute('data-selected', 'false');

    // Find tag button for '企画' which is selected
    const kikakuTags = screen.getAllByRole('button', { name: '企画' });
    kikakuTags.forEach((tag) => {
      expect(tag).toHaveAttribute('data-selected', 'true');
    });
  });

  test('calls onToggleTag when tag is clicked', async () => {
    const user = userEvent.setup();
    const toggled: string[] = [];

    render(
      <VideoGrid
        items={mockItems}
        onOpen={() => {}}
        onToggleTag={(t) => toggled.push(t)}
        selectedTags={new Set()}
        hasMore={false}
        onLoadMore={() => {}}
      />
    );

    const tagButton = screen.getAllByRole('button', { name: '企画' })[0];
    await user.click(tagButton);

    expect(toggled).toEqual(['企画']);
  });

  test('shows "さらに表示" button when hasMore is true', () => {
    render(
      <VideoGrid
        items={mockItems}
        onOpen={() => {}}
        onToggleTag={() => {}}
        selectedTags={new Set()}
        hasMore={true}
        onLoadMore={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: 'さらに表示' })).toBeInTheDocument();
  });

  test('shows "末尾" when hasMore is false', () => {
    render(
      <VideoGrid
        items={mockItems}
        onOpen={() => {}}
        onToggleTag={() => {}}
        selectedTags={new Set()}
        hasMore={false}
        onLoadMore={() => {}}
      />
    );

    expect(screen.getByText('末尾')).toBeInTheDocument();
  });
});
