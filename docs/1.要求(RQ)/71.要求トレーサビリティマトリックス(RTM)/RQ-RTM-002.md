---
id: RQ-RTM-002
title: 要求トレーサビリティ（設計別）
doc_type: 要求トレーサビリティマトリックス
phase: RQ
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[RQ-RTM-001]]'
related:
- '[[RQ-RDR-033]]'
- '[[BD-ARCH-001]]'
- '[[DD-API-001]]'
- '[[DD-UI-002]]'
tags:
- diopside
- RQ
- RTM
---

## 方針
- Quartz公開を前提に、設計文書（BD/DD）を起点とした要件追跡を静的Markdownで可視化する。
- 追跡の正本は各文書の `up` / `related` と本文リンク（`[[ID]]`）とし、一覧は再生成する。

## 追跡軸（設計別）
- 設計IDごとに、以下を同一ブロックで追跡する。
  - 根拠要件: `[[RQ-FR-*]]` / `[[RQ-UX-*]]` / `[[RQ-SEC-*]]` など
  - 決定経路: `[[RQ-RDR-*]]` / `[[BD-ADR-*]]`
  - 検証文書: `[[UT-*]]` / `[[IT-*]]` / `[[AT-*]]`

## 生成運用
1. docs更新後に `task docs:guard` を実行する。
2. `task docs:trace` を実行し、要求別/設計別の静的ビューを再生成する。
3. 必要に応じて個別追跡（`traceability.py`）を補助的に出力する。
   - `python3 .opencode/skills/obsidian-trace/scripts/traceability.py --docs-root docs --start DD-UI-002 --depth 4 --direction both --include-related --mode tree --out reports/traceability_dd_ui_002.md`
4. 変更差分を確認し、`RQ-RTM-001` と `RQ-RTM-002` を同時に更新する。

## 設計別ビュー（静的）
- `task docs:trace` で自動更新する。

<!-- BEGIN AUTO-GENERATED: DESIGN_VIEW -->
- generated_at: 2026-02-11

