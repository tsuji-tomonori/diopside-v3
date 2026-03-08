import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from '../App';

jest.mock('../components/SearchBar', () => ({
  SearchBar: () => <div data-testid="search-bar" />,
}));

jest.mock('../components/SelectedTags', () => ({
  SelectedTags: () => null,
}));

jest.mock('../components/VideoGrid', () => ({
  VideoGrid: () => <div data-testid="video-grid" />,
}));

jest.mock('../components/FiltersDrawer', () => ({
  FiltersDrawer: () => null,
}));

jest.mock('../components/VideoModal', () => ({
  VideoModal: () => null,
}));

jest.mock('../components/Toast', () => ({
  Toast: () => null,
}));

jest.mock('../components/AdminPanel', () => ({
  AdminPanel: () => <div data-testid="admin-panel" />,
}));

jest.mock('../hooks/useToast', () => ({
  useToast: () => ({
    state: { message: '' },
    toast: jest.fn(),
  }),
}));

jest.mock('../lib/data', () => ({
  loadJsonFromPublic: jest.fn(async (path: string) => {
    if (path.endsWith('tag_group_map.json')) {
      return {
        generated_at: '2026-03-08T00:00:00+09:00',
        ui_groups: [],
        tag_type_to_ui_group: {},
        tags: {},
      };
    }
    return [];
  }),
  mergeRecords: jest.fn(() => ({ items: [], durationMaxBoundMinutes: 240 })),
  StagedDataLoader: jest.fn(),
  parseArchivePageItems: jest.fn(),
  buildTagMasterMap: jest.fn(() => new Map()),
  calculateDurationMaxBound: jest.fn(() => 240),
}));

jest.mock('../lib/adminAuth', () => ({
  getAdminAccessToken: jest.fn(() => 'admin-token'),
  handleAdminAuthCallback: jest.fn(async () => ({ status: 'idle' as const })),
  isAdminAuthConfigured: jest.fn(() => false),
  logoutAdmin: jest.fn(),
  parseAdminClaims: jest.fn(() => ({ sub: 'admin-user', scopes: ['admin'], groups: ['admin'] })),
  startAdminLogin: jest.fn(async () => {}),
}));

jest.mock('../lib/adminApi', () => ({
  hasStaticAdminToken: jest.fn(() => true),
  setAdminAuthTokenProvider: jest.fn(),
}));

jest.mock('../lib/adminRuntime', () => ({
  getAdminDevBypassClaims: jest.fn(() => ({ sub: 'dev-user', scopes: ['admin'], groups: ['admin'] })),
  isAdminDevBypassEnabled: jest.fn(() => false),
  readViteEnv: jest.fn(() => ''),
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState({}, '', '/web/');
    globalThis.fetch = jest.fn().mockResolvedValue({ ok: false }) as jest.Mock;
  });

  test('does not render an admin navigation button on the public route', async () => {
    render(<App />);

    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '管理UI' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cognitoでログイン' })).not.toBeInTheDocument();

    await waitFor(() => expect(screen.getByTestId('video-grid')).toBeInTheDocument());
  });

  test('renders the admin screen only for the direct admin route', async () => {
    window.history.replaceState({}, '', '/web/admin');

    render(<App />);

    expect(screen.queryByRole('button', { name: '管理UI' })).not.toBeInTheDocument();
    expect(screen.queryByTestId('search-bar')).not.toBeInTheDocument();

    await waitFor(() => expect(screen.getByTestId('admin-panel')).toBeInTheDocument());
  });
});
