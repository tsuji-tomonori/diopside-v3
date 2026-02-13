---
id: RQ-RTM-002
title: 要求トレーサビリティ（設計別）
doc_type: 要求トレーサビリティマトリックス
phase: RQ
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[RQ-RTM-001]]'
related:
- '[[RQ-RDR-033]]'
- '[[RQ-RDR-037]]'
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
  - 根拠要件（FR/NFR）: `[[RQ-FR-*]]` / `[[RQ-UX-*]]` / `[[RQ-SEC-*]]` など
  - 決定経路: `[[RQ-RDR-*]]` / `[[BD-ADR-*]]`
  - 検証文書: `[[UT-*]]` / `[[IT-*]]` / `[[AT-*]]`

## テスト層トレース方針（UT/IT/AT）
- `task docs:trace` で、次の整合表を同時に再生成する。
  - 要求（FR/NFR） -> 受入テスト（AT-SCN）
  - 基本設計（BD、ADR除く） -> 結合テスト（IT-CASE）
  - 詳細設計（DD） -> 単体テスト（UT-CASE）
- 判定方式は「直接リンク」ではなく「経路判定」とする。
  - 判定対象リンク: frontmatter（`up` / `related`）+ 本文 `[[ID]]`
  - 探索深さ: `max_depth=4`
  - 判定基準: 対応するケース/シナリオ（AT-SCN, IT-CASE, UT-CASE）に到達できれば `PASS`
  - 計画/報告/運用文書（PLAN/RPT/OPS/GO など）は「補助文書」として表示する。

## 生成運用
1. docs更新後に `task docs:guard` を実行する。
2. `task docs:trace` を実行し、要求別/設計別の静的ビューを再生成する。
3. 必要に応じて個別追跡（`traceability.py`）を補助的に出力する。
   - `python3 .opencode/skills/obsidian-trace/scripts/traceability.py --docs-root docs --start DD-UI-002 --depth 4 --direction both --include-related --mode tree --out reports/traceability_dd_ui_002.md`
4. 変更差分を確認し、`RQ-RTM-001` と `RQ-RTM-002` を同時に更新する。

## 設計別ビュー（静的）
- `task docs:trace` で自動更新する。

<!-- BEGIN AUTO-GENERATED: DESIGN_VIEW -->
- generated_at: 2026-02-13

