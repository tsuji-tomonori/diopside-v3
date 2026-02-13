# 影響確認レポート

- 日付: 2026-02-13
- 対象: 2026-02-12〜2026-02-13に実施した要求/設計/テスト文書の補完、および分析レポート更新
- 判定: 変更履歴リンク規約と影響確認フローに沿って追記・補正を実施（バッチ/波形/ワードクラウド仕様補完を含む）

## 実施内容
- 要求/設計の具体化: `RQ-GL-015`, `RQ-UC-002`, `BD-ARCH-001`, `DD-AV-001`, `DD-COST-001`
- 新規文書追加: `BD-DEP-006`, `DD-ARCH-002`, `UT-CASE-009`〜`UT-CASE-013`, `IT-CASE-009`〜`IT-CASE-013`, `AT-SCN-008`, `AT-SCN-009`
- 分析レポート更新: `reports/docs-analysis-report.md`, `reports/docs-analysis-report.html`
- 運用補正: `BD-ARCH-001` の変更履歴へADRリンクを補記（`[[BD-ADR-021]]`）
- 追加実施（2026-02-13）:
  - 要求決定記録/設計決定記録の追加: `RQ-RDR-038`, `BD-ADR-027`
  - 要求修正: `RQ-DG-001`, `RQ-FR-020`, `RQ-FR-022`, `RQ-FR-023`, `RQ-RTM-001`
  - 設計修正: `BD-ARCH-001`, `BD-DATA-001`, `BD-API-001`, `BD-API-002`, `BD-API-005`, `BD-MON-001`, `DD-API-002`, `DD-API-014`, `DD-LOG-001`
  - テスト/DDL補完: `AT-SCN-003`, `IT-CASE-009`, `IT-CASE-010`, `IT-CASE-011`, `DD-DDL-003`〜`DD-DDL-014`
  - 実行タスク化: `reports/tasks_docs_fix_2026-02-13.md`
  - インフラ文書体系追加（2026-02-13 追補）:
    - RQ/BD決定記録: `RQ-RDR-039`, `BD-ADR-028`
    - BD-INF: `BD-INF-001`〜`BD-INF-007`
    - DD-INF: `DD-IAC-001`, `DD-IAC-002`, `DD-NET-001`, `DD-IAM-001`, `DD-OBS-001`, `DD-DR-001`, `DD-CICD-INF-001`
    - UT/IT/AT-INF: `UT-IAC-001`, `UT-POL-001`, `UT-SEC-001`, `IT-INF-ENV-001`, `IT-INF-SMK-001`, `IT-INF-NET-001`, `IT-INF-OBS-001`, `IT-INF-ROLL-001`, `AT-OPS-INF-001`, `AT-DR-001`, `AT-SLO-001`
    - 既存文書接続: `BD-ENV-001`, `BD-ENV-002`, `BD-CM-001`, `BD-TST-001`, `BD-DEP-001`, `RQ-RTM-001`
  - AWSサービス一覧の明確化（2026-02-13 追補）:
    - 基本設計へ管理対象サービス表を追加: `BD-INF-001`
    - 配備設計の一覧粒度をサービス単位へ統一: `BD-DEP-005`
    - 設計決定記録へ一覧正本管理ルールを追記: `BD-ADR-028`
  - 追加実施（2026-02-13: INF設計具体化）:
    - 正本境界整理: `BD-INF-001`, `BD-INF-007`, `BD-DEP-005`
    - DD具体化: `DD-NET-001`, `DD-IAM-001`, `DD-OBS-001`, `DD-DR-001`, `DD-IAC-002`, `DD-CICD-INF-001`
    - UT/IT/AT具体化: `UT-IAC-001`, `UT-POL-001`, `UT-SEC-001`, `IT-INF-ENV-001`, `IT-INF-NET-001`, `IT-INF-OBS-001`, `IT-INF-ROLL-001`, `IT-INF-SMK-001`, `AT-OPS-INF-001`, `AT-DR-001`, `AT-SLO-001`
    - 追跡更新: `RQ-RTM-001`, `RQ-RTM-002`
  - 追加実施（2026-02-13: a11y/UI/UX非機能設計レビュー対応）:
    - DD具体化: `DD-UI-003`, `DD-UI-004`, `DD-UI-005`
    - AT具体化: `AT-SCN-001`, `AT-SCN-002`
    - CIゲート具体化: `BD-BUILD-001`
    - 追跡更新: `RQ-RTM-001`
  - 追加実施（2026-02-13: API語彙統一・DB正本整合）:
    - API設計整合: `BD-API-002` の実行入力を `trigger_mode` + `run_kind` へ分離し、状態語彙へ `cancelled` を追加
    - デプロイ整合: `BD-DEP-006` をDB正本前提へ更新し、DBバックアップ（スナップショット/PITR）を追加
  - 追加実施（2026-02-13: `.opencode` スキル同期）:
    - 追加スキル: `doc-bd-inf`, `doc-dd-arch`, `doc-dd-cicd-inf`, `doc-dd-dr`, `doc-dd-iac`, `doc-dd-iam`, `doc-dd-net`, `doc-dd-obs`
    - マップ更新: `.opencode/skills/obsidian-doc-new/assets/doc_path_map.yaml` に `BD-INF` / `DD-ARCH` / `DD-CICD-INF` / `DD-DR` / `DD-IAC` / `DD-IAM` / `DD-NET` / `DD-OBS` を追加
    - オーケストレーター追従: `.opencode/skills/docops-orchestrator/SKILL.md`, `.opencode/agents/docops-orchestrator.md`
  - 追加実施（2026-02-13: テスト計画/判定追随・RTM直接リンク補強）:
    - テスト計画追随: `UT-PLAN-005`, `IT-PLAN-001`, `AT-PLAN-001`
    - 判定/報告追随: `AT-GO-001`, `AT-RPT-001`
    - 要求直接検証リンク補強: `RQ-FR-006`, `RQ-FR-007`, `RQ-FR-008`, `RQ-FR-010`, `RQ-FR-011`, `RQ-FR-012`, `RQ-FR-013`, `RQ-FR-014`, `RQ-FR-016`, `RQ-FR-017`, `RQ-DEV-002`
    - 設計根拠要件補強: `DD-ARCH-002`, `DD-AV-002`, `DD-IAC-001`, `DD-LOG-002`, `DD-SEC-002`
    - 追跡再生成: `RQ-RTM-001`, `RQ-RTM-002`

