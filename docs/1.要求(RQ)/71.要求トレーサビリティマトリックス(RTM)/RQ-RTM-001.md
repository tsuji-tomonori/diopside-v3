---
id: RQ-RTM-001
title: 要求トレーサビリティ（要求別）
doc_type: 要求トレーサビリティマトリックス
phase: RQ
version: 1.0.6
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-RDR-033]]'
- '[[RQ-RTM-002]]'
- '[[RQ-FR-001]]'
- '[[RQ-AV-001]]'
- '[[BD-TST-001]]'
tags:
- diopside
- RQ
- RTM
---


## 方針
- Quartz公開を前提に、Dataviewへ依存せず静的Markdownで要求トレーサビリティを可視化する。
- 追跡の正本は各文書の `up` / `related` および本文リンク（`[[ID]]`）とし、RTMは自動生成結果を掲載する。
- 手更新の固定マトリクスは作成しない。

## 追跡軸（要求別）
- 要求IDごとに、以下を同一ブロックで追跡する。
  - 根拠決定: `[[RQ-RDR-*]]`
  - 設計決定: `[[BD-ADR-*]]`
  - 設計本文: `[[BD-*]]` / `[[DD-*]]`
  - 検証: `[[UT-*]]` / `[[IT-*]]` / `[[AT-*]]`

## 生成運用
1. docs更新後に `task docs:guard` を実行する。
2. `task docs:trace` を実行し、要求別/設計別の静的ビューを再生成する。
3. 必要に応じて個別追跡（`traceability.py`）を補助的に出力する。
   - `python3 .opencode/skills/obsidian-trace/scripts/traceability.py --docs-root docs --start RQ-FR-001 --depth 4 --direction both --include-related --mode tree --out reports/traceability_rq_fr_001.md`
4. 変更差分を確認し、`RQ-RTM-001` と `RQ-RTM-002` を同時に更新する。

## 運用チェック
- 任意の `RQ-*` から、最低1件の `BD` または `DD` へ到達できる。
- 任意の `BD` / `DD` から、根拠 `RQ-*` と検証 `UT/IT/AT` へ到達できる。
- 断線（存在しないリンクID、孤立文書、RDR/ADR経路欠落）がある場合は修正し、再生成後に反映する。

## 要求別ビュー（静的）
- `task docs:trace` で自動更新する。

<!-- BEGIN AUTO-GENERATED: REQUIREMENT_VIEW -->
- generated_at: 2026-02-11

