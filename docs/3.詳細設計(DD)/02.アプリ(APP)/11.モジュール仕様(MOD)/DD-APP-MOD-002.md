---
id: DD-APP-MOD-002
title: Next.js App Router 実装ガイド
doc_type: アーキテクチャ詳細
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-12
updated: '2026-02-14'
up:
- '[[BD-SYS-ADR-024]]'
- '[[BD-SYS-ARCH-001]]'
related:
- '[[DD-APP-MOD-001]]'
- '[[DD-APP-UI-001]]'
- '[[DD-APP-UI-012]]'
- '[[DD-APP-UI-013]]'
- '[[DD-APP-UI-014]]'
- '[[DD-APP-UI-015]]'
- '[[DD-APP-UI-016]]'
- '[[DD-APP-UI-017]]'
- '[[DD-DEV-CODE-001]]'
- '[[RQ-DEV-001-01]]'
- '[[RQ-PS-001-01]]'
- '[[RQ-SEC-001-01]]'
- '[[RQ-UX-001-01]]'
tags:
- diopside
- DD
- ARCH
- Next.js
---


## 目的
- [[BD-SYS-ADR-024]] で決定した Next.js App Router 採用に基づき、Server Components (RSC) と Client Components の分割ガイドを定義する。
- フロントエンド実装者が迷いなくコンポーネント設計できるよう、判定基準と実装パターンを明確化する。

## RSC / Client Component 分割基準

### Server Component を使用する場合
| 条件 | 理由 | 例 |
|------|------|-----|
| データフェッチが必要 | サーバーサイドで直接実行可能 | ページコンポーネント、一覧表示 |
| 静的コンテンツの表示 | バンドルサイズ削減 | ヘッダー、フッター、レイアウト |
| 秘密情報へのアクセス | クライアントに露出しない | API認証ヘッダー生成 |
| SEOが重要 | SSRによるメタデータ生成 | 一覧ページ、詳細ページ |

### Client Component を使用する場合
| 条件 | 理由 | 例 |
|------|------|-----|
| ユーザーインタラクション | イベントハンドラが必要 | 検索入力、フィルタパネル |
| ブラウザAPI使用 | サーバーでは利用不可 | localStorage、IntersectionObserver |
| 状態管理が必要 | useState、useReducer | フォーム、モーダル状態 |
| エフェクトが必要 | useEffect、useLayoutEffect | アニメーション、外部ライブラリ連携 |

## ディレクティブ規約

### 'use client' の配置ルール
```typescript
// 正: ファイル先頭に配置
'use client'

import { useState } from 'react'
// ...

// 誤: コンポーネント内に配置
export function MyComponent() {
  'use client' // これは無効
}
```

### 境界の最小化原則
```
app/
├── page.tsx              # Server Component（データフェッチ）
├── layout.tsx            # Server Component（レイアウト）
└── _components/
    ├── ArchiveList.tsx   # Server Component（一覧表示）
    ├── SearchPanel.tsx   # 'use client'（検索入力）
    └── FilterDrawer.tsx  # 'use client'（フィルタ操作）
```

**原則**: Client Component の境界を可能な限り葉に近い位置に配置し、Server Component をデフォルトとする。

## データフェッチパターン

### Server Component でのフェッチ
```typescript
// app/page.tsx
async function ArchivePage() {
  // Server Component内で直接フェッチ
  const bootstrap = await fetch(`${API_BASE}/web/bootstrap.json`, {
    next: { revalidate: 60 } // 60秒キャッシュ
  }).then(r => r.json())

  return <ArchiveList items={bootstrap.items} />
}
```

### Client Component への props 受け渡し
```typescript
// app/_components/SearchPanel.tsx
'use client'

interface SearchPanelProps {
  initialTags: Tag[] // Server Component からの props
}

export function SearchPanel({ initialTags }: SearchPanelProps) {
  const [query, setQuery] = useState('')
  // ...
}
```

### [[RQ-GL-010|段階ロード]]の実装
```typescript
// app/page.tsx
import { Suspense } from 'react'

export default async function Page() {
  // bootstrap は即座にフェッチ
  const bootstrap = await fetchBootstrap()

  return (
    <>
      <InitialCards items={bootstrap.items} />
      <Suspense fallback={<TagFilterSkeleton />}>
        <TagFilterAsync />
      </Suspense>
      <Suspense fallback={<ArchiveListSkeleton />}>
        <ArchiveListAsync />
      </Suspense>
    </>
  )
}
```

## 状態管理パターン

