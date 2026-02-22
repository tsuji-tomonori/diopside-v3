---
id: UT-PLAN-002
title: 単体テスト計画 002（ドキュメント）
doc_type: 単体テスト計画
phase: UT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-22'
up:
- '[[UT-PLAN-001]]'
- '[[BD-DEV-TEST-001]]'
- '[[RQ-DG-001]]'
related:
- '[[UT-CASE-014]]'
- '[[IT-PLAN-001]]'
tags:
- diopside
- UT
- PLAN
---


## テスト目的
- ドキュメント変更時に、Obsidianリンク整合とfrontmatter整合が常に成立することを単体観点で保証する。

## 観点
- 本文IDリンク（`[[ID]]`）が解決できること。
- frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）が欠落しないこと。
- 用語リンク補正後に `reports/doc_check.md` が整合状態を維持すること。

## 実行方針
- 基本入口は `task docs:guard` とし、差分文書単位で `docs:autolink:changed` と `docs:check:changed` を実行する。
- 失敗時は対象文書のみ修正し、再度 `task docs:guard` を実行して局所再検証する。

## 対象ケース
- [[UT-CASE-014]]: docs運用ガード（リンク/frontmatter/用語補正）

## 完了条件
- `task docs:guard` が成功し、`reports/doc_check.md` で `broken_links: 0` を満たす。
- 変更対象文書の `updated` と `変更履歴` が当日更新され、追跡可能性が維持される。

## 変更履歴
- 2026-02-11: 新規作成（単体テスト方針の領域分割: DOC）
