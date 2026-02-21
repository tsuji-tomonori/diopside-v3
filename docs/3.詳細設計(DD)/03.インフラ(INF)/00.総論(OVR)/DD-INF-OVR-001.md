---
id: DD-INF-OVR-001
title: インフラ詳細設計総論
doc_type: インフラ詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[BD-INF-PLAT-001]]'
- '[[BD-SYS-ADR-036]]'
related:
- '[[DD-INF-NET-001]]'
- '[[DD-INF-CF-001]]'
- '[[DD-INF-S3-001]]'
- '[[DD-INF-LMB-001]]'
- '[[DD-INF-COG-001]]'
- '[[DD-INF-CFG-001]]'
- '[[DD-INF-IAC-001]]'
- '[[DD-INF-SEC-001]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- DD-INF配下の正本を「横断設計 + サービス別詳細 + 運用詳細」の3層で構成し、実装値の責務を文書ID単位で固定する。
- CloudFront/S3/Lambda/Cognito/Config/DBの設定値はサービス別詳細文書を正本とし、デプロイ文書は反映手順と承認条件に限定する。

## 章構成
1. 総論（本書）
2. ネットワーク詳細
3. 配信基盤詳細（CloudFront/WAF）
4. ストレージ詳細（S3）
5. API実行基盤詳細（Lambda/API/DB）
6. 認証基盤詳細（Cognito）
7. 監視・ログ詳細
8. 統制・監査詳細（IAM/Config）
9. IaC・[[DD-INF-DEP-001|デプロイ詳細]]
10. DR復旧詳細

## 正本境界
| 領域 | 正本文書 | 本書からの扱い |
|---|---|---|
| CloudFront設定 | [[DD-INF-CF-001]] | 配信経路・Behavior・OAC・Policyを参照する。 |
| S3設定 | [[DD-INF-S3-001]] | prefix/暗号化/versioning/lifecycleを参照する。 |
| Lambda設定 | [[DD-INF-LMB-001]] | runtime/timeout/concurrency/ログを参照する。 |
| Cognito設定 | [[DD-INF-COG-001]] | `/openapi/*` と `/api/v1/*` の認証境界を参照する。 |
| Config設定 | [[DD-INF-CFG-001]] | required-tagsの評価・是正フローを参照する。 |
| DB設定 | [[DD-INF-DB-001]] | バックアップ/PITRと責務境界を参照する。 |

## 環境差分の扱い
- 差分管理対象環境は `dev` と `prod` を正本とし、ephemeral環境は検証用途として `dev` 設定を継承する。
- 破壊的変更判定は [[DD-INF-IAC-001]] の `cdk diff` 基準を適用する。

## 変更履歴
- 2026-02-21: 新規作成（DD-INF章構成をサービス別正本中心へ再編） [[BD-SYS-ADR-036]]
