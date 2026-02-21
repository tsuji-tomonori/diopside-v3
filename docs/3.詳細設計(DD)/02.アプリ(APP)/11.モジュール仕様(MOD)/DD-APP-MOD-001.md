---
id: DD-APP-MOD-001
title: コンポーネント分割
doc_type: コンポーネント詳細
phase: DD
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-14'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-UI-001]]'
- '[[BD-SYS-ARCH-002]]'
- '[[BD-APP-UI-003]]'
related:
- '[[RQ-FR-006]]'
- '[[RQ-FR-013]]'
- '[[RQ-FR-017]]'
- '[[BD-SYS-ARCH-003]]'
- '[[DD-APP-MOD-003]]'
- '[[DD-APP-UI-012]]'
- '[[DD-APP-UI-013]]'
- '[[DD-APP-UI-014]]'
- '[[DD-APP-UI-015]]'
- '[[DD-APP-UI-016]]'
- '[[DD-APP-UI-017]]'
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

## 画面コンポーネント参照
- 公開UI: [[DD-APP-UI-012|SearchConditionPanel]], [[DD-APP-UI-013|ArchiveList]], [[DD-APP-UI-014|ArchiveDetailModal]], [[DD-APP-UI-015|HighlightWavePanel]], [[DD-APP-UI-016|WordCloudPanel]]。
- 管理UI: [[DD-APP-UI-017|RunStatusScreen]], [[DD-APP-UI-018]]。

## 変更履歴
- 2026-02-14: 画面コンポーネント詳細（`DD-APP-UI-012`〜`DD-APP-UI-018`）への参照を追加
- 2026-02-11: [[BD-SYS-ARCH-002|論理構成]]/[[BD-APP-UI-003|画面遷移]]との追跡性補強のため `BD-SYS-ARCH-002` `BD-SYS-ARCH-003` `BD-APP-UI-003` 参照を追加
- 2026-02-11: レイヤ分割、依存方向、禁止事項を具体化
- 2026-02-10: 新規作成
