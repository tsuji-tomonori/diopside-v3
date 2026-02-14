# 影響確認レポート

- 日付: 2026-02-14
- 対象: 環境定義を `dev/prod` へ再統一する文書改訂
- 判定: 要求/設計/試験の環境語彙を2環境前提へ整合

## 実施内容
- 要求更新: `RQ-COST-001`, `RQ-RDR-027`
- 基本設計更新: `BD-INF-ENV-001`
- 詳細設計更新: `DD-INF-NET-001`, `DD-SYS-COST-001`
- 単体テスト更新: `UT-IAC-001`, `UT-SEC-001`

## 影響確認
- 要求整合: `Environment` 列挙値を `Production` / `Development` へ更新し、運用環境方針と一致。
- 設計整合: 環境分割方針を `dev/prod` に統一し、ネットワーク実装値と昇格ルールを2環境へ再定義。
- テスト整合: IaC静的検証/セキュリティスキャンの対象環境を `dev/prod` に統一。

## 検証
- `task docs:guard` を実行し、対象7文書で `issues: 0` / `broken_links: 0` を確認。

## 実施内容（追加）
- 対象: UI詳細設計の画面/画面コンポーネント文書の全件整備と設計横断リンク化
- 詳細設計追加: `DD-APP-UI-007`〜`DD-APP-UI-018`
- 詳細設計更新: `DD-APP-UI-001`〜`DD-APP-UI-006`, `DD-APP-MOD-001`, `DD-APP-MOD-003`, `DD-APP-MOD-002`, `DD-APP-ALG-001`, `DD-APP-API-009`, `DD-APP-API-013`, `DD-APP-API-015`
- 基本設計更新: `BD-APP-UI-001`〜`BD-APP-UI-004`

## 影響確認（追加）
- 画面整合: `UI-U01`〜`UI-U03` と `UI-A01`〜`UI-A06` を各DD-UIへ1対1で対応付けた。
- コンポーネント整合: `SearchConditionPanel` / `ArchiveList` / `ArchiveDetailModal` / `HighlightWavePanel` / `WordCloudPanel` / `RunStatusScreen` を個別DD-UIとして追加した。
- 設計横断リンク: BD/UI, DD/UI, DD/COMP, DD/API, DD/ALGで画面ID・画面コンポーネント名を `[[DD-UI-*]]` へリンク化した。

## 実施内容（追加2）
- 対象: BD/DD文書体系を「領域(全体/アプリ/インフラ/開発) -> トピック」へ再編し、IDを `BD-{領域}-{トピック}-{連番}` / `DD-{領域}-{トピック}-{連番}` へ全面移行。
- 事前成果物: `reports/id_migration_map_2026-02-14.csv` に旧ID/旧Pathと新ID/新Pathの対応表を作成してから移行を実施。
- 基本設計移行: `BD-ARCH-*`, `BD-ADR-*`, `BD-API-*`, `BD-UI-*`, `BD-INF-*` 等を `BD-SYS-*` / `BD-APP-*` / `BD-INF-*` / `BD-DEV-*` へ改名・再配置。
- 詳細設計移行: `DD-API-*`, `DD-UI-*`, `DD-DDL-*`, `DD-IAC-*` 等を `DD-APP-*` / `DD-INF-*` / `DD-SYS-*` / `DD-DEV-*` へ改名・再配置。
- 運用更新: `doc_path_map.yaml` のBD/DD prefixを新体系へ更新。

## 影響確認（追加2）
- リンク整合: docs配下の `[[ID]]` と本文中のID参照を全面置換し、旧BD/DD IDの残存を解消。
- 規約整合: `index.md` は `docs/index.md` のみを維持し、`filename == id` を全件で満たす。
- トレーサビリティ: `up/related` のリンク切れ・逆参照不整合が発生していないことを確認。

## 検証（追加2）
- `task docs:guard` 実行。
- `task docs:check` 実行（`issues: 0`, `broken_links: 0`, `nonlinked_doc_ids: 0`）。

## 実施内容（追加3）
- 対象: 基本設計のセキュリティ章重複（SYS/INF）を `INF/51.セキュリティ(SEC)` へ統合。
- 基本設計更新: `BD-INF-SEC-001`（統合先として拡張）, `BD-SYS-SEC-001`（廃止・参照互換のみ保持）。

## 影響確認（追加3）
- 正本統合: 基本設計のセキュリティ正本を `[[BD-INF-SEC-001]]` に一本化。
- 参照互換: `[[BD-SYS-SEC-001]]` は `status: 廃止` として残し、既存リンク切れを回避。
- 階層方針: 新規階層は追加せず、既存の `03.インフラ(INF)/51.セキュリティ(SEC)` へ寄せて整理。

