---
id: DD-NET-001
title: ネットワーク詳細設計
doc_type: インフラ詳細
phase: DD
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[BD-INF-003]]'
- '[[RQ-SEC-001]]'
related:
- '[[IT-INF-NET-001]]'
- '[[AT-OPS-INF-001]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- 本書は VPC 実装値（CIDR/サブネット/ルート/SG/NACL/VPC Endpoint）を環境別に定義する。
- ネットワーク境界方針は [[BD-INF-003]] を正本とし、本書は方針を受けた実装値を正本化する。

## 章構成
1. VPC・サブネット設計
2. ルートテーブル設計
3. Security Group/NACL設計
4. VPC Endpoint設計

## 1. VPC・サブネット設計
| リソース | 設定項目 | dev | stg | prod | 根拠 |
|---|---|---|---|---|---|
| VPC | CIDR | `10.20.0.0/16` | `10.21.0.0/16` | `10.22.0.0/16` | 環境分割（[[BD-INF-002]]）と境界分離（[[BD-INF-003]]）を満たすため、環境間で非重複CIDRを固定する。 |
| Public subnet | CIDR | `10.20.0.0/24` | `10.21.0.0/24` | `10.22.0.0/24` | 公開受信面（`443/tcp`）と出口制御の起点を分離するため。 |
| Private app subnet | CIDR | `10.20.10.0/24` | `10.21.10.0/24` | `10.22.10.0/24` | API/実行基盤を公開面から分離し最小到達性を維持するため。 |
| Private data subnet | CIDR | `10.20.20.0/24` | `10.21.20.0/24` | `10.22.20.0/24` | データ面への直接到達を抑止し、内部アクセスのみ許可するため。 |

## 2. ルートテーブル設計
| リソース | 設定項目 | 設定値 | 根拠 |
|---|---|---|---|
| Public route table | デフォルトルート | `0.0.0.0/0 -> Internet Gateway` | 公開経路（`/web`, `/docs`, `/openapi`, `/api/v1`）の受信を成立させるため。 |
| Private app route table | デフォルトルート | `0.0.0.0/0 -> NAT Gateway` | アプリ面は受信不可を維持しつつ、外向き通信のみ許可するため。 |
| Private data route table | デフォルトルート | なし（VPC内部のみ） | データ面の外部到達性を禁止し、誤送信経路を削減するため。 |

## 3. Security Group/NACL設計
| リソース | 設定項目 | 設定値 | 根拠 |
|---|---|---|---|
| Public SG | Ingress | `443/tcp` のみ許可、`80/tcp` は `443` へリダイレクト | TLS最小要件（TLS1.2以上）と公開面最小化を維持するため。 |
| Admin SG | Ingress | `443/tcp` を運用固定CIDRまたはゼロトラスト経路に限定 | 管理面への不要到達を防止するため。 |
| App SG | Egress | `443/tcp` のみ許可、送信先はAWS API/監視/認証基盤allowlist | 出口制御の原則（[[BD-INF-003]]）を具体化するため。 |
| Subnet NACL | Deny rule | 最終行に明示denyを設定 | 未定義通信の許可漏れを防ぐため。 |

## 4. VPC Endpoint設計
| リソース | 設定項目 | 設定値 | 根拠 |
|---|---|---|---|
| Gateway Endpoint (S3) | 接続先 | `com.amazonaws.<region>.s3` | Private subnet からS3へインターネット非経由で到達させるため。 |
| Interface Endpoint (CloudWatch Logs) | 接続先 | `com.amazonaws.<region>.logs` | 監視ログ送信を私設経路化し、送信制御と可用性を両立するため。 |

## 変更管理
- ネットワーク変更は `cdk diff` 差分で `route/security-group/nacl/vpc-endpoint` の4点をレビュー必須とする。
- CIDR変更は破壊的変更として扱い、[[DD-CICD-INF-001]] の二重承認フローを適用する。

## 検証要件
- [[IT-INF-NET-001]] で許可経路/拒否経路の到達性テストを実施する。
- [[IT-INF-SMK-001]] で公開経路と監視連携のスモークを実施する。

## 変更履歴
- 2026-02-13: VPC詳細設計として再編し、リソース別設定値と根拠を章分割で追加
- 2026-02-13: ネットワーク変更レビュー基準を `cdk diff` 差分へ統一
- 2026-02-13: CIDR/サブネット/SG/NACL/egress/TLS最小要件を具体化
- 2026-02-13: 新規作成
