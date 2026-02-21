# 影響確認レポート

- 日付: 2026-02-11
- 対象: 当日実施した要求/設計/テスト文書の累積追記（本文各セクション参照）
- 判定: 各追記セクションの変更対象について、整合判定と影響範囲を記録。

## 実施内容
- `RQ-AV-001`〜`RQ-DATA-001` の SnowCard を個別化し、受入基準へ測定可能な閾値を追加。
- 各NFRの `related` を設計/運用文書に合わせて見直し、一律参照を解消。
- 意味変更の決定記録として `RQ-RDR-017` を新規追加。

## 影響確認
- 要求整合: [[RQ-SC-001]] のMVP完了条件（NFR受入確認）に対して、判定可能な閾値が定義された。
- 設計整合: [[BD-SYS-QUAL-001]] / [[BD-SYS-SEC-001]] / [[DD-SYS-AV-001]] / [[DD-SYS-PERF-001]] / [[DD-APP-LOG-001]] / [[DD-SYS-COST-001]] へのトレースを付与。
- 受入整合: [[AT-PLAN-001]] / [[AT-RPT-001]] / [[AT-GO-001]] で閾値判定結果を記録できる構成を維持。

## 検証
- `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し、リンク/整合性に問題がないことを確認。

## 追記（収集要件の表現具体化）
- 対象: `RQ-FR-002`, `RQ-FR-003`
- 実施: 「収集できる」を、判定条件（公式チャンネルID一致/出演判定条件）と対象状態（公開動画）を明示した要件文へ更新。
- 反映: 両文書の `version` を `1.0.4` へ更新。
- 判定: 収集可否の判断条件が本文で一意に読める記述となり、レビュー時の解釈差分を低減。

## 追記（WCAG 2.2 AA相当UX要求の追加）
- 対象: `RQ-UX-001`〜`RQ-UX-024`, `RQ-RDR-018`
- 実施:
  - UX詳細要求を `RQ-UX-002`〜`RQ-UX-024` として新規追加（1トピック1ファイル）。
  - `RQ-UX-001` を総則として位置づけ、詳細要求への参照リンクを追加。
  - 要求追加の決定記録として `RQ-RDR-018` を新規作成。
- 影響確認:
  - 要求整合: WCAG観点（代替テキスト、入力支援、認証、言語指定、CI/CDゲート等）を要求レベルで網羅。
  - 設計/受入整合: `BD-APP-UI-002` / `BD-SYS-SEC-001` / `BD-DEV-PIPE-001` / `AT-SCN-002` へのトレースを付与。

## 追記（詳細画面[[RQ-GL-017|ワードクラウド]]要求の追加）
- 対象: `RQ-FR-021`, `RQ-RDR-021`, `RQ-UC-006`, `RQ-SC-001`, `RQ-PC-003`, `RQ-PRC-001`, `RQ-FR-013`
- 実施:
  - 詳細画面で公開チャット由来の集計結果から生成された[[RQ-GL-017|ワードクラウド]]を表示する機能要求 `RQ-FR-021` を新規追加。
  - 採用判断を `RQ-RDR-021` に記録し、POC（`.workspace/CreateWordCloudService`）準拠の要件境界を明文化。
  - `RQ-UC-006` に[[RQ-GL-017|ワードクラウド]]確認導線と未生成時の代替フローを追記。
  - `RQ-SC-001` / `RQ-PC-003` / `RQ-PRC-001` を更新し、チャット生データ非保存を維持したまま非可逆派生物の利用を許容する境界を追加。
- 影響確認:
  - 要求整合: 詳細表示要求（`RQ-FR-013`）と[[RQ-GL-017|ワードクラウド]]要求（`RQ-FR-021`）の責務分担を維持。
  - 制約整合: 公開データ限定・プライバシー要件と矛盾しない運用条件（生データ0件、派生物のみ保持）を定義。
  - スコープ整合: DoD の Must機能要求範囲を `RQ-FR-021` まで更新。

## 追記（[[RQ-GL-017|ワードクラウド]]静的画像配信の設計反映）
- 対象: `BD-APP-API-001`, `BD-APP-UI-002`, `BD-APP-UI-004`, `BD-SYS-ADR-009`, `AT-PLAN-001`, `AT-SCN-003`
- 実施:
  - `BD-SYS-ADR-009` を新規追加し、[[RQ-GL-017|ワードクラウド]]の配信方式を「事前生成の静的画像配信」として決定。
  - `BD-APP-API-001` に `wordcloud/{videoId}.png` 契約、HTTPステータス運用、フォールバック方針を追記。
  - `BD-APP-UI-002` と `BD-APP-UI-004` に詳細モーダルの表示条件、代替表示、再試行導線、代替テキスト要件を追記。
  - `AT-PLAN-001` / `AT-SCN-003` に [[RQ-FR-021]] 受入観点（表示成功/未生成/取得失敗）を追加。
- 影響確認:
  - 設計整合: `RQ-RDR-021 -> BD-SYS-ADR-009 -> BD-API/UI` のトレース経路を構築。
  - 受入整合: `AT-SCN-003` でタイムスタンプ観点と[[RQ-GL-017|ワードクラウド]]観点を同時検証可能。
  - 運用整合: 動的APIを追加せず、静的配信前提の既存運用モデルを維持。

## 追記（詳細画面タイムスタンプ表示と該当秒遷移要求の追加）
- 対象: `RQ-FR-020`, `RQ-RDR-020`, `RQ-UC-006`, `RQ-SC-001`
- 実施:
  - 詳細画面でタイムスタンプ一覧を表示し、選択時にYouTube該当秒へ遷移する機能要求 `RQ-FR-020` を新規追加。
  - 要求追加の決定記録として `RQ-RDR-020` を新規作成。
  - 利用シナリオ整合のため `RQ-UC-006` にタイムスタンプ操作フローを反映。
  - MVP完了条件のMust範囲を `RQ-FR-020` まで拡張するため `RQ-SC-001` を更新。
- 影響確認:
  - 要求整合: `RQ-FR-013`（詳細表示）と `RQ-FR-014`（外部遷移）を跨ぐ導線を独立要求として判定可能化。
  - 受入整合: タイムスタンプ未生成時の代替表示と、`t=<秒数>` 付き遷移の双方をAT観点に追加可能な構成を維持。
  - 根拠整合: POC（`.workspace/CreateTimestamp`）で確認済みの時刻整形・秒数算出方針を要求根拠として記録。

## 追記（配信前後メタデータ再確認要求の追加）
- 対象: `RQ-FR-019`, `RQ-RDR-019`, `RQ-SC-001`
- 実施:
  - 配信前メタデータ取得と配信後再確認を自動化し、差分有無を記録する機能要求 `RQ-FR-019` を新規追加。
  - 配信結果タグ付けを自動化せず管理者手動運用とする決定記録 `RQ-RDR-019` を新規作成。
  - `RQ-SC-001` の DoD における Must機能要求範囲を `RQ-FR-019` まで更新。
- 影響確認:
  - 要求整合: 収集精度向上（配信前後差分追跡）と運用品質担保（タグ付け手動判断）の責務境界を明文化。
  - 既存要求整合: `RQ-FR-004`（正規化）、`RQ-FR-005`（[[RQ-GL-005|タグ辞書]]）、`RQ-FR-017`（実行結果確認）との重複を回避し連携関係を保持。
  - 参考実装整合: `.workspace/NotifyDeliveryScheduleApp` の定期取得・差分判定方針と矛盾しない要求粒度で記述。

## 追記（運用シナリオUCの追加）
- 対象: `RQ-UC-009`, `RQ-FR-019`, `RQ-RDR-019`
- 実施:
  - 配信前確認→配信後再確認→手動タグ付けを明示したユースケース `RQ-UC-009` を新規追加。
  - `RQ-FR-019` の `up` と依存・関連へ `RQ-UC-009` を追加し、要求から運用シナリオへのトレースを補強。
  - `RQ-RDR-019` の影響範囲へ `RQ-UC-009` を追記し、要求追加時の決定記録を同一変更で更新。
- 影響確認:
  - 要求/UC整合: 自動処理（メタデータ再確認）と手動処理（タグ付け）の責務境界がユースケース上でも一意に読める。
  - 運用整合: 再確認失敗時の [[RQ-UC-007]] への遷移導線を保持し、既存運用フローと接続できる。

## 追記（ATへの `RQ-FR-020` 受入展開）
- 対象: `AT-PLAN-001`, `AT-SCN-003`
- 実施:
  - `AT-PLAN-001` の対象範囲へタイムスタンプ表示・該当秒遷移を追加。
  - 判定基準へ [[RQ-FR-020]] の観点（表示、`t=<秒数>` 遷移、未生成時代替表示）を明示。
  - `AT-SCN-003` を「詳細表示・タイムスタンプ遷移」シナリオへ更新し、手順・期待結果・記録項目を具体化。
- 影響確認:
  - 受入整合: 要求追加 [[RQ-FR-020]] からATシナリオまでのトレースが成立。
  - 判定整合: 既存の詳細表示/外部遷移判定に、秒指定遷移と未生成時挙動の判定軸を追加。

## 追記（既存収集UCからの導線補強）
- 対象: `RQ-UC-001`
- 実施:
  - `related` に [[RQ-UC-009]] と [[RQ-FR-019]] を追加し、収集起動から配信前後再確認・手動タグ付け運用までのトレースを明示。
- 影響確認:
  - ユースケース整合: 既存の収集起動シナリオと新規運用シナリオの接続が文書上で追跡可能になった。

## 追記（詳細機能の生成責務をDATへ追加）
- 対象: `RQ-FR-022`, `RQ-FR-023`, `RQ-RDR-022`, `RQ-FR-020`, `RQ-FR-021`, `RQ-SC-001`
- 実施:
  - タイムスタンプ表示用データ生成要求 `RQ-FR-022` を DAT として新規追加。
  - [[RQ-GL-017|ワードクラウド]]表示用画像生成要求 `RQ-FR-023` を DAT として新規追加。
  - 表示要求（`RQ-FR-020` / `RQ-FR-021`）と生成要求（`RQ-FR-022` / `RQ-FR-023`）を分離する決定記録 `RQ-RDR-022` を新規作成。
  - `RQ-FR-020` / `RQ-FR-021` の `related` へ生成要求を追記し、責務境界のトレースを補強。
  - `RQ-SC-001` の対象機能と DoD 範囲を `RQ-FR-023` まで更新。
- 影響確認:
  - 要求整合: DET（表示）と DAT（生成）の責務境界が要求文書で一意に読める構成になった。
  - 受入整合: 表示不具合と生成不具合を[[RQ-GL-012|受入判定]]時に切り分け可能になった。
  - 制約整合: `RQ-PRC-001` / `RQ-PC-003` の生データ非保存方針を、生成要求側の受入基準へ反映した。

## 追記（プロジェクト名の理由・意図の明文化）
- 対象: `RQ-GL-001`, `RQ-PP-001`
- 実施:
  - `RQ-GL-001` の定義表へ、`diopside` の命名理由（石言葉「幸せへの道標」）と命名意図を追記。
  - `RQ-PP-001` に「プロジェクト名の理由と意図」節を追加し、目的文書から名称の背景を参照可能化。
- 影響確認:
  - 要求整合: スコープ/目的/用語で `diopside` の意味と価値観を一貫して説明できる。
  - 文書運用整合: 命名背景の説明が要求文書内で完結し、レビュー時の解釈差分を低減。

## 追記（UC主体のステークホルダーリンク化）
- 対象: `RQ-UC-007`
- 実施:
  - 本文中の主体「管理者」を [[RQ-SH-001|管理者]] へリンク化し、ステークホルダー定義への参照を明示。
  - frontmatter の `version` を `1.0.4` へ更新し、`updated` と変更履歴を当日更新。
- 影響確認:
  - 要求整合: UC本文からステークホルダー定義へ一意に遷移でき、主体解釈の曖昧さを低減。

## 追記（`RQ-FR-020` の意味変更: タイムスタンプ一覧 -> [[RQ-GL-016|コメント密度波形]]）
- 対象: `RQ-FR-020`, `RQ-RDR-020`, `RQ-FR-022`, `RQ-RDR-022`, `RQ-UC-006`, `RQ-SC-001`, `RQ-GL-015`, `RQ-GL-016`, `RQ-DM-008`, `RQ-DM-001`, `BD-SYS-ADR-010`, `BD-APP-API-001`, `BD-APP-UI-002`, `BD-APP-UI-004`, `AT-PLAN-001`, `AT-SCN-003`
- 実施:
  - `RQ-FR-020` を「[[RQ-GL-016|コメント密度波形]]を表示し[[RQ-GL-015|盛り上がり区間]]へ遷移する要求」へ意味変更。
  - `RQ-RDR-020` を更新し、POC（`.workspace/CreateTimestamp`）の密度抽出意図を採用理由として明文化。
  - 用語 `RQ-GL-015`（[[RQ-GL-015|盛り上がり区間]]）/ `RQ-GL-016`（[[RQ-GL-016|コメント密度波形]]）を新規追加。
  - ドメイン `RQ-DM-008`（[[RQ-GL-015|盛り上がり区間]]モデル）を新規追加し、`RQ-DM-001` へ関連追記。
  - 生成要求 `RQ-FR-022` と分離決定 `RQ-RDR-022` を波形データ前提へ更新。
  - 設計は `BD-SYS-ADR-010 -> BD-APP-API-001 -> BD-APP-UI-002/004` で、`highlights/{videoId}.json` 契約と波形UI要件へ更新。
  - 受入は `AT-PLAN-001` / `AT-SCN-003` を波形表示・区間クリック遷移観点へ更新。
- 影響確認:
  - 要求整合: 「コメント密度を測定し、高密度区間を残す」という意図が要求本文で直接読める構成になった。
  - 用語/ドメイン整合: UI語彙（波形・区間）とデータ語彙（区間境界・密度指標）が文書横断で一致。
  - 設計/受入整合: 可視化契約、操作仕様、判定観点が一貫して追跡可能。

## 追記（TypeScript型安全方針のBD反映）
- 対象: `BD-DEV-PIPE-001`, `BD-SYS-ADR-011`, `.opencode/skills/doc-bd-build/SKILL.md`, `.opencode/skills/doc-bd-build/TEMPLATE.md`
- 実施:
  - `BD-DEV-PIPE-001` を更新し、TypeScript型安全の標準設定（`strict`、`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`、`useUnknownInCatchVariables`）と受入基準を追加。
  - `BD-SYS-ADR-011` を新規作成し、型安全を `tsconfig` + lint の品質ゲートで標準化する決定を記録。
  - `doc-bd-build` スキルに、型安全方針をBD-BUILD更新時の必須観点として追加。
  - `doc-bd-build` テンプレートに、型安全章立て（tsconfig/lint/受入基準）を追加。
- 影響確認:
  - 要求整合: [[RQ-DEV-001]] の `lint/test/build` 必須化と、型安全ゲートの導入方針が整合。
  - 設計整合: [[BD-DEV-PIPE-001]] から [[DD-DEV-CODE-001]] への規約展開が可能なトレースを確保。
  - 運用整合: スキル更新により、今後のBD-BUILD更新でも同方針を継続適用できる。

## 追記（NFRと制約の整合条件明確化）
- 対象: `RQ-AV-001`, `RQ-PS-001`, `RQ-OBY-001`, `RQ-INT-001`, `RQ-DATA-001`, `RQ-UX-003`, `RQ-UX-014`, `RQ-UX-016`, `RQ-UX-020`, `RQ-UX-022`, `RQ-UX-023`, `RQ-RDR-023`
- 実施:
  - NFR整合チェックで抽出した要確認項目について、運用時間帯、計測条件、例外条件、MVP適用条件を本文へ追記。
  - `RQ-RDR-023` を新規追加し、制約（`RQ-PC-002` / `RQ-PC-004` / `RQ-PC-006`）とNFRの整合方針を決定記録化。
  - UX要件はスコープ境界に合わせ、管理者向け導線適用・将来拡張適用の条件を明確化。
- 影響確認:
  - 要求整合: 明確な矛盾を追加せず、要確認事項を判定可能条件へ変換。
  - 制約整合: 個人運用体制、APIクォータ制約、月額コスト上限を前提にした運用可能な要件へ補正。
  - 受入整合: 例外時の判定基準が定義され、ATでの再現可能性を向上。

## 追記（スキルメンテナンス方針の要求・設計反映）
- 対象: `RQ-DG-001`, `RQ-DEV-001`, `RQ-RDR-024`, `BD-INF-CM-001`, `BD-SYS-ADR-012`, `.opencode/skills/skill-maintainer/SKILL.md`, `.opencode/skills/docops-orchestrator/SKILL.md`, `.opencode/skills/doc-rq-dg/SKILL.md`, `.opencode/skills/doc-bd-cm/SKILL.md`
- 実施:
  - `RQ-DG-001` の改修フローと受入基準に、スキル同一変更・共通スキル同時更新・記録要件を追加。
  - `RQ-DEV-001` の受入基準に、スキル同期と `impact_check/doc_check` 更新を品質ゲートとして追加。
  - `RQ-RDR-024` を新規作成し、スキルメンテナンス方針を要求決定記録として固定。
  - `BD-INF-CM-001` と `BD-SYS-ADR-012` を更新し、変更分類ごとの同期設計と同一変更原則を構成管理へ反映。
  - `skill-maintainer` / `docops-orchestrator` / `doc-rq-dg` / `doc-bd-cm` の各スキルに新方針を同期。
- 影響確認:
  - 要求整合: [[RQ-DG-001]] と [[RQ-DEV-001]] で運用手順と品質ゲートが整合。
  - 設計整合: [[RQ-RDR-024]] -> [[BD-SYS-ADR-012]] -> [[BD-INF-CM-001]] のトレース経路を確立。
  - 運用整合: 共通規約変更時の最低更新セット（`skill-maintainer` / `docops-orchestrator` / `obsidian-doc-*`）を明文化。

## 追記（FRディレクトリを機能単位へ再編）
- 対象: `docs/1.要求(RQ)/51.機能要求(FR)` 配下23文書（`RQ-FR-001`〜`RQ-FR-023`）
- 実施:
  - 実装工程ベースの分類（収集実行/収集データ整備/一覧表示/検索・絞り込み）から、機能単位の分類へ再編。
  - 新カテゴリ `01.収集対象取り込み(ING)` / `02.検索・絞り込み・並び替え(SCH)` / `03.タグ管理(TAG)` / `04.一覧表示・段階ロード(LST)` / `06.コメント密度波形(HLW)` / `07.ワードクラウド(WCL)` を作成し、関連文書を移動。
  - 既存カテゴリ `05.詳細表示・外部遷移(DET)` は機能区分として継続利用し、`DET` には `RQ-FR-013` / `RQ-FR-014` を配置。
  - `06.運用監視・再実行(OPS)` は番号重複解消のため `08.運用監視・再実行(OPS)` へリネームし、`RQ-FR-016` / `RQ-FR-017` / `RQ-FR-018` を維持配置。
  - 旧カテゴリ `01.収集実行(COL)` / `02.収集データ整備(DAT)` / `03.一覧表示(VIEW)` / `04.検索・絞り込み(FLT)` は空ディレクトリ化後に整理。
- 影響確認:
  - 要求整合: 要求ID・本文・frontmatterを変更せず、文書の意味は不変。
  - トレーサビリティ整合: Obsidianリンクは `[[RQ-FR-xxx]]` のID解決のため、関連文書からの参照は維持。
  - 運用整合: 機能起点での閲覧性が向上し、[[RQ-GL-016|コメント密度波形]]/[[RQ-GL-017|ワードクラウド]]の表示要求と生成要求を同一機能カテゴリで追跡可能。

## 追記（FR機能単位編成を運用規約・スキル・エージェントへ反映）
- 対象: `AGENTS.md`, `.opencode/skills/doc-rq-fr/*`, `.opencode/skills/docops-orchestrator/SKILL.md`, `.opencode/skills/skill-maintainer/SKILL.md`, `.opencode/skills/obsidian-doc-*/SKILL.md`, `.opencode/agents/docops-orchestrator.md`
- 実施:
  - `AGENTS.md` に FR機能単位編成規約（ING/SCH/TAG/LST/DET/HLW/WCL/OPS）を追加し、生成系要求の配置方針を明文化。
  - `doc-rq-fr` に FR配置規則と曖昧時のRDR記録ルールを追加。
  - `docops-orchestrator` / `skill-maintainer` に FR編成維持の実行手順を追加。
  - `obsidian-doc-new` / `obsidian-doc-change` / `obsidian-doc-check` に FR配置の確認観点を追加。
  - 運用用エージェントとして `.opencode/agents/docops-orchestrator.md` を新規追加。
- 影響確認:
  - 規約整合: FRの再編方針が AGENTS/skills/agents で同一ルールに統一された。
  - 運用整合: 新規FR追加時に実装工程寄り分類へ戻るリスクを低減。
  - トレーサビリティ整合: 配置判断が曖昧な場合のRDR記録ルールを明確化。
  - 検証結果: `validate_vault.py` 実行で `broken_links: 0`、`nonlinked_doc_ids: 68`（UT/IT/AT文書の既存ID未リンク）を確認。

## 追記（FR起点での用語・ドメイン不足補完）
- 対象: `RQ-GL-017`, `RQ-DM-009`, `RQ-FR-021`, `RQ-FR-023`, `RQ-DM-001`, `RQ-RDR-021`
- 実施:
  - WCL要求（[[RQ-FR-021]] / [[RQ-FR-023]]）で中核語彙となる [[RQ-GL-017|ワードクラウド]] を新規追加。
  - WCL成果物の生成・状態・参照を表す [[RQ-DM-009]] を新規追加。
  - [[RQ-FR-021]] / [[RQ-FR-023]] の要求本文と依存・関連へ [[RQ-GL-017]] / [[RQ-DM-009]] を反映。
  - [[RQ-DM-001]] に [[RQ-DM-009]] との関連を追加し、詳細表示導線のモデル整合を補強。
  - 要求決定記録 [[RQ-RDR-021]] に、用語/ドメイン補完の影響範囲を追記。
- 影響確認:
  - 要求整合: FRで使用する語彙（[[RQ-GL-017|ワードクラウド]]）の定義がGLで一意に参照可能となった。
  - ドメイン整合: HLWの [[RQ-DM-008]] に対し、WCL側も [[RQ-DM-009]] で対になるモデルを保持。
  - トレーサビリティ整合: `FR -> GL/DM -> RDR` の参照経路を補完し、レビュー時の解釈差分を低減。

## 追記（pre-commitとTaskfileのdocs運用整備）
- 対象: `Taskfile.yaml`, `.pre-commit-config.yaml`, `AGENTS.md`, `README.md`
- 実施:
  - docs運用専用の `Taskfile.yaml` を追加し、`precommit` / `docs:guard` / `docs:check` などの標準入口を定義。
  - `docs:autolink:changed` / `docs:check:changed` を追加し、差分docsだけを対象にリンク補正と整合検査を実行可能化。
  - `.pre-commit-config.yaml` に汎用フック（`pre-commit-hooks`）を追加し、既存のdocs専用ローカルフックと併用。
  - `AGENTS.md` の変更フローを `task docs:guard` / `task docs:check` 中心へ更新し、`README.md` に運用コマンドを追記。
- 影響確認:
  - 運用整合: docs更新時の手順が Task 入口に統一され、実行漏れリスクを低減。
  - 品質整合: pre-commitで一般的なフォーマット/YAML整合を早期検知可能。
  - 拡張整合: docs専用タスク構成のため、既存Web/他作業フローへの影響を最小化。

## 追記（本文IDリンクのfail運用導入と残件解消）
- 対象: `.opencode/skills/obsidian-doc-check/scripts/validate_vault.py`, `.pre-commit-config.yaml`, `.github/workflows/docs-link-check.yml`, `RQ-DG-001`, `UT-PLAN-001`, `IT-PLAN-001`, `AT-GO-001`, `AT-RPT-001`
- 実施:
  - `validate_vault.py` を拡張し、本文中の未リンク文書IDを `nonlinked_doc_ids` として検出し fail とする運用を追加。
  - `--targets` を追加し、差分文書のみを厳格検査できるようにした。
  - pre-commit と CI に同一検査ゲート（用語リンク + 本文IDリンク）を追加。
  - `RQ-DG-001` の改修フローと受入基準に、リンク検査ゲートと fail 条件を反映。
  - 残件だったUT/IT/AT文書の本文ID参照を `[[ID]]` へ統一（`UT-PLAN-001`, `IT-PLAN-001`, `AT-GO-001`, `AT-RPT-001`）。
- 影響確認:
  - 運用整合: ローカルコミットとPRの双方で同一ルールによりリンク不備をブロック可能。
  - トレーサビリティ整合: テスト計画/判定/報告の表・本文から関連IDへ直接遷移可能。
  - 検証結果: `validate_vault.py --docs-root docs --report reports/doc_check.md` 実行で `nonlinked_doc_ids: 0` を確認。

## 追記（単一CloudFront配下のURL分岐設計追加）
- 対象: `RQ-FR-025`, `RQ-RDR-026`, `BD-SYS-ADR-014`, `BD-INF-DEP-004`, `BD-APP-API-004`, `DD-INF-DEP-002`, `DD-APP-API-010`, `AT-SCN-006`, `RQ-SC-001`, `RQ-DEV-001`, `RQ-SEC-001`, `RQ-INT-001`, `AT-REL-001`, `AT-RUN-001`
- 実施:
  - 新規文書で、単一CloudFront Distribution上の経路分離（`/web/*`, `/docs/*`, `/openapi/*`, `/api/v1/*`）を要求・設計・受入まで定義。
  - 版対応を `/openapi/v1/openapi.json` と `/api/v1/*` で固定し、認証境界を `/openapi/*` と `/api/v1/*` に設定。
  - 既存文書は最小更新として、DoD範囲・非機能受入基準・配信/障害対応手順へ追記のみ実施。
- 影響確認:
  - 要求整合: `RQ-RDR-026 -> RQ-FR-025` で意思決定と要求本文が整合。
  - 設計整合: `BD-SYS-ADR-014 -> BD-INF-DEP-004/BD-APP-API-004 -> DD-INF-DEP-002/DD-APP-API-010` の経路でトレース可能。
  - 運用整合: `AT-SCN-006`、`AT-REL-001`、`AT-RUN-001` で経路競合・認証障害の検証と復旧を再現可能。

## 追記（ドキュメント公開フロー要求とQuartz+CDK設計の追加）
- 対象: `RQ-FR-024`, `RQ-RDR-025`, `RQ-DEV-001`, `RQ-SC-001`, `BD-SYS-ADR-013`, `BD-INF-DEP-003`, `DD-INF-DEP-001`, `AT-PLAN-001`, `AT-REL-001`, `AT-RUN-001`
- 実施:
  - 公開運用要求 `RQ-FR-024` を新規追加し、`task docs:deploy` を単一入口とする受入基準を定義。
  - 要求決定記録 `RQ-RDR-025` を新規作成し、Quartz build + CDK deploy + invalidationの標準化を決定。
  - 設計決定 `BD-SYS-ADR-013` と設計本文 `BD-INF-DEP-003` を新規追加し、`siteAssetPath`、S3+OAC、pretty URL rewrite、失敗時観点を明文化。
  - `DD-INF-DEP-001` を意味変更し、公開フロー詳細（I/O、解決パス、障害ハンドリング）へ更新。
  - 受入運用文書 `AT-REL-001` / `AT-RUN-001` と計画 `AT-PLAN-001` を公開手順前提へ更新。
  - `RQ-DEV-001` と `RQ-SC-001` を更新し、DevOps品質ゲートとDoD範囲を [[RQ-FR-024]] まで拡張。
- 影響確認:
  - 要求整合: [[RQ-PC-005]]（AWS配信基盤）と [[RQ-PC-009]]（小差分リリース）の制約を、公開運用要求で具体化できた。
  - 設計整合: [[RQ-RDR-025]] -> [[BD-SYS-ADR-013]] -> [[BD-INF-DEP-003]] -> [[DD-INF-DEP-001]] のトレース経路を構築。
  - 受入整合: 公開手順と障害復旧の判定を [[AT-REL-001]] / [[AT-RUN-001]] で再現可能化。

## 追記（CornellNoteWeb準拠の公開設計整理）
- 対象: `RQ-RDR-025`, `BD-SYS-ADR-013`, `BD-INF-DEP-003`, `DD-INF-DEP-001`, `BD-INF-DEP-004`, `DD-INF-DEP-002`
- 実施:
  - `.workspace/CornellNoteWeb` の運用原則（Task入口統一/IaC配備/運用手順明文化）を[[RQ-GL-001|diopside]]公開設計へ明記。
  - 公開方式をPhase 1（docs単独公開）/ Phase 2（単一CloudFront分岐拡張）で段階化。
  - `BD-INF-DEP-003` と `DD-INF-DEP-001` に `docs-link-check` と `docs-deploy` の責務分離、および `docs:deploy` 実行チェーンを設計として追加。
  - `BD-INF-DEP-004` / `DD-INF-DEP-002` にPhase 2適用条件（Phase 1安定化前提）を追加。
- 影響確認:
  - 運用整合: 先行公開で運用安定化してから経路分岐へ拡張するため、段階導入リスクを低減。
  - 設計整合: RDR/ADR/BD/DDで同じ段階導入方針を参照できる状態へ統一。

## 追記（AWSタグ統制の要求・設計反映: 単一アカウント前提）
- 対象: `RQ-COST-001`, `RQ-SEC-001`, `RQ-RDR-027`, `BD-SYS-ADR-015`, `DD-SYS-COST-001`
- 実施:
  - `RQ-COST-001` に必須タグセット（`CostCenter`/`Environment`/`Owner`/`Project`/`ManagedBy`）、列挙値制約、コスト配分タグ有効化遅延を考慮した受入基準を追加。
  - `RQ-SEC-001` にタグへのPII/秘密情報禁止、`aws:` プレフィックス禁止、大小文字表記ゆれ統制の受入基準を追加。
  - 要求判断を `RQ-RDR-027` として新規作成し、Organizations前提を置かない単一アカウント方針を明文化。
  - 設計判断を `BD-SYS-ADR-015` で新規作成し、IaC + IAM + Config の3層統制を採用。
  - `DD-SYS-COST-001` を意味変更し、[[RQ-GL-005|タグ辞書]]、強制/検知フロー、Billing運用、是正SLAを具体化。
- 影響確認:
  - 要求整合: [[RQ-PC-006]] のコスト上限制約と、タグ統制に関する運用条件が同時に判定可能になった。
  - 設計整合: [[RQ-RDR-027]] -> [[BD-SYS-ADR-015]] -> [[DD-SYS-COST-001]] の追跡経路を構築。
  - 運用整合: タグ欠落/禁止情報混入の是正記録を [[AT-OPS-001]] へ集約できる構成を維持。

## 追記（PoC参照によるメタデータ取得方式・構成・要求の整理）
- 対象: `RQ-RDR-028`, `RQ-FR-001`, `RQ-FR-003`, `RQ-FR-004`, `RQ-FR-019`, `RQ-DATA-001`, `RQ-UC-001`, `BD-SYS-ARCH-001`, `BD-APP-API-002`, `BD-APP-DATA-001`
- 実施:
  - `.workspace/get-archives-info.zip` を参照し、取得業務を「公式取り込み/出演補完取り込み/差分更新」の3モードへ分離する決定記録 `RQ-RDR-028` を新規作成。
  - `RQ-FR-001` に3モード起動と更新種別（新規/既存/補完/再確認）の記録要件を追加。
  - `RQ-FR-003` に出演候補ID集合を用いた補完取り込みを追加（具体形式は固定しない）。
  - `RQ-FR-004` に必須属性/任意属性の分離と、任意欠損の補完対象識別を追加。
  - `RQ-FR-019` に責務境界（配信前後再確認と全体差分更新の分離）を明記。
  - `RQ-DATA-001` に取得元区分・更新種別の追跡記録を受入基準として追加。
  - `RQ-UC-001`、`BD-SYS-ARCH-001`、`BD-APP-API-002`、`BD-APP-DATA-001` を更新し、取得モード分離とデータ層構成を設計へ反映。
- 影響確認:
  - 要求整合: `FR/UC/RDR` で収集モードと責務境界が一意に読める構成を維持。
  - 設計整合: `RQ-RDR-028 -> BD-SYS-ARCH-001 -> BD-APP-API-002/BD-APP-DATA-001` のトレース経路を構築。
  - 制約整合: `RQ-PC-003` / `RQ-PRC-001` に合わせ、コメント/チャット/字幕の恒久保存を採用しない境界を維持。

## 追記（cdk-nag除外理由の設計明文化）
- 対象: `BD-INF-DEP-003`, `DD-INF-DEP-001`, `AT-RUN-001`
- 実施:
  - `BD-INF-DEP-003` に cdk-nag 品質ゲートと、Phase 1で許可する除外ID（`IAM4/IAM5/L1/S1/CFR1/CFR2/CFR3/CFR4`）の適用方針を追加。
  - `DD-INF-DEP-001` に除外IDごとの対象・理由・再評価条件、および cdk-nag 失敗時の運用ルールを追加。
  - `AT-RUN-001` に cdk-nag 失敗の障害分類と、`DD-INF-DEP-001` への同時反映を含む復旧手順を追加。
- 影響確認:
  - 設計整合: cdk-nagの除外理由がコード（`infra/lib/quartz-site-stack.ts`）と文書（BD/DD/AT）で一致。
  - 運用整合: 新規除外追加時に、実装だけでなく設計文書更新を必須化できる状態を確認。

## 追記（Phase 1経路と実装経路の整合補正）
- 対象: `infra/functions/pretty-url-rewrite.js`, `Taskfile.yaml`, `AT-REL-001`
- 実施:
  - CloudFront Functionに `/docs/*` 互換リライトを追加し、`/docs/` から公開トップへ到達できるよう修正。
  - `docs:verify` を `/` と `/docs/` の双方確認へ更新。
  - `AT-REL-001` をPhase 1（docs先行公開）基準へ修正し、Phase 2の経路確認を条件付き手順へ分離。
- 影響確認:
  - 経路整合: `BD-INF-DEP-003` の Phase 1 方針（docs公開）と運用手順の参照経路が一致。
  - 互換性: 既存の `/` アクセスを維持しつつ、`/docs/*` 導線でも同等到達を確認可能。

## 追記（AWS CDKベストプラクティスの設計・スキル反映）
- 対象: `RQ-RDR-029`, `BD-SYS-ADR-016`, `RQ-DEV-001`, `BD-DEV-PIPE-001`, `BD-INF-DEP-003`, `DD-INF-DEP-001`, `.opencode/skills/doc-rq-dev/*`, `.opencode/skills/doc-bd-build/*`, `.opencode/skills/doc-bd-dep/*`, `.opencode/skills/doc-dd-dep/*`
- 実施:
  - 要求決定記録 `RQ-RDR-029` を新規追加し、CDK設計標準（`synth` 決定性、Construct中心、stateful分離、props注入、`cdk.context.json` 固定）を採用決定として記録。
  - 設計決定 `BD-SYS-ADR-016` を新規追加し、非採用案（Stack中心実装、`process.env` 直参照、物理名固定）を明示。
  - `RQ-DEV-001` の受入基準へCDK品質ゲート（`cdk synth` 再現性、context管理、論理ID置換防止）を追加。
  - `BD-DEV-PIPE-001` / `BD-INF-DEP-003` / `DD-INF-DEP-001` を更新し、決定性・CIゲート・CDKテスト方針（fine-grained/snapshot/integ）を反映。
  - 対応 `doc-*` スキルと `TEMPLATE.md` を同一変更で更新し、以後の文書更新で同観点が漏れないように同期。
- 影響確認:
  - 要求整合: [[RQ-PC-009]] の小差分リリース制約に対し、CDK運用の判定可能条件が追加された。
  - 設計整合: [[RQ-RDR-029]] -> [[BD-SYS-ADR-016]] -> [[BD-DEV-PIPE-001]]/[[BD-INF-DEP-003]] -> [[DD-INF-DEP-001]] の追跡経路を構築。
  - スキル整合: `doc-rq-dev` / `doc-bd-build` / `doc-bd-dep` / `doc-dd-dep` が同一のCDK品質観点を保持。

## 追記（Quartzデフォルトホームへの移行）
- 対象: `docs/index.md`, `docs/RQ-HM-001.md`, `infra/functions/pretty-url-rewrite.js`, `infra/test/fixtures/site/index.html`, `BD-INF-DEP-003`, `DD-INF-DEP-001`, `AT-REL-001`
- 実施:
  - ホーム文書を `RQ-HM-001` から `index` へ移行し、公開トップの正本を Quartz デフォルト (`index.md`) に統一。
  - CloudFront Function の `"/"` と `"/docs/"` リライト先を `index.html` へ変更。
  - infra のテストフィクスチャを `RQ-HM-001.html` から `index.html` へ置換。
  - 設計文書と配信手順書の公開トップ参照を `index.html` / [[index]] 前提へ更新。
- 影響確認:
  - 経路整合: ルートアクセスと docs プレフィックスアクセスが同一トップへ解決される。
  - 設計整合: BD/DD/AT の参照先が実装のルーティング仕様と一致する。

## 追記（AIエージェント運用要求と設計の追加）
- 対象: `RQ-DEV-002`, `RQ-RDR-029`, `BD-SYS-ARCH-005`, `BD-SYS-ADR-016`
- 実施:
  - AIエージェント運用を非機能要求として `RQ-DEV-002` に新規追加し、役割分離・最小権限・実行上限を受入基準化。
  - 要求採用理由と影響範囲を `RQ-RDR-029` に記録。
  - 運用アーキテクチャを `BD-SYS-ARCH-005` に新規追加し、Primary/Subagent分離と成果物トレースをMermaidで明示。
  - 設計判断を `BD-SYS-ADR-016` に新規追加し、段階解放とホワイトリスト運用を採用決定として固定。
- 影響確認:
  - 要求整合: `RQ-PC-007` / `RQ-PC-009` のAI支援開発制約を、判定可能な運用要件へ具体化。
  - 設計整合: `RQ-RDR-029 -> BD-SYS-ADR-016 -> BD-SYS-ARCH-005` の追跡経路を構築。
  - 運用整合: 既存の文書運用規約（`BD-INF-CM-001`, `RQ-DG-001`）と矛盾しない更新単位を維持。

## 追記（エージェント実体定義への反映とDevOps要件束ね）
- 対象: `.opencode/agents/review.md`, `.opencode/agents/security-auditor.md`, `.opencode/agents/orchestrator.md`, `RQ-DEV-001`
- 実施:
  - `review` / `security-auditor` を read-only 監査系サブエージェントとして追加し、`edit: deny` と最小bash許可を設定。
  - `orchestrator` をPrimaryとして追加し、`permission.task` をホワイトリスト方式（`explore`/`review`/`security-auditor`）で定義。
  - `RQ-DEV-001` に [[RQ-DEV-002]] 参照を追加し、AIエージェント運用要件をDevOps要件に統合。
- 影響確認:
  - 運用整合: 役割分離・最小権限・段階解放の方針が文書と実体定義の双方で一致。
  - 要求整合: `RQ-DEV-001` から `RQ-DEV-002` を辿れるため、DevOps品質ゲート内でAI運用要件を判定可能。

## 追記（本文リンクのコード化解消）
- 対象: `docs/**`, `reports/impact_check_2026-02-11.md`
- 実施:
  - 本文中でコード化されていたObsidianリンク（例: `[[RQ-FR-001]]`）を、リンク解決可能な `[[RQ-FR-001]]` 形式へ統一。
  - 依頼対象の [[RQ-FR-019]] を優先して修正し、同種パターンを要求/設計/詳細設計/受入テスト文書へ横展開。
  - 記法説明として意図したプレースホルダー（例: `` `[[ID]]` ``, `` `[[RQ-FR-xxx]]` ``）は維持。
- 影響確認:
  - 要求整合: [[RQ-FR-019]] の責務境界参照（[[RQ-FR-001]]）が本文から直接遷移可能。
  - トレーサビリティ整合: RQ/BD/DD/AT と impact_check の相互参照でリンク切れを解消。
  - 運用整合: 本文IDリンクのfail運用（`RQ-DG-001`）と整合する記法へ是正。

## 追記（変更履歴のRDR/ADRリンク必須化）
- 対象: `AGENTS.md`, `RQ-DG-001`, `BD-INF-CM-001`, `.opencode/skills/docops-orchestrator/SKILL.md`, `.opencode/skills/obsidian-doc-new/SKILL.md`, `.opencode/skills/obsidian-doc-change/SKILL.md`, `.opencode/skills/obsidian-doc-check/SKILL.md`, `.opencode/skills/skill-maintainer/SKILL.md`, `.opencode/skills/doc-rq-*/TEMPLATE.md`, `.opencode/skills/doc-bd-*/TEMPLATE.md`
- 実施:
  - 規約正本 `AGENTS.md` に、RQ文書の変更履歴行へ `[[RQ-RDR-xxx]]`、BD文書の変更履歴行へ `[[BD-ADR-xxx]]` の必須化を追加。
  - `RQ-DG-001` と `BD-INF-CM-001` を更新し、改修フロー/設計要点と受入基準に履歴リンク必須を反映。
  - 共通スキル5件へ同ルールを同期し、チェック項目・実行フロー・保守手順で同一基準を維持。
  - RQ/BDの全テンプレートで `## 変更履歴` 雛形をリンク必須形式へ統一。
