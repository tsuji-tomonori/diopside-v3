---
id: BD-INF-ENV-001
title: アカウント・環境分割方針
doc_type: インフラアーキテクチャ
phase: BD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-20'
up:
- '[[BD-INF-PLAT-001]]'
related:
- '[[BD-DEV-ENV-001]]'
- '[[BD-DEV-ENV-002]]'
- '[[IT-ENV-001]]'
- '[[BD-SYS-ADR-028]]'
tags:
- diopside
- BD
- INF
---

## 方針
- 環境は `dev/prod` を正本とし、PR検証はephemeral環境で実施する。
- 監査証跡を集約できるよう、将来のログアーカイブ用アカウント分離を前提に命名とタグを固定する。

## 必須設計項目
- 環境境界: `dev` と `prod` の権限/ネットワーク/配備経路を分離する。
- 昇格境界: `dev -> prod` の単方向のみ許可する。
- ガバナンス: `Owner`, `Environment`, `CostCenter`, `DataClass` を必須タグにする。
- 監査連携: CloudTrail/Config/Cost可視化が環境別に集計できること。

## 受入条件
- 一時環境はIaCで再現可能で、破棄後に残存リソースが0件である。
- dev/prod差分は変数管理で制御し、手動差分を禁止する。

## 未指定事項
- 組織アカウント構成（単一/複数）。
- ログアーカイブ専用アカウントの導入時期。

## 変更履歴
- 2026-02-20: 章再編に合わせてアカウント分割・タグ標準・監査連携要件を追加 [[BD-SYS-ADR-036]]
- 2026-02-14: 環境定義を `dev/prod` に統一し、昇格ルールを2環境運用へ更新 [[BD-SYS-ADR-028]]
- 2026-02-13: 新規作成（環境分割と昇格ルールを定義） [[BD-SYS-ADR-028]]
