---
id: RQ-RDR-040
title: DDDドメイン軸導入と用語・集約整合を要求として確定する決定
doc_type: 要求決定記録
phase: RQ
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
  - '[[RQ-SC-001]]'
related:
  - '[[DOM-SUB-001]]'
  - '[[DOM-CTX-001]]'
  - '[[DOM-BC-001]]'
  - '[[DOM-BC-002]]'
  - '[[DOM-BC-003]]'
  - '[[DOM-BC-004]]'
  - '[[DOM-BC-005]]'
  - '[[DOM-BC-006]]'
  - '[[RQ-GL-002]]'
  - '[[RQ-DM-001]]'
  - '[[RQ-DM-002]]'
  - '[[RQ-DM-003]]'
  - '[[RQ-DM-004]]'
  - '[[RQ-DM-005]]'
  - '[[RQ-DM-006]]'
  - '[[RQ-DM-007]]'
  - '[[RQ-DM-008]]'
  - '[[RQ-DM-009]]'
  - '[[BD-SYS-ARCH-001]]'
  - '[[BD-SYS-ADR-029]]'
tags:
  - diopside
  - RQ
  - RDR
---

## 決定事項
- DDD全量対応の戦略基盤として `docs/0.ドメイン(DOM)/` を追加し、5+1境界づけられたコンテキスト（Ingestion / TagManagement / Publishing / Viewing / Administration / Analytics）を要求上の正本境界として採用する。
- 境界間契約は Published Language を明示し、静的配信契約スキーマ群を Publishing から Viewing への公式契約として扱う。
- 用語 `RQ-GL-002` は「[[RQ-GL-002|収集実行]] ([[RQ-GL-002|ingestion_run]])」を正とし、`job/run/runs` の揺れを要求・モデル・関連設計で段階的に解消する。
- ドメインモデルでは、最低4集約（動画、[[RQ-GL-002|収集実行]]、[[RQ-GL-005|タグ辞書]]、[[RQ-GL-006|アーカイブ索引]]）について集約境界と集約ルートを明記し、境界横断更新を禁止する。

## 理由
- DDD戦略レポートで未定義とされたBC境界・サブドメイン分類・コンテキスト間関係を正式化し、戦術レビューCriticalの前提不足を解消する必要がある。
- 用語不一致（ingestion_job / [[RQ-GL-002|ingestion_run]]）を放置すると、要件解釈と設計実装の対応が崩れ、トレーサビリティが低下する。
- 集約ルート未定義のままでは更新整合条件を機械判定できず、将来の検証ルール追加（S7）の前提が成立しない。

## 影響
- DOM文書（`DOM-SUB-001`, `DOM-CTX-001`, `DOM-BC-001`〜`DOM-BC-006`）を要求追跡の参照先として利用する。
- GL/DM更新で用語と集約観点を整合し、FR/UCへの `bounded_context` / `subdomain` 展開時の参照基準を固定する。
- `BD-SYS-ARCH-001` および `BD-SYS-ADR-029` から、境界定義と契約定義を設計判断へ接続する。

## 変更履歴
- 2026-02-14: 決定記録から具体パス記述を除外し、要求レベルの契約表現へ統一 [[RQ-RDR-042]]
- 2026-02-14: 新規作成