- 影響確認:
  - 要求整合: `[[RQ-RDR-024]]` を起点に、RQ文書の変更理由が履歴行から直接追跡可能。
  - 設計整合: `[[BD-SYS-ADR-012]]` を起点に、BD文書の設計判断が履歴行から直接追跡可能。
  - 運用整合: 規約/運用文書/スキル/テンプレートが同一書式へ揃い、新規文書でもリンク記載漏れを抑止。

## 追記（「ページング済み索引」用語の定義とリンク統一）
- 対象: `RQ-FR-006`, `RQ-GL-009`, `BD-APP-API-001`, `DD-APP-API-001`, `DD-APP-API-004`
- 実施:
  - `RQ-FR-006` の要求本文「ページング済み索引」を [[RQ-GL-009|ページング済み索引（archive_index）]] へリンク化。
  - `RQ-GL-009` に別名「ページング済み索引」を追加し、`related` へ [[RQ-FR-006]] を追記。
  - `BD-APP-API-001` の `archive_index.p{page}.json` 契約を [[RQ-GL-009|archive_index]] 表記へ統一し、主な利用要求へ [[RQ-FR-006]] を追加。
  - `DD-APP-API-001` / `DD-APP-API-004` のページング索引表現を [[RQ-GL-009]] 参照に統一。
