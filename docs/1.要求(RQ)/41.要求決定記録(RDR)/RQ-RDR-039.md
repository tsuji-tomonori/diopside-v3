---
id: RQ-RDR-039
title: インフラを要求-設計-テスト一体で管理する決定
doc_type: 要求決定記録
phase: RQ
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-22'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-DEV-001-01]]'
- '[[RQ-SEC-001-01]]'
- '[[RQ-OBY-001-01]]'
- '[[RQ-RTM-001]]'
- '[[BD-INF-PLAT-001]]'
- '[[BD-SYS-ADR-028]]'
tags:
- diopside
- RQ
- RDR
---

## 決定事項
- インフラ（クラウド/ネットワーク/CI/CD/監視/DR）を本体ドキュメント体系へ組み込み、UT/IT/ATまで追跡対象とする。
- インフラ変更はアプリ変更と同様に `要求 -> BD -> DD -> UT/IT/AT -> 受入` の順で整備する。
- インフラIaC管理方式はCDKのみを採用し、Terraformを含む別方式を要求標準に採用しない。
- 反映フローは `cdk synth -> cdk diff -> approve -> cdk deploy -> verify` を標準とする。
- RTMはインフラ文書とインフラ試験文書の直接リンクを持つ。

## 理由
- インフラ障害はアプリ品質・運用品質へ直接影響するため、分離管理では追跡性が不足する。
- IaCと運用手順をテスト対象化しないと、リリース判定で見落としが発生しやすい。

## 影響
- BDにINF章、DDにINF詳細章、UT/IT/ATにインフラ試験章を追加する。
- 既存の環境/構成管理/[[BD-DEV-TEST-001|テスト戦略]]/デプロイ文書へ参照統合を追加する。

## 変更履歴
- 2026-02-13: CDKオンリー方針と標準反映フロー（`cdk synth/diff/deploy`）を決定事項へ追加 [[RQ-RDR-039]]
- 2026-02-13: 新規作成 [[RQ-RDR-039]]
