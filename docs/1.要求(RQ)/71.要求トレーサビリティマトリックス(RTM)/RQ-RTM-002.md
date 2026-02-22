---
id: RQ-RTM-002
title: 要求トレーサビリティ（設計別）
doc_type: 要求トレーサビリティマトリックス
phase: RQ
version: 1.0.5
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-23'
up:
- '[[RQ-RTM-001]]'
related:
- '[[RQ-RDR-033]]'
- '[[RQ-RDR-037]]'
- '[[RQ-RDR-039]]'
- '[[RQ-RDR-050]]'
- '[[BD-SYS-ARCH-001]]'
- '[[DD-APP-API-001]]'
- '[[DD-APP-UI-002]]'
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
   - `python3 .opencode/skills/obsidian-trace/scripts/traceability.py --docs-root docs --start DD-APP-UI-002 --depth 4 --direction both --include-related --mode tree --out reports/traceability_dd_ui_002.md`
4. 変更差分を確認し、`RQ-RTM-001` と `RQ-RTM-002` を同時に更新する。

## 設計別ビュー（静的）
- `task docs:trace` で自動更新する。

<!-- BEGIN AUTO-GENERATED: DESIGN_VIEW -->
- generated_at: 2026-02-23

| 設計ID | タイトル | 根拠要件(FR/NFR) | RDR | ADR | 検証(UT/IT/AT) |
| --- | --- | --- | --- | --- | --- |
| [[BD-APP-API-001]] | API一覧 | [[RQ-FR-001]], [[RQ-FR-002]], [[RQ-FR-003]], [[RQ-FR-004]], [[RQ-FR-005]], [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-FR-008]], [[RQ-FR-009]], [[RQ-FR-010]], [[RQ-FR-011]], [[RQ-FR-012]], [[RQ-FR-013]], [[RQ-FR-014]], [[RQ-FR-015]], [[RQ-FR-016]], [[RQ-FR-017]], [[RQ-FR-018]], [[RQ-FR-019]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-FR-022]], [[RQ-FR-023]], [[RQ-FR-024]], [[RQ-FR-025]] | [[RQ-RDR-021]], [[RQ-RDR-034]], [[RQ-RDR-038]], [[RQ-RDR-046]] | - | - |
| [[BD-APP-API-002]] | 収集API設計 | [[RQ-DATA-001-01]], [[RQ-FR-001]], [[RQ-FR-003]], [[RQ-FR-004]], [[RQ-FR-005]], [[RQ-FR-009]], [[RQ-FR-017]], [[RQ-FR-019]], [[RQ-FR-022]], [[RQ-FR-023]], [[RQ-FR-025]] | [[RQ-RDR-028]], [[RQ-RDR-034]], [[RQ-RDR-036]], [[RQ-RDR-038]], [[RQ-RDR-046]] | - | - |
| [[BD-APP-API-003]] | エラーモデル | [[RQ-FR-001]] | - | - | - |
| [[BD-APP-API-004]] | OpenAPI配布とAPIバージョン境界 | [[RQ-FR-025]], [[RQ-INT-001-01]] | [[RQ-RDR-026]] | - | [[AT-SCN-006]] |
| [[BD-APP-API-005]] | HTTP API契約共通方針 | [[RQ-DEV-001-01]], [[RQ-INT-001-01]], [[RQ-OBY-001-01]], [[RQ-SEC-001-01]] | [[RQ-RDR-038]] | - | - |
| [[BD-APP-DATA-001]] | データアーキテクチャ | [[RQ-DATA-001-01]], [[RQ-FR-001]], [[RQ-FR-004]], [[RQ-FR-009]], [[RQ-PRC-001-01]] | [[RQ-RDR-014]], [[RQ-RDR-017]], [[RQ-RDR-028]], [[RQ-RDR-034]], [[RQ-RDR-036]], [[RQ-RDR-038]] | - | - |
| [[BD-APP-DATA-002]] | ER図（概要） | [[RQ-FR-001]] | [[RQ-RDR-014]] | - | - |
| [[BD-APP-DATA-003]] | データ保持・削除方針 | [[RQ-DATA-001-01]], [[RQ-PRC-001-01]] | [[RQ-RDR-034]], [[RQ-RDR-035]] | - | - |
| [[BD-APP-UI-001]] | 画面一覧 | [[RQ-FR-001]], [[RQ-FR-002]], [[RQ-FR-003]], [[RQ-FR-004]], [[RQ-FR-005]], [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-FR-008]], [[RQ-FR-009]], [[RQ-FR-010]], [[RQ-FR-011]], [[RQ-FR-012]], [[RQ-FR-013]], [[RQ-FR-014]], [[RQ-FR-015]], [[RQ-FR-016]], [[RQ-FR-017]], [[RQ-FR-018]], [[RQ-FR-019]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-FR-022]], [[RQ-FR-024]], [[RQ-FR-025]] | [[RQ-RDR-036]], [[RQ-RDR-047]] | - | - |
| [[BD-APP-UI-002]] | 検索画面情報設計 | [[RQ-FR-001]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-FR-022]], [[RQ-FR-023]], [[RQ-UX-003-01]], [[RQ-UX-013-01]], [[RQ-UX-015-01]], [[RQ-UX-020-01]] | [[RQ-RDR-015]], [[RQ-RDR-018]], [[RQ-RDR-021]], [[RQ-RDR-032]] | - | [[UT-PLAN-004]] |
| [[BD-APP-UI-003]] | 画面遷移 | [[RQ-FR-001]], [[RQ-FR-005]], [[RQ-FR-014]], [[RQ-FR-019]], [[RQ-FR-020]], [[RQ-FR-024]], [[RQ-FR-025]] | - | - | - |
| [[BD-APP-UI-004]] | アクセシビリティ方針 | [[RQ-FR-001]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-UX-017-01]] | [[RQ-RDR-021]] | - | - |
| [[BD-DEV-ENV-001]] | 開発環境 | [[RQ-DEV-001-01]], [[RQ-SEC-001-01]] | - | - | [[AT-PLAN-001]], [[AT-RPT-001]], [[IT-ENV-001]] |
| [[BD-DEV-ENV-002]] | 本番環境 | [[RQ-AV-001-01]], [[RQ-DEV-001-01]], [[RQ-PS-001-01]], [[RQ-SEC-001-01]] | [[RQ-RDR-045]] | - | [[AT-PLAN-001]], [[AT-RPT-001]] |
| [[BD-DEV-PIPE-001]] | ビルド方針（デプロイ単位分離） | [[RQ-DEV-001-01]], [[RQ-DEV-005-01]], [[RQ-DEV-006-01]], [[RQ-DEV-007-01]], [[RQ-FR-001]], [[RQ-SEC-005-01]], [[RQ-UX-021-01]] | [[RQ-RDR-017]], [[RQ-RDR-018]], [[RQ-RDR-050]] | - | [[AT-GO-001]] |
| [[BD-DEV-TEST-001]] | テスト戦略 | [[RQ-AV-001-01]], [[RQ-FR-001]], [[RQ-OBY-001-01]], [[RQ-PS-001-01]] | [[RQ-RDR-037]], [[RQ-RDR-039]] | - | [[AT-DR-001]], [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-OPS-INF-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]], [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]], [[AT-SLO-001]], [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]], [[UT-COV-001]], [[UT-IAC-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-002]], [[UT-PLAN-003]], [[UT-PLAN-004]], [[UT-PLAN-005]], [[UT-POL-001]], [[UT-RPT-001]], [[UT-SEC-001]], [[UT-STAT-001]], [[UT-TDAT-001]] |
| [[BD-INF-AUD-001]] | 監査証跡基本設計（CloudTrail中心） | [[RQ-DEV-001-01]], [[RQ-SEC-001-01]] | - | - | - |
| [[BD-INF-CM-001]] | 構成管理方針 | [[RQ-FR-001]] | [[RQ-RDR-013]], [[RQ-RDR-024]] | - | - |
| [[BD-INF-DEP-001]] | デプロイ方式 | [[RQ-FR-001]] | - | - | - |
| [[BD-INF-DEP-002]] | デプロイ運用ルール | [[RQ-FR-001]] | - | - | - |
| [[BD-INF-DEP-003]] | CI/CD基本設計（Quartz + CDK） | [[RQ-FR-024]] | [[RQ-RDR-025]] | - | [[AT-REL-001]], [[AT-RUN-001]], [[UT-PLAN-003]] |
| [[BD-INF-DEP-004]] | エッジ・DNS・証明書設計 | [[RQ-FR-025]] | [[RQ-RDR-026]], [[RQ-RDR-034]] | - | [[AT-REL-001]], [[AT-RUN-001]], [[AT-SCN-006]] |
| [[BD-INF-DEP-005]] | コンピュートと配備設計 | [[RQ-DEV-001-01]], [[RQ-FR-025]] | - | - | [[AT-REL-001]], [[AT-RUN-001]] |
| [[BD-INF-DEP-006]] | バックアップ・DR設計 | [[RQ-AV-001-01]], [[RQ-COST-001-01]] | - | - | [[AT-RUN-001]] |
| [[BD-INF-ENV-001]] | アカウント・環境分割方針 | - | - | - | [[IT-ENV-001]], [[IT-INF-ENV-001]] |
| [[BD-INF-IAC-001]] | インフラ変更フロー | - | - | - | [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]] |
| [[BD-INF-KMS-001]] | 暗号化・鍵管理方針 | [[RQ-SEC-001-01]], [[RQ-SEC-003-01]] | - | - | - |
| [[BD-INF-MON-001]] | 監視設計 | [[RQ-AV-001-01]], [[RQ-OBY-001-01]], [[RQ-PS-001-01]] | - | - | [[AT-OPS-001]], [[IT-CASE-012]], [[IT-CASE-013]], [[IT-INF-OBS-001]] |
| [[BD-INF-MON-002]] | SLO運用 | [[RQ-AV-001-01]], [[RQ-OBY-001-01]], [[RQ-PS-001-01]] | [[RQ-RDR-045]] | - | [[AT-GO-001]], [[AT-OPS-001]], [[AT-RPT-001]] |
| [[BD-INF-MON-003]] | 監査・追跡設計 | [[RQ-AV-001-01]], [[RQ-OBY-001-01]], [[RQ-PS-001-01]] | - | - | [[AT-OPS-001]] |
| [[BD-INF-MON-004]] | 運用ガバナンス方針 | [[RQ-OBY-001-01]] | - | - | [[AT-SLO-001]] |
| [[BD-INF-NET-001]] | ネットワーク境界方針 | [[RQ-SEC-001-01]] | - | - | [[IT-INF-NET-001]], [[IT-INF-SMK-001]] |
| [[BD-INF-OPS-001]] | インフラ運用ガバナンス設計 | [[RQ-COST-001-01]], [[RQ-DEV-001-01]] | - | - | [[AT-OPS-001]] |
| [[BD-INF-PLAT-001]] | インフラ基本設計の章構成と全体構成 | [[RQ-DEV-001-01]], [[RQ-SEC-001-01]] | [[RQ-RDR-039]] | - | - |
| [[BD-INF-PLAT-002]] | データストア基本設計 | [[RQ-AV-001-01]], [[RQ-PS-001-01]], [[RQ-SEC-001-01]], [[RQ-SEC-003-01]] | - | - | [[AT-DR-001]] |
| [[BD-INF-SEC-001]] | IAM・セキュリティ境界方針 | [[RQ-DEV-001-01]], [[RQ-SEC-001-01]], [[RQ-UX-022-01]] | - | - | [[AT-OPS-INF-001]] |
| [[BD-INF-WAF-001]] | L7防御設計（WAF/Shield） | [[RQ-SEC-001-01]] | - | - | - |
| [[BD-SYS-ADR-001]] | 収集対象を公式+出演にする | - | [[RQ-RDR-001]], [[RQ-RDR-002]], [[RQ-RDR-003]], [[RQ-RDR-004]], [[RQ-RDR-005]], [[RQ-RDR-006]], [[RQ-RDR-007]], [[RQ-RDR-008]], [[RQ-RDR-009]] | - | - |
| [[BD-SYS-ADR-002]] | [[RQ-GL-010|段階ロード]]JSONを採用する | - | [[RQ-RDR-001]] | - | - |
| [[BD-SYS-ADR-003]] | [[RQ-GL-005|タグ辞書]]分離を採用する | - | [[RQ-RDR-001]] | - | - |
| [[BD-SYS-ADR-004]] | 静的配信+API起動バッチ（単一Backend API）構成を採用する | - | [[RQ-RDR-034]] | - | - |
| [[BD-SYS-ADR-005]] | 検索をフロントで実行する | - | [[RQ-RDR-001]] | - | - |
| [[BD-SYS-ADR-006]] | 監視はSLO最小セットで開始する | - | [[RQ-RDR-001]] | - | - |
| [[BD-SYS-ADR-007]] | リリースゲートをATで管理する | - | [[RQ-RDR-001]] | - | - |
| [[BD-SYS-ADR-008]] | 運用[[RQ-GL-011|再収集]]フローを標準化する | - | [[RQ-RDR-001]] | - | - |
| [[BD-SYS-ADR-009]] | [[RQ-GL-017|ワードクラウド]]は事前生成の静的画像配信を採用する | [[RQ-FR-021]], [[RQ-PRC-001-01]] | [[RQ-RDR-021]] | - | - |
| [[BD-SYS-ADR-010]] | 詳細画面の見どころ導線は[[RQ-GL-016|コメント密度波形]]を採用する | [[RQ-FR-020]], [[RQ-FR-022]] | [[RQ-RDR-020]] | - | - |
| [[BD-SYS-ADR-011]] | TypeScript型安全をtsconfigとlintで標準化する | [[RQ-DEV-001-01]] | [[RQ-RDR-017]] | - | - |
| [[BD-SYS-ADR-012]] | スキルメンテナンスを構成管理設計へ組み込む | [[RQ-DEV-001-01]] | [[RQ-RDR-024]] | - | - |
| [[BD-SYS-ADR-013]] | ドキュメント公開はQuartz成果物をCDK経由で配信する | [[RQ-FR-024]] | [[RQ-RDR-025]] | - | [[AT-REL-001]], [[AT-RUN-001]] |
| [[BD-SYS-ADR-014]] | 単一CloudFrontのパス分岐と認証境界を固定する | [[RQ-FR-025]] | [[RQ-RDR-026]] | - | - |
| [[BD-SYS-ADR-015]] | 単一アカウントでAWSタグ統制をIAMとConfigで実施する | [[RQ-COST-001-01]], [[RQ-SEC-001-01]] | [[RQ-RDR-027]], [[RQ-RDR-049]] | - | [[AT-OPS-001]] |
| [[BD-SYS-ADR-016]] | AIエージェント運用で最小権限と段階解放を採用する | [[RQ-DEV-002-01]], [[RQ-DEV-002-07]] | [[RQ-RDR-029]] | - | - |
| [[BD-SYS-ADR-017]] | 公開UIの端末優先順位をモバイル先行で固定する | [[RQ-UX-001-01]], [[RQ-UX-005-01]] | [[RQ-RDR-032]] | - | [[AT-GO-001]], [[AT-SCN-002]] |
| [[BD-SYS-ADR-018]] | 公開UIをモバイルファーストで設計する | [[RQ-UX-001-01]], [[RQ-UX-005-01]] | [[RQ-RDR-032]] | - | [[AT-GO-001]], [[AT-SCN-002]] |
| [[BD-SYS-ADR-019]] | ビルドをデプロイ単位で分離して品質ゲートを固定する | [[RQ-DEV-001-01]] | [[RQ-RDR-025]] | - | - |
| [[BD-SYS-ADR-020]] | 非機能詳細設計の判定軸を統一する | [[RQ-AV-001-01]], [[RQ-DATA-001-01]], [[RQ-OBY-001-01]], [[RQ-PS-001-01]], [[RQ-SEC-001-01]] | [[RQ-RDR-023]] | - | [[AT-GO-001]] |
| [[BD-SYS-ADR-021]] | DB正本化と3層責務境界で検索拡張性を確保する | [[RQ-DATA-001-01]], [[RQ-FR-005]], [[RQ-FR-019]], [[RQ-FR-025]], [[RQ-INT-001-01]] | [[RQ-RDR-003]], [[RQ-RDR-034]] | - | [[AT-SCN-006]] |
| [[BD-SYS-ADR-022]] | Lambda構造化ログをCloudWatch 30日保持で運用する | [[RQ-COST-001-01]], [[RQ-OBY-001-01]] | [[RQ-RDR-035]] | - | [[AT-GO-001]], [[AT-OPS-001]] |
| [[BD-SYS-ADR-023]] | HTTP API契約をRFC準拠で統一する | [[RQ-INT-001-01]], [[RQ-OBY-001-01]], [[RQ-SEC-001-01]] | - | - | - |
| [[BD-SYS-ADR-024]] | Next.js App Router運用指針を基本設計へ標準化する | [[RQ-DEV-001-01]], [[RQ-PS-001-01]], [[RQ-SEC-001-01]], [[RQ-UX-001-01]] | - | - | - |
| [[BD-SYS-ADR-025]] | Hono + Zod の入力検証と例外処理を標準化する | [[RQ-DEV-001-01]], [[RQ-INT-001-01]], [[RQ-SEC-001-01]] | - | - | - |
| [[BD-SYS-ADR-026]] | テスト戦略をUT/IT/ATの三層品質ゲートで運用する | [[RQ-DEV-001-01]], [[RQ-FR-001]] | - | - | [[AT-GO-001]], [[AT-PLAN-001]], [[IT-PLAN-001]], [[UT-PLAN-001]] |
| [[BD-SYS-ADR-027]] | バッチ実行制約と補助データ生成の運用境界を固定する | [[RQ-FR-001]], [[RQ-FR-022]], [[RQ-FR-023]] | - | - | - |
| [[BD-SYS-ADR-028]] | インフラ文書を本体開発フローへ統合する | - | [[RQ-RDR-039]] | - | - |
| [[BD-SYS-ADR-029]] | ドメイン境界正本をBD-SYS-DOMへ統合しPublished Languageを維持する | - | [[RQ-RDR-040]] | - | - |
| [[BD-SYS-ADR-030]] | データ保持・削除方針の責務をDB正本へ限定する | [[RQ-DATA-001-01]], [[RQ-OBY-001-01]], [[RQ-PRC-001-01]] | [[RQ-RDR-034]], [[RQ-RDR-035]] | - | - |
| [[BD-SYS-ADR-031]] | 配備モードと責務マトリクスをINF正本へ統合する | - | [[RQ-RDR-043]] | - | - |
| [[BD-SYS-ADR-032]] | AnalyticsをCoreサブドメインとして扱う | [[RQ-FR-022]], [[RQ-FR-023]] | [[RQ-RDR-040]] | - | - |
| [[BD-SYS-ADR-033]] | 論理構成を4区分化しバックエンド処理形態を分離する | - | [[RQ-RDR-034]] | - | - |
| [[BD-SYS-ADR-034]] | API契約語彙と運用ヘルス経路を統一する | - | [[RQ-RDR-046]] | - | - |
| [[BD-SYS-ADR-036]] | INF基本設計をAWSリソース起点の章構成へ再編する | [[RQ-AV-001-01]], [[RQ-DEV-001-01]], [[RQ-OBY-001-01]], [[RQ-SEC-001-01]] | - | - | - |
| [[BD-SYS-ADR-037]] | docs PDF配布をArtifact/Releaseで二系統化し命名規則を統一する | [[RQ-DEV-001-01]], [[RQ-FR-024]] | - | - | [[AT-REL-001]] |
| [[BD-SYS-ADR-038]] | docs配備は初回ローカル構築後にGitHub OIDC AssumeRoleで自動実行する | [[RQ-DEV-001-01]], [[RQ-SEC-001-01]] | - | - | [[AT-REL-001]] |
| [[BD-SYS-ADR-039]] | CI/CDはGitHub Actionsを実装基盤に統一しPRとデプロイを分離運用する | [[RQ-DEV-005-01]], [[RQ-DEV-006-01]], [[RQ-DEV-007-01]], [[RQ-SEC-005-01]] | [[RQ-RDR-050]] | - | [[AT-GO-001]], [[AT-REL-001]] |
| [[BD-SYS-ARCH-001]] | システムコンテキスト | [[RQ-FR-001]] | [[RQ-RDR-011]], [[RQ-RDR-028]], [[RQ-RDR-034]], [[RQ-RDR-038]], [[RQ-RDR-040]] | - | [[AT-GO-001]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] |
| [[BD-SYS-ARCH-002]] | 論理構成 | [[RQ-FR-001]] | [[RQ-RDR-034]] | - | - |
| [[BD-SYS-ARCH-003]] | クラウド配置構成 | [[RQ-DEV-001-01]], [[RQ-FR-001]], [[RQ-OBY-001-01]], [[RQ-SEC-001-01]] | - | - | - |
| [[BD-SYS-ARCH-004]] | 主要データフロー | [[RQ-FR-001]] | - | - | - |
| [[BD-SYS-ARCH-005]] | AIエージェント運用アーキテクチャ | [[RQ-DEV-002-01]] | [[RQ-RDR-029]] | - | - |
| [[BD-SYS-DOM-001]] | ドメイン境界定義 | [[RQ-FR-001]], [[RQ-FR-002]], [[RQ-FR-003]], [[RQ-FR-004]], [[RQ-FR-005]], [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-FR-008]], [[RQ-FR-009]], [[RQ-FR-010]], [[RQ-FR-011]], [[RQ-FR-012]], [[RQ-FR-013]], [[RQ-FR-014]], [[RQ-FR-015]], [[RQ-FR-016]], [[RQ-FR-017]], [[RQ-FR-018]], [[RQ-FR-019]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-FR-022]], [[RQ-FR-023]], [[RQ-FR-024]], [[RQ-FR-025]] | [[RQ-RDR-040]], [[RQ-RDR-044]] | - | - |
| [[BD-SYS-QUAL-001]] | 品質特性 | [[RQ-DEV-001-01]], [[RQ-PS-001-01]], [[RQ-UX-001-01]], [[RQ-UX-023-01]] | [[RQ-RDR-017]] | - | [[AT-OPS-001]], [[AT-RPT-001]], [[AT-RUN-001]] |
| [[BD-SYS-SEC-001]] | セキュリティ設計（統合済み） | [[RQ-DEV-001-01]], [[RQ-SEC-001-01]], [[RQ-UX-022-01]] | [[RQ-RDR-017]], [[RQ-RDR-018]] | - | [[AT-OPS-001]] |
| [[DD-APP-ALG-001]] | 検索アルゴリズム | [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-FR-008]] | [[RQ-RDR-047]] | - | [[UT-PLAN-001]] |
| [[DD-APP-API-001]] | API詳細総論 | [[RQ-FR-001]], [[RQ-INT-001-06]] | [[RQ-RDR-034]] | - | [[UT-COV-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-005]], [[UT-RPT-001]], [[UT-STAT-001]], [[UT-TDAT-001]] |
| [[DD-APP-API-002]] | [[RQ-GL-002|収集実行]]起動API | [[RQ-FR-001]], [[RQ-FR-022]], [[RQ-FR-023]] | [[RQ-RDR-034]], [[RQ-RDR-046]] | - | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-SCN-004]], [[AT-SCN-008]], [[IT-CASE-001]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-PLAN-001]], [[UT-CASE-001]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-APP-API-003]] | [[RQ-GL-002|収集実行]]状態API | [[RQ-FR-001]] | [[RQ-RDR-047]] | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-004]], [[AT-SCN-005]], [[IT-CASE-002]], [[IT-PLAN-001]], [[UT-CASE-002]], [[UT-CASE-009]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-APP-API-004]] | アーカイブ一覧API | [[RQ-FR-001]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-001]], [[IT-CASE-003]], [[IT-CASE-009]], [[IT-PLAN-001]], [[UT-CASE-003]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-APP-API-005]] | [[RQ-GL-005|タグ辞書]]API | [[RQ-FR-001]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-002]], [[AT-SCN-007]], [[IT-CASE-004]], [[IT-CASE-009]], [[IT-PLAN-001]], [[UT-CASE-004]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-APP-API-006]] | 検索API | [[RQ-FR-001]], [[RQ-OBY-001-04]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-002]], [[IT-CASE-005]], [[IT-PLAN-001]], [[UT-CASE-005]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-APP-API-007]] | 動画詳細API | [[RQ-FR-001]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-003]], [[IT-CASE-006]], [[IT-PLAN-001]], [[UT-CASE-006]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-APP-API-008]] | [[RQ-GL-011|再収集]]API | [[RQ-FR-001]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-005]], [[IT-CASE-007]], [[IT-CASE-012]], [[IT-PLAN-001]], [[UT-CASE-007]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-APP-API-009]] | 運用診断API | [[RQ-FR-001]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-004]], [[AT-SCN-005]], [[IT-CASE-008]], [[IT-CASE-012]], [[IT-CASE-013]], [[IT-PLAN-001]], [[UT-CASE-008]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-APP-API-010]] | API経路バージョニング詳細 | [[RQ-FR-025]] | [[RQ-RDR-026]] | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-006]] |
| [[DD-APP-API-011]] | 収集結果明細API | [[RQ-FR-017]] | - | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-PLAN-001]], [[UT-CASE-009]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-APP-API-012]] | 配信前後再確認API | [[RQ-FR-019]] | [[RQ-RDR-034]] | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-007]], [[IT-CASE-010]], [[IT-PLAN-001]], [[UT-CASE-010]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-APP-API-013]] | タグ管理API | [[RQ-FR-005]], [[RQ-FR-019]] | [[RQ-RDR-036]] | - | [[AT-GO-001]], [[AT-RPT-001]], [[AT-SCN-007]], [[AT-SCN-009]], [[IT-CASE-011]], [[IT-CASE-013]], [[IT-PLAN-001]], [[UT-CASE-011]], [[UT-CASE-013]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-APP-API-014]] | ドキュメント公開実行API | [[RQ-FR-024]] | [[RQ-RDR-034]] | - | [[AT-GO-001]], [[AT-RPT-001]], [[IT-CASE-011]], [[IT-PLAN-001]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-PLAN-003]], [[UT-PLAN-005]] |
| [[DD-APP-API-015]] | 配信反映ジョブ状態API | [[RQ-FR-005]], [[RQ-FR-024]] | - | - | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-SCN-007]], [[AT-SCN-009]], [[IT-CASE-011]], [[IT-PLAN-001]], [[UT-CASE-013]], [[UT-PLAN-001]], [[UT-PLAN-005]] |
| [[DD-APP-DB-001]] | DB制約方針 | [[RQ-DATA-001-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-002]] | DDL一覧 | [[RQ-DATA-001-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-003]] | DB移行方針 | [[RQ-DATA-001-01]], [[RQ-DEV-001-01]] | - | - | [[AT-RUN-001]], [[IT-CASE-001]], [[UT-PLAN-001]] |
| [[DD-APP-DB-004]] | 一意制約・チェック制約 | [[RQ-DATA-001-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-005]] | channelsテーブル | [[RQ-DATA-001-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-006]] | videosテーブル | [[RQ-DATA-001-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-007]] | video_tagsテーブル | [[RQ-DATA-001-01]], [[RQ-FR-009]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-008]] | tagsテーブル | [[RQ-DATA-001-01]], [[RQ-FR-005]], [[RQ-FR-009]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-009]] | tag_typesテーブル | [[RQ-FR-005]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-010]] | ingestion_runsテーブル | [[RQ-FR-001]], [[RQ-OBY-001-01]] | [[RQ-RDR-046]] | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-011]] | ingestion_eventsテーブル | [[RQ-OBY-001-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-012]] | ingestion_itemsテーブル | [[RQ-FR-017]], [[RQ-FR-018]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-013]] | recheck_runsテーブル | [[RQ-FR-019]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-014]] | recheck_itemsテーブル | [[RQ-FR-019]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-015]] | publish_runsテーブル | [[RQ-FR-005]], [[RQ-FR-024]], [[RQ-FR-025]] | - | - | [[UT-CASE-012]], [[UT-PLAN-001]] |
| [[DD-APP-DB-016]] | publish_stepsテーブル | [[RQ-FR-024]], [[RQ-FR-025]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-DB-017]] | publish_artifactsテーブル | [[RQ-DATA-001-01]], [[RQ-INT-001-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-ERR-001]] | エラーコード設計 | [[RQ-OBY-001-01]], [[RQ-SEC-001-01]] | - | - | [[AT-SCN-006]], [[UT-PLAN-001]] |
| [[DD-APP-LOG-001]] | ログ設計 | [[RQ-AV-001-01]], [[RQ-COST-001-01]], [[RQ-OBY-001-01]], [[RQ-PRC-001-01]], [[RQ-PS-001-01]], [[RQ-SEC-001-01]] | [[RQ-RDR-035]] | - | [[AT-OPS-001]], [[AT-RPT-001]] |
| [[DD-APP-MOD-001]] | コンポーネント分割 | [[RQ-FR-006]], [[RQ-FR-013]], [[RQ-FR-017]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-MOD-002]] | Next.js App Router 実装ガイド | [[RQ-DEV-001-01]], [[RQ-PS-001-01]], [[RQ-SEC-001-01]], [[RQ-UX-001-01]] | - | - | - |
| [[DD-APP-MOD-003]] | 責務対応表 | [[RQ-FR-006]], [[RQ-FR-013]], [[RQ-FR-017]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-001]] | UI詳細総論 | [[RQ-UX-001-01]], [[RQ-UX-005-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-002]] | 一覧画面 | [[RQ-FR-001]], [[RQ-FR-007]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-UX-001-01]], [[RQ-UX-005-01]] | [[RQ-RDR-032]] | - | [[AT-SCN-003]], [[UT-CASE-016]], [[UT-PLAN-001]], [[UT-PLAN-004]] |
| [[DD-APP-UI-003]] | フィルタドロワー | [[RQ-FR-006]], [[RQ-FR-008]], [[RQ-UX-005-01]] | - | - | [[IT-CASE-004]], [[UT-PLAN-001]] |
| [[DD-APP-UI-004]] | 詳細モーダル | [[RQ-FR-013]], [[RQ-FR-014]], [[RQ-FR-020]], [[RQ-FR-021]], [[RQ-FR-022]], [[RQ-FR-023]] | [[RQ-RDR-020]], [[RQ-RDR-021]] | - | [[AT-SCN-003]], [[UT-PLAN-001]] |
| [[DD-APP-UI-005]] | 検索バー | [[RQ-FR-006]], [[RQ-FR-007]], [[RQ-UX-003-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-006]] | 運用ステータス画面 | [[RQ-FR-016]], [[RQ-FR-017]], [[RQ-FR-018]] | [[RQ-RDR-036]] | - | [[AT-SCN-007]], [[UT-PLAN-001]] |
| [[DD-APP-UI-007]] | [[RQ-GL-002|収集実行]]画面 | [[RQ-FR-001]], [[RQ-FR-002]], [[RQ-FR-003]], [[RQ-FR-004]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-008]] | [[RQ-GL-011|再収集]]設定画面 | [[RQ-FR-018]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-009]] | 配信前後確認・手動タグ付け画面 | [[RQ-FR-005]], [[RQ-FR-009]], [[RQ-FR-019]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-010]] | 配信反映ジョブ画面 | [[RQ-FR-005]], [[RQ-FR-024]], [[RQ-FR-025]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-011]] | 公開後運用・配信経路確認画面 | [[RQ-FR-024]], [[RQ-FR-025]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-012]] | SearchConditionPanel コンポーネント | [[RQ-FR-006]], [[RQ-FR-008]], [[RQ-UX-012-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-013]] | ArchiveList コンポーネント | [[RQ-FR-006]], [[RQ-FR-015]], [[RQ-UX-001-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-014]] | ArchiveDetailModal コンポーネント | [[RQ-FR-013]], [[RQ-FR-014]], [[RQ-UX-006-01]], [[RQ-UX-007-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-015]] | HighlightWavePanel コンポーネント | [[RQ-FR-020]], [[RQ-UX-002-01]], [[RQ-UX-017-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-016]] | WordCloudPanel コンポーネント | [[RQ-FR-021]], [[RQ-UX-002-01]], [[RQ-UX-017-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-017]] | RunStatusScreen コンポーネント | [[RQ-FR-017]], [[RQ-FR-018]], [[RQ-UX-017-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-APP-UI-018]] | 管理画面共通操作コンポーネント | [[RQ-FR-016]], [[RQ-UX-017-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-DEV-CODE-001]] | コーディング規約 | [[RQ-DEV-001-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-DEV-REV-001]] | レビュー規約 | [[RQ-DEV-001-01]] | - | - | [[UT-PLAN-001]] |
| [[DD-INF-CF-001]] | CloudFront詳細設計 | - | - | - | - |
| [[DD-INF-CF-002]] | CloudFront Function詳細（rewrite） | - | - | - | [[AT-SCN-006]] |
| [[DD-INF-CFG-001]] | AWS Config詳細（required-tags） | - | [[RQ-RDR-049]] | - | [[AT-OPS-INF-001]] |
| [[DD-INF-COG-001]] | Cognito詳細設計 | - | - | - | - |
| [[DD-INF-DB-001]] | DBインフラ詳細設計 | [[RQ-AV-001-01]] | - | - | [[AT-RUN-001]] |
| [[DD-INF-DEP-001]] | デプロイ詳細 | [[RQ-FR-024]] | [[RQ-RDR-025]], [[RQ-RDR-029]], [[RQ-RDR-050]] | - | [[AT-REL-001]], [[AT-RUN-001]], [[UT-CASE-015]], [[UT-PLAN-003]] |
| [[DD-INF-DEP-002]] | CloudFrontパス分岐詳細（デプロイ適用条件） | [[RQ-FR-025]] | [[RQ-RDR-026]] | - | [[AT-REL-001]], [[AT-SCN-006]] |
| [[DD-INF-DEP-003]] | インフラデプロイ詳細（領域分割） | - | [[RQ-RDR-046]] | - | [[AT-REL-001]], [[AT-RUN-001]] |
| [[DD-INF-IAC-001]] | インフラCI/CD詳細 | [[RQ-DEV-001-01]] | - | - | [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]] |
| [[DD-INF-IAC-002]] | IaCモジュール設計 | [[RQ-DEV-001-01]] | [[RQ-RDR-049]] | - | [[UT-IAC-001]], [[UT-POL-001]] |
| [[DD-INF-IAC-003]] | IaC状態管理とドリフト検知 | [[RQ-DEV-001-01]] | [[RQ-RDR-049]] | - | [[IT-INF-ENV-001]], [[IT-INF-ROLL-001]] |
| [[DD-INF-LMB-001]] | Lambda詳細設計 | - | - | - | - |
| [[DD-INF-MON-001]] | インフラ監視詳細設計 | [[RQ-OBY-001-01]] | - | - | [[AT-RPT-001]], [[AT-RUN-001]], [[AT-SLO-001]], [[IT-INF-OBS-001]] |
| [[DD-INF-MON-002]] | インフラ監視ログ詳細 | [[RQ-OBY-001-01]] | - | - | [[AT-OPS-001]], [[AT-RPT-001]] |
| [[DD-INF-NET-001]] | ネットワーク詳細設計 | [[RQ-SEC-001-01]] | - | - | [[AT-OPS-INF-001]], [[IT-INF-NET-001]], [[IT-INF-SMK-001]] |
| [[DD-INF-OVR-001]] | インフラ詳細設計総論 | - | - | - | - |
| [[DD-INF-S3-001]] | S3詳細設計 | - | - | - | - |
| [[DD-INF-SEC-001]] | DR復旧手順詳細 | [[RQ-AV-001-01]] | - | - | [[AT-DR-001]], [[AT-GO-001]], [[AT-RUN-001]] |
| [[DD-INF-SEC-002]] | IAM詳細設計 | [[RQ-SEC-001-01]] | [[RQ-RDR-049]] | - | [[AT-OPS-INF-001]], [[UT-POL-001]], [[UT-SEC-001]] |
| [[DD-INF-SEC-003]] | インフラセキュリティ統制詳細 | [[RQ-SEC-001-01]] | - | - | [[AT-OPS-001]] |
| [[DD-SYS-AV-001]] | 可用性詳細 | [[RQ-AV-001-01]], [[RQ-OBY-001-01]] | - | - | [[AT-OPS-001]], [[AT-RPT-001]] |
| [[DD-SYS-AV-002]] | インフラ可用性詳細 | [[RQ-AV-001-01]] | - | - | [[AT-OPS-001]], [[AT-RPT-001]] |
| [[DD-SYS-COST-001]] | コスト運用詳細 | [[RQ-COST-001-01]], [[RQ-SEC-001-01]] | [[RQ-RDR-027]], [[RQ-RDR-049]] | - | [[AT-OPS-001]] |
| [[DD-SYS-PERF-001]] | 性能設計 | [[RQ-OBY-001-01]], [[RQ-PS-001-01]] | - | - | [[AT-GO-001]], [[AT-OPS-001]], [[AT-RPT-001]] |
| [[DD-SYS-SCALE-001]] | 拡張性詳細 | [[RQ-AV-001-01]], [[RQ-DATA-001-01]], [[RQ-PS-001-01]] | - | - | [[AT-OPS-001]], [[UT-PLAN-001]] |
| [[DD-SYS-SEC-001]] | セキュリティ統制詳細 | [[RQ-DEV-001-01]], [[RQ-PRC-001-01]], [[RQ-SEC-001-01]] | [[RQ-RDR-035]] | - | [[AT-OPS-001]], [[AT-RUN-001]], [[UT-PLAN-001]] |
<!-- END AUTO-GENERATED: DESIGN_VIEW -->

