# 要求に対する基本設計実装レビュー（2026-02-11）

## 1. レビュー目的
- 要求（RQ-FR）に対して、基本設計（BD）が実装コード（web）へ適切に反映されているかを確認する。
- 本レビューは「要求→基本設計→実装」の整合観点に限定し、詳細設計（DD）の完全性監査は対象外とする。

## 2. レビュー対象
- 要求: `RQ-FR-006`, `RQ-FR-007`, `RQ-FR-015`, `RQ-FR-020`, `RQ-FR-021`, `RQ-FR-022`
- 基本設計: `BD-API-001`, `BD-UI-002`
- 実装: `web/src/App.tsx`, `web/src/components/VideoModal.tsx`, `web/public/*`

## 3. 結論（サマリ）
- 判定: **一部適合（改善要）**
- 概要:
  - 一覧の段階ロード基盤（`bootstrap.json` + `archive_index.pN.json` の順次読込）は実装されており、`RQ-FR-006/007/015` の主要意図に概ね適合。
  - ただし、`RQ-FR-020/021/022` で要求される「コメント密度波形」「ワードクラウド」「関連生成データ契約」は、BDで定義済みである一方、実装側に未反映。

## 4. 要求別レビュー結果

| 要求ID | 判定 | 根拠 |
| --- | --- | --- |
| `RQ-FR-006` | 適合 | `App.tsx` で `bootstrap.json` / `archive_index.pN.json` を用いた段階読込を実装。 |
| `RQ-FR-007` | 概ね適合 | 一覧表示（カード表示・詳細モーダル導線）は実装済み。ページングUIは「もっと見る」の増分方式で、要求文の前後ページ概念とは実装形態が異なる。 |
| `RQ-FR-015` | 部分適合 | 段階読込は実装済みだが、要求受入基準の「進行状態表示」は画面表示で未確認（状態値を保持するが表示未使用）。 |
| `RQ-FR-020` | 不適合 | `VideoModal` に波形表示・盛り上がり区間選択・`t=<秒>`遷移の実装がない。 |
| `RQ-FR-021` | 不適合 | `VideoModal` に `wordcloud/{videoId}.png` 取得/表示、失敗時代替表示、再試行導線がない。 |
| `RQ-FR-022` | 不適合（実装確認不能） | `web/public` に `highlights/*` が存在せず、クライアント側も参照処理なし。生成済み成果物の公開・利用経路を確認できない。 |

## 5. 主な確認ログ
- 要求・BD確認:
  - `sed -n '1,260p' docs/1.要求(RQ)/51.機能要求(FR)/06.コメント密度波形(HLW)/RQ-FR-020.md`
  - `sed -n '1,260p' docs/1.要求(RQ)/51.機能要求(FR)/07.ワードクラウド(WCL)/RQ-FR-021.md`
  - `sed -n '1,260p' docs/1.要求(RQ)/51.機能要求(FR)/06.コメント密度波形(HLW)/RQ-FR-022.md`
  - `sed -n '1,260p' docs/2.基本設計(BD)/41.API/BD-API-001.md`
  - `sed -n '1,260p' docs/2.基本設計(BD)/42.UI/BD-UI-002.md`
- 実装確認:
  - `sed -n '1,320p' web/src/App.tsx`
  - `sed -n '320,640p' web/src/App.tsx`
  - `sed -n '1,320p' web/src/components/VideoModal.tsx`
  - `rg --files web/public`
  - `rg "archiveLoaded|archiveTotal|loadPhase|tagMasterLoaded" web/src -n`

## 6. 指摘事項（改善提案）
1. `RQ-FR-020` 対応不足
   - `VideoModal` に `highlights/{videoId}.json` 取得・波形描画・区間クリック遷移（`t=<開始秒>`）を追加する。
2. `RQ-FR-021` 対応不足
   - `VideoModal` に `wordcloud/{videoId}.png` 表示領域、404/5xx/破損時の代替表示、再試行導線を追加する。
3. `RQ-FR-015` の受入基準観点不足
   - 既存の `loadPhase` / `archiveLoaded` / `archiveTotal` を利用し、段階ロード進行状態をUI表示する。
4. `RQ-FR-022` の検証可能性不足
   - 生成物公開経路（最低でもサンプル `highlights/{videoId}.json`）を用意し、受入検証で参照できる状態にする。

## 7. レビュー判定
- 現時点では、検索一覧系（`RQ-FR-006/007/015`）は概ね成立。
- ただし、詳細モーダルの見どころ機能（`RQ-FR-020/021`）とその生成データ活用（`RQ-FR-022`）が未反映のため、**基本設計の実装完了判定は不可**。