- 影響確認:
  - 用語整合: FR/GL/BD/DD の横断で「ページング済み索引」= `archive_index` の対応が一意に追跡可能。
  - トレーサビリティ整合: `RQ-FR-006 -> RQ-GL-009 -> BD-APP-API-001 -> DD-APP-API-001/DD-APP-API-004` の参照経路を補強。

## 追記（[[RQ-GL-010|段階ロード]]要求の目的明確化）
- 対象: `RQ-FR-015`, `RQ-RDR-002`
- 実施:
  - `RQ-FR-015` の要求文を「初回読み込み高速化のため[[RQ-GL-010|段階ロード]]で漸進表示する」表現へ更新。
  - 受入基準/例外/テスト観点を、待機理由の可視化・失敗時の次操作提示・重複/逆順化防止まで具体化。
  - 意味変更に伴い `RQ-RDR-002` を更新し、初回表示を最小表示単位先行とする決定を追記。
- 影響確認:
  - 要求整合: 一覧表示の目的（初回待機短縮）と手段（[[RQ-GL-010|段階ロード]]）が同一文脈で判定可能。
  - 決定整合: `RQ-RDR-002 -> RQ-FR-015` の追跡経路で、採用理由と要求本文の一致を確認。

## 追記（公開要求からコマンド名を分離し責務境界を明確化）
- 対象: `RQ-FR-024`, `RQ-RDR-025`
- 実施:
  - `RQ-FR-024` の要求本文/受入基準/例外を更新し、実装詳細（`task docs:deploy`）を除外して「単一操作で公開できる」要求へ整理。
  - `RQ-RDR-025` を更新し、標準入口の必須化は維持しつつ、操作方式やコマンド名の定義先を設計・運用文書と明記。
  - 両文書の変更履歴をRDRリンク必須ルールに合わせて補正。
