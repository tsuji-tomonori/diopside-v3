---
id: DD-APP-UI-001
title: UI詳細総論
doc_type: UI詳細
phase: DD
version: 1.0.4
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-19'
up:
- '[[BD-APP-UI-001]]'
- '[[BD-APP-UI-003]]'
related:
- '[[RQ-UX-001-01]]'
- '[[RQ-UX-005-01]]'
- '[[DD-APP-UI-002]]'
- '[[DD-APP-UI-003]]'
- '[[DD-APP-UI-004]]'
- '[[DD-APP-UI-005]]'
- '[[DD-APP-UI-006]]'
- '[[DD-APP-UI-007]]'
- '[[DD-APP-UI-008]]'
- '[[DD-APP-UI-009]]'
- '[[DD-APP-UI-010]]'
- '[[DD-APP-UI-011]]'
- '[[DD-APP-UI-012]]'
- '[[DD-APP-UI-013]]'
- '[[DD-APP-UI-014]]'
- '[[DD-APP-UI-015]]'
- '[[DD-APP-UI-016]]'
- '[[DD-APP-UI-017]]'
- '[[DD-APP-UI-018]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- UI
---


## 詳細仕様
- 公開UIと管理UIを分離し、画面責務と状態管理境界を明確化する。
- 端末差分はレイアウトのみで吸収し、操作意味とイベント名は共通化する。

## 画面責務境界
| 画面群 | 主要責務 | 非責務 |
| --- | --- | --- |
| 公開UI（一覧/検索/詳細） | 閲覧、検索、外部遷移 | 収集起動、公開操作 |
| 管理UI（運用ステータス） | [[RQ-GL-002|収集実行]]監視、再試行、公開確認 | 公開閲覧体験の描画 |

## 画面/コンポーネント索引
- 画面: [[DD-APP-UI-002|UI-U01]], [[DD-APP-UI-003|UI-U02]], [[DD-APP-UI-004|UI-U03]], [[DD-APP-UI-007|UI-A01]], [[DD-APP-UI-006|UI-A02]], [[DD-APP-UI-008|UI-A03]], [[DD-APP-UI-009|UI-A04]], [[DD-APP-UI-010|UI-A06]], [[DD-APP-UI-011|UI-A05]]。
- 画面コンポーネント: [[DD-APP-UI-012|SearchConditionPanel]], [[DD-APP-UI-013|ArchiveList]], [[DD-APP-UI-014|ArchiveDetailModal]], [[DD-APP-UI-015|HighlightWavePanel]], [[DD-APP-UI-016|WordCloudPanel]], [[DD-APP-UI-017|RunStatusScreen]]。

## 状態管理方針
- グローバル状態: `searchConditions`, `selectedVideo`, `runStatusSummary`。
- 画面ローカル状態: ドロワー開閉、入力中値、モーダル表示、リトライフラグ。
- API取得状態は `idle/loading/success/error` の4値で統一する。

## 共通UIルール
- 失敗表示は「原因の要約 + 次操作」を1ブロックで提示する。
- 主要操作ボタンは無効理由をツールチップで提示する。
- キーボード操作は `Tab` 順序と `Esc` 閉じるを全モーダルで統一する。

## I/Oまたは責務
- 入力: 配信JSON、管理APIレスポンス、[[RQ-SH-002|利用者]]/[[RQ-SH-001|管理者]]操作イベント。
- 出力: 画面状態、描画イベント、エラー/再試行導線、監査対象操作ログ。

## 変更履歴
- 2026-02-19: 管理UI責務の `収集実行` を GL 正本リンクへ統一
- 2026-02-14: 画面/画面コンポーネント索引を追加し、`DD-APP-UI-007`〜`DD-APP-UI-018` への参照を追加
- 2026-02-11: 画面責務境界、状態管理方針、共通UIルールを追加
- 2026-02-10: 新規作成