| 設計ID | タイトル | 根拠要件(RQ) | RDR | ADR | 検証(UT/IT/AT) |
| --- | --- | --- | --- | --- | --- |
| [[BD-ADR-001]] | 収集対象を公式+出演にする | [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RDR-001]], [[RQ-RDR-002]], [[RQ-RDR-003]], [[RQ-RDR-004]], [[RQ-RDR-005]], [[RQ-RDR-006]], [[RQ-RDR-007]], [[RQ-RDR-008]], [[RQ-RDR-009]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-001]], [[RQ-RDR-002]], [[RQ-RDR-003]], [[RQ-RDR-004]], [[RQ-RDR-005]], [[RQ-RDR-006]], [[RQ-RDR-007]], [[RQ-RDR-008]], [[RQ-RDR-009]] | - | - |
| [[BD-ADR-002]] | [[RQ-GL-010|段階ロード]]JSONを採用する | [[RQ-GL-001]], [[RQ-GL-010]], [[RQ-GL-011]], [[RQ-RDR-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-001]] | - | - |
| [[BD-ADR-003]] | [[RQ-GL-005|タグ辞書]]分離を採用する | [[RQ-GL-001]], [[RQ-GL-005]], [[RQ-GL-011]], [[RQ-RDR-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-001]] | - | - |
| [[BD-ADR-004]] | 静的配信+更新バッチ構成を採用する | [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RDR-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-001]] | - | - |
| [[BD-ADR-005]] | 検索をフロントで実行する | [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RDR-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-001]] | - | - |
| [[BD-ADR-006]] | 監視はSLO最小セットで開始する | [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RDR-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-001]] | - | - |
| [[BD-ADR-007]] | リリースゲートをATで管理する | [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RDR-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-001]] | - | - |
| [[BD-ADR-008]] | 運用[[RQ-GL-011|再収集]]フローを標準化する | [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RDR-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-001]] | - | - |
| [[BD-ADR-009]] | [[RQ-GL-017|ワードクラウド]]は事前生成の静的画像配信を採用する | [[RQ-FR-021]], [[RQ-GL-017]], [[RQ-PC-003]], [[RQ-PRC-001]], [[RQ-RDR-021]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-021]] | - | - |
| [[BD-ADR-010]] | 詳細画面の見どころ導線は[[RQ-GL-016|コメント密度波形]]を採用する | [[RQ-FR-020]], [[RQ-FR-022]], [[RQ-GL-015]], [[RQ-GL-016]], [[RQ-RDR-020]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-020]] | - | - |
| [[BD-ADR-011]] | TypeScript型安全をtsconfigとlintで標準化する | [[RQ-DEV-001]], [[RQ-PC-007]], [[RQ-PC-009]], [[RQ-RDR-017]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-017]] | - | - |
| [[BD-ADR-012]] | スキルメンテナンスを構成管理設計へ組み込む | [[RQ-DEV-001]], [[RQ-DG-001]], [[RQ-RDR-024]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-024]] | - | - |
| [[BD-ADR-013]] | ドキュメント公開はQuartz成果物をCDK経由で配信する | [[RQ-FR-024]], [[RQ-PC-005]], [[RQ-PC-009]], [[RQ-RDR-025]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-025]] | [[BD-ADR-014]] | [[AT-REL-001]], [[AT-RUN-001]] |
| [[BD-ADR-014]] | 単一CloudFrontのパス分岐と認証境界を固定する | [[RQ-FR-025]], [[RQ-RDR-026]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-026]] | [[BD-ADR-013]] | - |
| [[BD-ADR-015]] | 単一アカウントでAWSタグ統制をIAMとConfigで実施する | [[RQ-COST-001]], [[RQ-GL-005]], [[RQ-RDR-027]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SEC-001]] | [[RQ-RDR-027]] | - | [[AT-OPS-001]] |
| [[BD-ADR-016]] | AIエージェント運用で最小権限と段階解放を採用する | [[RQ-DEV-002]], [[RQ-DG-001]], [[RQ-RDR-029]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-029]] | - | - |
| [[BD-ADR-017]] | 公開UIの端末優先順位をモバイル先行で固定する | [[RQ-GL-012]], [[RQ-RDR-032]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-UX-001]], [[RQ-UX-005]] | [[RQ-RDR-032]] | - | [[AT-SCN-002]] |
| [[BD-ADR-018]] | 公開UIをモバイルファーストで設計する | [[RQ-GL-012]], [[RQ-RDR-032]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-UX-001]], [[RQ-UX-005]] | [[RQ-RDR-032]] | [[BD-ADR-018]] | [[AT-SCN-002]] |
| [[BD-ADR-019]] | ビルドをデプロイ単位で分離して品質ゲートを固定する | [[RQ-DEV-001]], [[RQ-RDR-025]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-025]] | [[BD-ADR-019]] | - |
| [[BD-ADR-020]] | 非機能詳細設計の判定軸を統一する | [[RQ-AV-001]], [[RQ-DATA-001]], [[RQ-GL-012]], [[RQ-OBY-001]], [[RQ-PS-001]], [[RQ-RDR-023]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SEC-001]] | [[RQ-RDR-023]] | [[BD-ADR-020]] | - |
| [[BD-ADR-021]] | DB正本化と3層責務境界で検索拡張性を確保する | [[RQ-DATA-001]], [[RQ-FR-005]], [[RQ-FR-025]], [[RQ-INT-001]], [[RQ-RDR-034]] | [[RQ-RDR-034]] | [[BD-ADR-021]] | - |
| [[BD-API-001]] | API一覧 | [[RQ-FR-001]], [[RQ-FR-002]], [[RQ-FR-003]], [[RQ-FR-004]], [[RQ-FR-005]], [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-FR-008]], [[RQ-FR-009]], [[RQ-FR-010]], [[RQ-FR-011]], [[RQ-FR-012]], [[RQ-FR-013]], [[RQ-FR-014]], [[RQ-FR-015]], [[RQ-FR-016]], [[RQ-FR-017]], [[RQ-FR-018]], [[RQ-FR-019]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-FR-022]], [[RQ-FR-023]], [[RQ-GL-005]], [[RQ-GL-009]], [[RQ-GL-010]], [[RQ-GL-015]], [[RQ-GL-016]], [[RQ-GL-017]], [[RQ-INT-001]], [[RQ-RDR-021]], [[RQ-RDR-034]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | [[RQ-RDR-021]], [[RQ-RDR-034]] | [[BD-ADR-001]], [[BD-ADR-009]], [[BD-ADR-010]], [[BD-ADR-021]] | - |
| [[BD-API-002]] | 収集API設計 | [[RQ-DATA-001]], [[RQ-FR-001]], [[RQ-FR-003]], [[RQ-FR-004]], [[RQ-FR-017]], [[RQ-FR-019]], [[RQ-GL-002]], [[RQ-RDR-028]], [[RQ-RDR-034]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | [[RQ-RDR-028]], [[RQ-RDR-034]] | [[BD-ADR-021]] | - |
| [[BD-API-003]] | エラーモデル | [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | - | [[BD-ADR-001]] | - |
| [[BD-API-004]] | OpenAPI配布とAPIバージョン境界 | [[RQ-FR-025]], [[RQ-INT-001]], [[RQ-RDR-026]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-026]] | [[BD-ADR-014]], [[BD-ADR-019]] | [[AT-SCN-006]] |
| [[BD-ARCH-001]] | システムコンテキスト | [[RQ-FR-001]], [[RQ-GL-002]], [[RQ-GL-004]], [[RQ-GL-010]], [[RQ-GL-011]], [[RQ-GL-012]], [[RQ-GL-013]], [[RQ-RDR-011]], [[RQ-RDR-028]], [[RQ-RDR-034]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]], [[RQ-SH-001]] | [[RQ-RDR-011]], [[RQ-RDR-028]], [[RQ-RDR-034]] | [[BD-ADR-001]], [[BD-ADR-002]], [[BD-ADR-003]], [[BD-ADR-004]], [[BD-ADR-005]], [[BD-ADR-006]], [[BD-ADR-007]], [[BD-ADR-008]], [[BD-ADR-021]] | - |
| [[BD-ARCH-002]] | 論理構成 | [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | - | [[BD-ADR-001]] | - |
| [[BD-ARCH-003]] | クラウド配置構成 | [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | - | [[BD-ADR-001]] | - |
| [[BD-ARCH-004]] | 主要データフロー | [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | - | [[BD-ADR-001]] | - |
| [[BD-ARCH-005]] | AIエージェント運用アーキテクチャ | [[RQ-DEV-002]], [[RQ-DG-001]], [[RQ-RDR-029]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-029]] | [[BD-ADR-016]] | - |
| [[BD-BUILD-001]] | ビルド方針（デプロイ単位分離） | [[RQ-DEV-001]], [[RQ-FR-001]], [[RQ-RDR-017]], [[RQ-RDR-018]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]], [[RQ-UX-019]], [[RQ-UX-021]] | [[RQ-RDR-017]], [[RQ-RDR-018]] | [[BD-ADR-001]], [[BD-ADR-011]], [[BD-ADR-016]], [[BD-ADR-019]] | - |
| [[BD-CM-001]] | 構成管理方針 | [[RQ-DG-001]], [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RDR-013]], [[RQ-RDR-024]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | [[RQ-RDR-013]], [[RQ-RDR-024]] | [[BD-ADR-001]], [[BD-ADR-012]], [[BD-ADR-016]] | - |
| [[BD-DATA-001]] | データアーキテクチャ | [[RQ-DATA-001]], [[RQ-FR-001]], [[RQ-FR-004]], [[RQ-PC-003]], [[RQ-PRC-001]], [[RQ-RDR-014]], [[RQ-RDR-017]], [[RQ-RDR-028]], [[RQ-RDR-034]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | [[RQ-RDR-014]], [[RQ-RDR-017]], [[RQ-RDR-028]], [[RQ-RDR-034]] | [[BD-ADR-021]] | - |
| [[BD-DEP-001]] | デプロイ方式 | [[RQ-COST-001]], [[RQ-DEV-001]], [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | - | [[BD-ADR-001]] | - |
| [[BD-DEP-002]] | デプロイ運用ルール | [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | - | [[BD-ADR-001]] | - |
| [[BD-DEP-003]] | ドキュメント公開フロー（Quartz + CDK） | [[RQ-DEV-001]], [[RQ-FR-024]], [[RQ-RDR-025]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-025]] | [[BD-ADR-013]], [[BD-ADR-016]], [[BD-ADR-019]] | [[AT-REL-001]], [[AT-RUN-001]], [[UT-PLAN-003]] |
| [[BD-DEP-004]] | 単一CloudFrontパス分岐デプロイ設計 | [[RQ-DEV-001]], [[RQ-FR-025]], [[RQ-RDR-026]], [[RQ-RDR-034]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-026]], [[RQ-RDR-034]] | [[BD-ADR-013]], [[BD-ADR-014]], [[BD-ADR-019]], [[BD-ADR-021]] | [[AT-REL-001]], [[AT-RUN-001]], [[AT-SCN-006]] |
| [[BD-ENV-001]] | 開発環境 | [[RQ-DEV-001]], [[RQ-PC-005]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]], [[RQ-SEC-001]] | - | [[BD-ADR-018]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[IT-ENV-001]] |
| [[BD-ENV-002]] | 本番環境 | [[RQ-AV-001]], [[RQ-DEV-001]], [[RQ-PC-005]], [[RQ-PS-001]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]], [[RQ-SEC-001]] | - | [[BD-ADR-018]] | [[AT-PLAN-001]], [[AT-RPT-001]] |
| [[BD-ERD-001]] | ER図（概要） | [[RQ-DATA-001]], [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RDR-014]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | [[RQ-RDR-014]] | [[BD-ADR-001]] | - |
| [[BD-MON-001]] | 監視設計 | [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-OBY-001]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | - | [[BD-ADR-001]] | [[AT-OPS-001]] |
| [[BD-MON-002]] | SLO運用 | [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | - | [[BD-ADR-001]] | [[AT-OPS-001]] |
| [[BD-QUAL-001]] | 品質特性 | [[RQ-AV-001]], [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-OBY-001]], [[RQ-PS-001]], [[RQ-RDR-017]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | [[RQ-RDR-017]] | [[BD-ADR-001]] | - |
| [[BD-RET-001]] | データ保持・削除方針 | [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | - | [[BD-ADR-001]] | - |
| [[BD-SEC-001]] | セキュリティ設計 | [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-PRC-001]], [[RQ-RDR-017]], [[RQ-RDR-018]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]], [[RQ-SEC-001]], [[RQ-UX-014]], [[RQ-UX-016]] | [[RQ-RDR-017]], [[RQ-RDR-018]] | [[BD-ADR-001]] | - |
| [[BD-TST-001]] | テスト戦略 | [[RQ-FR-001]], [[RQ-GL-001]], [[RQ-GL-011]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]], [[RQ-SH-001]] | - | [[BD-ADR-001]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]], [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]], [[UT-COV-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-002]], [[UT-PLAN-003]], [[UT-PLAN-004]], [[UT-PLAN-005]], [[UT-RPT-001]], [[UT-STAT-001]], [[UT-TDAT-001]] |
| [[BD-UI-001]] | 画面一覧 | [[RQ-FR-001]], [[RQ-FR-002]], [[RQ-FR-003]], [[RQ-FR-004]], [[RQ-FR-005]], [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-FR-008]], [[RQ-FR-009]], [[RQ-FR-010]], [[RQ-FR-011]], [[RQ-FR-012]], [[RQ-FR-013]], [[RQ-FR-014]], [[RQ-FR-015]], [[RQ-FR-016]], [[RQ-FR-017]], [[RQ-FR-018]], [[RQ-FR-019]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-FR-022]], [[RQ-FR-024]], [[RQ-FR-025]], [[RQ-GL-001]], [[RQ-GL-002]], [[RQ-GL-011]], [[RQ-GL-016]], [[RQ-GL-017]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]], [[RQ-SH-001]], [[RQ-SH-002]], [[RQ-UC-001]], [[RQ-UC-002]], [[RQ-UC-003]], [[RQ-UC-004]], [[RQ-UC-005]], [[RQ-UC-006]], [[RQ-UC-007]], [[RQ-UC-008]], [[RQ-UC-009]] | - | [[BD-ADR-001]], [[BD-ADR-009]], [[BD-ADR-010]] | - |
| [[BD-UI-002]] | 検索画面情報設計 | [[RQ-FR-001]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-FR-022]], [[RQ-FR-023]], [[RQ-GL-013]], [[RQ-GL-014]], [[RQ-GL-015]], [[RQ-GL-016]], [[RQ-GL-017]], [[RQ-RDR-015]], [[RQ-RDR-018]], [[RQ-RDR-021]], [[RQ-RDR-032]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]], [[RQ-UX-001]], [[RQ-UX-002]], [[RQ-UX-004]], [[RQ-UX-005]], [[RQ-UX-006]], [[RQ-UX-007]], [[RQ-UX-008]], [[RQ-UX-009]], [[RQ-UX-010]], [[RQ-UX-011]], [[RQ-UX-012]], [[RQ-UX-018]], [[RQ-UX-024]] | [[RQ-RDR-015]], [[RQ-RDR-018]], [[RQ-RDR-021]], [[RQ-RDR-032]] | [[BD-ADR-001]], [[BD-ADR-009]], [[BD-ADR-010]], [[BD-ADR-017]], [[BD-ADR-018]] | [[UT-PLAN-004]] |
| [[BD-UI-003]] | 画面遷移 | [[RQ-FR-001]], [[RQ-FR-014]], [[RQ-FR-020]], [[RQ-FR-024]], [[RQ-FR-025]], [[RQ-GL-011]], [[RQ-GL-014]], [[RQ-GL-016]], [[RQ-GL-017]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]], [[RQ-UC-001]], [[RQ-UC-002]], [[RQ-UC-006]], [[RQ-UC-007]], [[RQ-UC-008]], [[RQ-UC-009]] | - | [[BD-ADR-001]], [[BD-ADR-009]], [[BD-ADR-010]] | - |
| [[BD-UI-004]] | アクセシビリティ方針 | [[RQ-FR-001]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-GL-015]], [[RQ-GL-016]], [[RQ-GL-017]], [[RQ-RDR-021]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SC-001]] | [[RQ-RDR-021]] | [[BD-ADR-001]], [[BD-ADR-009]], [[BD-ADR-010]] | - |
| [[DD-ALG-001]] | 検索アルゴリズム | [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-FR-008]], [[RQ-GL-005]], [[RQ-GL-014]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-API-001]] | API詳細総論 | [[RQ-FR-001]], [[RQ-GL-002]], [[RQ-GL-005]], [[RQ-GL-009]], [[RQ-GL-011]], [[RQ-GL-013]], [[RQ-INT-001]], [[RQ-RDR-034]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-034]] | [[BD-ADR-021]] | [[UT-COV-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-005]], [[UT-RPT-001]], [[UT-STAT-001]], [[UT-TDAT-001]] |
| [[DD-API-002]] | [[RQ-GL-002|収集ジョブ]]起動API | [[RQ-FR-001]], [[RQ-GL-002]], [[RQ-GL-004]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-004]], [[IT-CASE-001]], [[IT-PLAN-001]], [[UT-CASE-001]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-003]] | [[RQ-GL-002|収集ジョブ]]状態API | [[RQ-FR-001]], [[RQ-GL-002]], [[RQ-GL-011]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-004]], [[AT-SCN-005]], [[IT-CASE-002]], [[IT-PLAN-001]], [[UT-CASE-002]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-004]] | アーカイブ一覧API | [[RQ-FR-001]], [[RQ-GL-007]], [[RQ-GL-009]], [[RQ-GL-010]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-001]], [[IT-CASE-003]], [[IT-PLAN-001]], [[UT-CASE-003]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-005]] | [[RQ-GL-005|タグ辞書]]API | [[RQ-FR-001]], [[RQ-GL-005]], [[RQ-RDR-034]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-034]] | [[BD-ADR-021]] | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-002]], [[IT-CASE-004]], [[IT-PLAN-001]], [[UT-CASE-004]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-006]] | 検索API | [[RQ-FR-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-002]], [[IT-CASE-005]], [[IT-PLAN-001]], [[UT-CASE-005]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-007]] | 動画詳細API | [[RQ-FR-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-003]], [[IT-CASE-006]], [[IT-PLAN-001]], [[UT-CASE-006]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-008]] | [[RQ-GL-011|再収集]]API | [[RQ-FR-001]], [[RQ-GL-011]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-005]], [[IT-CASE-007]], [[IT-PLAN-001]], [[UT-CASE-007]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-009]] | 運用診断API | [[RQ-FR-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-004]], [[AT-SCN-005]], [[IT-CASE-008]], [[IT-PLAN-001]], [[UT-CASE-008]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-010]] | API経路バージョニング詳細 | [[RQ-FR-025]], [[RQ-INT-001]], [[RQ-RDR-026]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-026]] | [[BD-ADR-014]] | [[AT-SCN-006]] |
| [[DD-AV-001]] | 可用性詳細 | [[RQ-AV-001]], [[RQ-OBY-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | [[BD-ADR-020]] | [[AT-OPS-001]], [[AT-RPT-001]] |
| [[DD-CODE-001]] | コーディング規約 | [[RQ-DEV-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | [[BD-ADR-011]] | [[UT-PLAN-001]] |
| [[DD-COMP-001]] | コンポーネント分割 | [[RQ-FR-006]], [[RQ-FR-013]], [[RQ-FR-017]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-COMP-002]] | 責務対応表 | [[RQ-FR-006]], [[RQ-FR-013]], [[RQ-FR-017]], [[RQ-GL-010]], [[RQ-GL-014]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-COST-001]] | コスト運用詳細 | [[RQ-COST-001]], [[RQ-GL-005]], [[RQ-PC-006]], [[RQ-RDR-027]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SEC-001]] | [[RQ-RDR-027]] | [[BD-ADR-015]] | [[AT-OPS-001]] |
| [[DD-DBCON-001]] | DB制約方針 | [[RQ-DATA-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-DBCON-002]] | 一意制約・チェック制約 | [[RQ-DATA-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-001]] | DDL一覧 | [[RQ-DATA-001]], [[RQ-GL-005]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-002]] | channelsテーブル | [[RQ-DATA-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-003]] | videosテーブル | [[RQ-DATA-001]], [[RQ-GL-011]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-004]] | video_tagsテーブル | [[RQ-DATA-001]], [[RQ-FR-009]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-005]] | tagsテーブル | [[RQ-DATA-001]], [[RQ-FR-005]], [[RQ-FR-009]], [[RQ-GL-005]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-006]] | tag_typesテーブル | [[RQ-FR-005]], [[RQ-GL-005]], [[RQ-GL-013]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-007]] | ingestion_runsテーブル | [[RQ-FR-001]], [[RQ-OBY-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-008]] | ingestion_eventsテーブル | [[RQ-OBY-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-DEP-001]] | デプロイ詳細 | [[RQ-FR-024]], [[RQ-RDR-025]], [[RQ-RDR-029]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-025]], [[RQ-RDR-029]] | [[BD-ADR-013]], [[BD-ADR-016]] | [[AT-REL-001]], [[AT-RUN-001]], [[UT-CASE-010]], [[UT-PLAN-003]] |
| [[DD-DEP-002]] | CloudFrontパス分岐詳細 | [[RQ-FR-025]], [[RQ-RDR-026]], [[RQ-RTM-001]], [[RQ-RTM-002]] | [[RQ-RDR-026]] | [[BD-ADR-014]] | [[AT-REL-001]], [[AT-SCN-006]] |
| [[DD-ERR-001]] | エラーコード設計 | [[RQ-OBY-001]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SEC-001]] | - | [[BD-ADR-020]] | [[AT-SCN-006]], [[UT-PLAN-001]] |
| [[DD-LOG-001]] | ログ設計 | [[RQ-AV-001]], [[RQ-GL-002]], [[RQ-GL-011]], [[RQ-GL-014]], [[RQ-OBY-001]], [[RQ-PS-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | [[BD-ADR-020]] | [[AT-OPS-001]], [[AT-RPT-001]] |
| [[DD-MIG-001]] | DB移行方針 | [[RQ-DATA-001]], [[RQ-DEV-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | [[BD-ADR-020]] | [[AT-RUN-001]], [[IT-CASE-001]], [[UT-PLAN-001]] |
| [[DD-PERF-001]] | 性能設計 | [[RQ-OBY-001]], [[RQ-PS-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | [[BD-ADR-020]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-RPT-001]] |
| [[DD-REV-001]] | レビュー規約 | [[RQ-DEV-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-SCALE-001]] | 拡張性詳細 | [[RQ-AV-001]], [[RQ-DATA-001]], [[RQ-GL-002]], [[RQ-GL-010]], [[RQ-GL-016]], [[RQ-GL-017]], [[RQ-PC-006]], [[RQ-PS-001]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | [[BD-ADR-020]] | [[AT-OPS-001]], [[UT-PLAN-001]] |
| [[DD-SEC-001]] | セキュリティ統制詳細 | [[RQ-DEV-001]], [[RQ-PRC-001]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-SEC-001]] | - | [[BD-ADR-020]] | [[AT-OPS-001]], [[AT-RUN-001]], [[UT-PLAN-001]] |
| [[DD-UI-001]] | UI詳細総論 | [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-UX-001]], [[RQ-UX-005]] | - | - | [[UT-PLAN-001]] |
| [[DD-UI-002]] | 一覧画面 | [[RQ-FR-001]], [[RQ-GL-014]], [[RQ-GL-016]], [[RQ-GL-017]], [[RQ-RDR-032]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-UX-001]], [[RQ-UX-005]] | [[RQ-RDR-032]] | [[BD-ADR-017]], [[BD-ADR-018]] | [[UT-CASE-011]], [[UT-PLAN-001]], [[UT-PLAN-004]] |
| [[DD-UI-003]] | フィルタドロワー | [[RQ-FR-006]], [[RQ-FR-008]], [[RQ-GL-005]], [[RQ-GL-014]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-UX-005]] | - | - | [[UT-PLAN-001]] |
| [[DD-UI-004]] | 詳細モーダル | [[RQ-FR-013]], [[RQ-FR-014]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-GL-016]], [[RQ-GL-017]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
| [[DD-UI-005]] | 検索バー | [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-RTM-001]], [[RQ-RTM-002]], [[RQ-UX-003]] | - | - | [[UT-PLAN-001]] |
| [[DD-UI-006]] | 運用ステータス画面 | [[RQ-FR-016]], [[RQ-FR-017]], [[RQ-FR-018]], [[RQ-FR-024]], [[RQ-RTM-001]], [[RQ-RTM-002]] | - | - | [[UT-PLAN-001]] |
<!-- END AUTO-GENERATED: DESIGN_VIEW -->

## 変更履歴
- 2026-02-11: `task docs:trace` による設計別静的ビューの自動生成ブロックを追加 [[RQ-RDR-033]]
- 2026-02-11: 新規作成（設計別トレーサビリティビューを追加） [[RQ-RDR-033]]