## 実施内容（追加4）
- 対象: DDD全量対応（2026-02-14）の追跡性補完。
- 要求決定記録追加: `RQ-RDR-040`（DOM層導入理由、BC境界定義理由、用語統一 `ingestion_run` 判断根拠、集約ルート明記の判断根拠を記録）。
- 変更ファイル:
  - `docs/1.要求(RQ)/41.要求決定記録(RDR)/RQ-RDR-040.md`
  - `reports/impact_check_2026-02-14.md`
- 関連文書リンク対象: `DOM-SUB-001`, `DOM-CTX-001`, `DOM-BC-001`〜`DOM-BC-006`, `RQ-GL-002`, `RQ-DM-001`〜`RQ-DM-009`, `BD-SYS-ARCH-001`, `BD-SYS-ADR-029`。

## 影響確認（追加4）
- RQ: 要求側の意思決定根拠を `RQ-RDR-040` に集約し、S1〜S5/T1/T2 の判断経路を追跡可能化。
- BD: `BD-SYS-ARCH-001` と `BD-SYS-ADR-029` を関連リンクとして固定し、要求起点の設計追跡を補完。
- DD: 直接改訂なし（今回の影響は参照整合のみ）。
- UT: 直接改訂なし（将来の集約境界検証項目の参照元を整理）。
- IT: 直接改訂なし（将来の境界契約検証観点の参照元を整理）。
- AT: 直接改訂なし（受入時の判断根拠リンクを要求側で補強）。

## 未対応項目（追加4時点）
- Worker 1〜4 成果の統合後に、`RQ-RDR-040` の関連リンク実体（新規DOM/ADR）の最終確認が必要。
- S6/S7 以降（FR/UCメタデータ展開、バリデータ拡張）に伴う追記が必要になった場合は、同日impact追記で更新する。

## 検証（追加4）
- `task docs:guard`: Integrator 実行欄（未実行）。
- `task docs:check`: Integrator 判断で実行（未実行）。

## 実施内容（追加5）
- 対象: 用語 `RQ-GL-002` の正本語彙を「[[RQ-GL-002|収集実行]]」へ統一し、`docs` 全体の旧称「収集ジョブ」を置換。
- 主要更新:
  - 要求: `RQ-GL-011`, `RQ-UC-001`, `RQ-FR-001`, `RQ-OBY-001`, `RQ-RTM-001`, `RQ-RTM-002`
  - 基本設計: `BD-SYS-ARCH-001`, `BD-APP-API-001`, `BD-APP-API-002`, `BD-APP-UI-001`
  - 詳細設計: `DD-SYS-SCALE-001`, `DD-APP-API-001`, `DD-APP-API-002`, `DD-APP-API-003`, `DD-APP-UI-007`, `DD-APP-LOG-001`
  - テスト文書: `UT-PLAN-005`, `UT-CASE-001`, `UT-CASE-002`, `IT-PLAN-001`, `IT-CASE-001`, `IT-CASE-002`, `IT-CASE-009`, `AT-SCN-004`, `AT-SCN-005`, `AT-SCN-008`
  - ドメイン: `DOM-BC-001`

## 影響確認（追加5）
- 用語整合: 運用/設計/試験で `[[RQ-GL-002|収集実行]]` を一貫使用し、`収集ジョブ` は互換説明（`RQ-GL-002` 本文）に限定。
- [[RQ-GL-011|再収集]]整合: `RQ-GL-011` 定義を「[[RQ-GL-011|再収集]]は `[[RQ-GL-002|収集実行]]` の再実行」として更新。
- 契約整合: API/UI/RTM の名称を「[[RQ-GL-002|収集実行]]起動API」「[[RQ-GL-002|収集実行]]状態API」へ統一し、要求-設計-試験の追跡語彙を一致化。

## 検証（追加5）
- `rg -n "収集ジョブ|ingestion_job" docs` を実行し、旧称は `RQ-GL-002`（旧称明記）と `RQ-RDR-040`（不一致理由の記録）に限定されることを確認。
- `task docs:guard` を実行し、`issues: 0` / `broken_links: 0` / `backlink_issues: 0` を確認。

## 実施内容（追加6）
- 対象: RQ-UC/RQ-FRの記述主体を「システム」から「アクターがやりたいこと」へ統一。
- 要求決定記録追加: `RQ-RDR-041`（UC/FRの主体表現統一ルールを決定）。
- ユースケース更新: `RQ-UC-001`, `RQ-UC-007`, `RQ-UC-008`, `RQ-UC-009`。
- 機能要求更新: `RQ-FR-001`, `RQ-FR-005`, `RQ-FR-017`, `RQ-FR-018`, `RQ-FR-019`。
- スキル更新: `.opencode/skills/doc-rq-uc/SKILL.md`, `.opencode/skills/doc-rq-uc/TEMPLATE.md`, `.opencode/skills/doc-rq-fr/SKILL.md`, `.opencode/skills/obsidian-doc-new/assets/snowcard_ja.md`, `.opencode/skills/skill-maintainer/SKILL.md`, `.opencode/skills/docops-orchestrator/SKILL.md`。

