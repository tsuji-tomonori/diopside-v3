---
id: BD-SYS-ADR-022
title: Lambda構造化ログをCloudWatch 30日保持で運用する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[RQ-RDR-035]]'
related:
- '[[RQ-OBY-001]]'
- '[[RQ-COST-001]]'
- '[[BD-INF-MON-001]]'
- '[[BD-INF-MON-002]]'
- '[[DD-APP-LOG-001]]'
- '[[DD-SYS-SEC-001]]'
- '[[AT-OPS-001]]'
tags:
- diopside
- BD
- ADR
---

## 決定事項
- Lambdaアプリケーションは構造化JSONを `stdout` へ出力し、CloudWatch Logsへ集約する。
- ログスキーマは共通必須項目（`timestamp`, `severity`, `event.*`, `correlation_id`, `trace_id`）を固定し、用途分類を `operational/security/audit` とする。
- CloudWatch Logsの保持期間を30日に固定し、31日目以降は自動削除する。
- セキュリティ/監査ログはサンプリングせず、運用ログのみ高頻度INFOを条件付き抑制する。

## 理由
- Lambda標準出力の収集方式は運用が単純で、追加収集基盤を不要にできる。
- 共通スキーマを固定することで、障害調査、通知判定、[[RQ-GL-012|受入判定]]で同一キーを利用できる。
- 30日保持は [[RQ-COST-001]] の上限制約と整合し、継続運用コストを抑制できる。

## 影響
- 監視設計: [[BD-INF-MON-001]] / [[BD-INF-MON-002]] で30日検索可能期間を前提に運用手順を維持する。
- ログ詳細: [[DD-APP-LOG-001]] でイベント語彙、必須項目、保持削除ルールを具体化する。
- セキュリティ詳細: [[DD-SYS-SEC-001]] で監査ログ保持期間を30日へ統一する。
- 受入運用: [[AT-OPS-001]] でCloudWatch保持設定の確認項目を追加する。

## 却下した選択肢
- 90日保持またはS3長期アーカイブを標準化する案: コストと運用複雑性が増えるため不採用。
- 非構造化テキストログ運用案: 検索性と相関性が低く、可観測性要求を満たせないため不採用。

## 変更履歴
- 2026-02-11: 新規作成 [[BD-SYS-ADR-022]]
