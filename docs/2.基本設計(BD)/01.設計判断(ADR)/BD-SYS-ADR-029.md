---
id: BD-SYS-ADR-029
title: ドメイン境界正本をBD-SYS-DOMへ統合しPublished Languageを維持する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-15'
up:
  - '[[RQ-RDR-040]]'
related:
  - '[[BD-SYS-ARCH-001]]'
  - '[[BD-SYS-DOM-001]]'
  - '[[BD-SYS-ADR-021]]'
tags:
  - diopside
  - BD
  - ADR
---

## 決定事項
- 旧 `docs/0.ドメイン(DOM)` の内容は、基本設計の `[[BD-SYS-DOM-001]]` へ統合し、ドメイン境界正本をBD階層に一本化する。
- BC境界の正本は [[BD-SYS-DOM-001]] とし、既存アーキ文書から同文書を参照して責務境界を追跡可能にする。
- Publishing BC と Viewing BC の境界契約は `contracts/static-json/*.schema.json` を Published Language として公式化する。
- 境界契約（スキーマ）変更は BC間合意を前提とし、契約変更時は ADR と関連設計文書で影響範囲を記録する。

## 理由
- ドメイン境界文書が `docs/0.ドメイン(DOM)` とBD本文に分散すると、変更時の参照更新漏れが発生しやすい。
- ドメイン境界正本をBD内に統合することで、設計の責務境界と運用導線を同一階層で維持できる。
- `contracts/static-json/*.schema.json` は既に配信JSON契約として機能しており、Published Languageとして明示することで契約ガバナンスを一元化できる。

## 影響
- [[BD-SYS-ARCH-001]] のドメイン境界参照を [[BD-SYS-DOM-001]] へ移管する。
- `RQ-RDR-040` を含む関連文書の `[[DOM-*]]` 参照を [[BD-SYS-DOM-001]] へ置換する。
- `docs/0.ドメイン(DOM)` 配下文書を削除し、トレース経路をBD正本へ統合する。
- 配信契約の変更判断は `contracts/static-json/*.schema.json` と関連DD/API文書を同時確認する運用へ移行する。

## トレードオフ
- ドメイン文書削除により旧DOM IDへの直接参照互換は失われるため、同一変更で参照置換を完了する必要がある。
- Published Language を公式化することで契約破壊的変更を抑制できる一方、スキーマ更新時の合意プロセスは増える。

## 却下した選択肢
- 旧DOM文書を廃止状態で残す案: 正本が二重化し、参照更新漏れを防げないため不採用。
- 契約管理を実装コードの型定義のみに集約する案: BC間の公開契約が文書上で監査しづらくなるため不採用。

## 変更履歴
- 2026-02-15: ドメイン境界正本を `[[BD-SYS-DOM-001]]` へ統合し、旧DOM文書群を削除する方針へ更新 [[BD-SYS-ADR-029]]
- 2026-02-14: 新規作成（DOM軸導入と Published Language 公式化の判断を記録） [[BD-SYS-ADR-029]]