| 要求ID | タイトル | RDR | ADR | 設計(BD/DD) | 検証(UT/IT/AT) |
| --- | --- | --- | --- | --- | --- |
| [[RQ-AV-001]] | 可用性要件 | [[RQ-RDR-010]], [[RQ-RDR-017]], [[RQ-RDR-023]] | [[BD-ADR-020]] | [[BD-ADR-020]], [[BD-ENV-002]], [[BD-QUAL-001]], [[DD-AV-001]], [[DD-LOG-001]], [[DD-SCALE-001]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]] |
| [[RQ-COST-001]] | コスト要件 | [[RQ-RDR-017]], [[RQ-RDR-027]] | [[BD-ADR-015]] | [[BD-ADR-015]], [[BD-DEP-001]], [[DD-COST-001]] | [[AT-OPS-001]] |
| [[RQ-DATA-001]] | データ要件 | [[RQ-RDR-017]], [[RQ-RDR-023]], [[RQ-RDR-028]], [[RQ-RDR-034]] | [[BD-ADR-020]], [[BD-ADR-021]] | [[BD-ADR-020]], [[BD-ADR-021]], [[BD-API-002]], [[BD-DATA-001]], [[BD-ERD-001]], [[DD-DBCON-001]], [[DD-DBCON-002]], [[DD-DDL-001]], [[DD-DDL-002]], [[DD-DDL-003]], [[DD-DDL-004]], [[DD-DDL-005]], [[DD-MIG-001]], [[DD-SCALE-001]] | [[AT-SCN-004]] |
| [[RQ-DEV-001]] | DevOps要件 | [[RQ-RDR-017]], [[RQ-RDR-024]], [[RQ-RDR-025]], [[RQ-RDR-026]], [[RQ-RDR-029]], [[RQ-RDR-033]] | [[BD-ADR-011]], [[BD-ADR-012]], [[BD-ADR-019]] | [[BD-ADR-011]], [[BD-ADR-012]], [[BD-ADR-019]], [[BD-BUILD-001]], [[BD-DEP-001]], [[BD-DEP-003]], [[BD-DEP-004]], [[BD-ENV-001]], [[BD-ENV-002]], [[DD-CODE-001]], [[DD-MIG-001]], [[DD-REV-001]], [[DD-SEC-001]] | [[AT-GO-001]], [[AT-REL-001]], [[AT-RUN-001]] |
| [[RQ-DEV-002]] | AIエージェント運用要件 | [[RQ-RDR-029]] | [[BD-ADR-016]] | [[BD-ADR-016]], [[BD-ARCH-005]] | - |
| [[RQ-DG-001]] | ドキュメント更新フロー | [[RQ-RDR-010]], [[RQ-RDR-013]], [[RQ-RDR-024]], [[RQ-RDR-033]] | [[BD-ADR-012]], [[BD-ADR-016]] | [[BD-ADR-012]], [[BD-ADR-016]], [[BD-ARCH-005]], [[BD-CM-001]] | [[UT-CASE-009]], [[UT-PLAN-002]] |
| [[RQ-DM-001]] | 動画エンティティ | [[RQ-RDR-014]] | - | - | - |
| [[RQ-DM-002]] | チャンネルエンティティ | [[RQ-RDR-014]] | - | - | - |
| [[RQ-DM-003]] | タグエンティティ | [[RQ-RDR-014]] | - | - | - |
| [[RQ-DM-004]] | [[RQ-GL-013|タグ種別]]エンティティ | [[RQ-RDR-010]], [[RQ-RDR-014]], [[RQ-RDR-015]] | - | - | - |
| [[RQ-DM-005]] | 収集実行エンティティ | [[RQ-RDR-014]] | - | - | - |
| [[RQ-DM-006]] | 収集イベントエンティティ | [[RQ-RDR-014]] | - | - | - |
| [[RQ-DM-007]] | [[RQ-GL-014|検索条件]]モデル | [[RQ-RDR-010]], [[RQ-RDR-014]], [[RQ-RDR-015]] | - | - | - |
| [[RQ-DM-008]] | [[RQ-GL-015|盛り上がり区間]]モデル | - | - | - | - |
| [[RQ-DM-009]] | [[RQ-GL-017|ワードクラウド]]成果物モデル | [[RQ-RDR-021]] | - | - | - |
| [[RQ-FR-001]] | 管理画面から公開動画[[RQ-GL-002|収集ジョブ]]を実行できる | [[RQ-RDR-001]], [[RQ-RDR-006]], [[RQ-RDR-010]], [[RQ-RDR-028]], [[RQ-RDR-030]] | - | [[BD-API-001]], [[BD-API-002]], [[BD-API-003]], [[BD-ARCH-001]], [[BD-ARCH-002]], [[BD-ARCH-003]], [[BD-ARCH-004]], [[BD-BUILD-001]], [[BD-CM-001]], [[BD-DATA-001]], [[BD-DEP-001]], [[BD-DEP-002]], [[BD-ERD-001]], [[BD-MON-001]], [[BD-MON-002]], [[BD-QUAL-001]], [[BD-RET-001]], [[BD-SEC-001]], [[BD-TST-001]], [[BD-UI-001]], [[BD-UI-002]], [[BD-UI-003]], [[BD-UI-004]], [[DD-API-001]], [[DD-API-002]], [[DD-API-003]], [[DD-API-004]], [[DD-API-005]], [[DD-API-006]], [[DD-API-007]], [[DD-API-008]], [[DD-API-009]], [[DD-DDL-007]], [[DD-UI-002]] | - |
| [[RQ-FR-002]] | 管理画面で公式投稿の公開動画をチャンネルID一致で取り込める | [[RQ-RDR-002]], [[RQ-RDR-007]], [[RQ-RDR-010]], [[RQ-RDR-030]] | - | [[BD-API-001]], [[BD-UI-001]] | - |
| [[RQ-FR-003]] | 管理画面で出演条件一致の公開動画を判定して取り込める | [[RQ-RDR-001]], [[RQ-RDR-003]], [[RQ-RDR-010]], [[RQ-RDR-028]], [[RQ-RDR-030]] | - | [[BD-API-001]], [[BD-API-002]], [[BD-UI-001]] | - |
| [[RQ-FR-004]] | 管理画面の収集結果として動画メタデータを正規化できる | [[RQ-RDR-004]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-019]], [[RQ-RDR-022]], [[RQ-RDR-028]], [[RQ-RDR-030]] | - | [[BD-API-001]], [[BD-API-002]], [[BD-DATA-001]], [[BD-UI-001]] | - |
| [[RQ-FR-005]] | [[RQ-GL-005|タグ辞書]]を更新できる | [[RQ-RDR-003]], [[RQ-RDR-005]], [[RQ-RDR-010]], [[RQ-RDR-019]], [[RQ-RDR-034]] | [[BD-ADR-021]] | [[BD-ADR-021]], [[BD-API-001]], [[BD-UI-001]], [[DD-DDL-005]], [[DD-DDL-006]] | - |
| [[RQ-FR-006]] | ページング済み索引を生成できる | [[RQ-RDR-005]], [[RQ-RDR-006]], [[RQ-RDR-010]] | - | [[BD-API-001]], [[BD-UI-001]], [[DD-ALG-001]], [[DD-COMP-001]], [[DD-COMP-002]], [[DD-UI-003]], [[DD-UI-005]] | - |
| [[RQ-FR-007]] | アーカイブ一覧を表示できる | [[RQ-RDR-007]], [[RQ-RDR-008]], [[RQ-RDR-010]] | - | [[BD-API-001]], [[BD-UI-001]], [[DD-ALG-001]], [[DD-UI-005]] | - |
| [[RQ-FR-008]] | キーワード検索できる | [[RQ-RDR-004]], [[RQ-RDR-008]], [[RQ-RDR-010]] | - | [[BD-API-001]], [[BD-UI-001]], [[DD-ALG-001]], [[DD-UI-003]] | - |
| [[RQ-FR-009]] | タグ条件で絞り込みできる | [[RQ-RDR-003]], [[RQ-RDR-009]], [[RQ-RDR-010]] | - | [[BD-API-001]], [[BD-UI-001]], [[DD-DDL-004]], [[DD-DDL-005]] | - |
| [[RQ-FR-010]] | 日付範囲で絞り込みできる | [[RQ-RDR-004]], [[RQ-RDR-010]] | - | [[BD-API-001]], [[BD-UI-001]] | - |
| [[RQ-FR-011]] | 再生時間で絞り込みできる | [[RQ-RDR-004]], [[RQ-RDR-010]] | - | [[BD-API-001]], [[BD-UI-001]] | - |
| [[RQ-FR-012]] | 並び順を切り替えできる | [[RQ-RDR-004]], [[RQ-RDR-010]] | - | [[BD-API-001]], [[BD-UI-001]] | - |
| [[RQ-FR-013]] | 動画詳細モーダルを表示できる | [[RQ-RDR-008]], [[RQ-RDR-010]], [[RQ-RDR-020]], [[RQ-RDR-021]] | - | [[BD-API-001]], [[BD-UI-001]], [[DD-COMP-001]], [[DD-COMP-002]], [[DD-UI-004]] | - |
| [[RQ-FR-014]] | YouTube視聴ページへ遷移できる | [[RQ-RDR-008]], [[RQ-RDR-010]], [[RQ-RDR-020]] | - | [[BD-API-001]], [[BD-UI-001]], [[BD-UI-003]], [[DD-UI-004]] | - |
| [[RQ-FR-015]] | 初回読み込みを高速化する[[RQ-GL-010|段階ロード]]で漸進表示できる | [[RQ-RDR-002]], [[RQ-RDR-010]] | - | [[BD-API-001]], [[BD-UI-001]] | - |
| [[RQ-FR-016]] | 管理画面で読み込み失敗を通知できる | [[RQ-RDR-006]], [[RQ-RDR-010]], [[RQ-RDR-030]] | - | [[BD-API-001]], [[BD-UI-001]], [[DD-UI-006]] | - |
| [[RQ-FR-017]] | 管理画面で収集実行結果を確認できる | [[RQ-RDR-006]], [[RQ-RDR-010]], [[RQ-RDR-019]], [[RQ-RDR-030]] | - | [[BD-API-001]], [[BD-API-002]], [[BD-UI-001]], [[DD-COMP-001]], [[DD-COMP-002]], [[DD-UI-006]] | - |
| [[RQ-FR-018]] | 管理画面で手動[[RQ-GL-011|再収集]]を実行できる | [[RQ-RDR-006]], [[RQ-RDR-010]], [[RQ-RDR-030]] | - | [[BD-API-001]], [[BD-UI-001]], [[DD-UI-006]] | - |
| [[RQ-FR-019]] | 管理画面で配信前後のメタデータ再取得と差分確認を運用できる | [[RQ-RDR-010]], [[RQ-RDR-019]], [[RQ-RDR-028]], [[RQ-RDR-030]] | - | [[BD-API-001]], [[BD-API-002]], [[BD-UI-001]] | - |
| [[RQ-FR-020]] | 詳細画面で[[RQ-GL-016|コメント密度波形]]を表示し[[RQ-GL-015|盛り上がり区間]]へ遷移できる | [[RQ-RDR-010]], [[RQ-RDR-020]], [[RQ-RDR-022]] | [[BD-ADR-010]] | [[BD-ADR-010]], [[BD-API-001]], [[BD-UI-001]], [[BD-UI-002]], [[BD-UI-003]], [[BD-UI-004]], [[DD-UI-004]] | [[AT-PLAN-001]], [[AT-SCN-003]] |
| [[RQ-FR-021]] | 動画詳細で[[RQ-GL-017|ワードクラウド]]を表示できる | [[RQ-RDR-010]], [[RQ-RDR-021]], [[RQ-RDR-022]] | [[BD-ADR-009]] | [[BD-ADR-009]], [[BD-API-001]], [[BD-UI-001]], [[BD-UI-002]], [[BD-UI-004]], [[DD-UI-004]] | [[AT-PLAN-001]], [[AT-SCN-003]] |
| [[RQ-FR-022]] | [[RQ-GL-016|コメント密度波形]]表示用データを生成できる | [[RQ-RDR-010]], [[RQ-RDR-022]] | [[BD-ADR-010]] | [[BD-ADR-010]], [[BD-API-001]], [[BD-UI-001]], [[BD-UI-002]] | - |
| [[RQ-FR-023]] | [[RQ-GL-017|ワードクラウド]]表示用画像を生成できる | [[RQ-RDR-010]], [[RQ-RDR-021]], [[RQ-RDR-022]] | - | [[BD-API-001]], [[BD-UI-002]] | - |
| [[RQ-FR-024]] | 管理画面でドキュメント公開を一括実行できる | [[RQ-RDR-010]], [[RQ-RDR-025]], [[RQ-RDR-030]] | [[BD-ADR-013]] | [[BD-ADR-013]], [[BD-DEP-003]], [[BD-UI-001]], [[BD-UI-003]], [[DD-DEP-001]], [[DD-UI-006]] | [[AT-PLAN-001]], [[AT-REL-001]] |
| [[RQ-FR-025]] | 管理画面運用の前提として単一CloudFrontで配信経路をパス分岐できる | [[RQ-RDR-010]], [[RQ-RDR-026]], [[RQ-RDR-030]], [[RQ-RDR-034]] | [[BD-ADR-014]], [[BD-ADR-021]] | [[BD-ADR-014]], [[BD-ADR-021]], [[BD-API-004]], [[BD-DEP-004]], [[BD-UI-001]], [[BD-UI-003]], [[DD-API-010]], [[DD-DEP-002]] | [[AT-SCN-006]] |
| [[RQ-GL-001]] | [[RQ-GL-001|diopside]] | [[RQ-RDR-010]], [[RQ-RDR-012]], [[RQ-RDR-013]], [[RQ-RDR-025]] | [[BD-ADR-001]], [[BD-ADR-002]], [[BD-ADR-003]], [[BD-ADR-004]], [[BD-ADR-005]], [[BD-ADR-006]], [[BD-ADR-007]], [[BD-ADR-008]] | [[BD-ADR-001]], [[BD-ADR-002]], [[BD-ADR-003]], [[BD-ADR-004]], [[BD-ADR-005]], [[BD-ADR-006]], [[BD-ADR-007]], [[BD-ADR-008]], [[BD-API-003]], [[BD-ARCH-002]], [[BD-ARCH-003]], [[BD-ARCH-004]], [[BD-CM-001]], [[BD-DEP-001]], [[BD-DEP-002]], [[BD-ERD-001]], [[BD-MON-001]], [[BD-MON-002]], [[BD-QUAL-001]], [[BD-RET-001]], [[BD-SEC-001]], [[BD-TST-001]], [[BD-UI-001]] | [[AT-PLAN-001]] |
| [[RQ-GL-002]] | [[RQ-GL-002|収集ジョブ]] | [[RQ-RDR-012]], [[RQ-RDR-013]] | - | [[BD-API-002]], [[BD-ARCH-001]], [[BD-UI-001]], [[DD-API-001]], [[DD-API-002]], [[DD-API-003]], [[DD-LOG-001]], [[DD-SCALE-001]] | [[AT-SCN-004]], [[AT-SCN-005]], [[IT-CASE-001]], [[IT-PLAN-001]], [[UT-CASE-001]], [[UT-PLAN-005]] |
| [[RQ-GL-003]] | [[RQ-GL-003|公式投稿動画]] | [[RQ-RDR-012]], [[RQ-RDR-013]] | - | - | [[AT-PLAN-001]] |
| [[RQ-GL-004]] | [[RQ-GL-004|出演動画]] | [[RQ-RDR-001]], [[RQ-RDR-012]], [[RQ-RDR-013]] | - | [[BD-ARCH-001]], [[DD-API-002]] | [[AT-PLAN-001]], [[AT-SCN-002]], [[AT-SCN-004]] |
| [[RQ-GL-005]] | [[RQ-GL-005|タグ辞書]] | [[RQ-RDR-003]], [[RQ-RDR-012]], [[RQ-RDR-013]], [[RQ-RDR-019]] | [[BD-ADR-003]], [[BD-ADR-015]] | [[BD-ADR-003]], [[BD-ADR-015]], [[BD-API-001]], [[DD-ALG-001]], [[DD-API-001]], [[DD-API-005]], [[DD-COST-001]], [[DD-DDL-001]], [[DD-DDL-005]], [[DD-DDL-006]], [[DD-UI-003]] | [[AT-RPT-001]], [[AT-SCN-002]], [[IT-CASE-004]], [[IT-PLAN-001]], [[UT-CASE-004]], [[UT-CASE-006]], [[UT-PLAN-005]] |
| [[RQ-GL-006]] | [[RQ-GL-006|アーカイブ索引]] | [[RQ-RDR-005]], [[RQ-RDR-012]], [[RQ-RDR-013]] | - | - | - |
| [[RQ-GL-007]] | [[RQ-GL-007|bootstrap]] | [[RQ-RDR-012]], [[RQ-RDR-013]] | - | [[DD-API-004]] | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] |
| [[RQ-GL-008]] | [[RQ-GL-008|tag_master]] | [[RQ-RDR-012]], [[RQ-RDR-013]] | - | - | [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]] |
| [[RQ-GL-009]] | [[RQ-GL-009|archive_index]] | [[RQ-RDR-012]], [[RQ-RDR-013]] | - | [[BD-API-001]], [[DD-API-001]], [[DD-API-004]] | - |
| [[RQ-GL-010]] | [[RQ-GL-010|段階ロード]] | [[RQ-RDR-002]], [[RQ-RDR-012]], [[RQ-RDR-013]] | [[BD-ADR-002]] | [[BD-ADR-002]], [[BD-API-001]], [[BD-ARCH-001]], [[DD-API-004]], [[DD-COMP-002]], [[DD-SCALE-001]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[IT-CASE-003]], [[UT-CASE-003]] |
| [[RQ-GL-011]] | [[RQ-GL-011|再収集]] | [[RQ-RDR-012]], [[RQ-RDR-013]], [[RQ-RDR-016]], [[RQ-RDR-030]] | [[BD-ADR-001]], [[BD-ADR-002]], [[BD-ADR-003]], [[BD-ADR-004]], [[BD-ADR-005]], [[BD-ADR-006]], [[BD-ADR-007]], [[BD-ADR-008]] | [[BD-ADR-001]], [[BD-ADR-002]], [[BD-ADR-003]], [[BD-ADR-004]], [[BD-ADR-005]], [[BD-ADR-006]], [[BD-ADR-007]], [[BD-ADR-008]], [[BD-API-003]], [[BD-ARCH-001]], [[BD-ARCH-002]], [[BD-ARCH-003]], [[BD-ARCH-004]], [[BD-CM-001]], [[BD-DEP-001]], [[BD-DEP-002]], [[BD-ERD-001]], [[BD-MON-001]], [[BD-MON-002]], [[BD-QUAL-001]], [[BD-RET-001]], [[BD-SEC-001]], [[BD-TST-001]], [[BD-UI-001]], [[BD-UI-003]], [[DD-API-001]], [[DD-API-003]], [[DD-API-008]], [[DD-DDL-003]], [[DD-LOG-001]] | [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-SCN-005]], [[IT-CASE-007]], [[IT-PLAN-001]], [[UT-CASE-007]], [[UT-PLAN-005]] |
| [[RQ-GL-012]] | [[RQ-GL-012|受入判定]] | [[RQ-RDR-009]], [[RQ-RDR-012]], [[RQ-RDR-013]], [[RQ-RDR-017]], [[RQ-RDR-020]], [[RQ-RDR-023]], [[RQ-RDR-028]], [[RQ-RDR-032]] | [[BD-ADR-017]], [[BD-ADR-018]], [[BD-ADR-020]] | [[BD-ADR-017]], [[BD-ADR-018]], [[BD-ADR-020]], [[BD-ARCH-001]] | [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]] |
| [[RQ-GL-013]] | [[RQ-GL-013|タグ種別]] | [[RQ-RDR-010]], [[RQ-RDR-015]] | - | [[BD-ARCH-001]], [[BD-UI-002]], [[DD-API-001]], [[DD-DDL-006]] | - |
| [[RQ-GL-014]] | [[RQ-GL-014|検索条件]] | [[RQ-RDR-010]], [[RQ-RDR-015]] | - | [[BD-UI-002]], [[BD-UI-003]], [[DD-ALG-001]], [[DD-COMP-002]], [[DD-LOG-001]], [[DD-UI-002]], [[DD-UI-003]] | [[AT-OPS-001]], [[AT-SCN-002]], [[UT-CASE-011]], [[UT-COV-001]], [[UT-PLAN-004]] |
| [[RQ-GL-015]] | [[RQ-GL-015|盛り上がり区間]] | [[RQ-RDR-020]] | [[BD-ADR-010]] | [[BD-ADR-010]], [[BD-API-001]], [[BD-UI-002]], [[BD-UI-004]] | [[AT-PLAN-001]], [[AT-SCN-003]] |
| [[RQ-GL-016]] | [[RQ-GL-016|コメント密度波形]] | [[RQ-RDR-020]], [[RQ-RDR-022]] | [[BD-ADR-010]] | [[BD-ADR-010]], [[BD-API-001]], [[BD-UI-001]], [[BD-UI-002]], [[BD-UI-003]], [[BD-UI-004]], [[DD-SCALE-001]], [[DD-UI-002]], [[DD-UI-004]] | [[AT-PLAN-001]], [[AT-SCN-003]] |
| [[RQ-GL-017]] | [[RQ-GL-017|ワードクラウド]] | [[RQ-RDR-021]], [[RQ-RDR-022]] | [[BD-ADR-009]] | [[BD-ADR-009]], [[BD-API-001]], [[BD-UI-001]], [[BD-UI-002]], [[BD-UI-003]], [[BD-UI-004]], [[DD-SCALE-001]], [[DD-UI-002]], [[DD-UI-004]] | [[AT-PLAN-001]], [[AT-SCN-003]] |
| [[RQ-INT-001]] | 相互運用性要件 | [[RQ-RDR-017]], [[RQ-RDR-023]], [[RQ-RDR-026]], [[RQ-RDR-034]] | [[BD-ADR-021]] | [[BD-ADR-021]], [[BD-API-001]], [[BD-API-004]], [[DD-API-001]], [[DD-API-010]] | [[AT-SCN-004]] |
| [[RQ-OBY-001]] | 可観測性要件 | [[RQ-RDR-017]], [[RQ-RDR-023]] | [[BD-ADR-020]] | [[BD-ADR-020]], [[BD-MON-001]], [[BD-QUAL-001]], [[DD-AV-001]], [[DD-DDL-007]], [[DD-DDL-008]], [[DD-ERR-001]], [[DD-LOG-001]], [[DD-PERF-001]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-RPT-001]] |
| [[RQ-PC-001]] | 法令遵守制約 | [[RQ-RDR-011]] | - | - | - |
| [[RQ-PC-002]] | YouTube利用規約制約 | [[RQ-RDR-011]], [[RQ-RDR-023]] | - | - | - |
| [[RQ-PC-003]] | 公開データ限定制約 | [[RQ-RDR-011]], [[RQ-RDR-021]], [[RQ-RDR-022]], [[RQ-RDR-028]] | [[BD-ADR-009]] | [[BD-ADR-009]], [[BD-DATA-001]] | - |
| [[RQ-PC-004]] | 運用体制制約 | [[RQ-RDR-010]], [[RQ-RDR-011]], [[RQ-RDR-023]] | - | - | - |
| [[RQ-PC-005]] | 配信基盤制約 | [[RQ-RDR-011]], [[RQ-RDR-025]] | [[BD-ADR-013]] | [[BD-ADR-013]], [[BD-ENV-001]], [[BD-ENV-002]] | - |
| [[RQ-PC-006]] | コスト上限制約 | [[RQ-RDR-011]], [[RQ-RDR-023]], [[RQ-RDR-027]] | - | [[DD-COST-001]], [[DD-SCALE-001]] | - |
| [[RQ-PC-007]] | 品質ゲート制約 | [[RQ-RDR-011]], [[RQ-RDR-024]], [[RQ-RDR-029]] | [[BD-ADR-011]] | [[BD-ADR-011]] | - |
| [[RQ-PC-008]] | セキュリティ制約 | [[RQ-RDR-011]] | - | - | - |
| [[RQ-PC-009]] | リリース制約 | [[RQ-RDR-011]], [[RQ-RDR-024]], [[RQ-RDR-025]], [[RQ-RDR-029]] | [[BD-ADR-011]], [[BD-ADR-013]] | [[BD-ADR-011]], [[BD-ADR-013]] | - |
| [[RQ-PP-001]] | [[RQ-GL-001|diopside]]の目的 | [[RQ-RDR-010]] | - | - | - |
| [[RQ-PP-002]] | 提供価値の定義 | - | - | - | - |
| [[RQ-PP-003]] | 成功指標の定義 | - | - | - | [[AT-GO-001]], [[AT-SCN-001]], [[AT-SCN-005]] |
| [[RQ-PRC-001]] | プライバシー要件 | [[RQ-RDR-017]], [[RQ-RDR-021]], [[RQ-RDR-022]], [[RQ-RDR-028]] | [[BD-ADR-009]] | [[BD-ADR-009]], [[BD-DATA-001]], [[BD-SEC-001]], [[DD-SEC-001]] | [[AT-OPS-001]] |
| [[RQ-PS-001]] | 性能要件 | [[RQ-RDR-017]], [[RQ-RDR-023]] | [[BD-ADR-020]] | [[BD-ADR-020]], [[BD-ENV-002]], [[BD-QUAL-001]], [[DD-LOG-001]], [[DD-PERF-001]], [[DD-SCALE-001]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]] |
| [[RQ-RDR-001]] | 収集対象に[[RQ-GL-004|出演動画]]を含める決定 | - | [[BD-ADR-001]], [[BD-ADR-002]], [[BD-ADR-003]], [[BD-ADR-004]], [[BD-ADR-005]], [[BD-ADR-006]], [[BD-ADR-007]], [[BD-ADR-008]] | [[BD-ADR-001]], [[BD-ADR-002]], [[BD-ADR-003]], [[BD-ADR-004]], [[BD-ADR-005]], [[BD-ADR-006]], [[BD-ADR-007]], [[BD-ADR-008]] | - |
| [[RQ-RDR-002]] | [[RQ-GL-010|段階ロード]]形式を採用する決定 | - | [[BD-ADR-001]] | [[BD-ADR-001]] | - |
| [[RQ-RDR-003]] | [[RQ-GL-005|タグ辞書]]を別ファイル管理する決定 | - | [[BD-ADR-001]] | [[BD-ADR-001]] | - |
| [[RQ-RDR-004]] | 検索をクライアント実行する決定 | - | [[BD-ADR-001]] | [[BD-ADR-001]] | - |
| [[RQ-RDR-005]] | [[RQ-GL-006|アーカイブ索引]]をページ分割する決定 | - | [[BD-ADR-001]] | [[BD-ADR-001]] | - |
| [[RQ-RDR-006]] | 運用監視項目を最小構成で開始する決定 | - | [[BD-ADR-001]] | [[BD-ADR-001]] | - |
| [[RQ-RDR-007]] | 公開データのみを扱う決定 | - | [[BD-ADR-001]] | [[BD-ADR-001]] | - |
| [[RQ-RDR-008]] | Cloud配信基盤の採用決定 | - | [[BD-ADR-001]] | [[BD-ADR-001]] | - |
| [[RQ-RDR-009]] | [[RQ-GL-012|受入判定]]基準を文書化する決定 | - | [[BD-ADR-001]] | [[BD-ADR-001]] | - |
| [[RQ-RDR-010]] | ステークホルダーを2者に統合する決定 | [[RQ-RDR-019]], [[RQ-RDR-025]], [[RQ-RDR-026]] | - | - | [[AT-PLAN-001]] |
| [[RQ-RDR-011]] | プロジェクト制約を個人開発・AWS・AI前提で再定義する決定 | - | - | [[BD-ARCH-001]] | - |
| [[RQ-RDR-012]] | 用語定義を[[RQ-GL-001|diopside]]文脈で具体化する決定 | - | - | - | - |
| [[RQ-RDR-013]] | 用語へ英名term_enを付与する決定 | - | - | [[BD-CM-001]] | - |
| [[RQ-RDR-014]] | ドメインモデルを業務記述へ統一する決定 | - | - | [[BD-DATA-001]], [[BD-ERD-001]] | - |
| [[RQ-RDR-015]] | 画面構成に基づく[[RQ-GL-013|タグ種別]]と[[RQ-GL-014|検索条件]]を用語定義へ追加する決定 | - | - | [[BD-UI-002]] | - |
| [[RQ-RDR-016]] | ユースケース記述をテンプレート文から業務シナリオへ具体化する決定 | - | - | - | - |
| [[RQ-RDR-017]] | NFR文書をテンプレートから測定可能な個別要件へ具体化する決定 | - | [[BD-ADR-011]] | [[BD-ADR-011]], [[BD-BUILD-001]], [[BD-DATA-001]], [[BD-QUAL-001]], [[BD-SEC-001]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]] |
| [[RQ-RDR-018]] | UX要件をWCAG 2.2 AA相当の個別要求として追加する決定 | - | - | [[BD-BUILD-001]], [[BD-SEC-001]], [[BD-UI-002]] | [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-SCN-002]] |
| [[RQ-RDR-019]] | 配信前後メタデータ再確認を自動化し配信結果タグ付けを手動運用とする決定 | [[RQ-RDR-010]] | - | - | - |
| [[RQ-RDR-020]] | 詳細画面[[RQ-GL-016|コメント密度波形]]表示と[[RQ-GL-015|盛り上がり区間]]遷移を採用する決定 | - | [[BD-ADR-010]] | [[BD-ADR-010]] | - |
| [[RQ-RDR-021]] | 詳細画面[[RQ-GL-017|ワードクラウド]]表示を採用する決定 | - | [[BD-ADR-009]] | [[BD-ADR-009]], [[BD-API-001]], [[BD-UI-002]], [[BD-UI-004]] | - |
| [[RQ-RDR-022]] | 詳細表示要求と生成要求を分離しDATへ明示する決定 | - | - | - | - |
| [[RQ-RDR-023]] | NFRとプロジェクト制約の整合条件を明確化する決定 | - | [[BD-ADR-020]] | [[BD-ADR-020]] | [[AT-PLAN-001]], [[AT-RPT-001]] |
| [[RQ-RDR-024]] | スキルメンテナンス方針を要求として標準化する決定 | - | [[BD-ADR-012]] | [[BD-ADR-012]], [[BD-CM-001]] | - |
| [[RQ-RDR-025]] | ドキュメント公開フローをQuartzとCDKの単一実行で標準化する決定 | [[RQ-RDR-010]], [[RQ-RDR-025]] | [[BD-ADR-013]], [[BD-ADR-019]] | [[BD-ADR-013]], [[BD-ADR-019]], [[BD-DEP-003]], [[DD-DEP-001]] | [[AT-REL-001]], [[AT-RUN-001]] |
| [[RQ-RDR-026]] | 単一CloudFrontで画面・文書・OpenAPI・APIをパス分岐する決定 | [[RQ-RDR-010]] | [[BD-ADR-014]] | [[BD-ADR-014]], [[BD-API-004]], [[BD-DEP-004]], [[DD-API-010]], [[DD-DEP-002]] | [[AT-SCN-006]] |
| [[RQ-RDR-027]] | AWSタグ統制を単一アカウント運用へ適用する決定 | - | [[BD-ADR-015]] | [[BD-ADR-015]], [[DD-COST-001]] | [[AT-OPS-001]] |
| [[RQ-RDR-028]] | メタデータ取得を3モード分離しPoC参照は要求境界に限定する決定 | - | - | [[BD-API-002]], [[BD-ARCH-001]], [[BD-DATA-001]] | - |
| [[RQ-RDR-029]] | AIエージェント運用を役割分離と最小権限で標準化する決定 | - | [[BD-ADR-016]] | [[BD-ADR-016]], [[BD-ARCH-005]], [[DD-DEP-001]] | - |
| [[RQ-RDR-030]] | 収集運用機能を管理画面カテゴリへ統合する決定 | [[RQ-RDR-030]] | - | - | - |
| [[RQ-RDR-032]] | 公開UIの端末優先順位をモバイル先行へ固定する決定 | [[RQ-RDR-032]] | [[BD-ADR-017]], [[BD-ADR-018]] | [[BD-ADR-017]], [[BD-ADR-018]], [[BD-UI-002]], [[DD-UI-002]] | [[AT-SCN-002]] |
| [[RQ-RDR-033]] | Quartz公開でDataview非依存の静的トレーサビリティ運用を採用する決定 | [[RQ-RDR-033]] | - | - | - |
| [[RQ-RDR-034]] | DB正本管理を前提に3層構造で段階拡張する決定 | [[RQ-RDR-034]] | [[BD-ADR-021]] | [[BD-ADR-021]], [[BD-API-001]], [[BD-API-002]], [[BD-ARCH-001]], [[BD-DATA-001]], [[BD-DEP-004]], [[DD-API-001]], [[DD-API-005]] | - |
| [[RQ-RTM-001]] | 要求トレーサビリティ（要求別） | [[RQ-RDR-001]], [[RQ-RDR-002]], [[RQ-RDR-003]], [[RQ-RDR-004]], [[RQ-RDR-005]], [[RQ-RDR-006]], [[RQ-RDR-007]], [[RQ-RDR-008]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-011]], [[RQ-RDR-012]], [[RQ-RDR-013]], [[RQ-RDR-014]], [[RQ-RDR-015]], [[RQ-RDR-016]], [[RQ-RDR-017]], [[RQ-RDR-018]], [[RQ-RDR-019]], [[RQ-RDR-020]], [[RQ-RDR-021]], [[RQ-RDR-022]], [[RQ-RDR-023]], [[RQ-RDR-024]], [[RQ-RDR-025]], [[RQ-RDR-026]], [[RQ-RDR-027]], [[RQ-RDR-028]], [[RQ-RDR-029]], [[RQ-RDR-030]], [[RQ-RDR-032]], [[RQ-RDR-033]] | [[BD-ADR-001]], [[BD-ADR-002]], [[BD-ADR-003]], [[BD-ADR-004]], [[BD-ADR-005]], [[BD-ADR-006]], [[BD-ADR-007]], [[BD-ADR-008]], [[BD-ADR-009]], [[BD-ADR-010]], [[BD-ADR-011]], [[BD-ADR-012]], [[BD-ADR-013]], [[BD-ADR-014]], [[BD-ADR-015]], [[BD-ADR-016]], [[BD-ADR-017]], [[BD-ADR-018]], [[BD-ADR-019]], [[BD-ADR-020]] | [[BD-ADR-001]], [[BD-ADR-002]], [[BD-ADR-003]], [[BD-ADR-004]], [[BD-ADR-005]], [[BD-ADR-006]], [[BD-ADR-007]], [[BD-ADR-008]], [[BD-ADR-009]], [[BD-ADR-010]], [[BD-ADR-011]], [[BD-ADR-012]], [[BD-ADR-013]], [[BD-ADR-014]], [[BD-ADR-015]], [[BD-ADR-016]], [[BD-ADR-017]], [[BD-ADR-018]], [[BD-ADR-019]], [[BD-ADR-020]], [[BD-API-001]], [[BD-API-002]], [[BD-API-003]], [[BD-API-004]], [[BD-ARCH-001]], [[BD-ARCH-002]], [[BD-ARCH-003]], [[BD-ARCH-004]], [[BD-ARCH-005]], [[BD-BUILD-001]], [[BD-CM-001]], [[BD-DATA-001]], [[BD-DEP-001]], [[BD-DEP-002]], [[BD-DEP-003]], [[BD-DEP-004]], [[BD-ENV-001]], [[BD-ENV-002]], [[BD-ERD-001]], [[BD-MON-001]], [[BD-MON-002]], [[BD-QUAL-001]], [[BD-RET-001]], [[BD-SEC-001]], [[BD-TST-001]], [[BD-UI-001]], [[BD-UI-002]], [[BD-UI-003]], [[BD-UI-004]], [[DD-ALG-001]], [[DD-API-001]], [[DD-API-002]], [[DD-API-003]], [[DD-API-004]], [[DD-API-005]], [[DD-API-006]], [[DD-API-007]], [[DD-API-008]], [[DD-API-009]], [[DD-API-010]], [[DD-AV-001]], [[DD-CODE-001]], [[DD-COMP-001]], [[DD-COMP-002]], [[DD-COST-001]], [[DD-DBCON-001]], [[DD-DBCON-002]], [[DD-DDL-001]], [[DD-DDL-002]], [[DD-DDL-003]], [[DD-DDL-004]], [[DD-DDL-005]], [[DD-DDL-006]], [[DD-DDL-007]], [[DD-DDL-008]], [[DD-DEP-001]], [[DD-DEP-002]], [[DD-ERR-001]], [[DD-LOG-001]], [[DD-MIG-001]], [[DD-PERF-001]], [[DD-REV-001]], [[DD-SCALE-001]], [[DD-SEC-001]], [[DD-UI-001]], [[DD-UI-002]], [[DD-UI-003]], [[DD-UI-004]], [[DD-UI-005]], [[DD-UI-006]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]], [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]], [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-009]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-COV-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-002]], [[UT-PLAN-003]], [[UT-PLAN-004]], [[UT-PLAN-005]], [[UT-RPT-001]], [[UT-STAT-001]], [[UT-TDAT-001]] |
| [[RQ-RTM-002]] | 要求トレーサビリティ（設計別） | [[RQ-RDR-001]], [[RQ-RDR-002]], [[RQ-RDR-003]], [[RQ-RDR-004]], [[RQ-RDR-005]], [[RQ-RDR-006]], [[RQ-RDR-007]], [[RQ-RDR-008]], [[RQ-RDR-009]], [[RQ-RDR-011]], [[RQ-RDR-013]], [[RQ-RDR-014]], [[RQ-RDR-015]], [[RQ-RDR-017]], [[RQ-RDR-018]], [[RQ-RDR-020]], [[RQ-RDR-021]], [[RQ-RDR-023]], [[RQ-RDR-024]], [[RQ-RDR-025]], [[RQ-RDR-026]], [[RQ-RDR-027]], [[RQ-RDR-028]], [[RQ-RDR-029]], [[RQ-RDR-032]], [[RQ-RDR-033]] | [[BD-ADR-001]], [[BD-ADR-002]], [[BD-ADR-003]], [[BD-ADR-004]], [[BD-ADR-005]], [[BD-ADR-006]], [[BD-ADR-007]], [[BD-ADR-008]], [[BD-ADR-009]], [[BD-ADR-010]], [[BD-ADR-011]], [[BD-ADR-012]], [[BD-ADR-013]], [[BD-ADR-014]], [[BD-ADR-015]], [[BD-ADR-016]], [[BD-ADR-017]], [[BD-ADR-018]], [[BD-ADR-019]], [[BD-ADR-020]] | [[BD-ADR-001]], [[BD-ADR-002]], [[BD-ADR-003]], [[BD-ADR-004]], [[BD-ADR-005]], [[BD-ADR-006]], [[BD-ADR-007]], [[BD-ADR-008]], [[BD-ADR-009]], [[BD-ADR-010]], [[BD-ADR-011]], [[BD-ADR-012]], [[BD-ADR-013]], [[BD-ADR-014]], [[BD-ADR-015]], [[BD-ADR-016]], [[BD-ADR-017]], [[BD-ADR-018]], [[BD-ADR-019]], [[BD-ADR-020]], [[BD-API-001]], [[BD-API-002]], [[BD-API-003]], [[BD-API-004]], [[BD-ARCH-001]], [[BD-ARCH-002]], [[BD-ARCH-003]], [[BD-ARCH-004]], [[BD-ARCH-005]], [[BD-BUILD-001]], [[BD-CM-001]], [[BD-DATA-001]], [[BD-DEP-001]], [[BD-DEP-002]], [[BD-DEP-003]], [[BD-DEP-004]], [[BD-ENV-001]], [[BD-ENV-002]], [[BD-ERD-001]], [[BD-MON-001]], [[BD-MON-002]], [[BD-QUAL-001]], [[BD-RET-001]], [[BD-SEC-001]], [[BD-TST-001]], [[BD-UI-001]], [[BD-UI-002]], [[BD-UI-003]], [[BD-UI-004]], [[DD-ALG-001]], [[DD-API-001]], [[DD-API-002]], [[DD-API-003]], [[DD-API-004]], [[DD-API-005]], [[DD-API-006]], [[DD-API-007]], [[DD-API-008]], [[DD-API-009]], [[DD-API-010]], [[DD-AV-001]], [[DD-CODE-001]], [[DD-COMP-001]], [[DD-COMP-002]], [[DD-COST-001]], [[DD-DBCON-001]], [[DD-DBCON-002]], [[DD-DDL-001]], [[DD-DDL-002]], [[DD-DDL-003]], [[DD-DDL-004]], [[DD-DDL-005]], [[DD-DDL-006]], [[DD-DDL-007]], [[DD-DDL-008]], [[DD-DEP-001]], [[DD-DEP-002]], [[DD-ERR-001]], [[DD-LOG-001]], [[DD-MIG-001]], [[DD-PERF-001]], [[DD-REV-001]], [[DD-SCALE-001]], [[DD-SEC-001]], [[DD-UI-001]], [[DD-UI-002]], [[DD-UI-003]], [[DD-UI-004]], [[DD-UI-005]], [[DD-UI-006]] | [[AT-GO-001]], [[AT-GUIDE-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RCHK-001]], [[AT-REL-001]], [[AT-RPT-001]], [[AT-RUN-001]], [[AT-SCN-001]], [[AT-SCN-002]], [[AT-SCN-003]], [[AT-SCN-004]], [[AT-SCN-005]], [[AT-SCN-006]], [[IT-CASE-001]], [[IT-CASE-002]], [[IT-CASE-003]], [[IT-CASE-004]], [[IT-CASE-005]], [[IT-CASE-006]], [[IT-CASE-007]], [[IT-CASE-008]], [[IT-ENV-001]], [[IT-ENV-002]], [[IT-INC-001]], [[IT-PLAN-001]], [[IT-RST-001]], [[IT-TDAT-001]], [[UT-CASE-001]], [[UT-CASE-002]], [[UT-CASE-003]], [[UT-CASE-004]], [[UT-CASE-005]], [[UT-CASE-006]], [[UT-CASE-007]], [[UT-CASE-008]], [[UT-CASE-010]], [[UT-CASE-011]], [[UT-COV-001]], [[UT-MET-001]], [[UT-MOCK-001]], [[UT-PLAN-001]], [[UT-PLAN-002]], [[UT-PLAN-003]], [[UT-PLAN-004]], [[UT-PLAN-005]], [[UT-RPT-001]], [[UT-STAT-001]], [[UT-TDAT-001]] |
| [[RQ-SC-001]] | [[RQ-GL-001|diopside]]スコープ定義 | [[RQ-RDR-001]], [[RQ-RDR-002]], [[RQ-RDR-003]], [[RQ-RDR-004]], [[RQ-RDR-005]], [[RQ-RDR-006]], [[RQ-RDR-007]], [[RQ-RDR-008]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-011]], [[RQ-RDR-012]], [[RQ-RDR-013]], [[RQ-RDR-014]], [[RQ-RDR-015]], [[RQ-RDR-016]], [[RQ-RDR-017]], [[RQ-RDR-018]], [[RQ-RDR-019]], [[RQ-RDR-020]], [[RQ-RDR-021]], [[RQ-RDR-022]], [[RQ-RDR-023]], [[RQ-RDR-024]], [[RQ-RDR-025]], [[RQ-RDR-026]], [[RQ-RDR-027]], [[RQ-RDR-028]], [[RQ-RDR-029]], [[RQ-RDR-030]], [[RQ-RDR-032]], [[RQ-RDR-033]], [[RQ-RDR-034]] | - | [[BD-API-001]], [[BD-API-002]], [[BD-API-003]], [[BD-ARCH-001]], [[BD-ARCH-002]], [[BD-ARCH-003]], [[BD-ARCH-004]], [[BD-BUILD-001]], [[BD-CM-001]], [[BD-DATA-001]], [[BD-DEP-001]], [[BD-DEP-002]], [[BD-ENV-001]], [[BD-ENV-002]], [[BD-ERD-001]], [[BD-MON-001]], [[BD-MON-002]], [[BD-QUAL-001]], [[BD-RET-001]], [[BD-SEC-001]], [[BD-TST-001]], [[BD-UI-001]], [[BD-UI-002]], [[BD-UI-003]], [[BD-UI-004]] | [[AT-PLAN-001]], [[AT-RUN-001]] |
| [[RQ-SEC-001]] | セキュリティ要件 | [[RQ-RDR-017]], [[RQ-RDR-026]], [[RQ-RDR-027]] | [[BD-ADR-015]], [[BD-ADR-020]] | [[BD-ADR-015]], [[BD-ADR-020]], [[BD-ENV-001]], [[BD-ENV-002]], [[BD-SEC-001]], [[DD-COST-001]], [[DD-ERR-001]], [[DD-SEC-001]] | [[AT-OPS-001]], [[AT-RPT-001]], [[AT-RUN-001]] |
| [[RQ-SH-001]] | 管理者 | [[RQ-RDR-010]], [[RQ-RDR-019]], [[RQ-RDR-025]], [[RQ-RDR-030]] | - | [[BD-ARCH-001]], [[BD-TST-001]], [[BD-UI-001]] | [[AT-GO-001]], [[AT-PLAN-001]], [[AT-RPT-001]] |
| [[RQ-SH-002]] | 利用者 | [[RQ-RDR-010]], [[RQ-RDR-026]] | - | [[BD-UI-001]] | [[AT-RPT-001]], [[AT-SCN-002]] |
| [[RQ-UC-001]] | 管理者がアーカイブ収集を起動する | [[RQ-RDR-010]], [[RQ-RDR-016]], [[RQ-RDR-019]], [[RQ-RDR-028]], [[RQ-RDR-030]] | - | [[BD-UI-001]], [[BD-UI-003]] | - |
| [[RQ-UC-002]] | 利用者が一覧から動画を閲覧する | [[RQ-RDR-010]], [[RQ-RDR-016]] | - | [[BD-UI-001]], [[BD-UI-003]] | - |
| [[RQ-UC-003]] | 利用者がキーワードで動画を探す | [[RQ-RDR-010]], [[RQ-RDR-016]] | - | [[BD-UI-001]] | - |
| [[RQ-UC-004]] | 利用者がタグで動画を絞り込む | [[RQ-RDR-010]], [[RQ-RDR-016]] | - | [[BD-UI-001]] | - |
| [[RQ-UC-005]] | 利用者が日付・再生時間で絞り込む | [[RQ-RDR-010]], [[RQ-RDR-016]] | - | [[BD-UI-001]] | - |
| [[RQ-UC-006]] | 利用者が動画詳細を確認する | [[RQ-RDR-010]], [[RQ-RDR-016]], [[RQ-RDR-020]], [[RQ-RDR-021]] | - | [[BD-UI-001]], [[BD-UI-003]] | - |
| [[RQ-UC-007]] | 管理者が収集失敗を調査する | [[RQ-RDR-010]], [[RQ-RDR-016]], [[RQ-RDR-030]] | - | [[BD-UI-001]], [[BD-UI-003]] | [[AT-OPS-001]] |
| [[RQ-UC-008]] | 管理者が[[RQ-GL-011|再収集]]を実施する | [[RQ-RDR-010]], [[RQ-RDR-016]], [[RQ-RDR-030]] | - | [[BD-UI-001]], [[BD-UI-003]] | [[AT-OPS-001]] |
| [[RQ-UC-009]] | 管理者が配信前後の再確認と手動タグ付けを実施する | [[RQ-RDR-010]], [[RQ-RDR-019]], [[RQ-RDR-030]] | - | [[BD-UI-001]], [[BD-UI-003]] | - |
| [[RQ-UX-001]] | ユーザー体験要件 | [[RQ-RDR-010]], [[RQ-RDR-017]], [[RQ-RDR-018]], [[RQ-RDR-032]] | [[BD-ADR-017]], [[BD-ADR-018]] | [[BD-ADR-017]], [[BD-ADR-018]], [[BD-UI-002]], [[DD-UI-001]], [[DD-UI-002]] | [[AT-RPT-001]], [[AT-SCN-002]] |
| [[RQ-UX-002]] | 非テキストコンテンツの代替とアクセシブルネーム | [[RQ-RDR-018]] | - | [[BD-UI-002]] | [[AT-SCN-002]] |
| [[RQ-UX-003]] | マルチメディアの字幕・音声解説・文字起こし | [[RQ-RDR-010]], [[RQ-RDR-018]], [[RQ-RDR-023]] | - | [[DD-UI-005]] | [[AT-GUIDE-001]] |
| [[RQ-UX-004]] | 色のみに依存しない表現とコントラスト | [[RQ-RDR-018]] | - | [[BD-UI-002]] | [[AT-SCN-002]] |
| [[RQ-UX-005]] | リフロー・拡大・画面向きへの対応 | [[RQ-RDR-018]], [[RQ-RDR-032]] | [[BD-ADR-017]], [[BD-ADR-018]] | [[BD-ADR-017]], [[BD-ADR-018]], [[BD-UI-002]], [[DD-UI-001]], [[DD-UI-002]], [[DD-UI-003]] | [[AT-SCN-002]] |
| [[RQ-UX-006]] | キーボード操作性とフォーカス順序 | [[RQ-RDR-018]] | - | [[BD-UI-002]] | [[AT-SCN-002]] |
| [[RQ-UX-007]] | フォーカス可視化とフォーカスの非遮蔽 | [[RQ-RDR-018]] | - | [[BD-UI-002]] | [[AT-SCN-002]] |
| [[RQ-UX-008]] | ポインター入力のターゲットサイズ | [[RQ-RDR-018]] | - | [[BD-UI-002]] | [[AT-SCN-002]] |
| [[RQ-UX-009]] | ドラッグ操作の代替手段 | [[RQ-RDR-010]], [[RQ-RDR-018]] | - | [[BD-UI-002]] | [[AT-SCN-002]] |
| [[RQ-UX-010]] | 複雑ジェスチャ・誤操作防止・端末動作への依存回避 | [[RQ-RDR-018]] | - | [[BD-UI-002]] | [[AT-SCN-002]] |
| [[RQ-UX-011]] | ページ構造（タイトル・見出し・ランドマーク）とナビゲーション | [[RQ-RDR-018]] | - | [[BD-UI-002]] | [[AT-SCN-001]] |
| [[RQ-UX-012]] | フォームのラベル・エラー提示・入力支援 | [[RQ-RDR-018]] | - | [[BD-UI-002]] | [[AT-SCN-002]] |
| [[RQ-UX-013]] | 同一プロセス内の再入力（Redundant Entry）の最小化 | [[RQ-RDR-018]] | - | - | [[AT-SCN-002]] |
| [[RQ-UX-014]] | アクセシブルな認証（Accessible Authentication） | [[RQ-RDR-018]], [[RQ-RDR-023]] | - | [[BD-SEC-001]] | [[AT-OPS-001]] |
| [[RQ-UX-015]] | ヘルプ手段の一貫性（Consistent Help） | [[RQ-RDR-018]] | - | - | [[AT-GUIDE-001]], [[AT-OPS-001]] |
| [[RQ-UX-016]] | 時間制限とセッションタイムアウトの配慮 | [[RQ-RDR-010]], [[RQ-RDR-018]], [[RQ-RDR-023]] | - | [[BD-SEC-001]] | [[AT-OPS-001]] |
| [[RQ-UX-017]] | 状態変化の通知（Status Messages） | [[RQ-RDR-018]] | - | - | [[AT-SCN-002]] |
| [[RQ-UX-018]] | 閃光・発作リスクの回避 | [[RQ-RDR-018]] | - | [[BD-UI-002]] | [[AT-SCN-001]] |
| [[RQ-UX-019]] | 堅牢性（HTML/ARIA準拠）と支援技術互換 | [[RQ-RDR-018]] | - | [[BD-BUILD-001]] | - |
| [[RQ-UX-020]] | ダウンロード資料・通知（メール等）のアクセシビリティ | [[RQ-RDR-018]], [[RQ-RDR-023]] | - | - | [[AT-GUIDE-001]], [[AT-OPS-001]] |
| [[RQ-UX-021]] | クラウドCI/CDにおけるアクセシビリティ検査の自動化とゲート | [[RQ-RDR-018]] | - | [[BD-BUILD-001]] | - |
| [[RQ-UX-022]] | サードパーティ/クラウドサービスのアクセシビリティ担保 | [[RQ-RDR-018]], [[RQ-RDR-023]] | - | - | [[AT-OPS-001]] |
| [[RQ-UX-023]] | アクセシビリティ不具合の受付と是正プロセス | [[RQ-RDR-010]], [[RQ-RDR-018]], [[RQ-RDR-023]] | - | - | [[AT-OPS-001]], [[AT-RUN-001]] |
| [[RQ-UX-024]] | 言語指定（Language of Page/Parts） | [[RQ-RDR-018]] | - | [[BD-UI-002]] | [[AT-SCN-001]] |
<!-- END AUTO-GENERATED: REQUIREMENT_VIEW -->

## 変更履歴
- 2026-02-11: `task docs:trace` による要求別静的ビューの自動生成ブロックを追加 [[RQ-RDR-033]]
- 2026-02-11: Quartz前提の静的トレーサビリティ運用（Dataview非依存）へ更新 [[RQ-RDR-033]]
- 2026-02-10: 新規作成 [[RQ-RDR-033]]