## 影響確認（追加6）
- 要求整合: 管理者系UC/FRで `システムは` / `本システムは` を要求主体から排除し、アクター目的主体へ統一。
- 追跡整合: 対象UC/FRの `related` と `変更履歴` に `[[RQ-RDR-041]]` を追加し、決定根拠を同一変更で追跡可能化。
- 運用整合: skill群へ同規約を同期し、以後の文書更新で同一方針を再利用可能化。

## 検証（追加6）
- `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py` を対象9文書へ実行。
- `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md --targets ...` を対象10文書へ実行。
- `task docs:guard` を実行し、整合チェックを確認。

## 実施内容（追加7）
- 対象: `BD-SYS-ARCH-006`（インフラ境界アーキテクチャ）を廃止ではなく完全削除し、内容を `BD-SYS-ARCH-003`（クラウド配置構成）へ統合。
- 基本設計更新: `BD-SYS-ARCH-003` に配信/運用/監視境界、障害時の基本動作、関連要求/設計リンクを統合。
- 基本設計削除: `BD-SYS-ARCH-006`。
- 参照更新: `RQ-RTM-001`, `BD-INF-DEP-005`, `BD-INF-PLAT-001` の `[[BD-SYS-ARCH-006]]` を `[[BD-SYS-ARCH-003]]` へ置換。

## 影響確認（追加7）
- 設計重複解消: クラウド配置トポロジと境界運用の記述先を `BD-SYS-ARCH-003` に一本化。
- トレーサビリティ維持: `BD-SYS-ARCH-003` の `up/related` を拡張し、`RQ-DEV-001`/`RQ-OBY-001`/`RQ-SEC-001` と `BD-SYS-ADR-022` などの追跡経路を維持。
- 参照整合: インフラ系設計とRTMからの削除ID参照を解消し、リンク切れリスクを抑止。

## 検証（追加7）
- `task docs:guard` 実行でリンク/frontmatter整合を確認。
- `task docs:trace` 実行で `RQ-RTM-002` の設計別ビューとテスト層トレースを再生成。
- `task docs:check` 実行で全体整合（`issues`, `broken_links`, `nonlinked_doc_ids`）を再確認。

## 実施内容（追加7）
- 対象: RQ層（SC/GL/UC/FR/NFR/RDR）の記述から具体ファイル名を除外し、用語・契約概念中心へ統一。
- 要求決定記録追加: `RQ-RDR-042`（要求文書で具体ファイル名を正本表現にしない方針を決定）。
- 要求更新:
  - SC: `RQ-SC-001`
  - GL: `RQ-GL-005`, `RQ-GL-006`, `RQ-GL-007`, `RQ-GL-008`, `RQ-GL-009`
  - UC: `RQ-UC-002`, `RQ-UC-009`
  - FR: `RQ-FR-005`, `RQ-FR-009`, `RQ-FR-019`, `RQ-FR-025`
  - NFR: `RQ-PS-001`, `RQ-INT-001`, `RQ-DEV-001`
  - RDR: `RQ-RDR-026`, `RQ-RDR-034`, `RQ-RDR-036`, `RQ-RDR-040`

## 影響確認（追加7）
- 要求整合: `bootstrap/tag_master/archive_index` は `[[RQ-GL-*]]` 用語リンクで表現し、具体ファイル名依存を除去。
- 境界整合: OpenAPI・契約スキーマは要求側で公開経路/契約群レベルに留め、実体定義はBD/DD側へ責務分離。
- 追跡整合: 変更対象の `## 変更履歴` に `[[RQ-RDR-042]]` を追加し、方針決定との同一変更追跡を確保。

## 検証（追加7）
- `rg -n "\\.json" docs/1.要求\(RQ\)` を実行し、RQ配下に具体JSONファイル名の記述が残存しないことを確認。
- `task docs:guard` を実行し、整合チェックを確認。

## 実施内容（追加8）
- 対象: バッチ仕様正本を `BD-SYS-ARCH-001` から `BD-APP-API-002` へ移管。
- 基本設計更新:
  - `BD-APP-API-002`: バッチ一覧/バッチイベント一覧/バッチ実行制約/BAT-006入出力契約/同時実行制御を正本として統合。
  - `BD-SYS-ARCH-001`: バッチ仕様詳細を削除し、システム境界の説明と正本参照へ整理。
  - `BD-APP-API-001`: API一覧正本ルールにバッチ仕様正本参照を追加。