- 影響確認:
  - 要求整合: FRが「何を満たすか」に集中し、実装方式の変更耐性が向上。
  - 決定整合: `RQ-RDR-025 -> RQ-FR-024` で、要求と実装責務の分離方針を追跡可能。

## 追記（主体表現のステークホルダーリンク統一）
- 対象: `docs/1.要求(RQ)` 配下の関連文書（UC/FR/NFR/RDR/PP/SC/PC/GL/DM/SH）
- 実施:
  - 本文中の主体表現 `管理者` / `利用者` を、文脈に応じて `[[RQ-SH-001|管理者]]` / `[[RQ-SH-002|利用者]]` へリンク化。
  - `確認主体` の表記をステークホルダーリンク形式へ統一（例: `[[RQ-SH-001|管理者]]/[[RQ-SH-002|利用者]]`）。
  - 変更文書の `updated` と `## 変更履歴` を当日更新し、履歴行へ `[[RQ-RDR-010]]` を付与。
- 影響確認:
  - 要求整合: 主体表現からステークホルダー定義へ直接遷移でき、解釈の揺れを低減。
  - トレーサビリティ整合: UC/FR/NFR から SH への参照経路が一貫化。

## 追記（管理者操作の管理画面カテゴリ統合）
- 対象: `RQ-RDR-030`, `RQ-FR-001`, `RQ-FR-002`, `RQ-FR-003`, `RQ-FR-004`, `RQ-FR-019`, `RQ-FR-016`, `RQ-FR-017`, `RQ-FR-018`, `RQ-FR-024`, `RQ-FR-025`, `RQ-UC-001`, `RQ-UC-007`, `RQ-UC-008`, `RQ-UC-009`, `RQ-SC-001`, `AGENTS.md`, `.opencode/skills/doc-rq-fr/*`, `.opencode/skills/docops-orchestrator/SKILL.md`, `.opencode/skills/skill-maintainer/SKILL.md`, `.opencode/skills/obsidian-doc-*/SKILL.md`, `.opencode/agents/docops-orchestrator.md`
- 実施:
  - `RQ-RDR-030` を新規作成し、旧 `ING` と旧 `OPS` を管理画面カテゴリへ統合する決定を記録。
  - FRカテゴリを `01.管理画面(ADM)` へ再編し、`RQ-FR-001/002/003/004/019/016/017/018/024/025` を移動。
  - 上記FRの要求本文を「管理画面でできること」起点へ更新し、変更履歴へ `[[RQ-RDR-030]]` を追記。
  - `RQ-UC-001/007/008/009` を管理画面起点の操作フローへ更新。
  - `RQ-SC-001` のIn Scopeを管理画面操作（収集実行/監視/[[RQ-GL-011|再収集]]/公開運用/配信経路確認）へ再整理。
  - FR編成規約の正本を `ADM/SCH/TAG/LST/DET/HLW/WCL` に更新し、関連スキル/エージェントへ同一変更で反映。
- 影響確認:
  - 要求整合: 管理者操作がカテゴリ横断せず `01.管理画面(ADM)` で一意に追跡可能。
  - 規約整合: `AGENTS.md` と `doc-rq-fr` / `docops-orchestrator` / `obsidian-doc-*` / `skill-maintainer` のFRカテゴリ定義が一致。
  - 運用整合: 収集起動から[[RQ-GL-011|再収集]]、公開、経路確認までを管理画面運用として同一文脈でレビュー可能。

## 追記（タグ原本のDB管理とJSON配信分離の決定追加）
- 対象: `RQ-RDR-031`
- 実施:
  - `RQ-RDR-031` を新規作成し、タグ原本をDBで管理しつつ、利用者向けにはDB由来JSONを配信する方針を決定記録化。
  - 既存の `RQ-RDR-003`（別ファイル管理）との関係を明示し、将来の高度検索/チャット欄検索を見据えた拡張境界を定義。
- 影響確認:
  - 要求整合: `RQ-FR-005` / `RQ-FR-009` の次回更新で、更新系（管理画面）と参照系（配信JSON）の責務分離を要求本文へ反映する前提を確立。
  - 用語整合: `RQ-GL-005` / `RQ-GL-014` で参照元と適用範囲を更新できるトレース経路を確保。
  - 運用整合: 利用者API応答時の都度生成を必須にしないため、配信性能と運用監視の分離方針を維持可能。

## 追記（公開UIのモバイル優先方針を要求・設計へ反映）
- 対象: `RQ-UX-001`, `RQ-UX-005`, `RQ-RDR-032`, `BD-APP-UI-002`, `DD-APP-UI-002`, `BD-SYS-ADR-020`
- 実施:
  - `RQ-UX-001` に公開UIの端末優先順位（スマートフォン -> タブレット -> PC）を追加し、受入基準へ390/768/1280px成立条件を追記。
  - `RQ-UX-005` に同優先順位を反映し、リフロー成立条件を390/768/1280pxの段階判定へ更新。
  - 要求決定記録 `RQ-RDR-032` を新規作成し、公開UIに限定したモバイル先行方針と影響範囲を記録。
  - `BD-APP-UI-002` にモバイルファースト設計方針、端末別レイアウト仕様、状態遷移一貫性要件を追加。
  - `DD-APP-UI-002` を詳細化し、端末別レイアウト、コンポーネント責務、状態遷移、操作制約を実装可能粒度で定義。
  - 設計決定記録 `BD-SYS-ADR-020` を新規作成し、モバイルファースト採用理由と却下案を明文化。
- 影響確認:
  - 要求整合: `RQ-RDR-032 -> RQ-UX-001/RQ-UX-005` で端末優先順位の判断根拠と受入条件が追跡可能。
  - 設計整合: `BD-SYS-ADR-020 -> BD-APP-UI-002 -> DD-APP-UI-002` の経路で、設計意図と実装仕様の接続を確認。
  - 適用境界整合: 方針適用を公開UIに限定し、管理画面への過剰適用を回避。

## 追記（環境定義の2層化と一時検証方針の設計反映）
- 対象: `BD-DEV-ENV-001`, `BD-DEV-ENV-002`, `BD-SYS-ADR-018`
- 実施:
  - 環境区分を「開発」「本番」の2層として明文化し、`BD-DEV-ENV-001` と `BD-DEV-ENV-002` の本文を環境差分・依存・運用制約ベースへ更新。
  - 常設の独立検証環境は持たず、本番準拠の一時環境で検証する運用方針を両ENV文書へ追記。
  - 意味変更の設計決定として `BD-SYS-ADR-018` を新規作成し、2層化の採用理由と影響範囲を固定。
- 影響確認:
  - 要求整合: `RQ-PC-005`（AWS統一）と `RQ-DEV-001`（小差分・再現可能運用）に整合する環境定義へ更新。
  - 非機能整合: `RQ-AV-001` / `RQ-PS-001` / `RQ-SEC-001` の閾値・認証境界を本番環境制約として追跡可能化。
  - 運用整合: 検証記録は `IT-ENV-001` / `AT-PLAN-001` 側で管理する責務分離を明確化。

## 追記（タグ原本DB管理の設計判断をADRへ追加）
- 対象: `BD-SYS-ADR-020`
- 実施:
  - `BD-SYS-ADR-020` を新規作成し、タグ原本のDB正本化と利用者向けJSON配信分離を設計判断として記録。
  - 更新イベント起点/定期バッチでの再生成を採用し、利用時点での都度再生成を不採用とする理由を明記。
- 影響確認:
  - 設計整合: `RQ-RDR-031 -> BD-SYS-ADR-020 -> BD-APP-API-001/BD-APP-DATA-001` の追跡経路を構築。
  - 要求整合: `RQ-FR-005` / `RQ-FR-009` / `RQ-UC-004` へ反映すべき責務境界（更新系/参照系分離）を明確化。
  - 運用整合: 静的配信の性能特性を維持しながら将来検索拡張へ接続できる設計方針を確立。

## 追記（タグ正本DB管理方針のRQ/BD/DD/IT/AT反映）
- 対象: `RQ-FR-005`, `RQ-FR-009`, `RQ-UC-004`, `RQ-GL-005`, `BD-APP-API-001`, `BD-APP-DATA-001`, `DD-APP-API-001`, `DD-APP-API-005`, `DD-APP-API-011`, `IT-CASE-009`, `AT-SCN-007`, `BD-SYS-ADR-018`, `BD-APP-UI-002`
- 実施:
  - `RQ-FR-005/009`, `RQ-UC-004`, `RQ-GL-005` を更新し、[[RQ-GL-005|タグ辞書]]の境界を「DB正本 + 生成JSON配信」へ統一。
  - `BD-APP-API-001`, `BD-APP-DATA-001` を更新し、`tag_master.json` の生成トリガー/公開切替/失敗時挙動とタグ正本管理層を追記。
  - `DD-APP-API-001`, `DD-APP-API-005` を更新し、公開契約と運用契約（更新/公開）を分離。
  - `DD-APP-API-011` を新規追加し、[[RQ-GL-005|タグ辞書]]更新APIと公開APIの契約を定義。
  - `IT-CASE-009`, `AT-SCN-007` を新規追加し、更新から公開反映までの結合/受入観点を追加。
  - 既存参照競合を解消するため `BD-SYS-ADR-018` を新規追加し、`BD-APP-UI-002` のモバイル方針参照を修正。
- 影響確認:
  - 要求整合: `RQ-RDR-031` と `BD-SYS-ADR-020` で定義した責務境界がFR/UC/GLへ反映された。
  - 設計整合: `RQ-RDR-031 -> BD-SYS-ADR-020 -> BD-APP-API-001/BD-APP-DATA-001 -> DD-APP-API-001/005/011` の追跡経路を構築。
  - テスト整合: `DD-APP-API-011 -> IT-CASE-009 -> AT-SCN-007` の検証経路で運用更新から利用者反映までを確認可能。

## 追記（BD-UIの画面一覧/画面遷移を実体化）
- 対象: `BD-APP-UI-001`, `BD-APP-UI-003`
- 実施:
  - `BD-APP-UI-001` をテンプレート記述から再構成し、利用者導線（一覧/検索/詳細）と管理者導線（収集実行/監視/[[RQ-GL-011|再収集]]/配信前後確認/公開運用）の画面カタログを追加。
  - 各画面に対して主体、主目的、入口、主要操作、主な状態、関連要求/UCを表形式で定義し、レビュー可能な設計粒度へ更新。
  - `BD-APP-UI-003` に利用者導線/管理者導線を分離したMermaid遷移図、遷移定義、例外復帰方針を追加。
  - 両文書の `related` を `RQ-UC-001/002/006/007/008/009` および `BD-SYS-ADR-009/010` へ補強し、`updated` と `version`（PATCH）を更新。
- 影響確認:
  - 要求整合: `RQ-UC` 群の操作フローが `BD-UI` 側で画面単位に受けられる構造へ整理され、画面責務の曖昧さを解消。
  - 設計整合: `BD-SYS-ADR-009/010` で定義した補助表示方針（波形/[[RQ-GL-017|ワードクラウド]]）を、画面遷移上の補助遷移として反映。
  - 運用整合: 管理者操作を `01.管理画面(ADM)` に集約した方針（`RQ-RDR-030`）と矛盾しない画面構成/遷移になっていることを確認。

## 追記（環境定義に対応するAT記録先の具体化）
- 対象: `AT-PLAN-001`, `AT-RPT-001`, `AT-GO-001`
- 実施:
  - `AT-PLAN-001` に、環境定義（[[BD-DEV-ENV-001]]/[[BD-DEV-ENV-002]]）を正本とした環境別運用値の記録方針を追加。
  - `AT-RPT-001` に、開発/本番の環境別運用値判定記録テンプレート（可用率/月次、MTTR、性能p95、認証境界確認）と判定ルールを追加。
  - `AT-GO-001` に、Go/No-Go判定入力として環境別運用値参照を追加し、判定サマリへ転記項目を追加。
