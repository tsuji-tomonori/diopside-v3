# Document Template

## 本文
- このテンプレートは diopside 向け文書の下書きです。
- Frontmatterは各文書IDに合わせて設定してください。

## 必須観点
- 要求・設計・テストの目的
- Next.js App Router 境界（Server Components優先、`"use client"` 最小化）
- Dynamic API（`cookies`/`headers`/`searchParams`）の利用位置と動的化影響
- データ取得境界（Server直結、Client->Route Handlers、Server->Route Handlers回避）
- 並列取得/preloadとSuspense/streamingの適用方針
- 受入条件または確認手順
- 依存/関連リンク（Obsidianリンク）

## 変更履歴
- YYYY-MM-DD: 変更要約（関連ADR: [[BD-ADR-xxx]]）
