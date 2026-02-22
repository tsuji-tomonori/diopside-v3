---
id: RQ-RDR-051
title: スコープ定義をエピック単位へ再編する決定
doc_type: 要求決定記録
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-22'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-PP-001]]'
- '[[RQ-SC-002]]'
- '[[RQ-SC-003]]'
- '[[RQ-SC-004]]'
- '[[RQ-SC-005]]'
- '[[RQ-SC-006]]'
- '[[RQ-SC-007]]'
- '[[RQ-SC-008]]'
- '[[RQ-RTM-003]]'
tags:
- diopside
- RQ
- RDR
---

## 決定事項
- `RQ-SC-001` のスコープ本文を、既存の対象境界を維持したままエピック構成へ再編する。
- エピック詳細は `RQ-SC-002` から `RQ-SC-008` を新設し、1エピック1文書で管理する。
- FRとエピックの対応は `RQ-RTM-003` で静的に可視化する。

## 理由
- 改修ごとの要求追加とスコープ変動に対し、価値単位（Epic）で影響範囲を識別できるようにするため。
- 既存の境界定義（Ingestion / TagManagement / Publishing / Viewing / Administration / Analytics）と矛盾せず、RDR/RTM追跡を維持できるため。

## 影響
- スコープ文書は「総覧 + Epic詳細」の2層構成となる。
- FR番号やIn Scope/Out of Scopeの意味変更は行わない。
- 変更時運用は `RQ-SC-001` の「変更運用（エピック単位）」に従う。

## 変更履歴
- 2026-02-21: 新規作成 [[RQ-RDR-051]]
