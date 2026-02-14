---
id: UT-PLAN-003
title: 単体テスト計画 003（インフラ）
doc_type: 単体テスト計画
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[UT-PLAN-001]]'
- '[[BD-DEV-TEST-001]]'
- '[[BD-INF-DEP-003]]'
- '[[DD-INF-DEP-001]]'
related:
- '[[UT-CASE-010]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- UT
- PLAN
---


## テスト目的
- 配信インフラのConstruct/Function変更で、意図しない経路変更や設定崩れを単体で早期検知する。

## 観点
- CloudFront Function（pretty URL rewrite）の入力URLと変換結果が仕様どおりである。
- CDK Constructの出力（テンプレート断面）が期待条件を満たす。
- 失敗時に配信経路を壊さず、変更単位で切り戻せる。

## 実行方針
- 基本入口は `npm --prefix infra run test`（Jest）とする。
- 依存更新や構成変更を含む場合は `npm --prefix infra run build` を追加実行し、型崩れを検知する。
- 配信設計変更時は `npm --prefix infra run synth` でテンプレート差分の妥当性を確認する。

## 対象ケース
- [[UT-CASE-010]]: 配信経路分岐とrewriteルールの単体検証

## 完了条件
- `infra` のJestが成功し、rewriteルールの主要経路（`/`, `/docs/*`, `/web/*`, `/api/v1/*`, `/openapi/*`）の期待結果が一致する。
- `infra` 変更時に `build` が成功し、型エラーが残存しない。

## 変更履歴
- 2026-02-11: 新規作成（単体テスト方針の領域分割: INF）
