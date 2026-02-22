---
id: RQ-UC-010
title: 管理者がPR品質ゲートを満たしてマージする
doc_type: ユースケース
phase: RQ
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-23'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-DEV-005-01]]'
- '[[BD-DEV-PIPE-001]]'
- '[[RQ-RDR-050]]'
bounded_context: Administration
subdomain: Supporting
tags:
- diopside
- RQ
- UC
---

## 概要
- [[RQ-SH-001|管理者]]がPull Requestを作成し、GitHub Actionsの必須品質ゲート合格後にマージを確定する利用シナリオ。

## 基本フロー
1. [[RQ-SH-001|管理者]]が変更をPushしてPull Requestを作成する。
2. GitHub Actionsが `docs` / `web` / `api` / `infra` の対象ジョブを実行する。
3. [[RQ-SH-001|管理者]]が必須ステータスチェックの合格を確認する。
4. [[RQ-SH-001|管理者]]がPull Requestをマージし、main反映を完了する。

## 拡張フロー（Issueラベル起点）
1. [[RQ-SH-001|管理者]]が対象Issueへ `opencode/run` ラベルを付与する。
2. GitHub Actionsが `issues:labeled` で起動し、許可ラベルと実行者allowlistを検証する。
3. OpenCodeが修正ブランチを作成してPRを作成する。
4. [[RQ-SH-001|管理者]]がPR品質ゲート合格を確認してマージする。

## 代替/例外フロー
- 必須チェック失敗: [[RQ-SH-001|管理者]]は失敗ジョブを修正し、再Pushでチェック再実行を行う。
- 判定衝突: 必須チェック名が重複して判定不能な場合、チェック命名を修正するまでマージを保留する。
- CI基盤障害: 一時的な実行障害の場合は再実行で復旧確認し、復旧前のマージを行わない。

## 変更履歴
- 2026-02-23: Issueラベル起動（`issues:labeled`）からPR作成までの拡張フローを追加 [[RQ-RDR-050]]
- 2026-02-21: 新規作成（GitHub Actions品質ゲート運用のユースケースを追加） [[RQ-RDR-050]]