| 設計ID | タイトル | 根拠要件(FR/NFR) | RDR | ADR | 検証(UT/IT/AT) |
| --- | --- | --- | --- | --- | --- |
| [[BD-ADR-001]] | 収集対象を公式+出演にする | - | [[RQ-RDR-001]], [[RQ-RDR-002]], [[RQ-RDR-003]], [[RQ-RDR-004]], [[RQ-RDR-005]], [[RQ-RDR-006]], [[RQ-RDR-007]], [[RQ-RDR-008]], [[RQ-RDR-009]] | - | - |
| [[BD-ADR-002]] | [[RQ-GL-010|段階ロード]]JSONを採用する | - | [[RQ-RDR-001]] | - | - |
| [[BD-ADR-003]] | [[RQ-GL-005|タグ辞書]]分離を採用する | - | [[RQ-RDR-001]] | - | - |
| [[BD-ADR-004]] | 静的配信+API起動バッチ（単一Backend API）構成を採用する | - | [[RQ-RDR-034]] | [[BD-ADR-004]], [[BD-ADR-021]] | - |
| [[BD-ADR-005]] | 検索をフロントで実行する | - | [[RQ-RDR-001]] | - | - |
| [[BD-ADR-006]] | 監視はSLO最小セットで開始する | - | [[RQ-RDR-001]] | - | - |
| [[BD-ADR-007]] | リリースゲートをATで管理する | - | [[RQ-RDR-001]] | - | - |
| [[BD-ADR-008]] | 運用[[RQ-GL-011|再収集]]フローを標準化する | - | [[RQ-RDR-001]] | - | - |
| [[BD-ADR-009]] | [[RQ-GL-017|ワードクラウド]]は事前生成の静的画像配信を採用する | [[RQ-FR-021]], [[RQ-PRC-001]] | [[RQ-RDR-021]] | - | - |
| [[BD-ADR-010]] | 詳細画面の見どころ導線は[[RQ-GL-016|コメント密度波形]]を採用する | [[RQ-FR-020]], [[RQ-FR-022]] | [[RQ-RDR-020]] | - | - |
| [[BD-ADR-011]] | TypeScript型安全をtsconfigとlintで標準化する | [[RQ-DEV-001]] | [[RQ-RDR-017]] | - | - |
| [[BD-ADR-012]] | スキルメンテナンスを構成管理設計へ組み込む | [[RQ-DEV-001]] | [[RQ-RDR-024]] | - | - |
| [[BD-ADR-013]] | ドキュメント公開はQuartz成果物をCDK経由で配信する | [[RQ-FR-024]] | [[RQ-RDR-025]] | [[BD-ADR-014]] | [[AT-REL-001]], [[AT-RUN-001]] |
| [[BD-ADR-014]] | 単一CloudFrontのパス分岐と認証境界を固定する | [[RQ-FR-025]] | [[RQ-RDR-026]] | [[BD-ADR-013]] | - |
| [[BD-ADR-015]] | 単一アカウントでAWSタグ統制をIAMとConfigで実施する | [[RQ-COST-001]], [[RQ-SEC-001]] | [[RQ-RDR-027]] | - | [[AT-OPS-001]] |
| [[BD-ADR-016]] | AIエージェント運用で最小権限と段階解放を採用する | [[RQ-DEV-002]] | [[RQ-RDR-029]] | - | - |
| [[BD-ADR-017]] | 公開UIの端末優先順位をモバイル先行で固定する | [[RQ-UX-001]], [[RQ-UX-005]] | [[RQ-RDR-032]] | - | [[AT-SCN-002]] |
| [[BD-ADR-018]] | 公開UIをモバイルファーストで設計する | [[RQ-UX-001]], [[RQ-UX-005]] | [[RQ-RDR-032]] | [[BD-ADR-018]] | [[AT-SCN-002]] |
| [[BD-ADR-019]] | ビルドをデプロイ単位で分離して品質ゲートを固定する | [[RQ-DEV-001]] | [[RQ-RDR-025]] | [[BD-ADR-019]] | - |
| [[BD-ADR-020]] | 非機能詳細設計の判定軸を統一する | [[RQ-AV-001]], [[RQ-DATA-001]], [[RQ-OBY-001]], [[RQ-PS-001]], [[RQ-SEC-001]] | [[RQ-RDR-023]] | [[BD-ADR-020]] | - |
| [[BD-ADR-021]] | DB正本化と3層責務境界で検索拡張性を確保する | [[RQ-DATA-001]], [[RQ-FR-005]], [[RQ-FR-019]], [[RQ-FR-025]], [[RQ-INT-001]] | [[RQ-RDR-003]], [[RQ-RDR-034]] | [[BD-ADR-004]], [[BD-ADR-021]] | [[AT-SCN-006]] |
| [[BD-ADR-022]] | Lambda構造化ログをCloudWatch 30日保持で運用する | [[RQ-COST-001]], [[RQ-OBY-001]] | [[RQ-RDR-035]] | [[BD-ADR-022]] | [[AT-OPS-001]] |
| [[BD-ADR-023]] | HTTP API契約をRFC準拠で統一する | [[RQ-INT-001]], [[RQ-OBY-001]], [[RQ-SEC-001]] | - | [[BD-ADR-023]] | - |
| [[BD-ADR-024]] | Next.js App Router運用指針を基本設計へ標準化する | [[RQ-DEV-001]], [[RQ-PS-001]], [[RQ-SEC-001]], [[RQ-UX-001]] | - | [[BD-ADR-024]] | - |
| [[BD-ADR-025]] | Hono + Zod の入力検証と例外処理を標準化する | [[RQ-DEV-001]], [[RQ-INT-001]], [[RQ-SEC-001]] | - | [[BD-ADR-025]] | - |
| [[BD-ADR-026]] | テスト戦略をUT/IT/ATの三層品質ゲートで運用する | [[RQ-DEV-001]], [[RQ-FR-001]] | - | [[BD-ADR-026]] | [[AT-GO-001]], [[AT-PLAN-001]], [[IT-PLAN-001]], [[UT-PLAN-001]] |
| [[BD-ADR-027]] | バッチ実行制約と補助データ生成の運用境界を固定する | [[RQ-FR-001]], [[RQ-FR-022]], [[RQ-FR-023]] | - | [[BD-ADR-027]] | - |
| [[BD-ADR-028]] | インフラ文書を本体開発フローへ統合する | - | [[RQ-RDR-039]] | [[BD-ADR-028]] | - |
| [[BD-API-001]] | API一覧 | [[RQ-FR-001]], [[RQ-FR-002]], [[RQ-FR-003]], [[RQ-FR-004]], [[RQ-FR-005]], [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-FR-008]], [[RQ-FR-009]], [[RQ-FR-010]], [[RQ-FR-011]], [[RQ-FR-012]], [[RQ-FR-013]], [[RQ-FR-014]], [[RQ-FR-015]], [[RQ-FR-016]], [[RQ-FR-017]], [[RQ-FR-018]], [[RQ-FR-019]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-FR-022]], [[RQ-FR-023]], [[RQ-FR-024]], [[RQ-FR-025]], [[RQ-INT-001]] | [[RQ-RDR-021]], [[RQ-RDR-034]], [[RQ-RDR-038]] | [[BD-ADR-001]], [[BD-ADR-009]], [[BD-ADR-010]], [[BD-ADR-021]], [[BD-ADR-023]], [[BD-ADR-027]] | - |
| [[BD-API-002]] | 収集API設計 | [[RQ-DATA-001]], [[RQ-FR-001]], [[RQ-FR-003]], [[RQ-FR-004]], [[RQ-FR-005]], [[RQ-FR-009]], [[RQ-FR-017]], [[RQ-FR-019]], [[RQ-FR-025]] | [[RQ-RDR-028]], [[RQ-RDR-034]], [[RQ-RDR-036]], [[RQ-RDR-038]] | [[BD-ADR-021]], [[BD-ADR-023]], [[BD-ADR-025]], [[BD-ADR-027]] | - |
| [[BD-API-003]] | エラーモデル | [[RQ-FR-001]] | - | [[BD-ADR-001]], [[BD-ADR-021]], [[BD-ADR-023]], [[BD-ADR-025]] | - |
| [[BD-API-004]] | OpenAPI配布とAPIバージョン境界 | [[RQ-FR-025]], [[RQ-INT-001]] | [[RQ-RDR-026]] | [[BD-ADR-014]], [[BD-ADR-019]], [[BD-ADR-023]] | [[AT-SCN-006]] |
| [[BD-API-005]] | HTTP API契約共通方針 | [[RQ-DEV-001]], [[RQ-INT-001]], [[RQ-OBY-001]], [[RQ-SEC-001]] | [[RQ-RDR-038]] | [[BD-ADR-023]], [[BD-ADR-025]], [[BD-ADR-027]] | - |
| [[BD-ARCH-001]] | システムコンテキスト | [[RQ-FR-001]], [[RQ-FR-022]], [[RQ-FR-023]] | [[RQ-RDR-011]], [[RQ-RDR-028]], [[RQ-RDR-034]], [[RQ-RDR-038]] | [[BD-ADR-001]], [[BD-ADR-002]], [[BD-ADR-003]], [[BD-ADR-004]], [[BD-ADR-005]], [[BD-ADR-006]], [[BD-ADR-007]], [[BD-ADR-008]], [[BD-ADR-021]], [[BD-ADR-024]], [[BD-ADR-027]] | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] |
| [[BD-ARCH-002]] | 論理構成 | [[RQ-FR-001]] | [[RQ-RDR-034]] | [[BD-ADR-001]], [[BD-ADR-021]] | - |
| [[BD-ARCH-003]] | クラウド配置構成 | [[RQ-FR-001]] | - | [[BD-ADR-001]], [[BD-ADR-014]], [[BD-ADR-021]] | - |
| [[BD-ARCH-004]] | 主要データフロー | [[RQ-FR-001]] | - | [[BD-ADR-001]], [[BD-ADR-021]] | - |
| [[BD-ARCH-005]] | AIエージェント運用アーキテクチャ | [[RQ-DEV-002]] | [[RQ-RDR-029]] | [[BD-ADR-016]] | - |
| [[BD-ARCH-006]] | インフラ境界アーキテクチャ | [[RQ-DEV-001]], [[RQ-OBY-001]], [[RQ-SEC-001]] | - | [[BD-ADR-006]], [[BD-ADR-014]], [[BD-ADR-022]] | - |
| [[BD-BUILD-001]] | ビルド方針（デプロイ単位分離） | [[RQ-DEV-001]], [[RQ-FR-001]], [[RQ-UX-019]], [[RQ-UX-021]] | [[RQ-RDR-017]], [[RQ-RDR-018]] | [[BD-ADR-001]], [[BD-ADR-011]], [[BD-ADR-016]], [[BD-ADR-019]], [[BD-ADR-022]], [[BD-ADR-024]] | - |
| [[BD-CM-001]] | 構成管理方針 | [[RQ-FR-001]] | [[RQ-RDR-013]], [[RQ-RDR-024]] | [[BD-ADR-001]], [[BD-ADR-012]], [[BD-ADR-016]], [[BD-ADR-028]] | - |
| [[BD-DATA-001]] | データアーキテクチャ | [[RQ-DATA-001]], [[RQ-FR-001]], [[RQ-FR-004]], [[RQ-FR-009]], [[RQ-PRC-001]] | [[RQ-RDR-014]], [[RQ-RDR-017]], [[RQ-RDR-028]], [[RQ-RDR-034]], [[RQ-RDR-036]], [[RQ-RDR-038]] | [[BD-ADR-001]], [[BD-ADR-021]], [[BD-ADR-027]] | - |
| [[BD-DEP-001]] | デプロイ方式 | [[RQ-COST-001]], [[RQ-DEV-001]], [[RQ-FR-001]] | - | [[BD-ADR-001]], [[BD-ADR-028]] | - |
| [[BD-DEP-002]] | デプロイ運用ルール | [[RQ-FR-001]] | - | [[BD-ADR-001]] | - |
| [[BD-DEP-003]] | ドキュメント公開フロー（Quartz + CDK） | [[RQ-DEV-001]], [[RQ-FR-024]] | [[RQ-RDR-025]] | [[BD-ADR-013]], [[BD-ADR-016]], [[BD-ADR-019]] | [[AT-REL-001]], [[AT-RUN-001]], [[UT-PLAN-003]] |
| [[BD-DEP-004]] | 単一CloudFrontパス分岐デプロイ設計 | [[RQ-DEV-001]], [[RQ-FR-025]] | [[RQ-RDR-026]], [[RQ-RDR-034]] | [[BD-ADR-013]], [[BD-ADR-014]], [[BD-ADR-019]], [[BD-ADR-021]] | [[AT-REL-001]], [[AT-RUN-001]], [[AT-SCN-006]] |
| [[BD-DEP-005]] | インフラデプロイ設計（配信境界） | [[RQ-DEV-001]], [[RQ-FR-025]] | - | [[BD-ADR-013]], [[BD-ADR-014]], [[BD-ADR-015]], [[BD-ADR-022]] | [[AT-REL-001]], [[AT-RUN-001]] |
| [[BD-DEP-006]] | バックアップ・リカバリ設計 | [[RQ-AV-001]], [[RQ-COST-001]] | - | - | [[AT-RUN-001]] |
| [[BD-ENV-001]] | 開発環境 | [[RQ-DEV-001]], [[RQ-SEC-001]] | - | [[BD-ADR-018]], [[BD-ADR-028]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[IT-ENV-001]] |
| [[BD-ENV-002]] | 本番環境 | [[RQ-AV-001]], [[RQ-DEV-001]], [[RQ-PS-001]], [[RQ-SEC-001]] | - | [[BD-ADR-018]], [[BD-ADR-028]] | [[AT-PLAN-001]], [[AT-RPT-001]] |
| [[BD-ERD-001]] | ER図（概要） | [[RQ-DATA-001]], [[RQ-FR-001]] | [[RQ-RDR-014]] | [[BD-ADR-001]], [[BD-ADR-021]] | - |
| [[BD-INF-001]] | インフラ全体像 | [[RQ-AV-001]], [[RQ-DEV-001]], [[RQ-OBY-001]], [[RQ-SEC-001]] | [[RQ-RDR-039]] | [[BD-ADR-028]] | - |
| [[BD-INF-002]] | 環境分割方針 | - | - | [[BD-ADR-028]] | [[IT-ENV-001]], [[IT-INF-ENV-001]] |
| [[BD-INF-003]] | ネットワーク境界方針 | [[RQ-SEC-001]] | - | [[BD-ADR-028]] | [[IT-INF-NET-001]], [[IT-INF-SMK-001]] |
| [[BD-INF-004]] | IAM・Secrets・鍵管理方針 | [[RQ-SEC-001]] | - | [[BD-ADR-028]] | [[AT-OPS-INF-001]] |
| [[BD-INF-005]] | インフラ可観測性方針 | [[RQ-OBY-001]] | - | [[BD-ADR-028]] | [[AT-SLO-001]] |
| [[BD-INF-006]] | DR/BCP方針 | [[RQ-AV-001]] | - | [[BD-ADR-028]] | [[AT-DR-001]] |
| [[BD-INF-007]] | インフラ変更フロー | - | - | [[BD-ADR-028]] | [[IT-INF-ROLL-001]] |
| [[BD-MON-001]] | 監視設計 | [[RQ-AV-001]], [[RQ-OBY-001]], [[RQ-PS-001]] | - | [[BD-ADR-006]], [[BD-ADR-008]], [[BD-ADR-022]], [[BD-ADR-027]] | [[AT-OPS-001]], [[IT-CASE-012]], [[IT-CASE-013]], [[IT-INF-OBS-001]] |
| [[BD-MON-002]] | SLO運用 | [[RQ-AV-001]], [[RQ-OBY-001]], [[RQ-PS-001]] | - | [[BD-ADR-006]], [[BD-ADR-008]], [[BD-ADR-022]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-RPT-001]] |
| [[BD-MON-003]] | インフラ監視運用 | [[RQ-AV-001]], [[RQ-OBY-001]], [[RQ-PS-001]] | - | [[BD-ADR-006]], [[BD-ADR-014]], [[BD-ADR-022]] | [[AT-OPS-001]] |
| [[BD-QUAL-001]] | 品質特性 | [[RQ-AV-001]], [[RQ-DEV-001]], [[RQ-OBY-001]], [[RQ-PS-001]], [[RQ-UX-001]], [[RQ-UX-023]] | [[RQ-RDR-017]] | [[BD-ADR-001]], [[BD-ADR-024]] | [[AT-OPS-001]], [[AT-RPT-001]], [[AT-RUN-001]] |
| [[BD-RET-001]] | データ保持・削除方針 | [[RQ-FR-001]] | - | [[BD-ADR-001]] | - |
| [[BD-SEC-001]] | セキュリティ設計 | [[RQ-DEV-001]], [[RQ-PRC-001]], [[RQ-SEC-001]], [[RQ-UX-014]], [[RQ-UX-016]], [[RQ-UX-022]] | [[RQ-RDR-017]], [[RQ-RDR-018]] | [[BD-ADR-001]], [[BD-ADR-024]] | [[AT-OPS-001]] |
| [[BD-TST-001]] | テスト戦略 | [[RQ-AV-001]], [[RQ-FR-001]], [[RQ-OBY-001]], [[RQ-PS-001]] | [[RQ-RDR-037]] | [[BD-ADR-001]], [[BD-ADR-026]], [[BD-ADR-028]] | [[AT-DR-001]], [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-OPS-INF-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]], [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]], [[AT-SLO-001]], [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]], [[UT-COV-001]], [[UT-IAC-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-002]], [[UT-PLAN-003]], [[UT-PLAN-004]], [[UT-PLAN-005]], [[UT-POL-001]], [[UT-RPT-001]], [[UT-SEC-001]], [[UT-STAT-001]], [[UT-TDAT-001]] |
| [[BD-UI-001]] | 画面一覧 | [[RQ-FR-001]], [[RQ-FR-002]], [[RQ-FR-003]], [[RQ-FR-004]], [[RQ-FR-005]], [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-FR-008]], [[RQ-FR-009]], [[RQ-FR-010]], [[RQ-FR-011]], [[RQ-FR-012]], [[RQ-FR-013]], [[RQ-FR-014]], [[RQ-FR-015]], [[RQ-FR-016]], [[RQ-FR-017]], [[RQ-FR-018]], [[RQ-FR-019]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-FR-022]], [[RQ-FR-024]], [[RQ-FR-025]] | [[RQ-RDR-036]] | [[BD-ADR-001]], [[BD-ADR-009]], [[BD-ADR-010]], [[BD-ADR-021]] | - |
| [[BD-UI-002]] | 検索画面情報設計 | [[RQ-FR-001]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-FR-022]], [[RQ-FR-023]], [[RQ-UX-001]], [[RQ-UX-002]], [[RQ-UX-003]], [[RQ-UX-004]], [[RQ-UX-005]], [[RQ-UX-006]], [[RQ-UX-007]], [[RQ-UX-008]], [[RQ-UX-009]], [[RQ-UX-010]], [[RQ-UX-011]], [[RQ-UX-012]], [[RQ-UX-013]], [[RQ-UX-015]], [[RQ-UX-018]], [[RQ-UX-020]], [[RQ-UX-024]] | [[RQ-RDR-015]], [[RQ-RDR-018]], [[RQ-RDR-021]], [[RQ-RDR-032]] | [[BD-ADR-001]], [[BD-ADR-009]], [[BD-ADR-010]], [[BD-ADR-017]], [[BD-ADR-018]] | [[UT-PLAN-004]] |
| [[BD-UI-003]] | 画面遷移 | [[RQ-FR-001]], [[RQ-FR-005]], [[RQ-FR-014]], [[RQ-FR-019]], [[RQ-FR-020]], [[RQ-FR-024]], [[RQ-FR-025]] | - | [[BD-ADR-001]], [[BD-ADR-009]], [[BD-ADR-010]], [[BD-ADR-021]] | - |
| [[BD-UI-004]] | アクセシビリティ方針 | [[RQ-FR-001]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-UX-017]] | [[RQ-RDR-021]] | [[BD-ADR-001]], [[BD-ADR-009]], [[BD-ADR-010]] | - |
| [[DD-ALG-001]] | 検索アルゴリズム | [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-FR-008]] | - | - | [[UT-PLAN-001]] |
| [[DD-API-001]] | API詳細総論 | [[RQ-FR-001]], [[RQ-INT-001]] | [[RQ-RDR-034]] | [[BD-ADR-021]], [[BD-ADR-023]], [[BD-ADR-025]] | [[UT-COV-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-005]], [[UT-RPT-001]], [[UT-STAT-001]], [[UT-TDAT-001]] |
| [[DD-API-002]] | [[RQ-GL-002|収集ジョブ]]起動API | [[RQ-FR-001]], [[RQ-FR-022]], [[RQ-FR-023]] | [[RQ-RDR-034]] | [[BD-ADR-021]], [[BD-ADR-027]] | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-004]], [[AT-SCN-008]], [[IT-CASE-001]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-PLAN-001]], [[UT-CASE-001]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-003]] | [[RQ-GL-002|収集ジョブ]]状態API | [[RQ-FR-001]] | - | [[BD-ADR-021]] | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-004]], [[AT-SCN-005]], [[IT-CASE-002]], [[IT-PLAN-001]], [[UT-CASE-002]], [[UT-CASE-009]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-004]] | アーカイブ一覧API | [[RQ-FR-001]] | - | [[BD-ADR-021]] | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-001]], [[IT-CASE-003]], [[IT-CASE-009]], [[IT-PLAN-001]], [[UT-CASE-003]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-005]] | [[RQ-GL-005|タグ辞書]]API | [[RQ-FR-001]] | - | [[BD-ADR-021]] | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-002]], [[AT-SCN-007]], [[IT-CASE-004]], [[IT-CASE-009]], [[IT-PLAN-001]], [[UT-CASE-004]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-006]] | 検索API | [[RQ-FR-001]] | - | [[BD-ADR-021]] | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-002]], [[IT-CASE-005]], [[IT-PLAN-001]], [[UT-CASE-005]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-007]] | 動画詳細API | [[RQ-FR-001]] | - | [[BD-ADR-021]] | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-003]], [[IT-CASE-006]], [[IT-PLAN-001]], [[UT-CASE-006]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-008]] | [[RQ-GL-011|再収集]]API | [[RQ-FR-001]] | - | [[BD-ADR-021]] | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-005]], [[IT-CASE-007]], [[IT-CASE-012]], [[IT-PLAN-001]], [[UT-CASE-007]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-009]] | 運用診断API | [[RQ-FR-001]] | - | [[BD-ADR-021]] | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-004]], [[AT-SCN-005]], [[IT-CASE-008]], [[IT-CASE-012]], [[IT-CASE-013]], [[IT-PLAN-001]], [[UT-CASE-008]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-API-010]] | API経路バージョニング詳細 | [[RQ-FR-025]], [[RQ-INT-001]] | [[RQ-RDR-026]] | [[BD-ADR-014]] | [[AT-SCN-006]] |
| [[DD-API-011]] | 収集結果明細API | [[RQ-FR-017]] | - | [[BD-ADR-021]] | [[AT-SCN-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[UT-CASE-009]], [[UT-PLAN-001]] |
| [[DD-API-012]] | 配信前後再確認API | [[RQ-FR-019]] | [[RQ-RDR-034]] | [[BD-ADR-021]] | [[AT-RPT-001]], [[AT-SCN-007]], [[IT-CASE-010]], [[UT-CASE-010]], [[UT-PLAN-001]] |
| [[DD-API-013]] | タグ管理API | [[RQ-FR-005]], [[RQ-FR-019]] | [[RQ-RDR-036]] | [[BD-ADR-021]] | [[AT-RPT-001]], [[AT-SCN-007]], [[AT-SCN-009]], [[IT-CASE-011]], [[IT-CASE-013]], [[UT-CASE-011]], [[UT-CASE-013]], [[UT-PLAN-001]] |
| [[DD-API-014]] | ドキュメント公開実行API | [[RQ-FR-024]] | [[RQ-RDR-034]] | [[BD-ADR-021]], [[BD-ADR-027]] | [[IT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-PLAN-003]] |
| [[DD-API-015]] | 配信反映ジョブ状態API | [[RQ-FR-005]], [[RQ-FR-024]] | - | [[BD-ADR-021]] | [[AT-RPT-001]], [[AT-SCN-007]], [[AT-SCN-009]], [[IT-CASE-011]], [[UT-CASE-013]], [[UT-PLAN-001]] |
| [[DD-ARCH-002]] | Next.js App Router 実装ガイド | - | - | [[BD-ADR-024]] | - |
| [[DD-AV-001]] | 可用性詳細 | [[RQ-AV-001]], [[RQ-OBY-001]] | - | [[BD-ADR-020]] | [[AT-OPS-001]], [[AT-RPT-001]] |
| [[DD-AV-002]] | インフラ可用性詳細 | - | - | [[BD-ADR-006]], [[BD-ADR-014]] | [[AT-OPS-001]], [[AT-RPT-001]] |
| [[DD-CICD-INF-001]] | インフラCI/CD詳細 | - | - | [[BD-ADR-028]] | [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]] |
| [[DD-CODE-001]] | コーディング規約 | [[RQ-DEV-001]] | - | [[BD-ADR-011]], [[BD-ADR-022]] | [[UT-PLAN-001]] |
| [[DD-COMP-001]] | コンポーネント分割 | [[RQ-FR-006]], [[RQ-FR-013]], [[RQ-FR-017]] | - | - | [[UT-PLAN-001]] |
| [[DD-COMP-002]] | 責務対応表 | [[RQ-FR-006]], [[RQ-FR-013]], [[RQ-FR-017]] | - | - | [[UT-PLAN-001]] |
| [[DD-COST-001]] | コスト運用詳細 | [[RQ-COST-001]], [[RQ-SEC-001]] | [[RQ-RDR-027]] | [[BD-ADR-015]] | [[AT-OPS-001]] |
| [[DD-DBCON-001]] | DB制約方針 | [[RQ-DATA-001]] | - | - | [[UT-PLAN-001]] |
| [[DD-DBCON-002]] | 一意制約・チェック制約 | [[RQ-DATA-001]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-001]] | DDL一覧 | [[RQ-DATA-001]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-002]] | channelsテーブル | [[RQ-DATA-001]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-003]] | videosテーブル | [[RQ-DATA-001]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-004]] | video_tagsテーブル | [[RQ-DATA-001]], [[RQ-FR-009]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-005]] | tagsテーブル | [[RQ-DATA-001]], [[RQ-FR-005]], [[RQ-FR-009]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-006]] | tag_typesテーブル | [[RQ-FR-005]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-007]] | ingestion_runsテーブル | [[RQ-FR-001]], [[RQ-OBY-001]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-008]] | ingestion_eventsテーブル | [[RQ-OBY-001]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-009]] | ingestion_itemsテーブル | [[RQ-FR-017]], [[RQ-FR-018]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-010]] | recheck_runsテーブル | [[RQ-FR-019]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-011]] | recheck_itemsテーブル | [[RQ-FR-019]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-012]] | publish_runsテーブル | [[RQ-FR-005]], [[RQ-FR-024]], [[RQ-FR-025]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-013]] | publish_stepsテーブル | [[RQ-FR-024]], [[RQ-FR-025]] | - | - | [[UT-PLAN-001]] |
| [[DD-DDL-014]] | publish_artifactsテーブル | [[RQ-DATA-001]], [[RQ-INT-001]] | - | - | [[UT-PLAN-001]] |
| [[DD-DEP-001]] | デプロイ詳細 | [[RQ-FR-024]] | [[RQ-RDR-025]], [[RQ-RDR-029]] | [[BD-ADR-013]], [[BD-ADR-016]] | [[AT-REL-001]], [[AT-RUN-001]], [[UT-PLAN-003]] |
| [[DD-DEP-002]] | CloudFrontパス分岐詳細 | [[RQ-FR-025]] | [[RQ-RDR-026]] | [[BD-ADR-014]] | [[AT-REL-001]], [[AT-SCN-006]] |
| [[DD-DEP-003]] | インフラデプロイ詳細（領域分割） | - | - | [[BD-ADR-014]] | [[AT-REL-001]], [[AT-RUN-001]] |
| [[DD-DR-001]] | DR復旧手順詳細 | - | - | - | [[AT-DR-001]], [[AT-RUN-001]] |
| [[DD-ERR-001]] | エラーコード設計 | [[RQ-OBY-001]], [[RQ-SEC-001]] | - | [[BD-ADR-020]], [[BD-ADR-023]], [[BD-ADR-025]] | [[AT-SCN-006]], [[UT-PLAN-001]] |
| [[DD-IAC-001]] | IaCモジュール設計 | - | - | [[BD-ADR-028]] | [[UT-IAC-001]], [[UT-POL-001]] |
| [[DD-IAC-002]] | IaC状態管理とドリフト検知 | - | - | - | [[IT-INF-ENV-001]], [[IT-INF-ROLL-001]] |
| [[DD-IAM-001]] | IAM詳細設計 | - | - | - | [[AT-OPS-INF-001]], [[UT-POL-001]], [[UT-SEC-001]] |
| [[DD-LOG-001]] | ログ設計 | [[RQ-AV-001]], [[RQ-COST-001]], [[RQ-OBY-001]], [[RQ-PRC-001]], [[RQ-PS-001]], [[RQ-SEC-001]] | [[RQ-RDR-035]] | [[BD-ADR-020]], [[BD-ADR-022]], [[BD-ADR-027]] | [[AT-OPS-001]], [[AT-RPT-001]] |
| [[DD-LOG-002]] | インフラ監視ログ詳細 | - | - | [[BD-ADR-022]] | [[AT-OPS-001]], [[AT-RPT-001]] |
| [[DD-MIG-001]] | DB移行方針 | [[RQ-DATA-001]], [[RQ-DEV-001]] | - | [[BD-ADR-020]] | [[AT-RUN-001]], [[IT-CASE-001]], [[UT-PLAN-001]] |
| [[DD-NET-001]] | ネットワーク詳細設計 | - | - | - | [[AT-OPS-INF-001]], [[IT-INF-NET-001]] |
| [[DD-OBS-001]] | インフラ監視詳細設計 | - | - | - | [[AT-SLO-001]], [[IT-INF-OBS-001]] |
| [[DD-PERF-001]] | 性能設計 | [[RQ-OBY-001]], [[RQ-PS-001]] | - | [[BD-ADR-020]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-RPT-001]] |
| [[DD-REV-001]] | レビュー規約 | [[RQ-DEV-001]] | - | - | [[UT-PLAN-001]] |
| [[DD-SCALE-001]] | 拡張性詳細 | [[RQ-AV-001]], [[RQ-DATA-001]], [[RQ-PS-001]] | - | [[BD-ADR-020]] | [[AT-OPS-001]], [[UT-PLAN-001]] |
| [[DD-SEC-001]] | セキュリティ統制詳細 | [[RQ-DEV-001]], [[RQ-PRC-001]], [[RQ-SEC-001]] | [[RQ-RDR-035]] | [[BD-ADR-020]], [[BD-ADR-022]] | [[AT-OPS-001]], [[AT-RUN-001]], [[UT-PLAN-001]] |
| [[DD-SEC-002]] | インフラセキュリティ統制詳細 | - | - | [[BD-ADR-014]] | [[AT-OPS-001]] |
| [[DD-UI-001]] | UI詳細総論 | [[RQ-UX-001]], [[RQ-UX-005]] | - | - | [[UT-PLAN-001]] |
| [[DD-UI-002]] | 一覧画面 | [[RQ-FR-001]], [[RQ-UX-001]], [[RQ-UX-005]] | [[RQ-RDR-032]] | [[BD-ADR-017]], [[BD-ADR-018]] | [[UT-PLAN-001]], [[UT-PLAN-004]] |
| [[DD-UI-003]] | フィルタドロワー | [[RQ-FR-006]], [[RQ-FR-008]], [[RQ-UX-005]] | - | - | [[UT-PLAN-001]] |
| [[DD-UI-004]] | 詳細モーダル | [[RQ-FR-013]], [[RQ-FR-014]], [[RQ-FR-020]], [[RQ-FR-021]] | - | - | [[UT-PLAN-001]] |
| [[DD-UI-005]] | 検索バー | [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-UX-003]] | - | - | [[UT-PLAN-001]] |
| [[DD-UI-006]] | 運用ステータス画面 | [[RQ-FR-016]], [[RQ-FR-017]], [[RQ-FR-018]], [[RQ-FR-019]], [[RQ-FR-024]] | [[RQ-RDR-036]] | [[BD-ADR-021]] | [[AT-SCN-007]], [[UT-PLAN-001]] |
<!-- END AUTO-GENERATED: DESIGN_VIEW -->

