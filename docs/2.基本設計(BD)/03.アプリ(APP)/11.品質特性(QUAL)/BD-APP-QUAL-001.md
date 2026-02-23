---
id: BD-APP-QUAL-001
title: アプリ品質特性
doc_type: 品質特性
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-23
updated: '2026-02-23'
up:
- '[[RQ-PS-001-01]]'
- '[[RQ-UX-001-01]]'
- '[[RQ-UX-023-01]]'
- '[[RQ-DEV-001-01]]'
related:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-SYS-ADR-024]]'
- '[[BD-SYS-ADR-031]]'
- '[[BD-APP-UI-002]]'
- '[[BD-APP-API-005]]'
- '[[AT-RPT-001]]'
tags:
- diopside
- BD
- APP
- QUAL
---

## 設計方針
- アプリ品質は、[[RQ-SH-002|利用者]]の体感（表示速度・操作継続性）を最優先に、Server Components標準運用と[[RQ-GL-010|段階ロード]]で維持する。
- キャッシュ再検証境界を明示し、更新遅延と不要な動的化を同時に防ぐ。
- 品質判定は開発時の体感ではなく、本番相当条件（`next build` + `next start` + Web Vitals）で評価する。

## 設計要点
### 主責務と指標
| 境界 | 主責務 | 品質指標 | 正本文書 |
|---|---|---|---|
| App-BE | API契約、run状態遷移、入力検証 | API成功率、失敗分類一貫性 | [[DD-APP-API-001]], [[DD-APP-LOG-001]] |
| App-FE | [[RQ-GL-010|段階ロード]]、検索体験、再試行導線 | LCP/INP/CLS、離脱率 | [[BD-APP-UI-002]], [[DD-APP-UI-001]] |

### 性能・体感品質
- 逐次awaitを避け、並列取得・preload・Suspenseで待機時間を局所化する。
- 主要導線のLCP/INP/CLSは `useReportWebVitals` で収集し、シミュレーション結果のみに依存しない。
- `loading.tsx` と Suspense により、データ待ちでもルート全体停止を避ける。

### キャッシュ・更新整合品質
- `fetch` は `cache` / `next.revalidate` / `next.tags` を明示し、更新導線へ `revalidatePath` または `revalidateTag` を接続する。
- Data Cache / Request Memoization / Full Route Cache / Router Cache の責務を分離し、再検証境界を固定する。

### UI品質
- `<Link>` prefetchは既定有効を維持し、無効化は副作用が明確な導線に限定する。
- 画像は `next/image` を標準利用し、リモート画像は寸法指定でCLS劣化を防ぐ。

## 変更履歴
- 2026-02-23: SYS品質特性を分割し、アプリ品質正本として新規作成 [[BD-SYS-ADR-040]]
