---
id: BD-INF-WAF-001
title: L7防御設計（WAF/Shield）
doc_type: インフラアーキテクチャ
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-20
updated: '2026-02-20'
up:
- '[[BD-INF-PLAT-001]]'
related:
- '[[RQ-SEC-001-01]]'
- '[[BD-INF-DEP-004]]'
- '[[BD-INF-SEC-001]]'
- '[[DD-INF-SEC-003]]'
- '[[BD-SYS-ADR-036]]'
tags:
- diopside
- BD
- INF
---

## 設計方針
- 公開経路は CloudFront を主境界とし、L7防御は WAF を中心に運用する。
- DDoS対策は Shield Standard を前提とし、Advanced は要件発生時に再評価する。

## 必須設計項目
- WAF適用点（CloudFront/ALB/API Gateway）。
- ルール運用（Managed Rule、Rate-based、例外ルール）。
- 誤検知時の切戻し手順（Count -> Block移行、緊急無効化条件）。
- 監視（ブロック件数、誤検知率、攻撃トレンド）。

## 受入基準
- 主要公開経路でWAF適用有無を説明できること。
- ルール変更の検証環境と承認手順が定義されていること。

## 未指定事項
- WAF対象経路の最終範囲。
- Shield Advanced契約要否。

## 変更履歴
- 2026-02-20: 新規作成（INF章再編でL7防御章を追加） [[BD-SYS-ADR-036]]