## テスト層トレース（自動生成）
- `task docs:trace` で自動更新する。

<!-- BEGIN AUTO-GENERATED: TEST_LAYER_TRACE -->
- generated_at: 2026-02-13
- judgment: 経路判定（max_depth=4、frontmatter+本文リンク）

### 要求 -> 受入テスト（AT）
| 要求ID(FR/NFR) | タイトル | ATシナリオ(AT-SCN) | 補助AT文書 | 判定 |
| --- | --- | --- | --- | --- |
| [[RQ-AV-001]] | 可用性要件 | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]] | PASS |
| [[RQ-COST-001]] | コスト要件 | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-OPS-001]] | PASS |
| [[RQ-DATA-001]] | データ要件 | [[AT-SCN-004]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001]] | DevOps要件 | [[AT-SCN-006]] | [[AT-GO-001]], [[AT-REL-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-002]] | AIエージェント運用要件 | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-001]] | 管理画面から公開動画[[RQ-GL-002|収集ジョブ]]を実行できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-007]], [[AT-SCN-008]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-002]] | 管理画面で公式投稿の公開動画をチャンネルID一致で取り込める | [[AT-SCN-008]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-003]] | 管理画面で出演条件一致の公開動画を判定して取り込める | [[AT-SCN-008]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-004]] | 管理画面の収集結果として動画メタデータを正規化できる | [[AT-SCN-008]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-005]] | [[RQ-GL-005|タグ辞書]]を更新できる | [[AT-SCN-009]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-006]] | ページング済み索引を生成できる | [[AT-SCN-007]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-007]] | アーカイブ一覧を表示できる | [[AT-SCN-002]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-008]] | キーワード検索できる | [[AT-SCN-002]] | [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-009]] | タグ条件で絞り込みできる | [[AT-SCN-009]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-010]] | 日付範囲で絞り込みできる | [[AT-SCN-002]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-011]] | 再生時間で絞り込みできる | [[AT-SCN-002]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-012]] | 並び順を切り替えできる | [[AT-SCN-002]] | [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-013]] | 動画詳細モーダルを表示できる | [[AT-SCN-002]], [[AT-SCN-003]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-014]] | YouTube視聴ページへ遷移できる | [[AT-SCN-002]], [[AT-SCN-003]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-015]] | 初回読み込みを高速化する[[RQ-GL-010|段階ロード]]で漸進表示できる | [[AT-SCN-002]], [[AT-SCN-008]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-016]] | 管理画面で読み込み失敗を通知できる | [[AT-SCN-002]], [[AT-SCN-007]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-017]] | 管理画面で収集実行結果を確認できる | [[AT-SCN-005]], [[AT-SCN-007]], [[AT-SCN-008]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-018]] | 管理画面で手動[[RQ-GL-011|再収集]]を実行できる | [[AT-SCN-005]], [[AT-SCN-007]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-019]] | 管理画面で配信前後のメタデータ再取得と差分確認を運用できる | [[AT-SCN-007]] | [[AT-PLAN-001]] | PASS |
| [[RQ-FR-020]] | 詳細画面で[[RQ-GL-016|コメント密度波形]]を表示し[[RQ-GL-015|盛り上がり区間]]へ遷移できる | [[AT-SCN-003]] | [[AT-PLAN-001]] | PASS |
| [[RQ-FR-021]] | 動画詳細で[[RQ-GL-017|ワードクラウド]]を表示できる | [[AT-SCN-003]] | [[AT-PLAN-001]] | PASS |
| [[RQ-FR-022]] | [[RQ-GL-016|コメント密度波形]]表示用データを生成できる | [[AT-SCN-003]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-023]] | [[RQ-GL-017|ワードクラウド]]表示用画像を生成できる | [[AT-SCN-003]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-024]] | 管理画面でドキュメント公開を一括実行できる | [[AT-SCN-007]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-REL-001]] | PASS |
| [[RQ-FR-025]] | 管理画面運用の前提として単一CloudFrontで配信経路をパス分岐できる | [[AT-SCN-006]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-001]] | 相互運用性要件 | [[AT-SCN-004]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-001]] | 可観測性要件 | [[AT-SCN-002]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-008]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-RPT-001]] | PASS |
| [[RQ-PRC-001]] | プライバシー要件 | [[AT-SCN-003]] | [[AT-OPS-001]] | PASS |
| [[RQ-PS-001]] | 性能要件 | [[AT-SCN-008]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]] | PASS |
| [[RQ-SEC-001]] | セキュリティ要件 | [[AT-SCN-006]] | [[AT-OPS-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-001]] | ユーザー体験要件 | [[AT-SCN-002]] | [[AT-RPT-001]] | PASS |
| [[RQ-UX-002]] | 非テキストコンテンツの代替とアクセシブルネーム | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-003]] | マルチメディアの字幕・音声解説・文字起こし | [[AT-SCN-002]] | [[AT-GUIDE-001]] | PASS |
| [[RQ-UX-004]] | 色のみに依存しない表現とコントラスト | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-005]] | リフロー・拡大・画面向きへの対応 | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-006]] | キーボード操作性とフォーカス順序 | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-007]] | フォーカス可視化とフォーカスの非遮蔽 | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-008]] | ポインター入力のターゲットサイズ | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-009]] | ドラッグ操作の代替手段 | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-010]] | 複雑ジェスチャ・誤操作防止・端末動作への依存回避 | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-011]] | ページ構造（タイトル・見出し・ランドマーク）とナビゲーション | [[AT-SCN-001]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-012]] | フォームのラベル・エラー提示・入力支援 | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-013]] | 同一プロセス内の再入力（Redundant Entry）の最小化 | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-014]] | アクセシブルな認証（Accessible Authentication） | [[AT-SCN-002]] | [[AT-OPS-001]] | PASS |
| [[RQ-UX-015]] | ヘルプ手段の一貫性（Consistent Help） | [[AT-SCN-002]] | [[AT-GUIDE-001]], [[AT-OPS-001]] | PASS |
| [[RQ-UX-016]] | 時間制限とセッションタイムアウトの配慮 | [[AT-SCN-002]] | [[AT-OPS-001]] | PASS |
| [[RQ-UX-017]] | 状態変化の通知（Status Messages） | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-018]] | 閃光・発作リスクの回避 | [[AT-SCN-001]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-019]] | 堅牢性（HTML/ARIA準拠）と支援技術互換 | [[AT-SCN-001]], [[AT-SCN-002]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-020]] | ダウンロード資料・通知（メール等）のアクセシビリティ | [[AT-SCN-001]], [[AT-SCN-002]] | [[AT-GUIDE-001]], [[AT-OPS-001]] | PASS |
| [[RQ-UX-021]] | クラウドCI/CDにおけるアクセシビリティ検査の自動化とゲート | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-022]] | サードパーティ/クラウドサービスのアクセシビリティ担保 | [[AT-SCN-002]], [[AT-SCN-004]] | [[AT-OPS-001]] | PASS |
| [[RQ-UX-023]] | アクセシビリティ不具合の受付と是正プロセス | [[AT-SCN-002]], [[AT-SCN-007]] | [[AT-OPS-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-024]] | 言語指定（Language of Page/Parts） | [[AT-SCN-001]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |

### 基本設計 -> 結合テスト（IT）
| 設計ID(BD) | タイトル | ITケース(IT-CASE) | 補助IT文書 | 判定 |
| --- | --- | --- | --- | --- |
| [[BD-API-001]] | API一覧 | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-API-002]] | 収集API設計 | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-004]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-API-003]] | エラーモデル | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-OBS-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-API-004]] | OpenAPI配布とAPIバージョン境界 | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-API-005]] | HTTP API契約共通方針 | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]] | PASS |
| [[BD-ARCH-001]] | システムコンテキスト | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-OBS-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-ARCH-002]] | 論理構成 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-OBS-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-ARCH-003]] | クラウド配置構成 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-ARCH-004]] | 主要データフロー | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-ARCH-005]] | AIエージェント運用アーキテクチャ | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-ROLL-001]], [[IT-PLAN-001]] | PASS |
| [[BD-ARCH-006]] | インフラ境界アーキテクチャ | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-BUILD-001]] | ビルド方針（デプロイ単位分離） | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]] | PASS |
| [[BD-CM-001]] | 構成管理方針 | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-ROLL-001]], [[IT-PLAN-001]] | PASS |
| [[BD-DATA-001]] | データアーキテクチャ | [[IT-CASE-001]], [[IT-CASE-004]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-PLAN-001]] | PASS |
| [[BD-DEP-001]] | デプロイ方式 | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]] | PASS |
| [[BD-DEP-002]] | デプロイ運用ルール | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-DEP-003]] | ドキュメント公開フロー（Quartz + CDK） | [[IT-CASE-001]], [[IT-CASE-011]] | [[IT-ENV-001]] | PASS |
| [[BD-DEP-004]] | 単一CloudFrontパス分岐デプロイ設計 | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-DEP-005]] | インフラデプロイ設計（配信境界） | [[IT-CASE-001]], [[IT-CASE-004]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]] | PASS |
| [[BD-DEP-006]] | バックアップ・リカバリ設計 | [[IT-CASE-007]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-OBS-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-ENV-001]] | 開発環境 | [[IT-CASE-001]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]] | PASS |
| [[BD-ENV-002]] | 本番環境 | [[IT-CASE-001]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-SMK-001]] | PASS |
| [[BD-ERD-001]] | ER図（概要） | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-OBS-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-INF-001]] | インフラ全体像 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]] | PASS |
| [[BD-INF-002]] | 環境分割方針 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-INF-ENV-001]] | PASS |
| [[BD-INF-003]] | ネットワーク境界方針 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-INF-NET-001]], [[IT-INF-SMK-001]] | PASS |
| [[BD-INF-004]] | IAM・Secrets・鍵管理方針 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]] | PASS |
| [[BD-INF-005]] | インフラ可観測性方針 | [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]] | PASS |
| [[BD-INF-006]] | DR/BCP方針 | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-INF-007]] | インフラ変更フロー | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-ROLL-001]] | PASS |
| [[BD-MON-001]] | 監視設計 | [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]] | PASS |
| [[BD-MON-002]] | SLO運用 | [[IT-CASE-007]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]], [[IT-PLAN-001]] | PASS |
| [[BD-MON-003]] | インフラ監視運用 | [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]] | PASS |
| [[BD-QUAL-001]] | 品質特性 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-RET-001]] | データ保持・削除方針 | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-SEC-001]] | セキュリティ設計 | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-TST-001]] | テスト戦略 | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-UI-001]] | 画面一覧 | [[IT-CASE-001]], [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-UI-002]] | 検索画面情報設計 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-OBS-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-UI-003]] | 画面遷移 | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-UI-004]] | アクセシビリティ方針 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-OBS-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |

### 詳細設計 -> 単体テスト（UT）
| 設計ID(DD) | タイトル | UTケース(UT-CASE) | 補助UT文書 | 判定 |
| --- | --- | --- | --- | --- |
| [[DD-ALG-001]] | 検索アルゴリズム | [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]] | [[UT-PLAN-001]] | PASS |
| [[DD-API-001]] | API詳細総論 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-COV-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-005]], [[UT-RPT-001]], [[UT-STAT-001]], [[UT-TDAT-001]] | PASS |
| [[DD-API-002]] | [[RQ-GL-002|収集ジョブ]]起動API | [[UT-CASE-001]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-API-003]] | [[RQ-GL-002|収集ジョブ]]状態API | [[UT-CASE-002]], [[UT-CASE-009]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-API-004]] | アーカイブ一覧API | [[UT-CASE-003]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-API-005]] | [[RQ-GL-005|タグ辞書]]API | [[UT-CASE-004]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-API-006]] | 検索API | [[UT-CASE-005]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-API-007]] | 動画詳細API | [[UT-CASE-006]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-API-008]] | [[RQ-GL-011|再収集]]API | [[UT-CASE-007]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-API-009]] | 運用診断API | [[UT-CASE-008]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-API-010]] | API経路バージョニング詳細 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-API-011]] | 収集結果明細API | [[UT-CASE-009]] | [[UT-PLAN-001]] | PASS |
| [[DD-API-012]] | 配信前後再確認API | [[UT-CASE-010]] | [[UT-PLAN-001]] | PASS |
| [[DD-API-013]] | タグ管理API | [[UT-CASE-011]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-API-014]] | ドキュメント公開実行API | [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-003]] | PASS |
| [[DD-API-015]] | 配信反映ジョブ状態API | [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-ARCH-002]] | Next.js App Router 実装ガイド | [[UT-CASE-003]] | [[UT-COV-001]], [[UT-PLAN-001]], [[UT-PLAN-004]] | PASS |
| [[DD-AV-001]] | 可用性詳細 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-AV-002]] | インフラ可用性詳細 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-005]] | PASS |
| [[DD-CICD-INF-001]] | インフラCI/CD詳細 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-IAC-001]], [[UT-POL-001]] | PASS |
| [[DD-CODE-001]] | コーディング規約 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-COMP-001]] | コンポーネント分割 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-COMP-002]] | 責務対応表 | [[UT-CASE-003]] | [[UT-PLAN-001]] | PASS |
| [[DD-COST-001]] | コスト運用詳細 | [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]] | [[UT-PLAN-001]], [[UT-PLAN-005]], [[UT-SEC-001]] | PASS |
| [[DD-DBCON-001]] | DB制約方針 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-DBCON-002]] | 一意制約・チェック制約 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-001]] | DDL一覧 | [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-002]] | channelsテーブル | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-003]] | videosテーブル | [[UT-CASE-007]], [[UT-CASE-009]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-004]] | video_tagsテーブル | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-005]] | tagsテーブル | [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-006]] | tag_typesテーブル | [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-007]] | ingestion_runsテーブル | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-008]] | ingestion_eventsテーブル | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-009]] | ingestion_itemsテーブル | [[UT-CASE-007]], [[UT-CASE-009]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-010]] | recheck_runsテーブル | [[UT-CASE-010]], [[UT-CASE-011]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-011]] | recheck_itemsテーブル | [[UT-CASE-010]], [[UT-CASE-011]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-012]] | publish_runsテーブル | [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-013]] | publish_stepsテーブル | [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-DDL-014]] | publish_artifactsテーブル | [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-DEP-001]] | デプロイ詳細 | [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-003]] | PASS |
| [[DD-DEP-002]] | CloudFrontパス分岐詳細 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-003]] | PASS |
| [[DD-DEP-003]] | インフラデプロイ詳細（領域分割） | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-003]], [[UT-SEC-001]] | PASS |
| [[DD-DR-001]] | DR復旧手順詳細 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-IAC-001]], [[UT-POL-001]], [[UT-SEC-001]] | PASS |
| [[DD-ERR-001]] | エラーコード設計 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-IAC-001]] | IaCモジュール設計 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-IAC-001]], [[UT-POL-001]] | PASS |
| [[DD-IAC-002]] | IaC状態管理とドリフト検知 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-IAC-001]], [[UT-POL-001]] | PASS |
| [[DD-IAM-001]] | IAM詳細設計 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-POL-001]], [[UT-SEC-001]] | PASS |
| [[DD-LOG-001]] | ログ設計 | [[UT-CASE-001]] | [[UT-PLAN-001]], [[UT-PLAN-005]], [[UT-SEC-001]] | PASS |
| [[DD-LOG-002]] | インフラ監視ログ詳細 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]], [[UT-PLAN-003]] | PASS |
| [[DD-MIG-001]] | DB移行方針 | [[UT-CASE-001]] | [[UT-PLAN-001]] | PASS |
| [[DD-NET-001]] | ネットワーク詳細設計 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-IAC-001]], [[UT-POL-001]], [[UT-SEC-001]] | PASS |
| [[DD-OBS-001]] | インフラ監視詳細設計 | [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-IAC-001]], [[UT-PLAN-005]], [[UT-POL-001]], [[UT-SEC-001]] | PASS |
| [[DD-PERF-001]] | 性能設計 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-REV-001]] | レビュー規約 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-SCALE-001]] | 拡張性詳細 | [[UT-CASE-001]], [[UT-CASE-003]] | [[UT-PLAN-001]] | PASS |
| [[DD-SEC-001]] | セキュリティ統制詳細 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-SEC-002]] | インフラセキュリティ統制詳細 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]], [[UT-PLAN-003]], [[UT-PLAN-005]], [[UT-SEC-001]] | PASS |
| [[DD-UI-001]] | UI詳細総論 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-UI-002]] | 一覧画面 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]], [[UT-PLAN-004]] | PASS |
| [[DD-UI-003]] | フィルタドロワー | [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]] | [[UT-PLAN-001]] | PASS |
| [[DD-UI-004]] | 詳細モーダル | [[UT-CASE-004]] | [[UT-PLAN-001]] | PASS |
| [[DD-UI-005]] | 検索バー | [[UT-CASE-001]], [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-UI-006]] | 運用ステータス画面 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
<!-- END AUTO-GENERATED: TEST_LAYER_TRACE -->

## 変更履歴
- 2026-02-11: UT/IT/ATトレース表の経路判定（max_depth=4）自動生成ブロックを追加 [[RQ-RDR-037]]
- 2026-02-11: DD-APIのFR対応を再マッピングし、[[DD-API-011]]〜[[DD-API-015]]を追加 [[RQ-RDR-034]]
- 2026-02-11: `task docs:trace` による設計別静的ビューの自動生成ブロックを追加 [[RQ-RDR-033]]
- 2026-02-11: 新規作成（設計別トレーサビリティビューを追加） [[RQ-RDR-033]]