### グローバル状態（React Context）
```typescript
// providers/search-context.tsx
'use client'

interface SearchState {
  query: string
  tags: string[]
  sortOrder: 'newest' | 'oldest'
}

const SearchContext = createContext<SearchState | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState)
  return (
    <SearchContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchContext.Provider>
  )
}
```

### 状態の配置場所
| 状態種別 | 配置場所 | 理由 |
|---------|---------|------|
| [[RQ-GL-014|検索条件]] | SearchContext | 複数コンポーネントで共有 |
| フィルタ展開状態 | ローカルstate | 単一コンポーネント内 |
| [[RQ-GL-010|段階ロード]]進行状態 | SearchContext | 件数表示と連動 |
| モーダル表示状態 | ローカルstate | 単一コンポーネント内 |

## エラーハンドリング

### Server Component のエラー
```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>データの取得に失敗しました</h2>
      <button onClick={reset}>再試行</button>
    </div>
  )
}
```

### [[RQ-GL-010|段階ロード]]失敗時
```typescript
// app/_components/AsyncArchiveList.tsx
'use client'

export function AsyncArchiveList() {
  const { data, error, isLoading, refetch } = useArchiveIndex()

  if (error) {
    return (
      <div>
        <p>一覧の読み込みに失敗しました</p>
        <button onClick={refetch}>再試行</button>
      </div>
    )
  }
  // ...
}
```

## パフォーマンス最適化

### 動的インポート
```typescript
// 重いコンポーネントの遅延ロード
const HighlightWavePanel = dynamic(
  () => import('./_components/HighlightWavePanel'),
  {
    loading: () => <WaveSkeleton />,
    ssr: false // Client-only
  }
)
```

### キャッシュ戦略
| リソース | キャッシュ設定 | 理由 |
|---------|--------------|------|
| [[RQ-GL-007|bootstrap]].json | revalidate: 60 | 頻繁に変更されない |
| [[RQ-GL-008|タグマスター]].json | revalidate: 300 | タグ更新は低頻度 |
| [[RQ-GL-009|アーカイブ索引]].pN.json | revalidate: 60 | 収集後に更新 |
| highlights/*.json | revalidate: 3600 | 生成後は不変 |

## 禁止事項

### Server Component での禁止
- `useState`, `useReducer` の使用
- `useEffect`, `useLayoutEffect` の使用
- ブラウザ専用API（`window`, `document`）へのアクセス
- イベントハンドラの定義

### Client Component での注意
- 大量のデータを props で渡さない（シリアライズコスト）
- Server Component を子として含めない（不可能）
- 無駄な `'use client'` の伝播を避ける

## コンポーネント分類表

| コンポーネント | 種別 | 理由 |
|---------------|------|------|
| `app/page.tsx` | Server | データフェッチ、レイアウト |
| `app/layout.tsx` | Server | 共通レイアウト |
| `ArchiveCard` | Server | 静的表示のみ |
| `SearchInput` | Client | 入力イベント（[[DD-APP-UI-012|SearchConditionPanel]] 配下） |
| `TagFilterPanel` | Client | チェックボックス操作（[[DD-APP-UI-012|SearchConditionPanel]] 配下） |
| `SortSelect` | Client | 選択イベント |
| `HighlightWavePanel` | Client | Canvas描画、クリックイベント（[[DD-APP-UI-015]]） |
| `WordCloudImage` | Server | 画像表示のみ |
| `Pagination` | Client | クリックイベント |
| `Modal` | Client | 開閉状態管理 |

## 関連ドキュメント
- [[BD-SYS-ADR-024]]: Next.js App Router 採用決定
- [[DD-APP-MOD-001]]: コンポーネント構成
- [[DD-APP-UI-001]]: UI詳細設計
- [[DD-APP-UI-012]]: SearchConditionPanel
- [[DD-APP-UI-013]]: ArchiveList
- [[DD-APP-UI-014]]: ArchiveDetailModal
- [[DD-APP-UI-015]]: HighlightWavePanel
- [[DD-APP-UI-016]]: WordCloudPanel
- [[DD-APP-UI-017]]: RunStatusScreen
- [[DD-DEV-CODE-001]]: [[DD-DEV-CODE-001|コーディング規約]]

## 変更履歴
- 2026-02-14: 画面コンポーネントの参照リンク（`DD-APP-UI-012`〜`DD-APP-UI-017`）を追加
- 2026-02-13: 設計別RTMの根拠追跡を補強するため、[[RQ-DEV-001-01]] / [[RQ-PS-001-01]] / [[RQ-SEC-001-01]] / [[RQ-UX-001-01]] を関連へ追加
- 2026-02-12: 新規作成（分析レポートに基づく追加）