- 影響確認:
  - 設計整合: `BD-DEV-ENV-001` / `BD-DEV-ENV-002` の運用制約をAT文書上で判定可能な記録項目へ変換できた。
  - 非機能整合: `RQ-AV-001` / `RQ-PS-001` / `RQ-SEC-001` の判定根拠が `AT-RPT-001` に集約され、`AT-GO-001` から参照可能。
  - 運用整合: 受入実行（AT-PLAN）→結果記録（AT-RPT）→最終判定（AT-GO）の記録経路を明確化。

## 追記（監視チェーン文書の全面改訂）
- 対象: `BD-INF-MON-001`, `BD-INF-MON-002`, `DD-APP-LOG-001`, `DD-SYS-AV-001`, `DD-SYS-PERF-001`, `AT-OPS-001`, `AT-RPT-001`, `AT-GO-001`
- 実施:
  - `BD-INF-MON-001` を監視対象/観測点/SLI定義中心へ再構成し、欠測時の扱いと `[[RQ-GL-011|再収集]]` 導線を明文化。
  - `BD-INF-MON-002` をSLO運用文書として再定義し、目標値・エラーバジェット・アラートレベル・逸脱時フローを追加。
  - `DD-APP-LOG-001` にログカテゴリ、必須スキーマ、記録率・欠測率判定、保持方針を追加。
  - `DD-SYS-AV-001` に可用率/MTTRの算出式、障害分類、一次復旧判定フローを追加。
  - `DD-SYS-PERF-001` に計測条件、p95算出ルール、劣化時運用を追加。
  - `AT-OPS-001` を証跡ベースチェックリストへ更新し、可用性/性能/可観測性を項目化。
  - `AT-RPT-001` に可観測性判定記録テンプレートと記入例を追加。
  - `AT-GO-001` に非機能ゲート判定表を追加し、Go/No-Go条件を閾値ベースへ具体化。
- 影響確認:
  - トレーサビリティ整合: `RQ-OBY-001` / `RQ-AV-001` / `RQ-PS-001` の閾値が BD -> DD -> AT で追跡可能になった。
  - 判定整合: 監視証跡（通知遅延、記録率、欠測率、可用率、p95）を `AT-RPT-001` と `AT-GO-001` で直接判定可能。
  - 運用整合: 監視逸脱時に `AT-OPS-001` と `AT-RUN-001` を併用して再実行・復旧記録を残せる構成へ統一。

## 追記（ビルド方針をデプロイ単位で分離）
- 対象: `BD-DEV-PIPE-001`, `BD-SYS-ADR-019`
- 実施:
  - `BD-DEV-PIPE-001` を更新し、ビルド責務を docs/web/api/infra の4つのデプロイ単位で分離して明記。
  - 単位ごとに成果物、配信経路、単位固有ゲート、失敗時の扱いをマトリクス化。
  - 共通TypeScript品質ゲートと、インフラ決定性ゲート（`cdk synth`、`cdk.context.json`、`cdk-nag`）を単位設計と接続。
  - 設計判断として `BD-SYS-ADR-019` を新規作成し、単位分離の採用理由と却下案を記録。
- 影響確認:
  - 設計整合: `BD-SYS-ADR-019 -> BD-DEV-PIPE-001` の追跡経路を追加し、ビルド失敗条件の責務境界を明確化。
  - 配信整合: `BD-INF-DEP-003` / `BD-INF-DEP-004` の経路分離（`/docs/*`, `/web/*`, `/openapi/*`, `/api/v1/*`）とビルド単位の対応を一致化。
  - 運用整合: 単位別失敗時に対象単位のみ再実行する方針を明記し、小差分リリース時の復旧時間短縮を狙う。

## 追記（デプロイ責務の領域分割明記）
- 対象: `BD-INF-DEP-004`, `BD-INF-DEP-005`, `BD-INF-DEP-006`, `DD-INF-DEP-002`, `DD-INF-DEP-003`, `DD-DEP-004`, `AT-REL-001`
- 実施:
  - デプロイ文書を領域別（docs/infra/front/backend）に分割し、frontとbackendのBD/DD文書を新規追加。
  - `BD-INF-DEP-004` をハブ化し、領域別の基本設計/詳細設計/運用確認の参照マップを追加。
  - `DD-INF-DEP-002` をinfra正本として整理し、docs/front/backend詳細への参照境界を明確化。
  - `AT-REL-001` に領域別確認手順を追加し、配信時の切り分け先を固定。
- 影響確認:
  - 設計整合: `BD-INF-DEP-004 -> (BD-INF-DEP-005/006) -> (DD-INF-DEP-003/004)` の追跡経路を追加し、責務境界を文書で分離。
  - 運用整合: 受入時に領域単位でPass/Fail判定でき、障害時の一次切り分けを短縮可能。
  - 要求整合: `RQ-FR-025` の経路分岐要求を、領域別のデプロイ責務として追跡可能化。

## 追記（Phase 2: DDL/DB制約詳細の実体化）
- 対象: `DD-APP-DB-002`〜`DD-APP-DB-011`, `DD-APP-DB-001`, `DD-APP-DB-004`
- 実施:
  - DDL一覧、テーブル別カラム、インデックス、更新ルール、依存順序を具体化。
  - `channels/videos/tag_types/tags/video_tags/ingestion_runs/ingestion_events` の責務境界と運用条件を明記。
  - 外部キー方針、NULL方針、一意制約、チェック制約、段階有効化ルールを追加。
  - 移行設計 `DD-APP-DB-003` と接続し、制約追加時の backfill/contract 条件を明文化。
- 影響確認:
  - 設計整合: `DD-APP-DB-002 -> DD-APP-DB-005..008 -> DD-APP-DB-001/002` の追跡経路を構築。
  - 運用整合: 制約違反時のロールバックとエラー分類（`DD-APP-ERR-001`）を接続。
  - 受入整合: 移行時に件数整合/重複0件/必須欠損0件を判定可能化。

## 追記（Phase 3: UI/アルゴリズム/実装規約の実体化）
- 対象: `DD-APP-UI-001`, `DD-APP-UI-003`, `DD-APP-UI-004`, `DD-APP-UI-005`, `DD-APP-UI-006`, `DD-APP-ALG-001`, `DD-APP-MOD-001`, `DD-APP-MOD-003`, `DD-DEV-CODE-001`, `DD-DEV-REV-001`
- 実施:
  - UI総論で画面責務境界、状態管理方針、共通UIルールを定義。
  - フィルタドロワー/詳細モーダル/検索バー/運用ステータス画面の入出力、状態遷移、失敗時挙動を詳細化。
  - 検索アルゴリズムを4段階処理（前処理/フィルタ/並び替え/ページング）で定義。
  - コンポーネント分割と責務対応表を追加し、依存方向・禁止事項を明記。
  - コーディング規約とレビュー規約を判定可能な基準（型安全、命名、指摘区分）へ更新。
- 影響確認:
  - 設計整合: `BD-UI-*` / `RQ-FR-*` / `DD-UI-*` / `DD-APP-ALG-001` の接続を補強。
  - 運用整合: 管理画面操作の監査導線を `DD-APP-UI-006` で明文化。
  - 品質整合: 実装規約 `DD-DEV-CODE-001` とレビュー規約 `DD-DEV-REV-001` の判定基準を統一。

## 追記（Phase 1: 非機能詳細設計の実体化）
- 対象: `DD-SYS-SEC-001`, `DD-APP-ERR-001`, `DD-SYS-SCALE-001`, `DD-APP-DB-003`, `BD-SYS-ADR-020`
- 実施:
  - `DD-SYS-SEC-001` を更新し、認証/認可境界、入力検証、秘密情報管理、監査ログ、障害時ハンドリングを具体化。
  - `DD-APP-ERR-001` を更新し、コード体系、HTTPマッピング、再試行ポリシー、ログ連携ルールを追加。
  - `DD-SYS-SCALE-001` を更新し、スケール対象、適用トリガ、縮退方針、監視判定を明文化。
  - `DD-APP-DB-003` を更新し、段階移行（expand/backfill/switch/contract）、互換期間、ロールバック条件を追加。
  - 設計決定として `BD-SYS-ADR-020` を新規作成し、非機能DDの必須記載項目と判定軸を統一。
- 影響確認:
  - 設計整合: `RQ-RDR-023 -> BD-SYS-ADR-020 -> DD-SEC/ERR/SCALE/MIG` の追跡経路を追加。
  - 運用整合: 障害時の一次切り分けに必要な失敗条件と再試行/ロールバック条件をDDで直接参照可能化。
  - 受入整合: DD記載内容から `AT-OPS-001` / `AT-RPT-001` / `AT-RUN-001` への証跡連携を補強。

## 追記（単体テスト方針の4領域分割とケース再配置）
- 対象: `UT-PLAN-001`, `UT-PLAN-002`, `UT-PLAN-003`, `UT-PLAN-004`, `UT-PLAN-005`, `UT-CASE-001`〜`UT-CASE-011`, `UT-MOCK-001`, `UT-COV-001`, `UT-STAT-001`, `UT-MET-001`
- 実施:
  - `UT-PLAN-001` を統括計画へ再編し、領域別計画（DOC/INF/FE/BE）へのハブとして更新。
  - 領域別計画 `UT-PLAN-002`（DOC）、`UT-PLAN-003`（INF）、`UT-PLAN-004`（FE）、`UT-PLAN-005`（BE）を新規追加。
  - 単体テストケース配下を領域ディレクトリへ再編し、既存 `UT-CASE-001`〜`UT-CASE-008` を `04.バックエンド(BE)` へ移動。
  - 領域構造を固定するため `UT-CASE-009`（DOC）、`UT-CASE-010`（INF）、`UT-CASE-011`（FE）を新規追加。
  - `UT-MOCK-001` / `UT-COV-001` / `UT-STAT-001` / `UT-MET-001` を更新し、4領域別の観点と実行方針を明記。
- 影響確認:
  - UT整合: 方針（PLAN）と実行単位（CASE）が4領域で対応し、責務境界が明確化。
  - トレーサビリティ整合: `UT-PLAN-001 -> UT-PLAN-002..005 -> UT-CASE-009..011/001..008` の追跡経路を構築。
  - 運用整合: docs/infra/front/backendの変更時に、影響領域のみ再実行する方針を文書上で判定可能化。

## 追記（Quartz前提の静的トレーサビリティ運用へ移行）
- 対象: `RQ-RDR-033`, `RQ-RTM-001`, `RQ-RTM-002`, `RQ-DG-001`, `Taskfile.yaml`, `.opencode/skills/obsidian-trace/scripts/generate_rtm_views.py`, `.opencode/skills/doc-rq-rtm/SKILL.md`, `.opencode/skills/doc-rq-rtm/TEMPLATE.md`, `docs/index.md`
- 実施:
  - `RQ-RDR-033` を新規作成し、Dataview依存を廃止して静的Markdownで追跡する方針を決定記録化。
  - `RQ-RTM-001` を要求別ビューとして改訂し、Dataview節を廃止して静的生成運用へ更新。
  - `RQ-RTM-002` を新規追加し、設計別ビューを分離して公開サイトで追跡できる構成へ拡張。
  - `generate_rtm_views.py` を追加し、frontmatter/本文リンクから要求別・設計別の静的テーブルを自動生成可能化。
  - `Taskfile.yaml` に `task docs:trace` を追加し、RTM再生成を標準手順化。
  - `RQ-DG-001` の改修フローと受入基準に、`RQ-RTM-001/002` 再生成反映を追加。
  - `doc-rq-rtm` スキルとテンプレートを、Quartz表示可能な静的追跡前提へ同期。
  - `docs/index.md` の入口に [[RQ-RTM-002]] を追加。
- 影響確認:
  - 要求整合: `RQ-RDR-033 -> RQ-RTM-001/002` で、追跡方式の決定根拠と公開形態を追跡可能。
  - 運用整合: `RQ-DG-001` と `doc-rq-rtm` の更新により、更新フローと作業ガイドの規約差分を解消。
  - 公開整合: Quartz上でDataview非対応でも、要求別/設計別の追跡ビューを静的ページとして参照可能。

## 追記（RTMの要件対象をFR/NFRへ限定）
- 対象: `.opencode/skills/obsidian-trace/scripts/generate_rtm_views.py`, `RQ-RTM-001`, `RQ-RTM-002`
- 実施:
  - RTM自動生成ロジックを更新し、要求側の集計対象を `51.機能要求(FR)` と `61.非機能要求(NFR)` 配下の `RQ-*` に限定。
  - 要求別/設計別ビューの見出し・説明を FR/NFR 前提へ更新。
- 影響確認:
  - トレーサビリティ整合: 用語/UC/RDR等の補助文書を主表から除外し、設計がどのFR/NFRを満たすかを優先表示できる。
  - 公開整合: Quartz上のRTMがレビュー観点（FR/NFR起点）に一致する。

## 追記（DB正本 + 3層構造を前提にBDを再整理）
- 対象: `RQ-RDR-034`, `BD-SYS-ADR-021`, `BD-SYS-ARCH-001`, `BD-APP-DATA-001`, `BD-APP-API-001`, `BD-APP-API-002`, `BD-APP-UI-001`, `BD-INF-DEP-004`, `DD-APP-API-001`, `DD-APP-API-005`, `AT-SCN-006`
- 実施:
  - `RQ-RDR-034` を新規作成し、原本データのDB正本化、利用者検索の静的JSON継続、将来API検索の段階導入を要求決定として記録。
  - `BD-SYS-ADR-021` を新規作成し、更新系（管理画面->Backend API->DB）と参照系（利用者UI->S3静的JSON）の責務境界を設計決定として固定。
  - `BD-SYS-ARCH-001` を更新し、3層境界（プレゼンテーション/アプリケーション/データ）と更新系・参照系の分離フローをMermaidへ反映。
  - `BD-APP-DATA-001` を更新し、DB正本層/配信生成層/配信公開層のデータライフサイクルと公開切替ルールを追加。
  - `BD-APP-API-001` と `BD-APP-API-002` を更新し、利用者向け参照契約（静的）と管理画面向け更新契約（API）を分離。
  - `BD-APP-UI-001` を更新し、管理画面更新系UIと利用者参照系UIの境界を明記。
  - `BD-INF-DEP-004` を更新し、`/web/*` 配信領域と `/docs/*` 経路の公開境界を補強。
  - `DD-APP-API-001` / `DD-APP-API-005` を最小追従し、DB正本前提とタグ更新・公開反映APIを追加。
  - `AT-SCN-006` に静的JSON確認と情報漏えい確認観点を追加。