## 影響確認
- 要求整合: 段階ロード中の操作制限、[[RQ-GL-015|盛り上がり区間]]判定条件、例外時挙動が要求本文で判定可能な粒度に具体化された。
- 設計整合: バッチ責務（BAT-006/007）と運用制約、可用性判定（MTTR/外部障害分類）、コスト超過検知がBD/DD間で追跡可能。
- テスト整合: DD-API-011〜015に対応するUT、主要運用導線をカバーするIT/ATシナリオが追加され、`RQ -> BD/DD -> UT/IT/AT` の経路を補強。
- 規約整合: BD文書の変更履歴行にADRリンクを付与する規約を満たす状態へ補正。
- 要求整合（追加）: 波形表示要求（`RQ-FR-020`）と生成要求（`RQ-FR-022/023`）の主従関係、入力列（`meta_type/message_text`）、検出パターン（`草|w|くさ|kusa`）を明文化した。
- 設計整合（追加）: BAT-006の入力スキーマ・同時実行制御・片系失敗時挙動、LLMフォールバック、YouTubeクォータ制御、docs公開ロールバック状態遷移をBD/DDで同期した。
- 追跡整合（追加）: `RQ-RTM-001` と `IT-CASE-009/010/011` の直接リンクを補強し、`DD-API-011〜015` へのIT層トレースを明示した。
- 追跡整合（INF追加）: インフラ文書群を `RQ-DEV-001`/`RQ-SEC-001`/`RQ-OBY-001` 系要求から辿れる構造へ接続した。
- タスク消化（INF追加）: `reports/tasks_docs_fix_2026-02-13.md` のP0タスク（18〜23）を完了状態へ更新した。
- 設計整合（AWS一覧追補）: `BD-INF-001` と `BD-DEP-005` の両方で、管理対象AWSサービスの個数・構築理由・導入段階を同一粒度で参照可能にした。
- 設計具体化（INF追補）: インフラ実装判断に必要な実装値（CIDR/TLS/IAM境界/SLO閾値/DR判定）をDDへ反映し、UT/IT/ATの判定基準を数値化した。
- 追跡整合（INF追補）: DD-INF文書に要求リンク（`RQ-DEV-001`, `RQ-SEC-001`, `RQ-OBY-001`, `RQ-AV-001`）を追加し、RTM再生成で設計トレースを補強した。
- 要求-設計整合（a11y追補）: UI詳細にフォーカス管理（初期/循環/復帰/非遮蔽）とフォーム属性要件（`aria-invalid`/`aria-describedby`/`aria-live`）を追加し、`RQ-UX-006/007/012/017/019` との対応を明確化した。
- 検証整合（a11y追補）: `AT-SCN-001/002` にキーボード・SR・320px/400%ズーム・言語指定・状態通知の受入観点を追加し、`RQ-UX-021` のCIゲート要件を `BD-BUILD-001` へ接続した。
- 設計整合（2026-02-13追補）: 収集起動契約の語彙衝突（`mode` の多義）を `trigger_mode` と `run_kind` の分離で解消し、run状態語彙を `queued/running/succeeded/failed/partial/cancelled` へ統一した。
- デプロイ整合（2026-02-13追補）: バックアップ設計を「ファイルベース前提」からDB正本前提へ改訂し、復旧導線へDB PITRを追加した。
- スキル整合（2026-02-13追補）: 設計書に実在する `BD-INF` / `DD-ARCH` / `DD-CICD-INF` / `DD-DR` / `DD-IAC` / `DD-IAM` / `DD-NET` / `DD-OBS` のスキル・生成マップ未定義を解消し、`.opencode` と `docs` のID体系を一致させた。
- テスト・判定整合（2026-02-13追補）: UT/IT/AT計画・判定文書の対象範囲を `DD-API-015` / `AT-SCN-009` まで拡張し、Go/No-Go入力の範囲不一致を解消した。
- 追跡整合（2026-02-13追補）: 要求文書へ直接検証リンクを追加し、RTM要求別ビューの検証欠落を縮小した。

## 検証
- `task docs:guard` を実行し、文書整合チェックを実施。
- `task docs:trace` を実行し、RTM静的ビューを再生成。
- `task docs:check` を実行し、Vault全体で `broken_links: 0` を確認。
- `task docs:guard` 再実行で対象変更文書（`BD-API-002`, `BD-DEP-006`）の整合を確認（issues/broken links ともに 0）。
