---
id: BD-SYS-ADR-044
title: INF管理対象リソース一覧を `cdk synth` で自動照合する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-03-07
updated: '2026-03-07'
up:
- '[[RQ-DEV-001-05]]'
related:
- '[[BD-INF-DEP-005]]'
- '[[BD-INF-IAC-001]]'
- '[[DD-INF-IAC-002]]'
- '[[UT-IAC-001]]'
tags:
- diopside
- BD
- ADR
---

## 決定事項
- [[BD-INF-DEP-005]] の管理対象AWSリソース一覧は、人間向け表に加えて `cdk synth` と比較可能な selector 定義を同一文書へ保持する。
- docs系品質ゲートでは prod 条件の `cdk synth` を fixture asset path で実行し、管理対象主リソースの過不足を自動判定する。
- `BucketPolicy` / `Route` / Association / Permission / Layer などの補助リソースと、CDK内部生成リソースは比較対象から明示除外する。

## 理由
- 手書きのリソース一覧は実装差分で陳腐化しやすく、レビューだけでは欠落や過剰追加を見逃しやすい。
- `cdk synth` を docsチェックへ接続すれば、設計書更新漏れとIaC実装漏れの双方を同じ入口で検知できる。
- Quartz成果物の実体はリソース数に影響しないため、fixture asset path を使えばAWS認証や配信ビルドに依存せず判定できる。

## 影響
- [[BD-INF-DEP-005]] に管理対象AWSリソース一覧の比較定義を追加し、現行 prod IaC と同期した主リソース個数を明示する。
- [[BD-INF-IAC-001]] の synth フェーズ必須出力へ管理対象リソース照合レポートを追加する。
- `Taskfile.yaml` に `docs:infra:check` / `docs:infra:check:changed` を追加し、`docs:check` / `docs:guard` / `docs:ut:stat:check` から実行する。
- `reports/infra_resource_check.md` を比較レポートの出力先とする。

## 却下した選択肢
- `reports/DiopsideDeliveryStack*.yaml` を正本として比較する案: 手動更新が必要で、`cdk synth` の実体と乖離しやすいため不採用。
- Markdown表の自然文だけを解析する案: 補助リソースの除外基準や logical id 範囲を表現できず、誤検知が多いため不採用。
- Quartz build 後の実アセットを必須入力にする案: docsチェックが重くなり、AWS資源台帳との差分検知に不要な依存を増やすため不採用。

## 変更履歴
- 2026-03-07: 新規作成（BD管理対象リソース一覧と `cdk synth` の自動照合方針を決定） [[BD-SYS-ADR-044]]