- 影響確認:
  - トレーサビリティ整合: `RQ-RDR-034 -> BD-SYS-ADR-021 -> BD-ARCH/DATA/API/DEP -> DD-API/AT-SCN` の経路を構築。
  - 設計整合: 3層責務境界とパス分岐設計（`/web/*` `/docs/*` `/openapi/*` `/api/v1/*`）を矛盾なく接続。
  - 将来拡張整合: 高度あいまい検索はMVP外のまま、API検索追加ポイントを設計境界として予約。

## 追記（全体見直し: アーキテクチャ波及と実行計画の具体化）
- 対象: `RQ-RDR-003`, `RQ-FR-005`, `RQ-FR-009`, `RQ-GL-005`, `RQ-DATA-001`, `RQ-INT-001`, `BD-SYS-ARCH-001`, `BD-SYS-ARCH-002`, `BD-SYS-ARCH-003`, `BD-SYS-ARCH-004`, `BD-APP-DATA-002`, `BD-APP-API-003`, `BD-APP-UI-001`, `BD-APP-UI-003`, `BD-INF-DEP-004`, `BD-APP-DATA-001`
- 実施:
  - `RQ-RDR-003` を廃止し、DB正本+生成配信の決定 `RQ-RDR-034` へ統合。
  - タグ管理要求/用語（`RQ-FR-005`, `RQ-FR-009`, `RQ-GL-005`）をDB正本更新と公開切替前提へ更新。
  - 非機能要求（`RQ-DATA-001`, `RQ-INT-001`）に正本DBと配信成果物の整合判定を追加。
  - `BD-SYS-ARCH-002/003/004` を全面更新し、論理境界・クラウド配置・主要データフローを3層構造へ再編。
  - `BD-APP-DATA-002` を実体化し、収集実行/タグ管理/公開反映（publish run）をER図へ反映。
  - `BD-APP-API-003` を実体化し、更新系/参照系分離のエラーモデルを定義。
  - `BD-APP-UI-001` と `BD-APP-UI-003` に配信反映ジョブ画面（UI-A06）と失敗復帰導線を追加。
  - `BD-INF-DEP-004` に Phase A-D の段階実行計画を追加し、実行順序を明示。
- 影響確認:
  - アーキテクチャ整合: `BD-SYS-ARCH-001` をハブに、`ARCH-002/003/004` と `ERD/API/UI/DEP` の責務分割を統一。
  - データ整合: タグ/動画の正本管理、publish run、公開切替の責務をRQ-BD間で接続。
  - 運用整合: 管理画面拡張（反映実行・再試行・ロールバック確認）を設計文書と実行計画で一貫化。

## 追記（MVP確定APIの過不足見直しとDD処理ロジック明記）
- 対象: `DD-APP-API-001`〜`DD-APP-API-010`, `DD-APP-API-011`, `DD-APP-API-012`, `DD-APP-API-013`, `DD-APP-API-014`, `DD-APP-API-015`, `RQ-RTM-002`, `BD-SYS-ADR-021`
- 実施:
  - MVP対象APIを `DD-APP-API-001` に明示し、運用API正本経路を `/api/v1` へ統一。
  - 既存API（`DD-APP-API-002/003/004/005/008/009/010`）へ処理ロジック、状態遷移、エラーマッピングを追記。
  - 予約境界API（`DD-APP-API-006/007`）をMVP非対象として明記。
  - 不足APIとして `DD-APP-API-011`（収集結果明細）、`DD-APP-API-012`（配信前後再確認）、`DD-APP-API-013`（タグ管理）、`DD-APP-API-014`（ドキュメント公開実行）、`DD-APP-API-015`（配信反映ジョブ状態）を新規追加。
  - `RQ-RTM-002` のDD-API行をFR単位へ再マッピングし、新規APIの追跡行を追加。
  - 設計追加に伴い `BD-SYS-ADR-021` を更新し、管理系API責務分割を記録。
- 影響確認:
  - 要求整合: `RQ-FR-005/017/018/019/024/025` の管理画面運用要件に対して、MVPで必要なAPIが欠落なく定義された。
  - 設計整合: `RQ-RDR-034 -> BD-SYS-ADR-021 -> DD-APP-API-001/005/011..015` の追跡経路を構築。
  - 運用整合: run状態監視と公開反映監視（UI-A06相当）で、`queued/running/succeeded/failed/rolled_back` をAPI応答で一貫判定可能化。

## 追記（AT/ITの運用API経路を `/api/v1/ops` へ同期）
- 対象: `IT-CASE-001`, `IT-CASE-002`, `IT-CASE-007`, `IT-CASE-008`, `AT-SCN-004`, `AT-SCN-005`
- 実施:
  - DD側の経路正本化に合わせ、結合テストケースと受入シナリオのAPI実行パスを `/ops/*` から `/api/v1/ops/*` へ更新。
  - `AT-SCN-004` の前提条件（管理者実行可能経路）も `/api/v1/ops` 前提へ同期。
  - 各文書の `updated` と `version` を当日更新。
- 影響確認:
  - テスト整合: DD-APP-API-002/003/008/009 の経路仕様と IT/AT 手順が一致した。
  - 運用整合: 旧経路依存による手順誤実行リスクを低減した。

## 追記（TypeScript防御的型付けの設計・スキル反映）
- 対象: `BD-SYS-ADR-022`, `BD-DEV-PIPE-001`, `DD-DEV-CODE-001`, `.opencode/skills/doc-bd-build/SKILL.md`, `.opencode/skills/doc-bd-build/TEMPLATE.md`, `.opencode/skills/doc-dd-code/SKILL.md`, `.opencode/skills/doc-dd-code/TEMPLATE.md`
- 実施:
  - `BD-SYS-ADR-022` を新規作成し、「覚える運用」ではなく「型とツールで事故を塞ぐ」方針を設計決定として記録。
  - `BD-DEV-PIPE-001` を更新し、Brand/Opaque、境界decode、センチネル値禁止、`NonEmptyArray`、unsafe cast局所化、資源解放保証を品質ゲートへ追加。
  - `DD-DEV-CODE-001` を更新し、防御的型付け規約（裸ID回避、判別可能union、boolean blindness回避、shotgun parsing防止）を実装規約として具体化。
  - `doc-bd-build` と `doc-dd-code` のスキル/テンプレートを更新し、今後の文書改訂でも同観点が必須になるよう同期。
- 影響確認:
  - 設計整合: `BD-SYS-ADR-022 -> BD-DEV-PIPE-001 -> DD-DEV-CODE-001` の追跡経路を構築し、方針から実装規約まで一貫化。
  - 運用整合: スキル更新により、境界検証漏れ・センチネル値混入・unsafe cast拡散を文書レビュー時点で検出可能。
  - 品質整合: TypeScript厳格設定（`strict` ほか4設定）と防御的型付け運用を同一ゲートで判定できる状態を確認。

## 追記（AWS Lambda前提ログ設計と30日保持方針の反映）
- 対象: `RQ-RDR-035`, `RQ-OBY-001`, `BD-SYS-ADR-022`, `DD-APP-LOG-001`, `DD-SYS-SEC-001`, `AT-OPS-001`
- 実施:
  - `RQ-RDR-035` を新規作成し、Lambda構造化ログ + CloudWatch Logs 30日保持/31日目以降自動削除の採用理由を決定記録化。
  - `RQ-OBY-001` を更新し、ログ用途分離（operational/security/audit）、必須相関キー、禁止記録項目、30日保持を受入基準へ反映。
  - `BD-SYS-ADR-022` を新規作成し、ログ収集経路（stdout -> CloudWatch）、サンプリング方針、保持方針を設計決定として固定。
  - `DD-APP-LOG-001` を更新し、共通JSONスキーマ、イベント語彙、ログレベル運用、セキュリティ制約、保持削除ルールを具体化。
  - `DD-SYS-SEC-001` の監査ログ保持期間を30日へ更新。
  - `AT-OPS-001` にCloudWatch保持設定（30日）確認観点を追加。
- 影響確認:
  - 要求整合: `RQ-RDR-035 -> RQ-OBY-001` で、運用・セキュリティ・監査を分離した判定軸を要求層に固定。
  - 設計整合: `RQ-RDR-035 -> BD-SYS-ADR-022 -> DD-APP-LOG-001` の追跡経路を追加し、AWS運用実態に一致したログ設計へ更新。
  - コスト整合: 長期アーカイブを採用せず30日保持に統一し、[[RQ-COST-001]] の上限制約と整合。
  - 運用制約: 30日超過後の詳細調査は不可となるため、AT日次/週次サマリの欠測を防ぐ運用が前提。

## 追記（DB正本拡張に向けたDDL/制約の具体化）
- 対象: `BD-APP-DATA-001`, `BD-APP-DATA-002`, `DD-APP-DB-002`, `DD-APP-DB-006`, `DD-APP-DB-010`, `DD-APP-DB-012`, `DD-APP-DB-013`, `DD-APP-DB-014`, `DD-APP-DB-015`, `DD-APP-DB-016`, `DD-APP-DB-017`, `DD-APP-DB-001`, `DD-APP-DB-004`, `DD-APP-DB-003`, `DD-APP-API-011`
- 実施:
  - `videos` に品質属性（`validation_status`, `missing_fields`, `supplement_required`）を追加し、[[RQ-DATA-001]] の品質追跡要件をDDLへ反映。
  - 収集runの動画単位結果を保持する `ingestion_items` を追加し、`DD-APP-API-011` の明細取得正本を `ingestion_events` 集約から分離。
  - 配信前後再確認向けに `recheck_runs` / `recheck_items` を追加し、[[RQ-FR-019]] の差分記録要件をrun/明細で追跡可能化。
  - 公開反映run向けに `publish_runs` / `publish_steps` / `publish_artifacts` を追加し、生成/検証/切替/ロールバックを履歴管理可能化。
  - run状態語彙を `queued/running/succeeded/failed/partial/cancelled` 系へ統一し、制約文書と移行文書に反映。
  - `BD-APP-DATA-002` / `BD-APP-DATA-001` を更新し、DB正本・再確認・配信反映の責務境界をERDとデータライフサイクルで整合化。
- 影響確認:
  - 要求整合: `RQ-DATA-001`, `RQ-FR-017`, `RQ-FR-019`, `RQ-FR-025` の受入観点（追跡性/差分確認/公開反映）をDDL実体へ接続。
  - 設計整合: `RQ-RDR-034 -> BD-SYS-ADR-021 -> BD-APP-DATA-001/BD-APP-DATA-002 -> DD-DDL/DBCON/MIG` の追跡経路を補強。
  - 移行整合: `DD-APP-DB-003` に expand/backfill/switch/contract の適用順序を追記し、既存運用を止めない段階導入条件を明確化。

## 追記（LLM支援タグ運用フローのRQ/BD/DD反映）
- 対象: `RQ-RDR-036`, `RQ-FR-019`, `RQ-UC-009`, `BD-SYS-ADR-021`, `BD-APP-API-002`, `BD-APP-UI-001`, `BD-APP-DATA-001`, `DD-APP-API-013`, `DD-APP-UI-006`
- 実施:
  - `RQ-RDR-036` を新規追加し、管理画面でのコピペ入力生成 -> 外部LLM提案 -> JSON取込検証 -> DB反映の運用境界を決定記録化。
  - `RQ-FR-019` と `RQ-UC-009` を更新し、JSON検証成功時のみ反映する条件と、反映後に `tag_master.json` / `archive_index.pN.json` を更新する運用を追加。
  - `BD-SYS-ADR-021` を更新し、外部提案と内部反映の責務分離、同一公開runでの2成果物再生成方針を追加。
  - `BD-APP-API-002` にタグ提案入力契約/タグ提案取込契約を追加し、`BD-APP-UI-001` の UI-A04 操作をコピー/JSONアップロード/検証確認まで拡張。
  - `BD-APP-DATA-001` に取込検証層と import属性を追加し、検証失敗時の未反映ルールを品質ゲートへ反映。
  - `DD-APP-API-013` を拡張し、`/admin/tagging/prompts` と `/admin/tagging/imports`、JSON契約、エラーマッピングを追加。
  - `DD-APP-UI-006` に提案入力コピー・JSON取込・検証失敗時のUI挙動を追加。
- 影響確認:
  - 要求整合: `RQ-RDR-036 -> RQ-FR-019 -> RQ-UC-009` で、手動判断主体を維持しつつLLM支援フローを追跡可能化。
  - 設計整合: `BD-SYS-ADR-021 -> BD-APP-API-002/BD-APP-UI-001/BD-APP-DATA-001 -> DD-APP-API-013/DD-APP-UI-006` の追跡経路を構築。
  - 運用整合: 反映後の公開更新対象を `tag_master` のみでなく `archive_index` まで含め、利用者画面との整合を維持。

