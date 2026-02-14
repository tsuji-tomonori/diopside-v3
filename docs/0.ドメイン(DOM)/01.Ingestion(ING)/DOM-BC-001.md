---
id: DOM-BC-001
title: BC定義 Ingestion
doc_type: 境界づけられたコンテキスト定義
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
  - '[[DOM-CTX-001]]'
related:
  - '[[DOM-SUB-001]]'
  - '[[DOM-BC-002]]'
  - '[[DOM-BC-003]]'
  - '[[DOM-BC-005]]'
  - '[[DOM-BC-006]]'
tags:
  - diopside
  - DOM
  - BC
  - ING
---

## サブドメイン
- Core

## 責務
- 公開 YouTube アーカイブの収集対象解決、[[RQ-GL-012|受入判定]]、メタデータ正規化。
- [[RQ-GL-002|収集実行]]（[[RQ-GL-002|ingestion_run]]）単位での実行状態管理。

## 主要用語（GL）
- [[RQ-GL-001]] [[RQ-GL-001|diopside]]
- [[RQ-GL-002]] [[RQ-GL-002|収集実行]]
- [[RQ-GL-003]] [[RQ-GL-003|公式投稿動画]]
- [[RQ-GL-004]] [[RQ-GL-004|出演動画]]
- [[RQ-GL-011]] [[RQ-GL-011|再収集]]
- [[RQ-GL-012]] [[RQ-GL-012|受入判定]]

## 主要ドメインモデル（DM）
- [[RQ-DM-001]] 動画エンティティ
- [[RQ-DM-002]] チャンネルエンティティ
- [[RQ-DM-005]] [[RQ-GL-002|収集実行]]エンティティ
- [[RQ-DM-006]] 収集イベントエンティティ

## 主要機能要求（FR）
- [[RQ-FR-001]]
- [[RQ-FR-002]]
- [[RQ-FR-003]]
- [[RQ-FR-004]]
- [[RQ-FR-018]]

## 境界外との契約
- External API とは [[DOM-CTX-001]] の ACL で接続する。
- Publishing（[[DOM-BC-003]]）へ収集済み正規化データを Customer-Supplier で供給する。
- Analytics（[[DOM-BC-006]]）へ補助データ生成トリガを Customer-Supplier で供給する。
- Administration（[[DOM-BC-005]]）から OHS コマンドを受け付ける。

## 変更履歴
- 2026-02-14: 新規作成（Ingestion BC の責務・GL/DM/FR・境界契約を定義） [[BD-SYS-ADR-029]]
