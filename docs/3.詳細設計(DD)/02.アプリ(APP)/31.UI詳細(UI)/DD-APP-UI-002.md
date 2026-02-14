---
id: DD-APP-UI-002
title: 一覧画面
doc_type: UI詳細
phase: DD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-14'
up:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-APP-API-001]]'
- '[[BD-APP-UI-002]]'
related:
- '[[RQ-FR-001]]'
- '[[RQ-UX-001]]'
- '[[RQ-UX-005]]'
- '[[RQ-RDR-032]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- UI
---


## 詳細仕様
- 本文書は公開UI（検索/一覧/詳細モーダル）の端末別詳細仕様を定義する。
- 実装はモバイルファースト（スマートフォン優先、次にタブレット、最後にPC）を前提とする。

## 端末別レイアウト
- **スマートフォン（390px基準）**: 1カラム縦積み。[[RQ-GL-014|検索条件]]、件数/並び順、一覧カードの順で表示し、主要操作は親指到達範囲に集約する。
- **タブレット（768px基準）**: 一覧表示領域を拡張し、補助情報（[[RQ-GL-016|コメント密度波形]]/[[RQ-GL-017|ワードクラウド]]）は折りたたみ可能領域として扱う。
- **PC（1280px基準）**: 一覧と補助情報の同時参照を許容する2カラム構成。操作順序はモバイルと同一に維持する。

## コンポーネント責務
- [[DD-APP-UI-012|SearchConditionPanel]]: キーワード、タグ、期間、再生時間、並び順の入力と変更通知を管理する。
- [[DD-APP-UI-013|ArchiveList]]: 検索結果カード群と「もっと見る」導線、追加読込状態を管理する。
- [[DD-APP-UI-014|ArchiveDetailModal]]: タイトル/メタ情報、YouTube遷移、URLコピー、閉じる操作を管理する。
- [[DD-APP-UI-015|HighlightWavePanel]]: `highlights/{videoId}.json` の取得、可視化、区間クリック遷移、再試行導線を管理する。
- [[DD-APP-UI-016|WordCloudPanel]]: `wordcloud/{videoId}.png` の取得、代替表示、再試行導線を管理する。
- 各責務の詳細は [[DD-APP-UI-012]], [[DD-APP-UI-013]], [[DD-APP-UI-014]], [[DD-APP-UI-015]], [[DD-APP-UI-016]] を参照する。

## 状態遷移
- 初期表示: `bootstrap` 読込成功で一覧描画、続けて `tag_master` と `archive_index` を非同期取得する。
- 条件変更: [[DD-APP-UI-012|SearchConditionPanel]] の変更イベントで一覧再評価し、件数表示とカード先頭を再計算する。
- 詳細表示: カード選択で [[DD-APP-UI-014|ArchiveDetailModal]] を開き、[[DD-APP-UI-015|HighlightWavePanel]] と [[DD-APP-UI-016|WordCloudPanel]] を並行取得する。
- 障害復帰: 補助情報取得失敗時は詳細モーダルを閉じず、再試行ボタンで再取得する。
- 復帰保持: モーダルを閉じた際は一覧の[[RQ-GL-014|検索条件]]、スクロール位置、表示件数を維持する。

## 操作制約
- 主要操作（検索、タグ選択、詳細表示、YouTube遷移、モーダル閉じる）は390px/768px/1280pxの全条件で提供する。
- 端末別でボタン配置を変えても、ラベルと操作意味を変更しない。
- 失敗状態（未生成/取得失敗/不正データ/破損画像）では、原因文言と再試行可否を明示する。
- 補助情報の失敗は主要操作を無効化しない。

## I/Oまたは責務
- 入力: `bootstrap.json`、`tag_master.json`、`archive_index.pN.json`、`highlights/{videoId}.json`、`wordcloud/{videoId}.png`、[[RQ-GL-014|検索条件]]、利用者操作。
- 出力: 一覧結果、詳細モーダル表示、YouTube遷移、エラー/再試行状態、操作継続性。

## 変更履歴
- 2026-02-14: 画面コンポーネント責務を `DD-APP-UI-012`〜`DD-APP-UI-016` へ分割しリンクを追加
- 2026-02-11: 公開UIのモバイルファースト方針に合わせ、端末別レイアウト/コンポーネント責務/状態遷移/操作制約を詳細化
- 2026-02-10: 新規作成