## 追記（HTTP APIベストプラクティスのBD/skill反映）
- 対象: `BD-SYS-ADR-023`, `BD-APP-API-005`, `BD-APP-API-001`, `BD-APP-API-002`, `BD-APP-API-003`, `BD-APP-API-004`, `.opencode/skills/doc-bd-api/*`, `.opencode/skills/doc-dd-api/*`, `.opencode/skills/doc-rq-int/*`
- 実施:
  - `BD-SYS-ADR-023` を新規追加し、HTTP API契約統一（HTTPセマンティクス、Problem Details、ページング、互換性、契約運用）の設計判断を記録。
  - `BD-APP-API-005` を新規追加し、URI命名、メソッド意味論、ステータス、カーソルページング、`application/problem+json`、SemVer/廃止、429/Retry-After、`traceparent`、OpenAPI契約正本運用を共通規約として定義。
  - `BD-APP-API-002` を更新し、管理系契約へ共通規約適用（GETボディ禁止、429運用、Problem Details、可観測性）を追記。
  - `BD-APP-API-003` を更新し、共通エラー契約を Problem Details基準へ再編。
  - `BD-APP-API-004` を更新し、SemVer、`deprecated: true`、Deprecation/Sunsetヘッダ、CI破壊的変更検知を追加。
  - `BD-APP-API-001` を更新し、利用者向け静的参照契約にもHTTP共通規約（ステータス/キャッシュ/エラーフォールバック）の参照を追加。
  - `doc-bd-api`/`doc-dd-api`/`doc-rq-int` の SKILL/TEMPLATE を更新し、API契約レビューの必須観点へ同ルールを同期。
- 影響確認:
  - 設計整合: `BD-SYS-ADR-023 -> BD-APP-API-005 -> BD-APP-API-002/003/004` の追跡経路を構築。
  - 要求整合: `RQ-INT-001`（互換性）、`RQ-SEC-001`（認可/情報露出抑制）、`RQ-OBY-001`（相関ID/トレース）と矛盾しない契約基準を確立。
  - 運用整合: skill更新により、今後のBD/DD/RQ-INT更新で同一API観点（Problem Details/互換性/CIゲート）を継続適用可能。

## 追記（Next.js App RouterベストプラクティスのBD/skill反映）
- 対象: `BD-SYS-ADR-024`, `BD-SYS-ARCH-001`, `BD-DEV-PIPE-001`, `BD-SYS-SEC-001`, `BD-SYS-QUAL-001`, `.opencode/skills/doc-bd-arch/*`, `.opencode/skills/doc-bd-build/*`, `.opencode/skills/doc-bd-sec/*`, `.opencode/skills/doc-bd-qual/*`
- 実施:
  - `BD-SYS-ADR-024` を新規追加し、App Router前提の設計標準（Server Components優先、Dynamic API利用境界、Route Handlers運用、キャッシュ再検証、セキュリティ統制）を決定記録化。
  - `BD-SYS-ARCH-001` に Web実行境界（RSC/Client分離、Dynamic API波及、Server->Route Handlers回避、Suspense/streaming）を追加。
  - `BD-DEV-PIPE-001` に Next.js本番品質ゲート（`next build` + `next start`、bundle analyzer、Web Vitals、`next/image`/`<Script>`、再検証設計）を追加。
  - `BD-SYS-SEC-001` を更新し、Server Actions認可、秘密情報境界（`.env`/`NEXT_PUBLIC_`）、CSP、認証経路境界を具体化。
  - `BD-SYS-QUAL-001` を更新し、体感性能・キャッシュ層・再検証・本番計測の品質特性を明文化。
  - 対応4スキル（`doc-bd-arch/build/sec/qual`）の `SKILL.md` と `TEMPLATE.md` を同期更新し、今後の文書改訂で同観点が漏れないようにした。
- 影響確認:
  - 設計整合: `BD-SYS-ADR-024 -> BD-SYS-ARCH-001/BD-DEV-PIPE-001/BD-SYS-SEC-001/BD-SYS-QUAL-001` の追跡経路を構築。
  - 要求整合: `RQ-DEV-001`, `RQ-PS-001`, `RQ-SEC-001`, `RQ-UX-001` と矛盾せず、受入観点（性能/安全/運用）をBDへ具体化。
  - 運用整合: 対応4スキル更新により、Next.js App Router前提の設計観点が docs 更新フローで継続適用可能。

## 追記（Hono + Zod 実装規約のBD/skill反映）
- 対象: `BD-SYS-ADR-025`, `BD-APP-API-005`, `BD-APP-API-002`, `BD-APP-API-003`, `.opencode/skills/doc-bd-api/*`, `.opencode/skills/doc-dd-api/*`
- 実施:
  - `BD-SYS-ADR-025` を新規追加し、Hono + Zod の入力検証・例外処理・型共有方針を設計判断として固定。
  - `BD-APP-API-005` を更新し、ValidationTargets単位検証、`c.req.valid(...)`、`HTTPException` + `app.onError` 集約、Zod v4運用（`safeParseAsync`, `z.flattenError()`）を共通規約へ追加。
  - `BD-APP-API-002` を更新し、更新系APIの実装準拠先として `BD-APP-API-005` / `BD-SYS-ADR-025` を追記。
  - `BD-APP-API-003` を更新し、ZodError起因の検証詳細を Problem Details拡張へ返す方針を追加。
  - `doc-bd-api` の `SKILL.md` / `TEMPLATE.md` を更新し、Hono + Zod 観点（検証境界、エラー整形、RPC型共有）を必須化。
  - `doc-dd-api` の `SKILL.md` / `TEMPLATE.md` を更新し、実装規約（`@hono/zod-validator`, `safeParseAsync`, `HTTPException`, `app.onError`）をチェック項目へ追加。
- 影響確認:
  - 設計整合: `BD-SYS-ADR-025 -> BD-APP-API-005 -> BD-APP-API-002/003` の追跡経路を構築。
  - 要求整合: `RQ-SEC-001`（入力検証/情報露出抑制）、`RQ-INT-001`（契約整合）、`RQ-DEV-001`（実装標準化）と矛盾しない運用基準を確立。
  - 運用整合: 対応2スキル更新により、今後のBD-API/DD-API更新時に同一のHono + Zod観点を継続適用可能。

## 追記（@hono/zod-openapi 統一方針のBD/skill反映）
- 対象: `BD-SYS-ADR-025`, `BD-APP-API-005`, `.opencode/skills/doc-bd-api/*`, `.opencode/skills/doc-dd-api/*`
- 実施:
  - `BD-SYS-ADR-025` を更新し、API契約定義方式を `@hono/zod-openapi`（`OpenAPIHono` + `createRoute()` + `app.openapi()`）へ統一する決定を追加。
  - `BD-APP-API-005` を更新し、Schema-first契約規約（`z` import元統一、`.openapi('SchemaName')`、`summary`/`operationId`/`tags`、`responses` 定義）を追加。
  - `BD-APP-API-005` の契約運用規約へ、`/openapi/v1/openapi.json` と `/openapi/` の配布経路固定、および `/api/v1/*` との版整合を追記。
  - `doc-bd-api` の `SKILL.md` / `TEMPLATE.md` を更新し、設計観点に `@hono/zod-openapi` の必須チェックを追加。
  - `doc-dd-api` の `SKILL.md` / `TEMPLATE.md` を更新し、詳細設計観点に `request.params/query/body` と `createRoute` 起点の定義規約を追加。
- 影響確認:
  - 設計整合: `BD-SYS-ADR-025 -> BD-APP-API-005` の追跡を強化し、契約定義方式の揺れを解消。
  - 運用整合: 対応2スキル更新により、今後のBD/DD API文書改訂で `@hono/zod-openapi` 観点を継続適用可能。

## 追記（要求重複・矛盾レビュー指摘の是正）
- 対象: `RQ-FR-009`, `RQ-UC-004`, `RQ-FR-005`, `RQ-FR-019`, `RQ-RTM-001`
- 実施:
  - `RQ-FR-009` と `RQ-UC-004` の無効タグ扱いを「入力エラー通知 + 当該条件未適用」に統一。
  - `RQ-FR-005` に責務境界節を追加し、通常のタグ辞書運用を正本化。
  - `RQ-FR-019` に責務境界節を追加し、配信前後再確認に紐づくLLM支援JSON取込・検証反映を正本化。
  - `RQ-RTM-001` の要求別ビューから、廃止済み `[[RQ-RDR-003]]` をタグ辞書系要求の根拠列から除外。
- 影響確認:
  - 要求整合: タグ運用における通常更新フローと配信前後再確認フローの境界がFR間で一意に読める。
  - UC整合: 無効タグ入力時の利用者体験がFRとUCで同一になり、実装判断の揺れを抑止。
  - トレーサビリティ整合: タグ辞書系要求の根拠RDRを現行決定（`[[RQ-RDR-034]]` ほか）へ寄せ、廃止決定の混在を低減。

## 追記（UX NFRに対するBD設計トレース不足の補完）
- 対象: `BD-APP-UI-002`, `BD-APP-UI-004`, `BD-SYS-SEC-001`, `BD-SYS-QUAL-001`, `RQ-RTM-001`, `RQ-RTM-002`
- 実施:
  - `BD-APP-UI-002` に `[[RQ-UX-003]]` / `[[RQ-UX-013]]` / `[[RQ-UX-015]]` / `[[RQ-UX-020]]` の設計要点（入力再利用、ヘルプ導線、将来拡張時代替導線）を追加。
  - `BD-APP-UI-004` に `[[RQ-UX-017]]` の状態通知要件（`aria-live`、通知文構成、再確認導線）を追加。
  - `BD-SYS-SEC-001` に `[[RQ-UX-022]]` の外部サービス評価（VPAT等）と代替導線・再評価運用を追加。
  - `BD-SYS-QUAL-001` に `[[RQ-UX-023]]` の受付SLA/是正プロセス品質を追加。
  - `task docs:trace` を実行し、`RQ-RTM-001` / `RQ-RTM-002` の静的ビューを再生成してトレース反映を同期。
- 影響確認:
  - 要求整合: UX NFRのうちBD未到達だった `RQ-UX-013` / `RQ-UX-015` / `RQ-UX-017` / `RQ-UX-020` / `RQ-UX-022` / `RQ-UX-023` について、対応するBD設計観点を追加。
  - 設計整合: `RQ-RDR-018` / `RQ-RDR-023` の影響範囲に記載されたBDトレース先（UI/SEC/QUAL）とRTMの記載が一致。
  - 運用整合: `task docs:guard` 実行でリンク補正と整合チェックを通過し、追跡ビュー更新後も整合性を維持。

## 追記（BD準拠確認で判明したDD不足の是正）
- 対象: `DD-APP-ERR-001`, `DD-APP-API-001`, `DD-APP-MOD-001`, `DD-APP-DB-002`, `DD-SYS-AV-001`, `DD-SYS-PERF-001`, `DD-SYS-SCALE-001`
- 実施:
  - `DD-APP-ERR-001` を Problem Details（`application/problem+json`）正本へ更新し、必須/拡張メンバー（`type/title/status/detail/instance` + `code/retryable/trace_id/errors[]` 等）を明記。
  - `DD-APP-API-001` の共通エラーモデルを Problem Details 基準へ統一し、`traceId` 表記を `trace_id` に統一。
  - API/エラー契約の追跡性を補強するため、`DD-APP-ERR-001` と `DD-APP-API-001` に `BD-APP-API-003` / `BD-APP-API-005` 参照を追加。
  - アーキテクチャ/データ/品質の追跡不足補完として、`DD-APP-MOD-001` に `BD-SYS-ARCH-002` / `BD-SYS-ARCH-003` / `BD-APP-UI-003`、`DD-APP-DB-002` に `BD-APP-DATA-002`、`DD-SYS-AV-001` / `DD-SYS-PERF-001` / `DD-SYS-SCALE-001` に `BD-SYS-QUAL-001`（`DD-SYS-SCALE-001` は `BD-SYS-ARCH-004` も）を追加。
- 影響確認:
  - 設計整合: `BD-APP-API-003/005` の契約方針とDDエラー設計の矛盾（Problem Details未準拠）を解消。
  - トレーサビリティ整合: 優先不足対象（API共通方針/エラーモデル/論理構成/ERD/品質特性）からDDへの参照経路を補強。
  - 運用整合: 監視・ログ相関キーを `trace_id` に統一し、`DD-APP-LOG-001` との参照整合を維持。

## 追記（インフラBD/DD文書の新規追加）
- 対象: `BD-SYS-ADR-026`, `BD-SYS-ARCH-006`, `BD-INF-DEP-005`, `BD-INF-MON-003`, `DD-INF-DEP-003`, `DD-INF-SEC-003`, `DD-SYS-AV-002`, `DD-INF-MON-002`
- 実施:
  - `BD-SYS-ADR-026` を新規追加し、インフラ設計を配信境界/運用境界/監視境界で分割する方針を決定記録化。
  - `BD-SYS-ARCH-006` を新規追加し、経路分離（`/web/*`, `/docs/*`, `/openapi/*`, `/api/v1/*`）を前提にしたインフラ境界アーキテクチャを定義。
  - `BD-INF-DEP-005` を新規追加し、docs/front/backend/infra の領域分割デプロイ設計とロールバック方針を追加。
  - `BD-INF-MON-003` を新規追加し、可用性/性能/セキュリティ/ログ品質の4軸SLI/SLO運用を定義。
  - `DD-INF-DEP-003` を新規追加し、領域分割配備手順、経路別反映確認、切戻し条件を詳細化。
  - `DD-INF-SEC-003` を新規追加し、経路認証境界、IAM最小権限、秘密情報統制を詳細化。
  - `DD-SYS-AV-002` を新規追加し、経路別可用性指標と一次復旧判定を詳細化。
  - `DD-INF-MON-002` を新規追加し、インフラ監視イベント語彙とログ品質ゲートを詳細化。
- 影響確認:
  - 設計整合: `BD-SYS-ADR-026 -> BD-SYS-ARCH-006/BD-INF-DEP-005/BD-INF-MON-003 -> DD-INF-DEP-003/DD-INF-SEC-003/DD-SYS-AV-002/DD-INF-MON-002` の追跡経路を構築。
  - 要求整合: `RQ-DEV-001` / `RQ-SEC-001` / `RQ-OBY-001` / `RQ-FR-025` の受入観点をインフラ設計粒度へ具体化。
  - 運用整合: 配備・監視・復旧の責務境界を分離し、障害時の再実行範囲を限定できる構成を追加。

## 追記（BDテスト戦略をUT/IT/AT三層へ再構成）
- 対象: `BD-DEV-TEST-001`, `BD-SYS-ADR-026`
- 実施:
  - `BD-DEV-TEST-001` を更新し、単体テスト/結合テスト/受入テストの責務境界を明確化。
  - レベル間接続（UT完了 -> IT着手 -> AT着手）と、Fail時の進行停止ルールを品質ゲートとして追加。
  - 要求保証マトリクス（簡易）を追加し、要求カテゴリごとの主要検証層と最終保証層を明記。
  - 設計決定 `BD-SYS-ADR-026` を新規作成し、三層品質ゲート採用の理由と影響範囲を記録。
