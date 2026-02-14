---
id: BD-SYS-QUAL-001
title: 品質特性
doc_type: 品質特性
phase: BD
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-14'
up:
- '[[RQ-SC-001]]'
- '[[RQ-PS-001]]'
- '[[RQ-UX-001]]'
- '[[RQ-UX-023]]'
- '[[RQ-DEV-001]]'
related:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-SYS-ADR-001]]'
- '[[BD-SYS-ADR-024]]'
- '[[BD-SYS-ADR-031]]'
- '[[BD-DEV-PIPE-001]]'
- '[[BD-SYS-SEC-001]]'
- '[[BD-APP-UI-002]]'
- '[[AT-RPT-001]]'
- '[[AT-OPS-001]]'
- '[[AT-RUN-001]]'
tags:
- diopside
- BD
- QUAL
---


## 設計方針
- 品質特性は App/Infra と BE/FE の責務境界を明示した上で、利用者体感（表示速度・操作継続性）と運用安定性（配備・監視・復旧）を一体で設計する。
- 体感性能の最大要因である「ウォーターフォール削減」と「クライアントJS削減」を優先し、Server Components 標準運用を維持する。
- 開発環境計測だけで合否を判断せず、`next build` / `next start` とフィールド指標（Web Vitals）を併用して判定する。

## 設計要点
### 責務マトリクス
| 境界 | 主責務 | 品質指標 | 正本文書 |
|---|---|---|---|
| App-BE | API契約、run状態遷移、入力検証 | API成功率、失敗分類一貫性 | [[DD-APP-API-001]], [[DD-APP-LOG-001]] |
| App-FE | [[RQ-GL-010|段階ロード]]、検索体験、再試行導線 | LCP/INP/CLS、離脱率 | [[BD-APP-UI-002]], [[DD-APP-UI-001]] |
| Infra-BE | 配備、認証境界、監査 | 配備成功率、認可失敗率 | [[BD-INF-DEP-005]], [[DD-INF-SEC-003]] |
| Infra-FE | 配信経路、キャッシュ、到達性 | 経路別到達率、更新反映時間 | [[BD-INF-DEP-004]], [[DD-INF-MON-001]] |

### 性能・体感品質
- Server Components を既定とし、Client Components はインタラクションに必要な最小範囲へ限定する。
- 逐次 await を避け、並列取得・preload・Suspense で待機時間を局所化する。
- 主要導線のLCP/INP/CLSは `useReportWebVitals` で収集し、Lighthouseのシミュレーション結果だけに依存しない。

### キャッシュ・更新整合品質
- Data Cache / Request Memoization / Full Route Cache / Router Cache の役割を区分し、どこを保持しどこで再検証するかを文書で固定する。
- `fetch` は `cache` / `next.revalidate` / `next.tags` を明示し、更新導線には `revalidatePath` または `revalidateTag` を接続する。
- ISR運用では短すぎる `revalidate` を避け、即時性が必要な更新はオンデマンド再検証へ切り分ける。

### UI品質と継続操作性
- `loading.tsx` と Suspense により、データ待ちでもルート全体を停止させない。
- `<Link>` の prefetch は既定有効を維持し、無効化は無駄な通信が明確な導線に限定する。
- 画像は `next/image` を標準利用し、リモート画像では寸法指定でCLS劣化を防ぐ。

### 開発・運用品質
- 本番相当検証として `next build` + `next start` を必須化し、開発専用最適化に依存した品質判定を禁止する。
- `@next/bundle-analyzer` でバンドル増加を定期監視し、回帰を早期検出する。
- Turbopack 前提で開発体験を維持し、巨大barrel importや過剰再エクスポートを避ける。
- 配備品質は `通常/初回/緊急` のモードごとに合否判定を分離し、緊急配備でも監査記録を必須とする。

### 是正プロセス品質（[[RQ-UX-023]]）
- アクセシビリティ不具合の状態は「受付/調査/対応/完了」の4状態で追跡し、状態遷移を監査可能な記録として保持する。
- 受付確認は3営業日以内を標準SLAとし、長期不在など例外時は公開告知と復帰後の一次回答期限を記録する。
- 重大度High以上は次リリースまでに修正方針を確定し、未解消の場合は回避策と恒久対応予定を同時に提示する。
- 運用証跡は [[AT-OPS-001]] と [[AT-RUN-001]] に集約し、最終判定は [[AT-RPT-001]] で参照可能とする。

## 変更履歴
- 2026-02-14: App/Infra・BE/FEの責務マトリクスを追加し、品質指標の正本文書を明確化 [[BD-SYS-ADR-031]]
- 2026-02-11: [[RQ-UX-023]] 対応としてアクセシビリティ不具合の受付SLAと是正プロセス品質を追加 [[BD-SYS-ADR-024]]
- 2026-02-11: Next.js App Router前提の品質特性（性能・キャッシュ・Web Vitals・本番検証）を追加 [[BD-SYS-ADR-024]]
- 2026-02-10: 新規作成 [[BD-SYS-ADR-001]]
