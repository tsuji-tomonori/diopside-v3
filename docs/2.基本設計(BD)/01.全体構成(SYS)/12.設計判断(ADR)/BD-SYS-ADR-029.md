---
id: BD-SYS-ADR-029
title: DOM軸導入とPublished Language公式化で境界契約を管理する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
  - '[[RQ-RDR-040]]'
related:
  - '[[BD-SYS-ARCH-001]]'
  - '[[DOM-CTX-001]]'
  - '[[DOM-SUB-001]]'
  - '[[DOM-BC-003]]'
  - '[[DOM-BC-004]]'
  - '[[BD-SYS-ADR-021]]'
tags:
  - diopside
  - BD
  - ADR
---

## 決定事項
- 工程別文書体系（RQ/BD/DD/UT/IT/AT）を維持したまま、DOM層をドメイン軸インデックスとして追加する。
- BC境界の正本は [[DOM-CTX-001]] とし、既存アーキ文書から同文書へ参照して責務境界を追跡可能にする。
- Publishing BC と Viewing BC の境界契約は `contracts/static-json/*.schema.json` を Published Language として公式化する。
- 境界契約（スキーマ）変更は BC間合意を前提とし、契約変更時は ADR と関連設計文書で影響範囲を記録する。

## 理由
- DDD導入時にディレクトリ再編を先行すると、既存の工程別運用・レビュー導線・追跡性が同時に崩れる。
- DOM軸を追加し frontmatter/リンクで接続する方式なら、既存運用を維持しつつ境界定義を段階導入できる。
- `contracts/static-json/*.schema.json` は既に配信JSON契約として機能しており、Published Languageとして明示することで契約ガバナンスを一元化できる。

## 影響
- [[BD-SYS-ARCH-001]] に DOM軸参照（[[DOM-CTX-001]]）と Published Language 位置づけを追加する。
- DOM文書群（[[DOM-SUB-001]] / [[DOM-CTX-001]] / BC定義）を基点に、要求・設計文書のトレース経路を拡張する。
- 配信契約の変更判断は `contracts/static-json/*.schema.json` と関連DD/API文書を同時確認する運用へ移行する。

## トレードオフ
- ディレクトリ再編を行わないため短期の文書移行コストは抑制できるが、DOM軸メタデータとリンク整備の運用負荷が増える。
- Published Language を公式化することで契約破壊的変更を抑制できる一方、スキーマ更新時の合意プロセスは増える。

## 却下した選択肢
- 工程別ディレクトリをBC別に全面再編する案: 既存の文書運用・参照導線への影響が大きく、移行期間の不整合リスクが高いため不採用。
- 契約管理を実装コードの型定義のみに集約する案: BC間の公開契約が文書上で監査しづらくなるため不採用。

## 変更履歴
- 2026-02-14: 新規作成（DOM軸導入と Published Language 公式化の判断を記録） [[BD-SYS-ADR-029]]
