---
id: BD-ADR-024
title: Next.js App Router運用指針を基本設計へ標準化する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
  - '[[RQ-DEV-001]]'
  - '[[RQ-PS-001]]'
  - '[[RQ-SEC-001]]'
  - '[[RQ-UX-001]]'
related:
  - '[[BD-ARCH-001]]'
  - '[[BD-BUILD-001]]'
  - '[[BD-SEC-001]]'
  - '[[BD-QUAL-001]]'
tags:
  - diopside
  - BD
  - ADR
---

## 決定事項
- Web公開系の基本設計では、Next.js App Routerを前提に Server Components を既定値として扱い、`"use client"` 境界を必要最小限にする。
- Dynamic API（`cookies()` / `headers()` / `searchParams`）は利用位置を明示し、Root Layoutでの無差別利用を禁止する。
- データ取得は Server Components 直結を原則とし、Client からのバックエンドアクセスは Route Handlers 経由に限定する。Server から Route Handlers を経由する往復は採用しない。
- キャッシュは `fetch` 拡張（`cache` / `next.revalidate` / `next.tags`）と `revalidatePath` / `revalidateTag` を組み合わせ、TTLと再検証境界を文書で明示する。
- 本番品質ゲートに `next build` + `next start`、Web Vitals 収集、bundle analyzer、`next/image` / `<Script>` 運用確認を追加する。
- セキュリティ設計では Server Actions の認可、機密データのクライアント漏えい防止、`.env` / `NEXT_PUBLIC_` 境界、CSPを必須統制とする。

## 理由
- App Router の設計境界は体感性能（ウォーターフォール削減、クライアントJS縮小）と運用安全性に直結し、プロジェクト初期段階で標準化しないと後から修正コストが増大する。
- キャッシュ層が多層（Data/Route/Router Cache）であるため、暗黙挙動のままでは更新遅延や意図しない動的化を招きやすい。
- RSC時代は「どこでデータに触るか」がセキュリティ境界になるため、認可・秘密管理・公開経路をBD段階で固定する必要がある。

## 影響
- アーキテクチャ概要: [[BD-ARCH-001]] で Server/Client 境界、Dynamic API利用位置、並列取得とSuspense運用を明記する。
- ビルド設計: [[BD-BUILD-001]] で Next.js 本番品質ゲート（build/start、Web Vitals、bundle分析、画像/Script最適化）を受入基準へ追加する。
- セキュリティ設計: [[BD-SEC-001]] で Server Actions 認可、機密境界、CSP、環境変数運用を具体化する。
- 品質特性: [[BD-QUAL-001]] でキャッシュ設計、再検証戦略、体感性能指標を品質特性に接続する。

## 却下した選択肢
- Pages Router中心で設計する案: App Router の標準機能（RSC/Streaming/Cache制御）を活かせず、将来拡張時の移行コストが高いため不採用。
- すべて Client Components で統一する案: JSバンドル増加と初期表示遅延のリスクが高いため不採用。
- キャッシュ戦略を実装裁量に委ねる案: 更新遅延と障害切り分けが困難になるため不採用。

## 変更履歴
- 2026-02-11: 新規作成（Next.js App Router運用指針の標準化） [[BD-ADR-024]]