- 設計判断更新:
  - `BD-SYS-ADR-027`: 正本参照先を `BD-APP-API-002` へ変更し、影響欄を更新。
- 要求運用更新:
  - `RQ-DG-001`: バッチ仕様変更時の同時更新ゲートを `BD-APP-API-002` + `DD-APP-API-*` へ更新。

## 影響確認（追加8）
- 正本一意性: バッチ仕様の詳細定義をAPP/API文書へ集約し、システム文書との二重正本を解消。
- 追跡整合: ADR（`BD-SYS-ADR-027`）と運用ゲート（`RQ-DG-001`）の参照先を新正本へ統一。
- 境界整合: `BD-SYS-ARCH-001` はアーキテクチャ境界（実行境界/配置方針）に責務を限定。

## 検証（追加8）
- `task docs:guard` を実行し、リンク・frontmatter・相互参照整合を確認する。
- 必要に応じて `task docs:check` を実行し、全体整合（`issues`, `broken_links`, `nonlinked_doc_ids`）を確認する。

## 実施内容（追加9）
- 対象: `BD-APP-DATA-003` の保持・削除方針を「DB正本のみ」へ責務限定。
- 基本設計更新:
  - `BD-APP-DATA-003`: 保持対象/保持期間/削除条件/例外時の扱い/監査可能性を再設計。
  - `BD-SYS-ADR-030`: DB限定方針と削除/非公開動画の無期限保持（トゥームストーン管理）を新規決定。
- 追跡更新: `RQ-RTM-002` の設計別ビューで `BD-APP-DATA-003` の根拠要件を再計算。

## 影響確認（追加9）
- 境界整合: データ保持方針の責務をDB正本に限定し、非DB（CloudWatch/S3/バックアップ）の保持決定をインフラ文書へ委譲。
- 要求整合: `RQ-DATA-001` / `RQ-PRC-001` のデータ品質・PII非保持要件と、`RQ-OBY-001` のログ保持要件を責務分離したまま両立。
- 設計整合: `BD-APP-DATA-001`（DB正本境界）、`BD-INF-DEP-006`（バックアップ）、`DD-APP-LOG-001`（ログ保持）への参照経路を明確化。

## 検証（追加9）
- `task docs:guard` を実行してリンク/Frontmatter/追跡整合を確認。
- `task docs:trace` を実行して `RQ-RTM-002` の設計別ビューを再生成。
- 必要に応じて `task docs:check` を実行し、全体整合を再確認。

## 実施内容（追加10）
- 対象: `reports/docs-review-2026-02-14.html` の全量修正（残課題中心）。
- 要求決定記録追加: `RQ-RDR-043`（用語統制と更新フロー工程分割を同時適用）。
- 設計判断追加: `BD-SYS-ADR-031`（配備モード・責務6分類・IAM粒度マトリクス・DD正本統合）。
- 要求更新: `RQ-DG-001`, `RQ-GL-008`。
- 基本設計更新: `BD-INF-DEP-005`, `BD-INF-DEP-001`, `BD-INF-DEP-002`, `BD-INF-PLAT-001`, `BD-SYS-QUAL-001`, `BD-APP-API-002`, `BD-SYS-ARCH-001`。
- 詳細設計更新: `DD-INF-SEC-003`, `DD-APP-API-001`, `DD-APP-ERR-001`, `DD-SYS-SEC-001`。

## 影響確認（追加10）
- 更新フロー: `RQ-DG-001` を RQ/BD/DD/UT/IT/AT の工程別に再編し、同一変更ゲート（RDR/ADR/RTM/テスト追従）を明示。
- 用語統制: `[[RQ-GL-008|tag_master]]（タグマネージャー）` を正本表記に固定し、`TagMaster`/`タグマスター` を廃止語へ移行。
- DEP再編: `BD-INF-DEP-005` に配備モード（通常/初回/緊急）と配備責務6分類（BE/FE/Infra/DB/Doc/TestAsset）を追加。
- 階層整理: `BD-INF-DEP-001` / `BD-INF-DEP-002` は `BD-INF-DEP-005` へ統合し、廃止（参照互換保持）。
- IAM粒度: `DD-INF-SEC-003` に `環境(dev/prod) x 責務(deploy/ops/audit)` マトリクスを追加。
- DD正本整理: エラー契約正本を `DD-APP-API-001` に統合し `DD-APP-ERR-001` を廃止、セキュリティ正本を `DD-INF-SEC-003` に統合し `DD-SYS-SEC-001` を廃止。

## 検証（追加10）
- `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス...>` を実行する。
- `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md --targets <対象Markdownパス...>` を実行する。
- `task docs:guard` を実行して `issues` / `broken_links` / `backlink_issues` を確認する。
- `task docs:trace` を実行して `RQ-RTM-001` / `RQ-RTM-002` を再生成する。
