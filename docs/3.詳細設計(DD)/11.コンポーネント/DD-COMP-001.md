---
id: DD-COMP-001
title: コンポーネント分割
doc_type: コンポーネント詳細
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[BD-ARCH-001]]'
- '[[BD-UI-001]]'
related:
- '[[RQ-FR-006]]'
- '[[RQ-FR-013]]'
- '[[RQ-FR-017]]'
- '[[DD-COMP-002]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- COMP
---


## 詳細仕様
- コンポーネントは `app`, `features`, `shared`, `ops` の4層で分離する。
- 依存方向は `app -> features -> shared` の単方向とし、逆依存を禁止する。

## 分割方針
| 層 | 役割 | 例 |
| --- | --- | --- |
| `app` | ルーティング、画面合成 | `AppShell`, `RouteConfig` |
| `features` | ユースケース単位UI/ロジック | `SearchFeature`, `DetailFeature` |
| `shared` | 再利用部品、共通型、ユーティリティ | `Button`, `DateFormatter`, `ErrorBanner` |
| `ops` | 管理画面専用機能 | `RunHistoryPanel`, `RetryAction` |

## 禁止事項
- `shared` が `features` を参照する構成を禁止する。
- 画面コンポーネントからAPIクライアントを直接呼ばない。
- 管理画面の部品を公開UIへ直接流用しない。

## I/Oまたは責務
- 入力: 画面要件、機能要求、API契約。
- 出力: 層別コンポーネント構成、依存境界、禁止ルール。

## 変更履歴
- 2026-02-11: レイヤ分割、依存方向、禁止事項を具体化
- 2026-02-10: 新規作成