## テスト層トレース（自動生成）
- `task docs:trace` で自動更新する。

<!-- BEGIN AUTO-GENERATED: TEST_LAYER_TRACE -->
- generated_at: 2026-02-23
- judgment: 経路判定（max_depth=4、frontmatter+本文リンク）

### 要求 -> 受入テスト（AT）
| 要求ID(FR/NFR) | タイトル | ATシナリオ(AT-SCN) | 補助AT文書 | 判定 |
| --- | --- | --- | --- | --- |
| [[RQ-AV-001-01]] | 月次可用率（HTTP 2xx/3xx 応答で利用可能な時間割合）を99.5%以上に維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-RPT-001]] | PASS |
| [[RQ-AV-001-02]] | 月次可用率（HTTP 2xx/3xx 応答で利用可能な時間割合）を 99.5%以上にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-001-03]] | 計画停止は月間合計 120分以内にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-001-04]] | 障害発生から暫定復旧までの時間（MTTR）が 30分以内にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-001-05]] | MTTR 30分要件は運用時間帯（平日09:00-21:00 JST）の一次復旧を対象とし、運用時間外に検知した障害は次の運用開始後30分以内の一次復旧を判定対象にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-001-06]] | 可用性判定結果を [[AT-RPT-001]] に記録し、Go/No-Go判定で参照できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-RPT-001]] | PASS |
| [[RQ-AV-001-07]] | 外部要因（YouTube API障害、CDN障害）で 15分以上断続失敗した場合は、障害区分を分離して記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-001-08]] | 可用率が閾値未達の場合は、[[AT-GO-001]] で要是正として扱い、リリース判定を保留できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]] | PASS |
| [[RQ-AV-002-01]] | バッチ障害時もSPAが最終配信データで検索を継続可能とし、データ鮮度を[[RQ-SH-002\|利用者]]に明示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-004]], [[AT-SCN-006]] | [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-002-02]] | 収集バッチが失敗しても、SPAは直前に配信済みの静的JSONで検索・一覧機能を提供し続けるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-002-03]] | SPAの画面上に「最終更新日時」が表示され、[[RQ-SH-002\|利用者]]がデータの鮮度を確認できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-004]], [[AT-SCN-006]] | [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-002-04]] | バッチ障害が24時間以上継続した場合、SPAに鮮度警告が表示されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-002-05]] | CloudFrontのカスタムエラーページが設定され、オリジン障害時に適切なフォールバックを返すできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-002-06]] | 初回デプロイ前（配信データが一切存在しない状態）では、検索機能は利用不可となりメンテナンスページを表示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-002-07]] | S3バケット自体が利用不能な場合は、CloudFrontのキャッシュ期間内のみ継続提供可能とできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-003-01]] | S3・DB正本（RDB）・CDK状態のバックアップ方針を定め、RPO 24時間以内でデータ復旧可能な状態を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-003-02]] | S3バケットのバージョニングが全対象バケットで有効化されているできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-003-03]] | DB正本（RDB）で日次バックアップとポイントインタイム復旧が有効化されているできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-003-04]] | CDK状態（`cdk.context.json`・スタック定義）がGitリポジトリで管理され、任意時点へ復元可能であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-003-05]] | RPO（目標復旧時点）は24時間以内とできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-003-06]] | 年次でリストア手順の検証を実施し、結果を記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-003-07]] | バックアップ設定はCDKで管理され、`cdk synth` で設定の存在を検証可能であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-003-08]] | リストア検証で失敗が判明した場合は、30日以内に手順を是正し再検証できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-003-09]] | バージョニングによるストレージ増加が [[RQ-COST-001-01]] の上限に影響する場合は、[[RQ-COST-003-01]] のライフサイクルルールで非現行バージョンを制御できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-004-01]] | 収集バッチは、YouTube API呼出に対してリトライ上限・指数バックオフ・サーキットブレーカーを適用し、障害の波及を防止できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-004-02]] | YouTube API呼出のリトライ上限が3回以内に設定されているできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-004-03]] | リトライ間隔に指数バックオフ（初回1秒、最大30秒）が適用されているできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-004-04]] | 連続5回の失敗でサーキットブレーカーがオープン状態に遷移できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-004-05]] | サーキットオープン時にアラートが発報され、[[RQ-OBY-001-01]] のログに記録されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-004-06]] | サーキットオープン後、次回スケジュール実行時にハーフオープンで再試行できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-004-07]] | YouTube API側のレートリミット（HTTP 429）はリトライ対象とし、`Retry-After` ヘッダーを尊重できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-AV-004-08]] | サーキットオープンが24時間以上継続した場合は、手動確認のうえ収集スケジュールを一時停止できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-001-01]] | 月額運用コストを上限制約内で維持し、AWSタグを利用したコスト配賦と是正運用を実行できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-001-02]] | AWS月額実績コストは 3,000円以下を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-001-03]] | 月中時点で予測コストが 2,700円（上限の90%）を超えた場合、48時間以内に抑制施策を適用できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-001-04]] | 全対象リソースに `CostCenter` / `Environment` / `Owner` / `Project` / `ManagedBy` / `Description` の必須タグが付与され、日次監査で付与率 100% を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-001-05]] | 説明を設定できるインフラ構成要素（例: CloudFront Distribution/Function、CloudFormation Output、IAM Role）には `description` または `comment` を必須設定し、用途を画面上で即時判別できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-001-06]] | `Environment` は `Production` / `Development` の列挙値のみを許可し、表記ゆれ（例: `production`）を許容しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-001-07]] | コスト配分に使用するタグキーは請求コンソールで有効化し、有効化遅延（最大48時間）を考慮した月次集計手順を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-001-08]] | 抑制施策（収集頻度低減、キャッシュ期間延長、保持期間短縮）の適用記録を残せる運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-001-09]] | 月次コスト実績と予測差分を [[AT-OPS-001]] に記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-OPS-001]] | PASS |
| [[RQ-COST-001-10]] | 上限超過が確定した場合は、新規常時稼働リソース追加を停止し、次月計画で恒久対策を決定できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-001-11]] | タグ欠落リソースを検知した場合は24時間以内にタグを補完し、補完完了まで当該リソースの追加変更を凍結できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-001-12]] | 緊急障害対応で一時超過した場合でも、事後3営業日以内に原因と再発防止策を記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-002-01]] | AWS Budgetsによるコスト閾値アラートを自動化し、予算超過を早期検知できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-002-02]] | AWS Budgetsで月額予算が設定され、50%・75%・90%の閾値でアラートが発報されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-002-03]] | アラート通知先としてSNSトピックが設定され、メール通知が届くできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-002-04]] | Budgets設定はCDKで管理され、手動設定に依存しないできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-002-05]] | アラート発報から48時間以内に抑制施策の要否を判断し記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-002-06]] | AWS Budgets自体の障害でアラートが発報されなかった場合は、月次コストレビューで検知し、代替手段を検討できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-002-07]] | 90%閾値超過後に抑制施策が間に合わず上限超過した場合は、[[RQ-COST-001-01]] の例外手順に従うできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-003-01]] | S3・CloudWatch Logsのライフサイクルルールを設定し、不要データの自動削除でストレージコストを抑制できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-003-02]] | S3非現行バージョンが30日後に自動削除されるライフサイクルルールが設定されているできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-003-03]] | CloudWatch Logsの保持期間が30日に設定され、31日目以降は自動削除されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-003-04]] | アクセスログの保持期間が90日に設定されているできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-003-05]] | ライフサイクルルールはCDKで管理され、手動設定に依存しないできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-003-06]] | 月次でストレージ使用量を確認し、異常な増加傾向がないことを検証できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-003-07]] | 障害調査のためにログ保持期間の延長が必要な場合は、対象ロググループのみ一時的に延長し、調査完了後に元に戻すできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-COST-003-08]] | ライフサイクルルールの誤設定で必要なデータが削除された場合は、[[RQ-AV-003-01]] のバックアップからリストアできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-001-01]] | 公開アーカイブデータの完全性・一意性・分類正確性を維持し、取得元と更新種別を追跡可能な状態で検索配信できる | [[AT-SCN-006]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-001-02]] | DB正本（[[RQ-GL-005\|タグ辞書]]/動画メタデータ）と公開配信成果物の整合差分件数を 0件 にできる | [[AT-SCN-002]], [[AT-SCN-007]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-001-03]] | 動画ID重複率を 0% にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-001-04]] | 必須属性（動画ID、タイトル、公開日時、チャンネル区分）の欠損率を 0.5% 以下にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-001-05]] | 収集対象区分（[[RQ-GL-003\|公式投稿動画]] / [[RQ-GL-004\|出演動画]]）の誤分類重大件数を 0件にできる | [[AT-SCN-002]], [[AT-SCN-004]], [[AT-SCN-008]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-001-06]] | [[RQ-GL-011\|再収集]] 実行後、修正内容は 24時間以内に配信データへ反映できる | [[AT-SCN-005]] | [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-001-07]] | [[RQ-GL-002\|収集実行]]結果で、更新種別（新規/既存/補完/再確認）と取得元区分（公式/出演補完/差分更新）の記録率を 100% にできる | [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-008]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-001-08]] | 欠損率または重複率が閾値超過した場合は、配信反映を停止し品質是正後に再公開できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-001-09]] | 誤分類重大件が発生した場合は原因カテゴリ（ルール不備/入力不備/外部変動）を分類して記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-001-10]] | [[RQ-PC-002]] のAPIクォータ制約により24時間以内反映が不可能な場合は、クォータ復帰後24時間以内を代替基準とし、遅延理由を記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-001-11]] | 取得元または更新種別の追跡情報が欠落したデータは、品質是正完了まで配信対象へ反映しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-001-12]] | 配信生成に失敗した場合は直前公開版を維持し、正本DBとの差分再検証後に再公開できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-002-01]] | 収集バッチは冪等に設計し、同一バッチの再実行でデータ重複を発生させないことできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-002-02]] | videoIdを自然冪等キーとして使用し、upsertセマンティクスで書き込むできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-002-03]] | 同一収集バッチを連続2回実行した場合、2回目の実行でデータ件数の変動が0件であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-002-04]] | 部分失敗からの再実行時、成功済みアイテムの再処理がスキップまたはupsertで安全に処理されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-002-05]] | 冪等性の検証をcontract testまたは結合テストに含めるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-002-06]] | YouTube API側でvideoIdが再採番された場合（極めて稀）は、手動確認のうえ重複排除を実施できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-002-07]] | 部分失敗時の再開ポイントが特定できない場合は、全件[[RQ-GL-011\|再収集]]をupsertで安全に実行できる | [[AT-SCN-005]] | [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-003-01]] | 配信JSON（`bootstrap`/`archive_index`/`tag_master`）の全フィールド定義・型・許容値をメタデータ辞書として管理し、JSONスキーマと連動させることできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-003-02]] | 配信JSONの全フィールドについて、フィールド名・データ型・必須/任意・許容値域・説明がメタデータ辞書に記載されているできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-003-03]] | メタデータ辞書と `contracts/` 配下のJSONスキーマファイルが整合しているできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-003-04]] | 新規フィールド追加時にメタデータ辞書とJSONスキーマが同一変更で更新されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-003-05]] | メタデータ辞書に記載のないフィールドが配信JSONに0件であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-003-06]] | JSONスキーマとメタデータ辞書の不整合を検知した場合は、次回デプロイまでに是正できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DATA-003-07]] | 過渡期で非推奨フィールドが残存する場合は、メタデータ辞書に廃止予定日を明記できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-01]] | 小差分リリースを前提に、検証自動化とロールバック可能性を維持した運用を行える | [[AT-SCN-006]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-OPS-INF-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-02]] | すべてのリリース候補に対して、最低限 `lint` / `test` / `build` の3系統チェックを実行し成功率100%にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-03]] | AIエージェント運用を含む変更では、[[RQ-DEV-002-01]] の受入基準（役割分離・最小権限・実行上限）を満たせる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-04]] | 文書運用規約を変更したリリース候補では、対象 `doc-*` スキルと `skill-maintainer` / `docops-orchestrator` の同期更新を同一変更で実施できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-05]] | CDKを含む変更では `cdk synth` を副作用なく再現でき、CDKコンテキスト定義を差分管理できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-06]] | インフラIaCの管理方式はCDKのみを許可し、Terraformを含む別方式を採用しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-07]] | インフラ変更は標準反映フローに従って実行し、差分確認・承認・反映・検証の証跡を保持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-08]] | CDKの構成は「Construct中心 + Stack配線」に従い、Construct/Stack内部で `process.env` を直接参照しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-09]] | statefulリソースを含む変更では、論理IDの変更有無をレビューで確認し、意図しない置換が発生しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-10]] | スキル更新を含む変更では、`reports/impact_check_YYYY-MM-DD.md` と `reports/doc_check.md` が同一変更で更新され、`broken_links: 0` を満たせるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-11]] | ドキュメント公開は `task docs:deploy` を標準入口として実行でき、Quartz成果物（`quartz/public`）と配信アセット（`siteAssetPath`）の不整合を起こさず運用できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-12]] | 公開反映時はCloudFront invalidationが実行され、配信確認手順（[[AT-REL-001]]）で更新差分を確認できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-REL-001]] | PASS |
| [[RQ-DEV-001-13]] | 単一CloudFront運用では `'/web/*'`, `'/docs/*'`, `'/openapi/*'`, `'/api/v1/*'` の経路分岐を維持でき、`'/docs/*'` 以外へrewriteを適用しない状態を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-14]] | 本番反映手順は15分以内で完了し、失敗時は10分以内に直前版へロールバックできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-15]] | デプロイ手順書（[[AT-REL-001]]）と障害時手順（[[AT-RUN-001]]）が常に最新版と整合できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-REL-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-16]] | 手動承認を伴うリリース判定記録（[[AT-GO-001]]）を毎回残せる運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]] | PASS |
| [[RQ-DEV-001-17]] | チェック未実施または失敗時はリリース禁止とし、例外承認を認めない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-001-18]] | ロールバック不能な変更が発生した場合は、次回以降の変更を凍結して原因是正を優先できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-002-01]] | AIエージェント運用で役割分離・最小権限・実行上限を標準化し、安全な実行と再現可能な判断を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-002-02]] | 変更計画と実装を分離し、Primary運用は「分析・方針確定」と「実装・検証」で役割を分けて実施できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-002-03]] | レビュー専用/監査専用のエージェントは `edit` を禁止し、差分確認に必要な読み取り操作のみ許可できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-002-04]] | 危険度の高い操作（例: 外部公開、破壊的削除、権限昇格）はデフォルトで `ask` または `deny` とし、常時許可しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-002-05]] | サブエージェント呼び出しは許可対象を明示し、未定義の呼び出しを許可しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-002-06]] | 調査系エージェントは実行ステップ上限を持ち、上限到達時は未完了タスクと次アクションを記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-002-07]] | 要求追加または意味変更時は [[RQ-RDR-029]]、設計追加または意味変更時は [[BD-SYS-ADR-016]] を同一変更で更新できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-002-08]] | 権限定義が未設定または過剰許可のエージェントは、本番運用で使用しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-002-09]] | 実行ログまたは判断根拠を残せない変更は採用しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-003-01]] | ビジネスロジックのテストカバレッジ基準を維持し、JSON契約スキーマのcontract testと主要導線のE2Eスモークテストを実施できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-003-02]] | ビジネスロジック（収集・変換・配信生成）の行カバレッジが70%以上であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-003-03]] | 配信JSON（`bootstrap`/`archive_index`/`tag_master`）のcontract testが存在し、スキーマ違反を検知できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-003-04]] | 主要導線（トップページ表示→検索→結果表示）のE2Eスモークテストが存在できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-003-05]] | カバレッジとテスト結果がCIで自動計測され、閾値未達時にビルドが警告を出すできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-003-06]] | インフラ層（CDKコンストラクト）はスナップショットテストで代替し、行カバレッジの対象外とできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-003-07]] | E2Eテストが外部依存（YouTube API）で不安定な場合は、モックを使用した準E2Eで代替できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-004-01]] | AWSサービス追加・データモデル変更・契約変更時にアーキテクチャ決定記録（ADR）を作成し、既存BD-SYS-ADR体系と統合管理できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-004-02]] | 以下の変更時にADRが作成されている: 新規AWSサービス追加、データモデルの構造変更、配信JSON契約の破壊的変更できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-004-03]] | ADRに背景・選択肢・決定・結果の4セクションを含むできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-004-04]] | ADRは既存の `BD-SYS-ADR` 体系の命名規則と配置に従うできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-004-05]] | ADR未作成の該当変更がリリース候補に含まれる場合、レビューチェックリストで検知できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-004-06]] | 緊急障害対応で事前ADR作成が困難な場合は、復旧後7日以内に事後ADRを作成できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-004-07]] | 軽微な設定変更（閾値調整、タグ値変更等）はADR対象外とし、変更履歴への記録で代替できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-005-01]] | Pull RequestごとにGitHub Actionsで品質ゲートを自動実行し、必須チェック合格前のマージを防止できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-005-02]] | PR更新ごとに `lint` / `test` / `build` を必須ステータスチェックとして実行できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-005-03]] | `docs` / `web` / `api` / `infra` のデプロイ単位ごとに失敗ジョブを判別できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-005-04]] | 必須チェック未達時に保護ブランチへマージできない状態を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-005-05]] | 必須チェックで使用するjob名は一意に管理され、判定衝突を起こさない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-005-06]] | CIが基盤障害で失敗した場合は再実行で復旧確認を行い、復旧確認前にマージしない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-005-07]] | チェック定義変更時は、変更理由と影響範囲を同一PRへ記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-006-01]] | GitHub Actionsでデプロイ環境ごとの排他制御と承認ゲートを維持し、失敗時のロールバック入口を固定化できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-REL-001]] | PASS |
| [[RQ-DEV-006-02]] | デプロイは環境単位の `concurrency` 制御で同時実行を防止できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-006-03]] | 本番環境はEnvironment保護ルールで承認を必須化できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-006-04]] | `workflow_dispatch` で明示的にデプロイを起動できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-006-05]] | 直前版へのロールバック手順をGitHub Actionsの手動入口として実行できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-006-06]] | デプロイ失敗時は `Quartz build失敗` / `CDK deploy失敗` / `反映遅延` の3系統で切り分け、復旧手順へ遷移できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-006-07]] | 承認者不在で反映できない場合はNo-Goとして判定し、承認経路確保までデプロイを延期できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-007-01]] | GitHub Actionsで生成される品質証跡を保持し、リリース判定文書から参照できる状態を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]] | PASS |
| [[RQ-DEV-007-02]] | a11y検査結果を含むArtifactsをアップロードし、保持期間を明示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-007-03]] | a11y検査結果は90日以上保持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-007-04]] | リリース判定時に対象Artifactsの参照先を記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-007-05]] | 単位別CI結果とデプロイ結果を同一実行IDで突合できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-007-06]] | Artifacts保持期限を超過した場合は、判定文書側へ期限超過を記録し再実行で証跡を再取得できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-DEV-007-07]] | 証跡欠落が判明したリリース候補はNo-Goとして扱い、証跡再取得まで公開しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-001]] | 管理画面から公開動画収集を実行できる | [[AT-SCN-004]], [[AT-SCN-008]] | [[AT-DR-001]], [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-OPS-INF-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]], [[AT-SLO-001]] | PASS |
| [[RQ-FR-002]] | 管理画面で公式投稿の公開動画をチャンネルID一致で取り込める | [[AT-SCN-008]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-003]] | 管理画面で出演条件一致の公開動画を判定して取り込める | [[AT-SCN-008]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-004]] | 管理画面の収集結果として動画メタデータを正規化できる | [[AT-SCN-008]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-005]] | [[RQ-GL-005|タグ辞書]]を更新できる | [[AT-SCN-009]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-006]] | ページング済み索引を生成できる | [[AT-SCN-007]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-007]] | アーカイブ一覧を表示できる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-008]] | キーワード検索できる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-009]] | タグ条件で絞り込みできる | [[AT-SCN-009]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-010]] | 日付範囲で絞り込みできる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-011]] | 再生時間で絞り込みできる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-012]] | 並び順を切り替えできる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-013]] | 動画詳細モーダルを表示できる | [[AT-SCN-003]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-014]] | YouTube視聴ページへ遷移できる | [[AT-SCN-003]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-015]] | 初回読み込みを高速化する[[RQ-GL-010|段階ロード]]で漸進表示できる | [[AT-SCN-002]], [[AT-SCN-008]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-016]] | 管理画面で読み込み失敗を通知できる | [[AT-SCN-002]], [[AT-SCN-007]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-017]] | 管理画面で[[RQ-GL-002|収集実行]]結果を確認できる | [[AT-SCN-005]], [[AT-SCN-007]], [[AT-SCN-008]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-018]] | 管理画面で手動[[RQ-GL-011|再収集]]を実行できる | [[AT-SCN-005]], [[AT-SCN-007]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-019]] | 管理画面で配信前後のメタデータ再取得と差分確認を運用できる | [[AT-SCN-007]] | [[AT-PLAN-001]] | PASS |
| [[RQ-FR-020]] | 詳細画面で[[RQ-GL-016|コメント密度波形]]を表示し[[RQ-GL-015|盛り上がり区間]]へ遷移できる | [[AT-SCN-003]] | [[AT-PLAN-001]] | PASS |
| [[RQ-FR-021]] | 動画詳細で[[RQ-GL-017|ワードクラウド]]を表示できる | [[AT-SCN-003]] | [[AT-PLAN-001]] | PASS |
| [[RQ-FR-022]] | [[RQ-GL-016|コメント密度波形]]表示用データを生成できる | [[AT-SCN-003]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-023]] | [[RQ-GL-017|ワードクラウド]]表示用画像を生成できる | [[AT-SCN-003]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-FR-024]] | 管理画面でドキュメント公開を一括実行できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-004]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-REL-001]] | PASS |
| [[RQ-FR-025]] | 管理画面運用の前提として単一CloudFrontで配信経路をパス分岐できる | [[AT-SCN-006]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-001-01]] | 外部連携を前提としたデータ契約（JSON構造、ID形式、日時形式）の互換性を維持できる | [[AT-SCN-006]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-001-02]] | 配信JSON（`bootstrap/tag_master/archive_index`）の必須キー欠落率を 0% にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-001-03]] | 日時は ISO 8601（UTC）形式、IDは仕様で定義した文字種のみを使用し、形式不一致を 0件にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-001-04]] | 後方互換性を破る変更は事前告知期間 14日以上を設け、旧形式を並行提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-001-05]] | 14日並行提供は必須キーの削除・型変更・意味変更に適用し、任意キー追加のみの変更は事前告知で代替できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-001-06]] | 契約変更時は [[DD-APP-API-001]] と [[AT-SCN-004]] の検証項目を同一変更で更新できる | [[AT-SCN-004]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-001-07]] | API版と仕様版は `'/api/v1/*'` と `'/openapi/v1/*'` の対応を維持し、版不一致を0件にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-001-08]] | 管理画面向け更新契約（タグ更新/公開反映）と[[RQ-SH-002\|利用者]]向け参照契約（`tag_master`/`archive_index`）の境界を維持し、契約混在を0件にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-004]], [[AT-SCN-006]] | [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-001-09]] | 契約破壊を検知した場合は新配信を停止し、互換モードまたは前版へ切り戻しできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-001-10]] | 外部仕様変更が原因の不整合は、影響APIを明示して一時的な変換層で吸収できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-002-01]] | 管理APIのOpenAPI 3.x仕様を `/openapi/v1/` で配信し、CIでスキーマ検証を実施して実装との乖離を0件に維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-002-02]] | OpenAPI 3.x仕様ファイルが `/openapi/v1/` 経路で配信されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-002-03]] | CIパイプラインでOpenAPI仕様のバリデーション（構文・参照整合）が実行されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-002-04]] | 実装のリクエスト/レスポンスがOpenAPI仕様と一致できるをcontract testで検証できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-002-05]] | 仕様と実装の乖離件数が0件であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-002-06]] | API変更時にOpenAPI仕様が同一変更で更新されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-002-07]] | 仕様と実装の乖離を検知した場合は、次回デプロイまでに仕様または実装を是正できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-INT-002-08]] | OpenAPI仕様の配信自体が障害の場合は、API機能には影響しないため優先度を下げて対応できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-001-01]] | 収集・配信・検索・管理操作の状態を、構造化ログ/メトリクス/アラートで追跡できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-RPT-001]] | PASS |
| [[RQ-OBY-001-02]] | ログは `operational` / `security` / `audit` の3区分で分類し、各イベントに `timestamp`、`event.name`、`event.outcome`、`severity`、`correlation_id` を記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-001-03]] | [[RQ-GL-002\|収集実行]]ごとに `run_id`、開始/終了時刻、対象件数、成功件数、失敗件数を必須記録できる | [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-008]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-001-04]] | [[DD-APP-API-006\|検索API]]はステータスコード、応答時間、[[RQ-GL-014\|検索条件]]種別を95%以上のリクエストで記録できる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-001-05]] | 認証失敗、認可失敗、入力検証失敗、管理操作、設定変更は100%記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-001-06]] | 重大障害（連続失敗3回、可用率閾値未達）のアラート通知を5分以内に発報できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-001-07]] | CloudWatch Logsの保持期間は30日とし、31日目以降の詳細ログは自動削除できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-001-08]] | 必須フィールド充足率は99%以上、ログ欠測率は1%未満を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-001-09]] | ログ運用コストは [[RQ-COST-001-01]] の月額上限内で維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-001-10]] | ログ出力失敗時はメトリクスで欠落件数を記録でき、欠落率が1%を超えた場合は運用障害として扱う運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-001-11]] | 監視基盤停止時は復旧後に欠測時間帯をレポートへ明記し、30日超過ログの再取得は行わない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-001-12]] | パスワード、トークン、セッションID、秘密鍵、PIIは平文で記録しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-002-01]] | 管理API `/api/v1/ops/diagnostics/health` でバックエンドサービスの接続状態を返却し、CloudFrontカスタムエラーページを設定できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-002-02]] | `/api/v1/ops/diagnostics/health` エンドポイントがDB正本・S3への接続状態を含むヘルスステータスを返却できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-002-03]] | レスポンスに `status`（`healthy` / `degraded` / `unhealthy`）と各依存サービスの状態を含むできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-002-04]] | ヘルスチェックの応答時間が5秒以内であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-002-05]] | CloudFrontで4xx/5xxエラー時のカスタムエラーページが設定されているできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-002-06]] | ヘルスチェック結果を [[RQ-OBY-001-01]] の監視対象に含めるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-002-07]] | ヘルスチェック自体が応答不能な場合は、CloudFrontカスタムエラーページで[[RQ-SH-002\|利用者]]に通知できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-004]], [[AT-SCN-006]] | [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-002-08]] | DB正本またはS3の一方のみ障害の場合は `degraded` ステータスを返却し、利用可能な機能を明示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-003-01]] | 主要障害シナリオのランブック（運用手順書）を整備し、MTTR超過時に簡易振り返りを実施できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-003-02]] | 以下の障害シナリオのランブックが整備されている: バッチ収集失敗、CloudFront無効化失敗、DB正本（RDB）接続障害、S3アクセス障害、Lambda実行エラーできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-003-03]] | 各ランブックに検知方法、影響範囲、復旧手順、エスカレーション基準を含むできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-003-04]] | [[RQ-AV-001-01]] のMTTR（30分）を超過した障害について、簡易振り返りノートを作成できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-003-05]] | 振り返りノートに発生日時、原因分類、復旧時間、再発防止策を記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-003-06]] | ランブックは半年ごとに見直し、陳腐化した手順を更新できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-003-07]] | 未知の障害シナリオが発生した場合は、復旧後にランブックを新規追加できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-OBY-003-08]] | 振り返りの結果、インフラ変更が必要な場合は、ADRを作成のうえ次回リリースで対応できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PRC-001-01]] | 公開YouTubeアーカイブのメタデータと非可逆な集計派生物のみを扱い、個人情報に該当し得る情報の恒久保持を回避できる | [[AT-SCN-003]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PRC-001-02]] | 収集対象データは動画メタデータ（動画ID/タイトル/説明/公開日時/タグ/チャンネル）と、詳細表示に利用する非可逆な集計派生物（例: [[RQ-GL-017\|ワードクラウド]]画像）に限定できる | [[AT-SCN-003]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PRC-001-03]] | コメント本文・チャット本文・視聴者個人識別情報の保存件数を常時 0件にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PRC-001-04]] | 集計処理の中間データは処理完了後に破棄し、チャット本文を再構成可能な形式で保持しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PRC-001-05]] | 削除/非公開化された動画は、検知から 24時間以内に配信対象から除外できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PRC-001-06]] | データ取り扱い範囲と除外項目を [[AT-OPS-001]] に明記し、受入時に照合できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-OPS-001]] | PASS |
| [[RQ-PRC-001-07]] | 想定外の個人情報が検出された場合は、該当データを即時非公開化し、削除完了まで配信停止できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PRC-001-08]] | 削除要請に該当する問い合わせは、受付から 3営業日以内に処理方針を回答できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-001-01]] | 検索と一覧操作を体感待ちの少ない性能で提供できる | [[AT-SCN-008]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-RPT-001]] | PASS |
| [[RQ-PS-001-02]] | 主要ページ初回表示時間（LCP相当）が p95 で 2.5秒以下にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-001-03]] | キーワード検索またはタグ絞り込み適用後、結果再描画完了までが p95 で 1.5秒以下にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-001-04]] | [[RQ-GL-010\|段階ロード]] の [[RQ-GL-009\|アーカイブ索引]] 読み込み開始から結果表示までが p95 で 2.0秒以下にできる | [[AT-SCN-008]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-001-05]] | 50件表示時の並び替え操作は p95 で 1.0秒以下にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-001-06]] | 計測条件は4G相当（下り10Mbps/上り3Mbps/RTT 50ms）、ミドルレンジ端末、同時利用10未満を標準にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-001-07]] | 性能閾値を連続3回超過した場合は劣化インシデントとして記録し、次リリースまでに改善策を実装できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-001-08]] | 外部ネットワーク要因で計測不能なケースは除外理由を [[AT-RPT-001]] に記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-RPT-001]] | PASS |
| [[RQ-PS-001-09]] | [[RQ-PC-006]] の上限超過見込み時は、p95閾値を維持したまま [[RQ-GL-010\|段階ロード]] の粒度とキャッシュ期間を見直し、常時稼働リソースを追加しない運用ができる | [[AT-SCN-008]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-002-01]] | 収集バッチは30分以内に完了し、Lambda実行時間上限を考慮した安全停止機構を備えることできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-002-02]] | 通常運用時の収集バッチ全体の処理時間が30分以内に完了できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-002-03]] | 個別Lambda関数の実行時間がLambda上限（15分）の80%（12分）を超過した場合、途中結果を保存して安全停止できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-002-04]] | 安全停止後の再実行で、[[RQ-DATA-002-01]] の冪等性により未処理分のみを継続処理できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-002-05]] | バッチ処理時間を [[RQ-OBY-001-01]] のメトリクスとして記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-002-06]] | 対象動画数の急増（通常の3倍以上）で30分を超過する場合は、分割実行を許容し、全分割の合計が60分以内であることを条件とできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-002-07]] | 安全停止が作動した場合は、次回スケジュール実行で自動的に継続処理されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-003-01]] | 配信JSONペイロードにサイズ上限を設け、モバイル端末のメモリ保護とネットワーク効率を確保できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-003-02]] | `bootstrap` JSONのサイズが圧縮前500KB以下であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-003-03]] | `archive_index` の1ページあたりのJSONサイズが圧縮前2MB以下であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-003-04]] | `tag_master` JSONのサイズが圧縮前300KB以下であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-003-05]] | 配信生成時にサイズを計測し、閾値超過時はビルドを警告付きで完了できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-003-06]] | サイズ計測結果を [[RQ-OBY-001-01]] のメトリクスとして記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-003-07]] | データ増加により閾値を超過した場合は、ページネーション粒度の見直しまたは不要フィールドの除外で対応できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-PS-003-08]] | 一時的な超過（閾値の120%以内）は警告として扱い、次回配信生成までに是正できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-001-01]] | 管理操作を適切に認可し、入力・依存ライブラリ・機密情報の基本統制を維持できる | [[AT-SCN-006]] | [[AT-RPT-001]] | PASS |
| [[RQ-SEC-001-02]] | 管理系APIの未認可アクセスを 100% 拒否できる（2xx 応答を返さない）できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-001-03]] | 主要入力項目での不正入力（型不一致、過長、不正文字列）を 100% バリデーション失敗にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-001-04]] | 依存ライブラリの脆弱性スキャンをリリースごとに実施し、Critical/High を 0件にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-001-05]] | シークレット（APIキー/トークン）平文のリポジトリ格納を 0件にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-001-06]] | `'/openapi/*'` と `'/api/v1/*'` は未認証アクセスを100%拒否し、認証済みアクセスのみ許可できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-001-07]] | タグ値にはPII/秘密情報を保存せず、監査サンプルで違反 0件を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-001-08]] | `aws:` プレフィックスで始まるタグキーを利用しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-001-09]] | 必須タグキーの表記は `UpperCamelCase`（`CostCenter` など）で固定し、大小文字違いのキー作成をIAM条件で拒否できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-001-10]] | Critical脆弱性検出時は即時リリース停止し、24時間以内に暫定対処またはロールバックを実施できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-001-11]] | タグの禁止情報混入を検知した場合は当日中に削除し、原因と再発防止策を [[AT-OPS-001]] に記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-OPS-001]] | PASS |
| [[RQ-SEC-001-12]] | セキュリティ事故発生時は [[AT-RUN-001]] の障害対応手順へエスカレーションできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-RUN-001]] | PASS |
| [[RQ-SEC-002-01]] | すべてのクライアント通信をHTTPS（TLS 1.2以上）で暗号化し、平文通信を許容しないことできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-002-02]] | CloudFrontディストリビューションでHTTPSが強制され、HTTPリクエストはHTTPSへリダイレクトされるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-002-03]] | TLSプロトコルの最小バージョンが TLS 1.2 以上であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-002-04]] | ACM証明書が設定され、自動更新が有効であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-002-05]] | CDKスタックの合成出力で上記設定が検証可能であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-002-06]] | ACM証明書の更新失敗を検知した場合は、7日以内に手動更新または原因是正を実施できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-002-07]] | TLS 1.2未満のクライアントからのアクセスは接続拒否として扱い、対応しないできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-003-01]] | すべての永続化データを保存時暗号化し、平文保存を許容しないことできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-DR-001]], [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-003-02]] | S3全バケットでSSE-S3（AES-256）によるサーバーサイド暗号化がデフォルト有効であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-003-03]] | DB正本（RDB）で保存時暗号化が有効であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-003-04]] | CDK `cdk synth` の出力で暗号化設定の存在を検証可能であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-003-05]] | 暗号化未設定のリソースが0件であることをデプロイ前チェックで確認できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-003-06]] | 暗号化未設定のリソースを検知した場合は、次回デプロイまでに是正できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-003-07]] | KMSカスタマーマネージドキーは予算制約から使用せず、AWS管理キーで運用できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-004-01]] | CloudFrontレスポンスヘッダーポリシーを通じて標準セキュリティヘッダーを全レスポンスに付与できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-004-02]] | `Content-Security-Policy` が設定され、インラインスクリプトの実行を制限できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-004-03]] | `X-Content-Type-Options: nosniff` が全レスポンスに付与されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-004-04]] | `X-Frame-Options: DENY` が全レスポンスに付与されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-004-05]] | `Strict-Transport-Security` が `max-age=63072000; includeSubDomains` 以上で設定されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-004-06]] | `Referrer-Policy: strict-origin-when-cross-origin` が設定されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-004-07]] | 上記ヘッダーはCloudFrontレスポンスヘッダーポリシーとしてCDKで管理されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-004-08]] | デプロイ後の応答ヘッダー検査で上記5種のヘッダーが全件存在できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-004-09]] | CSPポリシーにより正当なリソース読み込みが阻害された場合は、最小限のCSP緩和をADRに記録して適用できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-004-10]] | サードパーティ埋め込みが必要になった場合は、`X-Frame-Options` を `SAMEORIGIN` へ変更しADRに記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-005-01]] | GitHub Actions運用におけるワークフロー改ざんと資格情報漏えいを防止する統制を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-005-02]] | サードパーティActions参照はフル長SHAで固定できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-005-03]] | `GITHUB_TOKEN` は最小権限を既定値にし、ジョブ単位でのみ必要権限へ昇格できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-005-04]] | Actions利用元は許可リストで制限できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-005-05]] | クラウド認証はOIDC AssumeRoleを使用し、長期アクセスキーをSecretsへ保持しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-005-06]] | fork由来PRではSecrets非提供を前提に、PRワークフローをSecrets非依存で実行できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-005-07]] | セキュリティ是正の緊急対応で一時的な例外設定を行う場合は、有効期限と復旧計画を同一変更へ記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SEC-005-08]] | ワークフロー改ざんが疑われる場合はデプロイを停止し、復旧完了まで `workflow_dispatch` 実行を禁止できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-001-01]] | 全インフラは、Lambda・CloudFront・S3・RDB等のマネージドサービスで構成し、EC2・ECS等の常時稼働インスタンスを使用しないことできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-001-02]] | 全コンピューティングリソースがLambdaまたはCloudFront Functionsで実行されるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-001-03]] | EC2インスタンス、ECSタスク、EKSクラスタの利用が0件であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-001-04]] | 新規AWSサービスの追加時はマネージドサービスを第一選択とし、非マネージドサービスの採用はADRで理由を記録できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-001-05]] | CDK `cdk synth` の出力にEC2/ECS/EKS関連リソースが含まれないことを検証可能であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-001-06]] | 将来的にマネージドサービスでは実現不可能な要件が発生した場合は、ADRに代替案の比較評価を記録したうえで例外承認できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-001-07]] | 一時的な検証目的のEC2利用は、検証完了後に即座に削除できるを条件に許容できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-002-01]] | CloudFront圧縮・適切なキャッシュ制御・冗長コピー禁止により、データ転送量とストレージ使用量を最適化できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-002-02]] | CloudFrontでgzip/brotli圧縮が有効化されているできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-002-03]] | 静的配信JSONに適切な `Cache-Control` ヘッダーが設定され、不要な再取得を抑制できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-002-04]] | 同一データの冗長コピー（S3バケット間の不要な複製等）が0件であるできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-002-05]] | 月次で `CloudFront転送量(GB) / 配信成果物サイズ(GB)` を算出し、直近3か月移動平均比で ±20% 以内を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-002-06]] | 転送量の急増（前月比200%超）を検知した場合はアラートを発報できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-002-07]] | キャッシュ無効化（invalidation）が必要なデプロイ時は一時的に転送量が増加するが、通常運用の範囲として許容できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-SUS-002-08]] | 障害復旧のためにデータの一時的な冗長コピーが必要な場合は、復旧完了後に削除できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-001-01]] | [[RQ-SH-002\|利用者]]が目的動画へ短手数で到達できる検索体験を提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-006]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-001-02]] | 代表タスク（キーワード+タグ+期間条件で目的動画を発見）成功率を 90%以上にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-001-03]] | 代表タスク完了までの操作ステップ中央値が 6ステップ以下にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-001-04]] | [[RQ-GL-014\|検索条件]]変更から結果理解（件数/並び順確認）までの主観評価が 5段階中 4.0以上にできる | [[AT-SCN-002]] | [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-001-05]] | スマートフォン幅 390px で主要操作（検索、タグ選択、詳細表示、遷移）が欠損なく実行できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-001-06]] | タブレット幅 768px で主要操作（検索、タグ選択、詳細表示、遷移）が欠損なく実行できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-001-07]] | PC幅 1280px で主要操作（検索、タグ選択、詳細表示、遷移）が欠損なく実行できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-001-08]] | 成功率が閾値未達の場合は、未達タスクを [[AT-RPT-001]] に特定し、UI改善要求へ起票できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-RPT-001]] | PASS |
| [[RQ-UX-001-09]] | 主要操作でブロッカーが検出された場合はリリース不可にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-002-01]] | 非テキストコンテンツに代替テキストを提供できる | [[AT-SCN-002]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-002-02]] | 画像・アイコンボタン・リンクに適切な代替テキストまたはアクセシブルネームが付与され、欠落率を0件にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-002-03]] | スクリーンリーダーで主要機能（検索、絞り込み、詳細表示）を名称で識別できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-002-04]] | 装飾目的の画像を支援技術に読み上げられない形で実装できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-003-01]] | マルチメディア情報に字幕/文字起こし等の代替手段を提供できる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-003-02]] | MVP範囲では独自の動画/音声コンテンツを提供しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-003-03]] | 将来拡張でサービス内に動画/音声説明を独自提供する場合は、字幕または同等テキストを100%提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-003-04]] | 説明文や通知文を音声に依存して伝える機能を実装しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-003-05]] | YouTube本体機能に依存する字幕の欠落は外部要因として記録し、代替説明導線を提示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-004-01]] | 情報伝達を色のみに依存させない表現にできる | [[AT-SCN-002]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-004-02]] | 通常テキストのコントラスト比は4.5:1以上、UIコンポーネント境界は3:1以上にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-004-03]] | エラー・状態表示は色に加えてアイコンまたは文言で区別できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-004-04]] | サムネイル画像そのものの色設計は対象外だが、補助ラベルで意味を補完できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-005-01]] | 拡大表示・リフロー・縦横切替でも主要操作を維持できる | [[AT-SCN-002]], [[AT-SCN-003]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-005-02]] | 400%拡大時に主要操作面で横スクロール必須領域を発生させずに済むできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-005-03]] | 390px幅で検索、絞り込み、詳細遷移が完了できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-005-04]] | 768px幅で検索、絞り込み、詳細遷移が完了できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-005-05]] | 1280px幅で検索、絞り込み、詳細遷移が完了できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-005-06]] | 画面向き固定を要求しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-005-07]] | 外部埋め込み要素で向き固定が必要な場合は代替遷移手段を提示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-006-01]] | 主要機能をキーボードのみで操作できる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-006-02]] | 一覧、検索、フィルタ、ソート、詳細表示がTab/Enter/Escapeで完結できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-006-03]] | フォーカス順序を視覚順と機能順に整合させ、逆行や飛びを発生させずに済むできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-006-04]] | カスタムUI部品で標準キー操作と異なる場合は、画面内に操作説明を表示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-007-01]] | キーボードフォーカスを常時視認可能にできる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-007-02]] | すべての操作可能要素でフォーカスインジケータが視認できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-007-03]] | フォーカス対象がヘッダや固定フッタの裏に隠れない状態を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-007-04]] | ブラウザ既定表示を使用する場合でも、背景との識別ができない場合は独自スタイルで補強できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-008-01]] | ポインター操作対象のタップ領域を十分なサイズで提供できる | [[AT-SCN-002]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-008-02]] | 主要操作ボタン/リンクのターゲットサイズを最小24x24 CSS px以上にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-008-03]] | 隣接ターゲット間は誤タップ防止のため十分な間隔を確保できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-008-04]] | テキスト内インラインリンクを例外扱いする場合でも、拡大時に選択可能な状態を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-009-01]] | ドラッグ必須操作にクリック/キーボード等の代替手段を提供できる | [[AT-SCN-002]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-009-02]] | 並び替え・スライダー等のドラッグ操作は、ボタン操作または直接入力で代替できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-009-03]] | 代替手段はキーボード操作でも完結できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-009-04]] | 機能上ドラッグを廃止できない場合は、同等結果を得る別操作を必須提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-010-01]] | 複雑ジェスチャや端末動作に依存しない操作設計にできる | [[AT-SCN-002]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-010-02]] | マルチポイントや経路依存ジェスチャが必要な操作に単一タップ等の代替を提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-010-03]] | 取り消し不能な操作は確認ステップまたはUndo導線を提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-010-04]] | 外部プレイヤー由来のジェスチャは対象外だが、アプリ内機能で補完可能な導線を用意できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-011-01]] | ページタイトル・見出し階層・ランドマークを整備し、一貫したナビゲーションを提供できる | [[AT-SCN-001]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-011-02]] | 全ページに一意で内容を示すタイトルを設定できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-011-03]] | 見出し階層は意味順に構成し、スキップリンクまたは同等の主領域移動を提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-011-04]] | ナビゲーション配置は主要画面で一貫できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-011-05]] | モーダル表示時はタイトル相当のラベルと閉じる導線を必須にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-012-01]] | 入力項目に明確なラベルを付与できる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-012-02]] | 入力項目100%に視覚ラベルとプログラム上の関連付けを持たせることができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-012-03]] | エラー発生時は項目特定、原因、修正方法を文言で表示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-012-04]] | 必須/任意、入力形式、制約条件を事前提示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-012-05]] | サーバー側エラーのみの場合でも、再試行手順と問い合わせ導線を表示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-013-01]] | 同一手続き内の再入力を最小化できる | [[AT-SCN-002]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-013-02]] | 同一セッション内で確定済みの入力値は再利用し、不要な再入力要求をしない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-013-03]] | 再入力が必要な場合は、理由を明示し最小項目に限定できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-013-04]] | セキュリティ上再入力が必要な項目は、対象を限定し理由を提示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-014-01]] | [[RQ-SH-001\|管理者]]向け認証導線で、記憶/計算/パズル依存を避けた認証手段を提供できる | [[AT-SCN-002]], [[AT-SCN-004]], [[AT-SCN-007]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-014-02]] | 本要件の適用対象は[[RQ-SH-001\|管理者]]向けログイン/MFA導線とし、公開閲覧導線には認証を要求しない運用ができる | [[AT-SCN-004]], [[AT-SCN-007]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-014-03]] | CAPTCHA等を利用する場合は、同等の非視覚依存手段を提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-014-04]] | 認証情報入力時に貼り付け・パスワード管理ツール利用を不必要に禁止しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-014-05]] | 認証失敗時は原因分類と再試行手順を表示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-014-06]] | 不正アクセス対策で追加認証が必要な場合は、代替手段を最低1つ提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-015-01]] | 問い合わせ先・ヘルプ導線を画面間で一貫した位置と表現で提供できる | [[AT-SCN-002]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-015-02]] | ヘルプリンクまたは問い合わせ導線を主要画面で同一位置に表示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-015-03]] | 表示名称と遷移先を一貫させ、画面ごとの意味差分を作らない状態を維持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-015-04]] | メンテナンス等でヘルプ導線を一時変更する場合は、全画面で同時反映できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-016-01]] | [[RQ-SH-001\|管理者]]向けセッションに時間制限を設ける場合に、事前通知と延長手段を提供して影響を最小化できる | [[AT-SCN-002]], [[AT-SCN-004]], [[AT-SCN-007]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-016-02]] | 公開検索/閲覧導線にはセッションタイムアウトを設けない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-016-03]] | [[RQ-SH-001\|管理者]]向けセッションにタイムアウトを設定する場合、少なくとも60秒前に警告を表示できる | [[AT-SCN-004]], [[AT-SCN-007]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-016-04]] | [[RQ-SH-001\|管理者]]向けセッションには延長または中断後再開の手段を提供できる | [[AT-SCN-004]], [[AT-SCN-007]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-016-05]] | セキュリティ上延長不可の場合は、保存済み情報を保持し再入力を最小化できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-017-01]] | 処理結果や状態変化を、フォーカス移動に依存せず支援技術へ通知できる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-017-02]] | 成功/失敗/進行中の通知はARIA live等で読み上げ可能にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-017-03]] | 通知文に原因と次行動を含め、3秒未満で消失させない形で提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-017-04]] | 一時通知が非表示になる場合でも履歴または再確認手段を提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-018-01]] | 発作リスクを高める閃光や過度な点滅演出を実装しない運用ができる | [[AT-SCN-001]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-018-02]] | 1秒間に3回を超える全画面規模の点滅を実装しない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-018-03]] | 自動再生アニメーションには停止または非表示手段を提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-018-04]] | 外部動画コンテンツ由来の点滅は制御外だが、警告表示を提供できる設計にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-019-01]] | HTML/ARIA仕様に準拠し、主要支援技術で解釈可能なマークアップを維持できる | [[AT-SCN-001]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-019-02]] | 自動検査で重大なHTML構文不整合およびARIA misuseを0件にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-019-03]] | 主要画面でスクリーンリーダー検証を実施し、操作不能項目を0件にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-019-04]] | 外部ウィジェットに起因する違反は影響範囲を明示し、回避策または代替導線を提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-020-01]] | 資料ファイルや通知（メール等）を提供する場合に、読み上げ可能で意味構造を持つ表現を採用できる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-020-02]] | MVP範囲で新規の資料ダウンロード/メール通知を提供しない場合、本要件は将来拡張時の適用項目として管理できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-020-03]] | ダウンロード資料を提供する場合は、見出し構造、代替テキスト、言語指定を保持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-020-04]] | メール通知を提供する場合は、件名、本文構造、リンク目的を明確にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-020-05]] | 外部ツール生成物で構造保持が困難な場合は、同内容のHTMLページ導線を提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-021-01]] | CI/CDでアクセシビリティ検査を自動実行し、重大違反をリリースゲートで遮断できる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-021-02]] | Pull Requestごとに自動アクセシビリティ検査を実行できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-021-03]] | 重大違反（Critical/High）が1件以上の場合はマージ不可にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-021-04]] | 検査結果を履歴として90日以上保持できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-021-05]] | 誤検知を一時除外する場合は、有効期限付き例外設定と改善チケットを必須化できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-022-01]] | サードパーティ/クラウドサービス利用時にアクセシビリティ影響を評価し、代替手段を確保できる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-OPS-INF-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-022-02]] | MVP範囲で新規導入するサードパーティ/クラウドサービスを評価対象とし、導入時にアクセシビリティ適合状況（VPAT等）の確認記録を残せる運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-022-03]] | 重大なアクセシビリティ欠陥が判明した場合は代替導線または代替サービスを提供できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-022-04]] | 定期再評価は重大変更時または年1回のいずれか早い方で実施できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-022-05]] | 短期利用で代替困難な場合は、影響範囲と利用制限を明示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-023-01]] | アクセシビリティ不具合の受付窓口と優先度付き是正プロセスを維持できる | [[AT-SCN-002]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-023-02]] | 不具合報告の受付導線を公開し、受付確認を3営業日以内に返すことができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-023-03]] | 重大度High以上は次リリースまでに修正方針を確定できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-023-04]] | 対応状況（受付、調査、対応、完了）を追跡可能にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-023-05]] | 外部サービス起因で即時修正不可の場合は、代替手段と暫定回避策を提示できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-023-06]] | [[RQ-SH-001\|管理者]]の長期不在等で3営業日以内応答が困難な場合は、公開告知で一時SLA緩和を明示し、復帰後5営業日以内に一次回答できる | [[AT-SCN-004]], [[AT-SCN-007]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-024-01]] | ページ全体と言語切替部分に適切な言語指定を実施できる | [[AT-SCN-001]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-024-02]] | HTML文書に主要言語の `lang` 属性を設定できる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-024-03]] | 別言語語句が継続して現れる部分に部分言語指定を行えるができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-024-04]] | 主要画面で言語指定不備の検査結果を0件にできる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |
| [[RQ-UX-024-05]] | 固有名詞や短い外来語は部分言語指定を省略可能だが、可読性に支障を出さない運用ができる | [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[AT-SCN-007]], [[AT-SCN-008]], [[AT-SCN-009]] | [[AT-PLAN-001]], [[AT-RUN-001]] | PASS |

