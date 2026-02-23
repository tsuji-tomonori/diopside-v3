---
id: BD-INF-MON-003
title: 監査・追跡設計
doc_type: 監視設計
phase: BD
version: 1.1.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-20'
up:
  - '[[RQ-OBY-001-01]]'
  - '[[RQ-AV-001-01]]'
  - '[[RQ-PS-001-01]]'
related:
  - '[[BD-SYS-ADR-006]]'
  - '[[BD-SYS-ADR-014]]'
  - '[[BD-SYS-ADR-022]]'
  - '[[BD-INF-MON-001]]'
  - '[[BD-INF-MON-002]]'
  - '[[DD-INF-MON-002]]'
  - '[[BD-INF-AUD-001]]'
  - '[[BD-SYS-ADR-036]]'
  - '[[DD-SYS-AV-002]]'
  - '[[DD-INF-SEC-003]]'
  - '[[AT-OPS-001]]'
tags:
  - diopside
  - BD
  - MON
---

## 設計方針
- 監査証跡は CloudTrail を正本とし、改ざん耐性と追跡性を優先する。
- 監査観点（誰が、いつ、どの境界を変更したか）を日次で確認できる状態を維持する。

## 必須設計項目
- CloudTrail（単一/組織）の採用方針。
- KMS暗号化、ログファイル検証、保持期間。
- 重要操作（IAM/KMS/SG/CloudFront/WAF）の抽出ルール。
- 監査アラートの通知先と是正期限。

## 受入基準
- 重要操作は追跡可能で、実行主体と変更対象を特定できること。
- 証跡保管先に対して暗号化と削除統制が適用されていること。

## 未指定事項
- CloudTrailデータイベントの収集範囲。
- 監査ログの保存年限。

## 変更履歴
- 2026-02-20: 監視運用文書を監査・追跡設計へ再定義（章再編） [[BD-SYS-ADR-036]]
- 2026-02-11: 新規作成（インフラ監視の4軸判定） [[BD-SYS-ADR-006]]
