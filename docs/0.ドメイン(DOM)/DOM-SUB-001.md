---
id: DOM-SUB-001
title: サブドメイン分類
doc_type: サブドメイン定義
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
  - '[[RQ-SC-001]]'
related:
  - '[[DOM-CTX-001]]'
  - '[[DOM-BC-001]]'
  - '[[DOM-BC-002]]'
  - '[[DOM-BC-003]]'
  - '[[DOM-BC-004]]'
  - '[[DOM-BC-005]]'
  - '[[DOM-BC-006]]'
tags:
  - diopside
  - DOM
  - SUB
---

## 目的
- [[RQ-GL-001|diopside]] の業務領域を DDD の Core / Supporting / Generic で分類し、投資優先度と責務境界の判断基準を固定する。

## 分類結果
| サブドメイン | 分類 | 理由 | 投資優先度 |
|---|---|---|---|
| Ingestion（収集） | Core | 公開アーカイブ収集・[[RQ-GL-012|受入判定]]・正規化は [[RQ-GL-001|diopside]] 固有の価値源泉であり、代替困難。 | 最優先 |
| TagManagement（タグ管理） | Core | [[RQ-GL-005|タグ辞書]]とタグ割当の品質が検索性を直接規定する。 | 最優先 |
| Viewing（閲覧） | Core | 検索・絞り込み・[[RQ-GL-010|段階ロード]]・詳細表示は利用者価値を直接形成する。 | 最優先 |
| Publishing（配信） | Supporting | DB 正本から配信成果物を生成・切替する実行基盤であり、業務価値を支える。 | 標準 |
| Administration（運用管理） | Supporting | 各 BC の操作を統制する調整役で、固有ドメインモデルを主に保有しない。 | 標準 |
| Analytics（分析） | Supporting | [[RQ-GL-015|盛り上がり区間]]・[[RQ-GL-017|ワードクラウド]]生成は付加価値だが任意導入可能。 | 低 |

## Generic の扱い
- 現時点で Generic に独立配置するサブドメインは定義しない。
- 汎用化可能な共通技術（認証、監視、通知等）は必要時に Generic 候補として再評価する。

## 参照
- コンテキスト関係は [[DOM-CTX-001]] を正本とする。
- 各境界定義は [[DOM-BC-001]] / [[DOM-BC-002]] / [[DOM-BC-003]] / [[DOM-BC-004]] / [[DOM-BC-005]] / [[DOM-BC-006]] を参照する。

## 変更履歴
- 2026-02-14: 新規作成（Core/Supporting/Generic の分類と理由を定義） [[BD-SYS-ADR-029]]