### 基本設計 -> 結合テスト（IT）
| 設計ID(BD) | タイトル | ITケース(IT-CASE) | 補助IT文書 | 判定 |
| --- | --- | --- | --- | --- |
| [[BD-APP-API-001]] | API一覧 | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-APP-API-002]] | 収集API設計 | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-APP-API-003]] | エラーモデル | [[IT-CASE-002]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-PLAN-001]] | PASS |
| [[BD-APP-API-004]] | OpenAPI配布とAPIバージョン境界 | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-APP-API-005]] | HTTP API契約共通方針 | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-APP-DATA-001]] | データアーキテクチャ | [[IT-CASE-001]], [[IT-CASE-004]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-PLAN-001]] | PASS |
| [[BD-APP-DATA-002]] | ER図（概要） | [[IT-CASE-001]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-PLAN-001]] | PASS |
| [[BD-APP-DATA-003]] | データ保持・削除方針 | [[IT-CASE-001]], [[IT-CASE-004]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-APP-UI-001]] | 画面一覧 | [[IT-CASE-001]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-APP-UI-002]] | 検索画面情報設計 | [[IT-CASE-004]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-APP-UI-003]] | 画面遷移 | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-APP-UI-004]] | アクセシビリティ方針 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-DEV-ENV-001]] | 開発環境 | [[IT-CASE-001]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]] | PASS |
| [[BD-DEV-ENV-002]] | 本番環境 | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-SMK-001]] | PASS |
| [[BD-DEV-PIPE-001]] | ビルド方針（デプロイ単位分離） | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]] | PASS |
| [[BD-DEV-TEST-001]] | テスト戦略 | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-INF-AUD-001]] | 監査証跡基本設計（CloudTrail中心） | [[IT-CASE-001]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-INF-CM-001]] | 構成管理方針 | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]] | PASS |
| [[BD-INF-DEP-001]] | デプロイ方式 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]] | PASS |
| [[BD-INF-DEP-002]] | デプロイ運用ルール | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-INF-DEP-003]] | CI/CD基本設計（Quartz + CDK） | [[IT-CASE-001]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-PLAN-001]] | PASS |
| [[BD-INF-DEP-004]] | エッジ・DNS・証明書設計 | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-INF-DEP-005]] | コンピュートと配備設計 | [[IT-CASE-001]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]] | PASS |
| [[BD-INF-DEP-006]] | バックアップ・DR設計 | [[IT-CASE-007]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-OBS-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-INF-ENV-001]] | アカウント・環境分割方針 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-INF-ENV-001]] | PASS |
| [[BD-INF-IAC-001]] | インフラ変更フロー | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]] | PASS |
| [[BD-INF-KMS-001]] | 暗号化・鍵管理方針 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-INF-MON-001]] | 監視設計 | [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]] | PASS |
| [[BD-INF-MON-002]] | SLO運用 | [[IT-CASE-007]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]], [[IT-PLAN-001]] | PASS |
| [[BD-INF-MON-003]] | 監査・追跡設計 | [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]] | PASS |
| [[BD-INF-MON-004]] | 運用ガバナンス方針 | [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]] | PASS |
| [[BD-INF-NET-001]] | ネットワーク境界方針 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-NET-001]], [[IT-INF-SMK-001]] | PASS |
| [[BD-INF-OPS-001]] | インフラ運用ガバナンス設計 | [[IT-CASE-001]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]] | PASS |
| [[BD-INF-PLAT-001]] | インフラ基本設計の章構成と全体構成 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-INF-PLAT-002]] | データストア基本設計 | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-INF-SEC-001]] | IAM・セキュリティ境界方針 | [[IT-CASE-001]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-INF-WAF-001]] | L7防御設計（WAF/Shield） | [[IT-CASE-001]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ADR-001]] | 収集対象を公式+出演にする | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ADR-002]] | [[RQ-GL-010|段階ロード]]JSONを採用する | [[IT-CASE-003]], [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-003]] | [[RQ-GL-005|タグ辞書]]分離を採用する | [[IT-CASE-004]], [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-004]] | 静的配信+API起動バッチ（単一Backend API）構成を採用する | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-005]] | 検索をフロントで実行する | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-006]] | 監視はSLO最小セットで開始する | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]], [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-007]] | リリースゲートをATで管理する | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-008]] | 運用[[RQ-GL-011|再収集]]フローを標準化する | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]], [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-009]] | [[RQ-GL-017|ワードクラウド]]は事前生成の静的画像配信を採用する | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-010]] | 詳細画面の見どころ導線は[[RQ-GL-016|コメント密度波形]]を採用する | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-011]] | TypeScript型安全をtsconfigとlintで標準化する | [[IT-CASE-001]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-INF-ENV-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-012]] | スキルメンテナンスを構成管理設計へ組み込む | [[IT-CASE-001]], [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-INF-ENV-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-013]] | ドキュメント公開はQuartz成果物をCDK経由で配信する | [[IT-CASE-001]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-014]] | 単一CloudFrontのパス分岐と認証境界を固定する | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-015]] | 単一アカウントでAWSタグ統制をIAMとConfigで実施する | [[IT-CASE-004]], [[IT-CASE-011]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-016]] | AIエージェント運用で最小権限と段階解放を採用する | [[IT-CASE-001]], [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-017]] | 公開UIの端末優先順位をモバイル先行で固定する | [[IT-CASE-004]], [[IT-CASE-005]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-018]] | 公開UIをモバイルファーストで設計する | [[IT-CASE-004]], [[IT-CASE-005]] | [[IT-ENV-001]], [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-019]] | ビルドをデプロイ単位で分離して品質ゲートを固定する | [[IT-CASE-001]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-INF-ENV-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-020]] | 非機能詳細設計の判定軸を統一する | [[IT-CASE-001]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ADR-021]] | DB正本化と3層責務境界で検索拡張性を確保する | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-022]] | Lambda構造化ログをCloudWatch 30日保持で運用する | [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]] | PASS |
| [[BD-SYS-ADR-023]] | HTTP API契約をRFC準拠で統一する | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ADR-024]] | Next.js App Router運用指針を基本設計へ標準化する | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ADR-025]] | Hono + Zod の入力検証と例外処理を標準化する | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ADR-026]] | テスト戦略をUT/IT/ATの三層品質ゲートで運用する | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-027]] | バッチ実行制約と補助データ生成の運用境界を固定する | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]], [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-028]] | インフラ文書を本体開発フローへ統合する | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ADR-029]] | ドメイン境界正本をBD-SYS-DOMへ統合しPublished Languageを維持する | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-OBS-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ADR-030]] | データ保持・削除方針の責務をDB正本へ限定する | [[IT-CASE-007]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-031]] | 配備モードと責務マトリクスをINF正本へ統合する | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ADR-032]] | AnalyticsをCoreサブドメインとして扱う | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ADR-033]] | 論理構成を4区分化しバックエンド処理形態を分離する | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-OBS-001]] | PASS |
| [[BD-SYS-ADR-034]] | API契約語彙と運用ヘルス経路を統一する | [[IT-CASE-001]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ADR-036]] | INF基本設計をAWSリソース起点の章構成へ再編する | [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]] | PASS |
| [[BD-SYS-ADR-037]] | docs PDF配布をArtifact/Releaseで二系統化し命名規則を統一する | [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ADR-038]] | docs配備は初回ローカル構築後にGitHub OIDC AssumeRoleで自動実行する | [[IT-CASE-001]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ADR-039]] | CI/CDはGitHub Actionsを実装基盤に統一しPRとデプロイを分離運用する | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ARCH-001]] | システムコンテキスト | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-OBS-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ARCH-002]] | 論理構成 | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-ARCH-003]] | クラウド配置構成 | [[IT-CASE-001]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ARCH-004]] | 主要データフロー | [[IT-CASE-001]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-PLAN-001]] | PASS |
| [[BD-SYS-ARCH-005]] | AIエージェント運用アーキテクチャ | [[IT-CASE-007]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]] | PASS |
| [[BD-SYS-DOM-001]] | ドメイン境界定義 | [[IT-CASE-001]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]], [[IT-CASE-012]], [[IT-CASE-013]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |
| [[BD-SYS-QUAL-001]] | 品質特性 | [[IT-CASE-003]], [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-INF-OBS-001]], [[IT-PLAN-001]] | PASS |
| [[BD-SYS-SEC-001]] | セキュリティ設計（統合済み） | [[IT-CASE-009]], [[IT-CASE-010]], [[IT-CASE-011]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-INF-ENV-001]], [[IT-INF-NET-001]], [[IT-INF-OBS-001]], [[IT-INF-ROLL-001]], [[IT-INF-SMK-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] | PASS |

### 詳細設計 -> 単体テスト（UT）
| 設計ID(DD) | タイトル | UTケース(UT-CASE) | 補助UT文書 | 判定 |
| --- | --- | --- | --- | --- |
| [[DD-APP-ALG-001]] | 検索アルゴリズム | [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-API-001]] | API詳細総論 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-COV-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-005]], [[UT-RPT-001]], [[UT-STAT-001]], [[UT-TDAT-001]] | PASS |
| [[DD-APP-API-002]] | [[RQ-GL-002|収集実行]]起動API | [[UT-CASE-001]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-API-003]] | [[RQ-GL-002|収集実行]]状態API | [[UT-CASE-002]], [[UT-CASE-009]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-API-004]] | アーカイブ一覧API | [[UT-CASE-003]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-API-005]] | [[RQ-GL-005|タグ辞書]]API | [[UT-CASE-004]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-API-006]] | 検索API | [[UT-CASE-005]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-API-007]] | 動画詳細API | [[UT-CASE-006]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-API-008]] | [[RQ-GL-011|再収集]]API | [[UT-CASE-007]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-API-009]] | 運用診断API | [[UT-CASE-008]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-API-010]] | API経路バージョニング詳細 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-API-011]] | 収集結果明細API | [[UT-CASE-009]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-API-012]] | 配信前後再確認API | [[UT-CASE-010]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-API-013]] | タグ管理API | [[UT-CASE-011]], [[UT-CASE-013]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-API-014]] | ドキュメント公開実行API | [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-003]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-API-015]] | 配信反映ジョブ状態API | [[UT-CASE-013]] | [[UT-PLAN-001]], [[UT-PLAN-005]] | PASS |
| [[DD-APP-DB-001]] | DB制約方針 | [[UT-CASE-012]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-002]] | DDL一覧 | [[UT-CASE-001]], [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-003]] | DB移行方針 | [[UT-CASE-001]], [[UT-CASE-009]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-004]] | 一意制約・チェック制約 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-005]] | channelsテーブル | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-015]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-006]] | videosテーブル | [[UT-CASE-007]], [[UT-CASE-009]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-007]] | video_tagsテーブル | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-008]] | tagsテーブル | [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-009]] | tag_typesテーブル | [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-010]] | ingestion_runsテーブル | [[UT-CASE-001]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-011]] | ingestion_eventsテーブル | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-012]] | ingestion_itemsテーブル | [[UT-CASE-007]], [[UT-CASE-009]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-013]] | recheck_runsテーブル | [[UT-CASE-010]], [[UT-CASE-011]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-014]] | recheck_itemsテーブル | [[UT-CASE-010]], [[UT-CASE-011]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-015]] | publish_runsテーブル | [[UT-CASE-012]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-016]] | publish_stepsテーブル | [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-DB-017]] | publish_artifactsテーブル | [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-ERR-001]] | エラーコード設計 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-LOG-001]] | ログ設計 | [[UT-CASE-001]], [[UT-CASE-005]] | [[UT-PLAN-001]], [[UT-PLAN-005]], [[UT-SEC-001]] | PASS |
| [[DD-APP-MOD-001]] | コンポーネント分割 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-MOD-002]] | Next.js App Router 実装ガイド | [[UT-CASE-003]], [[UT-CASE-016]] | [[UT-COV-001]], [[UT-PLAN-001]], [[UT-PLAN-004]], [[UT-SEC-001]] | PASS |
| [[DD-APP-MOD-003]] | 責務対応表 | [[UT-CASE-003]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-001]] | UI詳細総論 | [[UT-CASE-001]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-002]] | 一覧画面 | [[UT-CASE-016]] | [[UT-PLAN-001]], [[UT-PLAN-004]] | PASS |
| [[DD-APP-UI-003]] | フィルタドロワー | [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-004]] | 詳細モーダル | [[UT-CASE-004]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-005]] | 検索バー | [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-006]] | 運用ステータス画面 | [[UT-CASE-002]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-007]] | [[RQ-GL-002|収集実行]]画面 | [[UT-CASE-001]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-008]] | [[RQ-GL-011|再収集]]設定画面 | [[UT-CASE-007]], [[UT-CASE-009]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-009]] | 配信前後確認・手動タグ付け画面 | [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-010]] | 配信反映ジョブ画面 | [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-011]] | 公開後運用・配信経路確認画面 | [[UT-CASE-008]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-012]] | SearchConditionPanel コンポーネント | [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-013]] | ArchiveList コンポーネント | [[UT-CASE-003]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-014]] | ArchiveDetailModal コンポーネント | [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-015]] | HighlightWavePanel コンポーネント | [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-016]] | WordCloudPanel コンポーネント | [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-017]] | RunStatusScreen コンポーネント | [[UT-CASE-002]], [[UT-CASE-009]] | [[UT-PLAN-001]] | PASS |
| [[DD-APP-UI-018]] | 管理画面共通操作コンポーネント | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-005]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-DEV-CODE-001]] | コーディング規約 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-DEV-REV-001]] | レビュー規約 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-INF-CF-001]] | CloudFront詳細設計 | [[UT-CASE-015]] | [[UT-PLAN-003]] | PASS |
| [[DD-INF-CF-002]] | CloudFront Function詳細（rewrite） | [[UT-CASE-015]] | [[UT-COV-001]], [[UT-IAC-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-002]], [[UT-PLAN-003]], [[UT-PLAN-004]], [[UT-PLAN-005]], [[UT-POL-001]], [[UT-RPT-001]], [[UT-SEC-001]], [[UT-STAT-001]], [[UT-TDAT-001]] | PASS |
| [[DD-INF-CFG-001]] | AWS Config詳細（required-tags） | [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]], [[UT-CASE-015]] | [[UT-POL-001]], [[UT-SEC-001]] | PASS |
| [[DD-INF-COG-001]] | Cognito詳細設計 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-015]] | [[UT-COV-001]], [[UT-IAC-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-002]], [[UT-PLAN-003]], [[UT-PLAN-004]], [[UT-PLAN-005]], [[UT-POL-001]], [[UT-RPT-001]], [[UT-SEC-001]], [[UT-STAT-001]], [[UT-TDAT-001]] | PASS |
| [[DD-INF-DB-001]] | DBインフラ詳細設計 | [[UT-CASE-001]], [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-011]], [[UT-CASE-015]] | [[UT-PLAN-001]] | PASS |
| [[DD-INF-DEP-001]] | デプロイ詳細 | [[UT-CASE-015]] | [[UT-PLAN-003]] | PASS |
| [[DD-INF-DEP-002]] | CloudFrontパス分岐詳細（デプロイ適用条件） | [[UT-CASE-015]] | [[UT-PLAN-003]] | PASS |
| [[DD-INF-DEP-003]] | インフラデプロイ詳細（領域分割） | [[UT-CASE-001]], [[UT-CASE-015]] | [[UT-COV-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-003]], [[UT-PLAN-005]], [[UT-POL-001]], [[UT-RPT-001]], [[UT-SEC-001]], [[UT-STAT-001]], [[UT-TDAT-001]] | PASS |
| [[DD-INF-IAC-001]] | インフラCI/CD詳細 | [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-015]] | [[UT-IAC-001]], [[UT-POL-001]] | PASS |
| [[DD-INF-IAC-002]] | IaCモジュール設計 | [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-015]] | [[UT-IAC-001]], [[UT-POL-001]] | PASS |
| [[DD-INF-IAC-003]] | IaC状態管理とドリフト検知 | [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-IAC-001]], [[UT-POL-001]] | PASS |
| [[DD-INF-LMB-001]] | Lambda詳細設計 | [[UT-CASE-015]] | [[UT-IAC-001]], [[UT-POL-001]], [[UT-SEC-001]] | PASS |
| [[DD-INF-MON-001]] | インフラ監視詳細設計 | [[UT-CASE-003]], [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-015]] | [[UT-IAC-001]], [[UT-POL-001]] | PASS |
| [[DD-INF-MON-002]] | インフラ監視ログ詳細 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-015]], [[UT-CASE-016]] | [[UT-COV-001]], [[UT-IAC-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-002]], [[UT-PLAN-003]], [[UT-PLAN-004]], [[UT-PLAN-005]], [[UT-POL-001]], [[UT-RPT-001]], [[UT-SEC-001]], [[UT-STAT-001]], [[UT-TDAT-001]] | PASS |
| [[DD-INF-NET-001]] | ネットワーク詳細設計 | [[UT-CASE-015]] | [[UT-IAC-001]], [[UT-POL-001]], [[UT-SEC-001]] | PASS |
| [[DD-INF-OVR-001]] | インフラ詳細設計総論 | [[UT-CASE-015]] | [[UT-PLAN-003]] | PASS |
| [[DD-INF-S3-001]] | S3詳細設計 | [[UT-CASE-015]] | [[UT-PLAN-003]] | PASS |
| [[DD-INF-SEC-001]] | DR復旧手順詳細 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-015]], [[UT-CASE-016]] | [[UT-COV-001]], [[UT-IAC-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-002]], [[UT-PLAN-003]], [[UT-PLAN-004]], [[UT-PLAN-005]], [[UT-POL-001]], [[UT-RPT-001]], [[UT-SEC-001]], [[UT-STAT-001]], [[UT-TDAT-001]] | PASS |
| [[DD-INF-SEC-002]] | IAM詳細設計 | [[UT-CASE-015]] | [[UT-POL-001]], [[UT-SEC-001]] | PASS |
| [[DD-INF-SEC-003]] | インフラセキュリティ統制詳細 | [[UT-CASE-001]], [[UT-CASE-003]], [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-015]] | [[UT-PLAN-001]], [[UT-SEC-001]] | PASS |
| [[DD-SYS-AV-001]] | 可用性詳細 | [[UT-CASE-001]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
| [[DD-SYS-AV-002]] | インフラ可用性詳細 | [[UT-CASE-007]], [[UT-CASE-009]] | [[UT-COV-001]], [[UT-IAC-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-002]], [[UT-PLAN-003]], [[UT-PLAN-004]], [[UT-PLAN-005]], [[UT-POL-001]], [[UT-RPT-001]], [[UT-SEC-001]], [[UT-STAT-001]], [[UT-TDAT-001]] | PASS |
| [[DD-SYS-COST-001]] | コスト運用詳細 | [[UT-CASE-004]], [[UT-CASE-006]], [[UT-CASE-011]] | [[UT-PLAN-001]], [[UT-PLAN-005]], [[UT-SEC-001]] | PASS |
| [[DD-SYS-PERF-001]] | 性能設計 | [[UT-CASE-001]], [[UT-CASE-003]], [[UT-CASE-007]], [[UT-CASE-009]], [[UT-CASE-012]], [[UT-CASE-013]] | [[UT-PLAN-001]] | PASS |
| [[DD-SYS-SCALE-001]] | 拡張性詳細 | [[UT-CASE-001]], [[UT-CASE-003]] | [[UT-PLAN-001]] | PASS |
| [[DD-SYS-SEC-001]] | セキュリティ統制詳細 | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-CASE-012]], [[UT-CASE-013]], [[UT-CASE-016]] | [[UT-PLAN-001]] | PASS |
<!-- END AUTO-GENERATED: TEST_LAYER_TRACE -->

## 変更履歴
- 2026-02-23: Issueラベル起動運用の要求追加に合わせて設計別トレーサビリティを再生成 [[RQ-RDR-050]]
- 2026-02-13: CDKオンリー運用（`cdk synth/diff/deploy`）へ更新したINF系設計の追跡を反映 [[RQ-RDR-039]]
- 2026-02-11: UT/IT/ATトレース表の経路判定（max_depth=4）自動生成ブロックを追加 [[RQ-RDR-037]]
- 2026-02-11: DD-APIのFR対応を再マッピングし、[[DD-APP-API-011]]〜[[DD-APP-API-015]]を追加 [[RQ-RDR-034]]
- 2026-02-11: `task docs:trace` による設計別静的ビューの自動生成ブロックを追加 [[RQ-RDR-033]]
- 2026-02-11: 新規作成（設計別トレーサビリティビューを追加） [[RQ-RDR-033]]
