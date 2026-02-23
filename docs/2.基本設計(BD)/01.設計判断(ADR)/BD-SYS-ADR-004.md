---
id: BD-SYS-ADR-004
title: 静的配信+API起動バッチ（単一Backend API）構成を採用する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[RQ-RDR-034]]'
related:
- '[[BD-SYS-ARCH-001]]'
- '[[BD-SYS-ADR-021]]'
tags:
- diopside
- BD
- ADR
---


## 設計方針
- 静的配信+API起動バッチ構成を採用するとして[[RQ-GL-001|diopside]]の基本設計を定義する。
- 収集対象（公式+出演）を前提に設計する。

## 設計要点
- 公開データの収集・正規化・索引生成を分離する。
- バッチ処理は単一のBackend API（Hono）内で実行し、別デプロイのworker/batchサービスを持たない。
- 手動実行と定期実行は同一の運用APIを起動入口とし、定期実行は外部スケジューラからAPIを呼び出して開始する。
- Web配信は静的JSON + フロント検索を採用する。
- 運用監視と[[RQ-GL-011|再収集]]導線を設計に含める。

## 変更履歴
- 2026-02-11: 単一Backend API（Hono）内でのAPI起動バッチ方式へ明確化（手動/定期起動を同一APIへ統一） [[BD-SYS-ADR-004]]
- 2026-02-10: 新規作成 [[BD-SYS-ADR-004]]