- 影響確認:
  - 設計整合: `BD-SYS-ADR-026 -> BD-DEV-TEST-001 -> UT/IT/AT計画` の追跡経路を構築。
  - テスト整合: テスト計画文書（`UT-PLAN-001` / `IT-PLAN-001` / `AT-PLAN-001`）との責務分担が一致。
  - 判定整合: Go/No-Go判定への入力根拠（UT/IT結果とAT判定）の接続を明示。

## 追記（単一Backend APIモノリス前提への構成統一）
- 対象: `RQ-RDR-034`, `RQ-GL-002`, `RQ-FR-018`, `BD-SYS-ADR-004`, `BD-SYS-ADR-021`, `BD-SYS-ARCH-001`, `BD-SYS-ARCH-003`, `BD-SYS-ARCH-004`, `BD-APP-API-001`, `BD-APP-API-002`, `DD-APP-API-001`, `DD-APP-API-002`, `DD-APP-API-012`, `DD-APP-API-014`, `RQ-RTM-002`
- 実施:
  - `RQ-RDR-034` を更新し、バッチ実行方式を「単一Backend API（Hono）内実行」、定期実行を「外部スケジューラ -> 同一運用API起動」に固定。
  - `RQ-GL-002` の定義/適用範囲を、運用API起動 + 同一Backend内バッチ処理へ統一。
  - `RQ-FR-018` の上限超過時表現を「手動確認キュー」から「要確認リストへの状態記録」へ変更し、別サービス前提の誤読を解消。
  - `BD-SYS-ADR-004` を「静的配信+API起動バッチ（単一Backend API）構成」へ改題し、別worker非採用と手動/定期の同一API起動を明記。
  - `BD-SYS-ADR-021` を更新し、収集/再確認/公開反映のrun実行が同一Backend API内で完結する方針を追記。
  - `BD-SYS-ARCH-001/003/004` を更新し、Batch Runner in API と Hono Monolith Runtime を明記して論理/配置/フローを同期。
  - `BD-APP-API-001/002` を更新し、収集後生成タイミングと運用契約に「Backend API内バッチ実行」を追記。
  - `DD-APP-API-001/002/012/014` を更新し、キュー/ワーカー投入表現を「同一Backend API内ジョブ実行モジュールへの登録」へ統一。
  - `RQ-RTM-002` の `BD-SYS-ADR-004` 行を新タイトル・根拠RDRへ更新。
- 影響確認:
  - 要求整合: `RQ-RDR-034 -> RQ-GL-002/RQ-FR-018` で、バッチ定義と管理画面運用要求がモノリス前提に一致。
  - 設計整合: `RQ-RDR-034 -> BD-SYS-ADR-004/021 -> BD-ARCH/API -> DD-API` の経路で「単一Backend API内実行」を一貫追跡可能。
  - 運用整合: 手動/定期とも同一運用API起動となり、実装境界（Honoモノリス）と運用手順の不一致を解消。

## 追記（受入に配信前後再確認・手動タグ運用フローを追加）
- 対象: `AT-SCN-007`, `AT-PLAN-001`, `AT-RPT-001`
- 実施:
  - `AT-SCN-007` を新規作成し、[[RQ-FR-019]] / [[RQ-UC-009]] に基づく運用フロー（再確認 -> 提案入力生成 -> JSON取込検証 -> DB反映 -> 公開反映）を手順化。
  - `AT-SCN-007` 本文に Mermaid のシーケンス図を追加し、成功系/検証失敗/公開反映失敗（`failed|rolled_back`）の分岐を明記。
  - `AT-PLAN-001` の受入シナリオへ [[AT-SCN-007]] を追加し、受入計画での実行対象を明示。
  - `AT-RPT-001` のAPI逆引きとAPI単位判定に [[DD-APP-API-012]] / [[DD-APP-API-013]] / [[DD-APP-API-015]] を追加。
- 影響確認:
  - 受入整合: 要求（[[RQ-FR-019]]）と受入手順（[[AT-SCN-007]]）の間で、運用フローを図と手順の両方で追跡可能化。
  - 判定整合: JSON検証失敗時の未反映、公開反映時の状態監視、旧公開版維持の判断が受入記録項目へ反映された。
  - トレーサビリティ整合: `AT-PLAN -> AT-SCN-007 -> AT-RPT` の記録経路に `DD-APP-API-012/013/015` の逆引きを接続。

## 追記（API/画面/バッチ/バッチイベント一覧の詳細設計リンク整備）
- 対象: `BD-APP-UI-001`, `BD-SYS-ARCH-001`（`BD-APP-API-001` は既存表で要件充足を確認）
- 実施:
  - `BD-APP-UI-001` の画面カタログへ `詳細設計` 列を追加し、画面ごとのDD-UI参照先を明記。
  - `BD-SYS-ARCH-001` に `バッチ一覧` と `バッチイベント一覧` を新設し、run状態遷移とDD-API/DD-DDL/DD-LOG参照を追加。
  - `BD-APP-API-001` は既存で API一覧表 + `詳細設計` 列 + 個別DDリンクが成立していることを確認し、追記対象から除外。
- 影響確認:
  - 設計整合: `BD-APP-UI-001 -> DD-UI-*`、`BD-SYS-ARCH-001 -> DD-API/DD-DDL/DD-LOG` の参照経路を明確化し、`BD-APP-API-001 -> DD-API-*` は既存整備済みであることを確認。
  - 運用整合: 管理画面で扱うrun系操作（収集/再収集/再確認/公開反映/docs公開）の責務と状態イベントの切り分けが容易になった。
  - トレーサビリティ整合: 一覧表から個別詳細設計へ直接遷移でき、レビュー時の確認コストを低減。

## 追記（FR/NFR変更履歴のRDRリンク完全化）
- 対象: `RQ-FR-*`（25件）, `RQ-AV-001` / `RQ-PS-001` / `RQ-SEC-001` / `RQ-PRC-001` / `RQ-DEV-001` / `RQ-DEV-002` / `RQ-COST-001` / `RQ-UX-001`〜`RQ-UX-024`, `RQ-RDR-037`
- 実施:
  - FR/NFRの `## 変更履歴` で、RDRリンク未記載の124行を1行ずつ意味確認し、該当 `[[RQ-RDR-xxx]]` を付与。
  - テンプレート廃止とFR個別SnowCard化の判断根拠として `RQ-RDR-037` を新規追加。
  - 追記したRDRが `related` に未登録だった文書は frontmatter `related` へ追記し、本文履歴と参照を同期。
- 影響確認:
  - 要求整合: FR/NFRすべての変更履歴行から、判断根拠RDRへ直接遷移可能。
  - トレーサビリティ整合: 履歴行の「なぜ変更したか」を文書上で再現できる状態を確認。

## 追記（UT/IT/ATトレース表の経路判定自動生成）
- 対象: `.opencode/skills/obsidian-trace/scripts/generate_rtm_views.py`, `RQ-RTM-002`, `RQ-RDR-037`
- 実施:
  - `generate_rtm_views.py` を拡張し、UT/IT/ATトレース表（要求->AT、BD->IT、DD->UT）を自動生成するブロックを追加。
  - 判定方式を直接リンクではなく経路判定（frontmatter + 本文リンク、`max_depth=4`）へ変更し、`PASS/FAIL` を出力可能化。
  - 判定対象を `AT-SCN` / `IT-CASE` / `UT-CASE` に固定し、`PLAN/RPT/OPS/GO` などは補助文書列で分離表示。
  - `RQ-RTM-002` に新しい自動生成ブロック `TEST_LAYER_TRACE` と運用方針を追加。
  - `RQ-RDR-037` を新規作成し、判定方式の採用理由と影響範囲を記録。
- 影響確認:
  - 要求整合: `RQ-RDR-037 -> RQ-RTM-002` で判定方式の根拠と表示仕様を追跡可能。
  - テスト整合: `BD-DEV-TEST-001` のUT/IT/AT三層責務を、RTM上で機械的に監視できる。
  - 運用整合: `task docs:trace` 実行のみで設計別ビューとテスト層トレースを同時再生成できる。

## 追記（監視文書の機械的記述解消とADR参照整合）
- 対象: `BD-INF-MON-001`, `BD-INF-MON-002`, `BD-INF-MON-003`
- 実施:
  - `BD-INF-MON-001` を再構成し、監視対象/観測点/SLI定義/欠測時運用/[[RQ-GL-011|再収集]]判定条件を具体化。
  - `BD-INF-MON-002` をSLO運用文書として再定義し、SLO目標・エラーバジェット・通知レベル・日次/月次判定・逸脱時フローを追加。
  - `BD-INF-MON-003` の `related` と変更履歴のADR参照を、監視文脈に合わせて `[[BD-SYS-ADR-006]]` / `[[BD-SYS-ADR-014]]` / `[[BD-SYS-ADR-022]]` へ整理。
- 影響確認:
  - 設計整合: `BD-INF-MON-001`（監視対象定義）と `BD-INF-MON-002`（SLO運用判定）の責務分離が成立。
  - トレーサビリティ整合: `RQ-OBY-001` / `RQ-AV-001` / `RQ-PS-001` の受入閾値を監視文書上で直接追跡可能。
  - 運用整合: 欠測時保留、再収集条件、恒久対処への切替条件が文書化され、日次判定の再現性を確保。

## 追記（インフラ系文書のADR参照正規化）
- 対象: `BD-SYS-ARCH-006`, `BD-INF-DEP-005`, `DD-SYS-AV-002`, `DD-INF-DEP-003`, `DD-INF-MON-002`, `DD-INF-SEC-003`, `RQ-RTM-002`
- 実施:
  - インフラ境界/配備経路/監視ログの根拠ADRを `[[BD-SYS-ADR-026]]` から文脈一致するADRへ再割当。
    - 経路境界・認証境界: `[[BD-SYS-ADR-014]]`
    - 監視SLO最小セット: `[[BD-SYS-ADR-006]]`
    - CloudWatch構造化ログ30日保持: `[[BD-SYS-ADR-022]]`
  - 影響6文書のfrontmatter（`up`/`related`）、`## 変更履歴`、`RQ-RTM-002` の該当行を同一変更で同期。
- 影響確認:
  - 設計整合: インフラ系BD/DDの根拠がテスト戦略ADRから分離され、責務境界と根拠が一致。
  - トレーサビリティ整合: `RQ-RTM-002` からインフラ設計の根拠ADRへ遷移した際の意味不一致を解消。
  - 運用整合: 監視・配備・認証統制の判定根拠が実運用文脈へ揃い、レビュー時の誤読リスクを低減。

## 追記（静的配信JSON契約のJSON Schema正本化）
- 対象: `contracts/static-json/bootstrap.schema.json`, `contracts/static-json/tag_master.schema.json`, `contracts/static-json/archive_index_page.schema.json`, `DD-APP-API-001`, `DD-APP-API-004`, `DD-APP-API-005`, `BD-SYS-ADR-021`
- 実施:
  - 利用者向け静的配信契約（`bootstrap.json` / `tag_master.json` / `archive_index.p{page}.json`）を JSON Schema Draft 2020-12 で新規定義。
  - `DD-APP-API-001/004/005` を更新し、必須項目の実データ整合（`bootstrapVersion` / `tagMasterVersion` / `archiveVersion` / `generatedAt`）とスキーマ正本参照を追加。
  - `tag_master.json` の `tags` 可変長タプルを `prefixItems + oneOf` で 2〜5 要素として明示。
  - `BD-SYS-ADR-021` を更新し、静的配信JSON契約のスキーマ正本化と互換方針（必須キー固定・追加キー許容）を設計判断として記録。
- 影響確認:
  - 設計整合: `BD-SYS-ADR-021 -> DD-APP-API-001/004/005 -> contracts/static-json/*.schema.json` の追跡経路を構築。
  - 契約整合: 文書上のIF定義と配信実データの差分を解消し、機械検証可能な契約へ移行。
  - 運用整合: 追加キーを許容する互換方針により、将来の非破壊拡張時の配信停止リスクを低減。

## 追記（インフラAWSリソース一覧の明文化）
- 対象: `BD-INF-DEP-005`
- 実施:
  - `BD-INF-DEP-005` に `## AWSリソース一覧` を追加し、リソース名/個数/構築理由/根拠文書を表形式で整理。
  - 個数は本番環境の論理個数として記載し、未固定となる可能性がある項目は注記で明示。
  - CloudFront/S3/OAC/Function/Lambda/CloudWatch/IAM/Config/Cognito/WAFの10項目を同一表で参照可能化。
- 影響確認:
  - 設計整合: `BD-INF-DEP-005` 単体でインフラ構成の説明責務を満たし、関連文書（`BD-SYS-ARCH-006`, `BD-INF-DEP-004`, `DD-INF-SEC-003`, `DD-APP-LOG-001`, `DD-SYS-COST-001`）へ追跡可能。
  - 運用整合: レビュー時に「何を何個、なぜ作るか」を一覧で確認でき、配備判断の解釈差分を低減。

## 追記（要求に対する基本設計実装レビュー）
- 対象: `reports/review_bd_implementation_2026-02-11.md`
- 実施:
  - `RQ-FR-006/007/015/020/021/022` と `BD-API-001` / `BD-UI-002` を起点に、`web/src/App.tsx` / `web/src/components/VideoModal.tsx` / `web/public/*` の実装有無を照合。
  - 段階ロード（一覧系）は概ね適合、詳細モーダル補助表示（コメント密度波形・ワードクラウド）は未実装と判定。
- 影響確認:
  - 要求整合: `RQ-FR-020/021/022` のMUST項目に対する未実装領域を明示し、次回実装スコープを特定。
  - 設計整合: `BD-API-001` / `BD-UI-002` で定義した静的契約（`highlights/*`, `wordcloud/*`）の実装ギャップを可視化。
  - テスト整合: 受入観点（代替表示・再試行・`t=<秒>`遷移）を実装確認項目として再利用可能化。
