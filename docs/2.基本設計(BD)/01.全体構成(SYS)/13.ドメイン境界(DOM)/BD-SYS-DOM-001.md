---
id: BD-SYS-DOM-001
title: ドメイン境界定義
doc_type: アーキテクチャ概要
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-15
updated: '2026-02-15'
up:
  - '[[RQ-SC-001]]'
related:
  - '[[RQ-RDR-040]]'
  - '[[BD-SYS-ARCH-001]]'
  - '[[BD-SYS-ADR-029]]'
  - '[[BD-SYS-ADR-021]]'
  - '[[RQ-FR-001]]'
  - '[[RQ-FR-005]]'
  - '[[RQ-FR-006]]'
  - '[[RQ-FR-019]]'
  - '[[RQ-FR-022]]'
  - '[[RQ-FR-023]]'
tags:
  - diopside
  - BD
  - DOM
---

## 目的
- [[RQ-GL-001|diopside]] の境界づけられたコンテキストと境界間契約を、基本設計の正本として一元管理する。

## サブドメイン分類
| サブドメイン | 分類 | 理由 | 投資優先度 |
|---|---|---|---|
| Ingestion（収集） | Core | 公開アーカイブ収集・[[RQ-GL-012|受入判定]]・正規化はサービス価値の中核。 | 最優先 |
| TagManagement（タグ管理） | Core | [[RQ-GL-005|タグ辞書]]と割当品質が検索体験を直接規定する。 | 最優先 |
| Viewing（閲覧） | Core | 検索・絞り込み・[[RQ-GL-010|段階ロード]]・詳細表示が利用者価値を形成する。 | 最優先 |
| Publishing（配信） | Supporting | DB正本から配信成果物を生成・切替する実行基盤。 | 標準 |
| Administration（運用管理） | Supporting | 各コンテキスト操作を統制する調整役。 | 標準 |
| Analytics（分析） | Supporting | [[RQ-GL-016|コメント密度波形]]・[[RQ-GL-017|ワードクラウド]]を生成する付加価値。 | 低 |

## コンテキスト一覧
- BC1 Ingestion
- BC2 TagManagement
- BC3 Publishing
- BC4 Viewing
- BC5 Administration
- BC6 Analytics（オプション）

## 関係図
```mermaid
flowchart TB
  EXT[External: YouTube Data API]
  ING[BC1 Ingestion]
  TAG[BC2 TagManagement]
  PUB[BC3 Publishing]
  VIEW[BC4 Viewing]
  ADM[BC5 Administration]
  ANA[BC6 Analytics]

  EXT -->|ACL| ING
  ING -->|Customer-Supplier| PUB
  TAG -->|Customer-Supplier| PUB
  PUB -->|Published Language| VIEW
  ING <-->|Shared Kernel| TAG
  ANA <-->|Shared Kernel| VIEW
  ING -->|Customer-Supplier| ANA
  ADM -. OHS/Command .-> ING
  ADM -. OHS/Command .-> TAG
  ADM -. OHS/Command .-> PUB
```

## 境界契約マトリクス
| 上流 | 下流 | パターン | 契約 |
|---|---|---|---|
| External | Ingestion | ACL | 外部API応答を内部モデルへ変換し、外部仕様変化の影響を遮断する。 |
| Ingestion | Publishing | Customer-Supplier | `videos/channels` を中心に成果物生成へ供給する。 |
| TagManagement | Publishing | Customer-Supplier | `tag_types/tags/video_tags` を供給し、`tag_master` 生成へ連携する。 |
| Publishing | Viewing | Published Language | `contracts/static-json/*.schema.json` を公式契約として扱う。 |
| Ingestion | TagManagement | Shared Kernel | `videos/channels` を共有し、タグ割当の参照整合を維持する。 |
| Ingestion | Analytics | Customer-Supplier | 収集完了を契機に補助データ生成を開始する。 |
| Analytics | Viewing | Shared Kernel | [[RQ-DM-008]] / [[RQ-DM-009]] を共有する。 |
| Administration | Ingestion/TagManagement/Publishing | OHS | 管理画面から運用コマンドをREST APIで発行する。 |

## BC責務サマリ
| BC | 主責務 | 主要FR | 主要DM | 主要GL |
|---|---|---|---|---|
| Ingestion | 収集対象解決、[[RQ-GL-012|受入判定]]、正規化、実行状態管理 | [[RQ-FR-001]], [[RQ-FR-002]], [[RQ-FR-003]], [[RQ-FR-004]], [[RQ-FR-018]] | [[RQ-DM-001]], [[RQ-DM-002]], [[RQ-DM-005]], [[RQ-DM-006]] | [[RQ-GL-002]], [[RQ-GL-003]], [[RQ-GL-004]], [[RQ-GL-011]], [[RQ-GL-012]] |
| TagManagement | [[RQ-GL-013|タグ種別]]・[[RQ-GL-005|タグ辞書]]管理、タグ割当整合 | [[RQ-FR-005]] | [[RQ-DM-003]], [[RQ-DM-004]] | [[RQ-GL-005]], [[RQ-GL-008]], [[RQ-GL-013]] |
| Publishing | 配信成果物生成、公開切替、ロールバック | [[RQ-FR-006]], [[RQ-FR-019]], [[RQ-FR-024]] | [[RQ-DM-010]] | [[RQ-GL-006]], [[RQ-GL-007]], [[RQ-GL-009]], [[RQ-GL-018]] |
| Viewing | 検索/絞り込み/一覧/詳細、[[RQ-GL-010|段階ロード]] | [[RQ-FR-007]], [[RQ-FR-008]], [[RQ-FR-009]], [[RQ-FR-010]], [[RQ-FR-011]], [[RQ-FR-012]], [[RQ-FR-013]], [[RQ-FR-014]], [[RQ-FR-015]], [[RQ-FR-020]], [[RQ-FR-021]] | [[RQ-DM-007]], [[RQ-DM-008]], [[RQ-DM-009]] | [[RQ-GL-010]], [[RQ-GL-014]], [[RQ-GL-015]], [[RQ-GL-016]], [[RQ-GL-017]] |
| Administration | 収集/[[RQ-GL-011|再収集]]/公開運用/配信経路確認の統制 | [[RQ-FR-016]], [[RQ-FR-017]], [[RQ-FR-025]] | - | （対象BC用語を使用） |
| Analytics | 補助分析データ生成とViewing提供 | [[RQ-FR-022]], [[RQ-FR-023]] | [[RQ-DM-008]], [[RQ-DM-009]] | [[RQ-GL-015]], [[RQ-GL-016]], [[RQ-GL-017]] |

## 変更管理ルール
- Published Language変更は Publishing と Viewing の合意を必須とする。
- Shared Kernel変更は関係BCの同時レビューを必須とする。

## 変更履歴
- 2026-02-15: 旧DOM文書群を統合し、基本設計のドメイン境界正本として新規作成 [[BD-SYS-ADR-029]]
