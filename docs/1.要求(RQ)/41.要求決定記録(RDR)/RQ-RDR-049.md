---
id: RQ-RDR-049
title: 説明可能なインフラ構成要素へ説明記載を必須化する決定
doc_type: 要求決定記録
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-COST-001]]'
- '[[BD-SYS-ADR-015]]'
- '[[DD-SYS-COST-001]]'
- '[[DD-INF-CFG-001]]'
- '[[DD-INF-IAC-002]]'
- '[[DD-INF-IAC-003]]'
- '[[AT-OPS-INF-001]]'
tags:
- diopside
- RQ
- RDR
---

## 決定事項
- タグ統制の必須キーへ `Description` を追加し、`CostCenter` / `Environment` / `Owner` / `Project` / `ManagedBy` / `Description` を正本とする。
- 説明を設定できるインフラ構成要素には `description` または `comment` を必須設定とし、管理画面で用途を即時判別できる状態を維持する。
- 説明文はリソースの責務と利用目的を1文で示し、曖昧語（`misc` / `temp` / `other`）のみの記載を禁止する。

## 理由
- 単一アカウント運用ではリソース数増加に伴い、コンソール上での即時識別性が低下しやすい。
- タグだけでは一覧把握、説明プロパティだけでは横断集計が不十分なため、両方を必須化する必要がある。
- 後追い調査時の判断時間を短縮し、運用時の誤操作リスクを下げるため。

## 影響
- 要求文書: [[RQ-COST-001]] に `Description` タグ必須化と説明フィールド必須化の受入基準を追加する。
- 設計文書: [[BD-SYS-ADR-015]] / [[DD-SYS-COST-001]] / [[DD-INF-CFG-001]] / [[DD-INF-IAC-002]] / [[DD-INF-IAC-003]] へ統制ルールと検証観点を反映する。
- 運用: [[AT-OPS-INF-001]] に基づく受入時、説明欠落リソースをNo-Go判定対象として扱う。

## 変更履歴
- 2026-02-21: 新規作成
