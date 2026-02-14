---
id: RQ-RTM-001
title: 要求トレーサビリティ（要求別）
doc_type: 要求トレーサビリティマトリックス
phase: RQ
version: 1.0.11
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-13'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-RDR-033]]'
- '[[RQ-RDR-038]]'
- '[[RQ-RDR-039]]'
- '[[RQ-RTM-002]]'
- '[[RQ-FR-001]]'
- '[[RQ-AV-001]]'
- '[[BD-DEV-TEST-001]]'
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
- FR/NFR要求IDごとに、以下を同一ブロックで追跡する。
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
- generated_at: 2026-02-14

| 要求ID(FR/NFR) | タイトル | RDR | ADR | 設計(BD/DD) | 検証(UT/IT/AT) |
| --- | --- | --- | --- | --- | --- |
| [[RQ-AV-001]] | 可用性要件 | [[RQ-RDR-010]], [[RQ-RDR-017]], [[RQ-RDR-023]] | - | [[BD-DEV-ENV-002]], [[BD-DEV-TEST-001]], [[BD-INF-DEP-006]], [[BD-INF-MON-001]], [[BD-INF-MON-002]], [[BD-INF-MON-003]], [[BD-INF-PLAT-001]], [[BD-INF-PLAT-002]], [[BD-SYS-ADR-020]], [[BD-SYS-QUAL-001]], [[DD-APP-LOG-001]], [[DD-INF-SEC-001]], [[DD-SYS-AV-001]], [[DD-SYS-AV-002]], [[DD-SYS-SCALE-001]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]] |
| [[RQ-COST-001]] | コスト要件 | [[RQ-RDR-017]], [[RQ-RDR-027]], [[RQ-RDR-035]] | - | [[BD-INF-DEP-001]], [[BD-INF-DEP-006]], [[BD-SYS-ADR-015]], [[BD-SYS-ADR-022]], [[DD-APP-LOG-001]], [[DD-SYS-COST-001]] | [[AT-OPS-001]] |
| [[RQ-DATA-001]] | データ要件 | [[RQ-RDR-017]], [[RQ-RDR-023]], [[RQ-RDR-028]], [[RQ-RDR-034]] | - | [[BD-APP-API-002]], [[BD-APP-DATA-001]], [[BD-APP-DATA-002]], [[BD-SYS-ADR-020]], [[BD-SYS-ADR-021]], [[DD-APP-DB-001]], [[DD-APP-DB-002]], [[DD-APP-DB-003]], [[DD-APP-DB-004]], [[DD-APP-DB-005]], [[DD-APP-DB-006]], [[DD-APP-DB-007]], [[DD-APP-DB-008]], [[DD-APP-DB-017]], [[DD-SYS-SCALE-001]] | [[AT-SCN-004]] |
| [[RQ-DEV-001]] | DevOps要件 | [[RQ-RDR-017]], [[RQ-RDR-024]], [[RQ-RDR-025]], [[RQ-RDR-026]], [[RQ-RDR-029]], [[RQ-RDR-033]], [[RQ-RDR-039]] | - | [[BD-APP-API-005]], [[BD-DEV-ENV-001]], [[BD-DEV-ENV-002]], [[BD-DEV-PIPE-001]], [[BD-INF-DEP-001]], [[BD-INF-DEP-003]], [[BD-INF-DEP-004]], [[BD-INF-DEP-005]], [[BD-INF-PLAT-001]], [[BD-INF-SEC-001]], [[BD-SYS-ADR-011]], [[BD-SYS-ADR-012]], [[BD-SYS-ADR-019]], [[BD-SYS-ADR-024]], [[BD-SYS-ADR-025]], [[BD-SYS-ADR-026]], [[BD-SYS-ARCH-006]], [[BD-SYS-QUAL-001]], [[BD-SYS-SEC-001]], [[DD-APP-DB-003]], [[DD-APP-MOD-002]], [[DD-DEV-CODE-001]], [[DD-DEV-REV-001]], [[DD-INF-IAC-001]], [[DD-INF-IAC-002]], [[DD-INF-IAC-003]], [[DD-SYS-SEC-001]] | [[AT-GO-001]], [[AT-REL-001]], [[AT-RUN-001]] |
| [[RQ-DEV-002]] | AIエージェント運用要件 | [[RQ-RDR-029]], [[RQ-RDR-038]] | - | [[BD-SYS-ADR-016]], [[BD-SYS-ARCH-005]] | [[AT-OPS-INF-001]] |
| [[RQ-FR-001]] | 管理画面から公開動画[[RQ-GL-002|収集ジョブ]]を実行できる | [[RQ-RDR-001]], [[RQ-RDR-006]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-028]], [[RQ-RDR-030]], [[RQ-RDR-037]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-API-002]], [[BD-APP-API-003]], [[BD-APP-DATA-001]], [[BD-APP-DATA-002]], [[BD-APP-DATA-003]], [[BD-APP-UI-001]], [[BD-APP-UI-002]], [[BD-APP-UI-003]], [[BD-APP-UI-004]], [[BD-DEV-PIPE-001]], [[BD-DEV-TEST-001]], [[BD-INF-CM-001]], [[BD-INF-DEP-001]], [[BD-INF-DEP-002]], [[BD-SYS-ADR-026]], [[BD-SYS-ADR-027]], [[BD-SYS-ARCH-001]], [[BD-SYS-ARCH-002]], [[BD-SYS-ARCH-003]], [[BD-SYS-ARCH-004]], [[DD-APP-API-001]], [[DD-APP-API-002]], [[DD-APP-API-003]], [[DD-APP-API-004]], [[DD-APP-API-005]], [[DD-APP-API-006]], [[DD-APP-API-007]], [[DD-APP-API-008]], [[DD-APP-API-009]], [[DD-APP-DB-010]], [[DD-APP-UI-002]], [[DD-APP-UI-007]] | [[AT-SCN-004]], [[AT-SCN-008]] |
| [[RQ-FR-002]] | 管理画面で公式投稿の公開動画をチャンネルID一致で取り込める | [[RQ-RDR-002]], [[RQ-RDR-007]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-030]], [[RQ-RDR-037]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]], [[DD-APP-UI-007]] | [[AT-SCN-008]] |
| [[RQ-FR-003]] | 管理画面で出演条件一致の公開動画を判定して取り込める | [[RQ-RDR-001]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-028]], [[RQ-RDR-030]], [[RQ-RDR-037]] | - | [[BD-APP-API-001]], [[BD-APP-API-002]], [[BD-APP-UI-001]], [[DD-APP-UI-007]] | [[AT-SCN-008]] |
| [[RQ-FR-004]] | 管理画面の収集結果として動画メタデータを正規化できる | [[RQ-RDR-004]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-019]], [[RQ-RDR-022]], [[RQ-RDR-028]], [[RQ-RDR-030]], [[RQ-RDR-037]] | - | [[BD-APP-API-001]], [[BD-APP-API-002]], [[BD-APP-DATA-001]], [[BD-APP-UI-001]], [[DD-APP-UI-007]] | [[AT-SCN-008]] |
| [[RQ-FR-005]] | [[RQ-GL-005|タグ辞書]]を更新できる | [[RQ-RDR-003]], [[RQ-RDR-005]], [[RQ-RDR-010]], [[RQ-RDR-019]], [[RQ-RDR-034]], [[RQ-RDR-036]] | - | [[BD-APP-API-001]], [[BD-APP-API-002]], [[BD-APP-UI-001]], [[BD-APP-UI-003]], [[BD-SYS-ADR-021]], [[DD-APP-API-013]], [[DD-APP-API-015]], [[DD-APP-DB-008]], [[DD-APP-DB-009]], [[DD-APP-DB-015]], [[DD-APP-UI-009]], [[DD-APP-UI-010]] | [[AT-SCN-009]], [[UT-CASE-011]], [[UT-CASE-013]] |
| [[RQ-FR-006]] | ページング済み索引を生成できる | [[RQ-RDR-005]], [[RQ-RDR-006]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-037]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]], [[DD-APP-ALG-001]], [[DD-APP-MOD-001]], [[DD-APP-MOD-003]], [[DD-APP-UI-003]], [[DD-APP-UI-005]], [[DD-APP-UI-012]], [[DD-APP-UI-013]] | [[AT-SCN-007]] |
| [[RQ-FR-007]] | アーカイブ一覧を表示できる | [[RQ-RDR-007]], [[RQ-RDR-008]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-037]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]], [[DD-APP-ALG-001]], [[DD-APP-UI-005]] | [[AT-SCN-002]] |
| [[RQ-FR-008]] | キーワード検索できる | [[RQ-RDR-004]], [[RQ-RDR-008]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-037]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]], [[DD-APP-ALG-001]], [[DD-APP-UI-003]], [[DD-APP-UI-012]] | [[AT-SCN-002]] |
| [[RQ-FR-009]] | タグ条件で絞り込みできる | [[RQ-RDR-003]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-034]] | - | [[BD-APP-API-001]], [[BD-APP-API-002]], [[BD-APP-DATA-001]], [[BD-APP-UI-001]], [[DD-APP-DB-007]], [[DD-APP-DB-008]], [[DD-APP-UI-009]] | [[AT-SCN-009]] |
| [[RQ-FR-010]] | 日付範囲で絞り込みできる | [[RQ-RDR-004]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-037]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]] | [[AT-SCN-002]] |
| [[RQ-FR-011]] | 再生時間で絞り込みできる | [[RQ-RDR-004]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-037]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]] | [[AT-SCN-002]] |
| [[RQ-FR-012]] | 並び順を切り替えできる | [[RQ-RDR-004]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-037]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]] | [[AT-SCN-002]] |
| [[RQ-FR-013]] | 動画詳細モーダルを表示できる | [[RQ-RDR-008]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-020]], [[RQ-RDR-021]], [[RQ-RDR-037]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]], [[DD-APP-MOD-001]], [[DD-APP-MOD-003]], [[DD-APP-UI-004]], [[DD-APP-UI-014]] | [[AT-SCN-003]] |
| [[RQ-FR-014]] | YouTube視聴ページへ遷移できる | [[RQ-RDR-008]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-020]], [[RQ-RDR-037]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]], [[BD-APP-UI-003]], [[DD-APP-UI-004]], [[DD-APP-UI-014]] | [[AT-SCN-003]] |
| [[RQ-FR-015]] | 初回読み込みを高速化する[[RQ-GL-010|段階ロード]]で漸進表示できる | [[RQ-RDR-002]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-037]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]], [[DD-APP-UI-013]] | [[AT-SCN-002]], [[AT-SCN-008]] |
| [[RQ-FR-016]] | 管理画面で読み込み失敗を通知できる | [[RQ-RDR-006]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-030]], [[RQ-RDR-037]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]], [[DD-APP-UI-006]], [[DD-APP-UI-018]] | [[AT-SCN-002]], [[AT-SCN-007]] |
| [[RQ-FR-017]] | 管理画面で収集実行結果を確認できる | [[RQ-RDR-006]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-019]], [[RQ-RDR-030]], [[RQ-RDR-037]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-API-002]], [[BD-APP-UI-001]], [[DD-APP-API-011]], [[DD-APP-DB-012]], [[DD-APP-MOD-001]], [[DD-APP-MOD-003]], [[DD-APP-UI-006]], [[DD-APP-UI-017]] | [[AT-SCN-005]], [[AT-SCN-007]], [[AT-SCN-008]] |
| [[RQ-FR-018]] | 管理画面で手動[[RQ-GL-011|再収集]]を実行できる | [[RQ-RDR-006]], [[RQ-RDR-009]], [[RQ-RDR-010]], [[RQ-RDR-030]], [[RQ-RDR-034]], [[RQ-RDR-037]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]], [[DD-APP-DB-012]], [[DD-APP-UI-006]], [[DD-APP-UI-008]], [[DD-APP-UI-017]] | [[AT-SCN-005]], [[AT-SCN-007]] |
| [[RQ-FR-019]] | 管理画面で配信前後のメタデータ再取得と差分確認を運用できる | [[RQ-RDR-010]], [[RQ-RDR-019]], [[RQ-RDR-028]], [[RQ-RDR-030]], [[RQ-RDR-036]] | - | [[BD-APP-API-001]], [[BD-APP-API-002]], [[BD-APP-UI-001]], [[BD-APP-UI-003]], [[BD-SYS-ADR-021]], [[DD-APP-API-012]], [[DD-APP-API-013]], [[DD-APP-DB-013]], [[DD-APP-DB-014]], [[DD-APP-UI-009]] | [[AT-PLAN-001]], [[AT-SCN-007]], [[UT-CASE-010]], [[UT-CASE-011]] |
| [[RQ-FR-020]] | 詳細画面で[[RQ-GL-016|コメント密度波形]]を表示し[[RQ-GL-015|盛り上がり区間]]へ遷移できる | [[RQ-RDR-010]], [[RQ-RDR-020]], [[RQ-RDR-022]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]], [[BD-APP-UI-002]], [[BD-APP-UI-003]], [[BD-APP-UI-004]], [[BD-SYS-ADR-010]], [[DD-APP-UI-004]], [[DD-APP-UI-015]] | [[AT-PLAN-001]], [[AT-SCN-003]] |
| [[RQ-FR-021]] | 動画詳細で[[RQ-GL-017|ワードクラウド]]を表示できる | [[RQ-RDR-010]], [[RQ-RDR-021]], [[RQ-RDR-022]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]], [[BD-APP-UI-002]], [[BD-APP-UI-004]], [[BD-SYS-ADR-009]], [[DD-APP-UI-004]], [[DD-APP-UI-016]] | [[AT-PLAN-001]], [[AT-SCN-003]] |
| [[RQ-FR-022]] | [[RQ-GL-016|コメント密度波形]]表示用データを生成できる | [[RQ-RDR-010]], [[RQ-RDR-022]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]], [[BD-APP-UI-002]], [[BD-SYS-ADR-010]], [[BD-SYS-ADR-027]], [[BD-SYS-ARCH-001]], [[DD-APP-API-002]] | [[AT-SCN-003]] |
| [[RQ-FR-023]] | [[RQ-GL-017|ワードクラウド]]表示用画像を生成できる | [[RQ-RDR-010]], [[RQ-RDR-021]], [[RQ-RDR-022]], [[RQ-RDR-038]] | - | [[BD-APP-API-001]], [[BD-APP-UI-002]], [[BD-SYS-ADR-027]], [[BD-SYS-ARCH-001]], [[DD-APP-API-002]] | [[AT-SCN-003]] |
| [[RQ-FR-024]] | 管理画面でドキュメント公開を一括実行できる | [[RQ-RDR-010]], [[RQ-RDR-025]], [[RQ-RDR-030]] | - | [[BD-APP-API-001]], [[BD-APP-UI-001]], [[BD-APP-UI-003]], [[BD-INF-DEP-003]], [[BD-SYS-ADR-013]], [[DD-APP-API-014]], [[DD-APP-API-015]], [[DD-APP-DB-015]], [[DD-APP-DB-016]], [[DD-APP-UI-010]], [[DD-APP-UI-011]], [[DD-INF-DEP-001]] | [[AT-PLAN-001]], [[AT-REL-001]], [[UT-CASE-012]], [[UT-CASE-013]] |
| [[RQ-FR-025]] | 管理画面運用の前提として単一CloudFrontで配信経路をパス分岐できる | [[RQ-RDR-010]], [[RQ-RDR-026]], [[RQ-RDR-030]], [[RQ-RDR-034]] | - | [[BD-APP-API-001]], [[BD-APP-API-002]], [[BD-APP-API-004]], [[BD-APP-UI-001]], [[BD-APP-UI-003]], [[BD-INF-DEP-004]], [[BD-INF-DEP-005]], [[BD-SYS-ADR-014]], [[BD-SYS-ADR-021]], [[DD-APP-API-010]], [[DD-APP-DB-015]], [[DD-APP-DB-016]], [[DD-APP-UI-010]], [[DD-APP-UI-011]], [[DD-INF-DEP-002]] | [[AT-SCN-006]] |
| [[RQ-INT-001]] | 相互運用性要件 | [[RQ-RDR-017]], [[RQ-RDR-023]], [[RQ-RDR-026]], [[RQ-RDR-034]] | - | [[BD-APP-API-001]], [[BD-APP-API-004]], [[BD-APP-API-005]], [[BD-SYS-ADR-021]], [[BD-SYS-ADR-023]], [[BD-SYS-ADR-025]], [[DD-APP-API-001]], [[DD-APP-API-010]], [[DD-APP-DB-017]] | [[AT-SCN-004]] |
| [[RQ-OBY-001]] | 可観測性要件 | [[RQ-RDR-017]], [[RQ-RDR-023]], [[RQ-RDR-035]], [[RQ-RDR-039]] | - | [[BD-APP-API-005]], [[BD-DEV-TEST-001]], [[BD-INF-MON-001]], [[BD-INF-MON-002]], [[BD-INF-MON-003]], [[BD-INF-MON-004]], [[BD-INF-PLAT-001]], [[BD-SYS-ADR-020]], [[BD-SYS-ADR-022]], [[BD-SYS-ADR-023]], [[BD-SYS-ARCH-006]], [[BD-SYS-QUAL-001]], [[DD-APP-DB-010]], [[DD-APP-DB-011]], [[DD-APP-ERR-001]], [[DD-APP-LOG-001]], [[DD-INF-MON-001]], [[DD-INF-MON-002]], [[DD-SYS-AV-001]], [[DD-SYS-PERF-001]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-RPT-001]] |
| [[RQ-PRC-001]] | プライバシー要件 | [[RQ-RDR-017]], [[RQ-RDR-021]], [[RQ-RDR-022]], [[RQ-RDR-028]], [[RQ-RDR-035]] | - | [[BD-APP-DATA-001]], [[BD-SYS-ADR-009]], [[BD-SYS-SEC-001]], [[DD-APP-LOG-001]], [[DD-SYS-SEC-001]] | [[AT-OPS-001]] |
| [[RQ-PS-001]] | 性能要件 | [[RQ-RDR-017]], [[RQ-RDR-023]] | - | [[BD-DEV-ENV-002]], [[BD-DEV-TEST-001]], [[BD-INF-MON-001]], [[BD-INF-MON-002]], [[BD-INF-MON-003]], [[BD-SYS-ADR-020]], [[BD-SYS-ADR-024]], [[BD-SYS-QUAL-001]], [[DD-APP-LOG-001]], [[DD-APP-MOD-002]], [[DD-SYS-PERF-001]], [[DD-SYS-SCALE-001]] | [[AT-GO-001]], [[AT-OPS-001]], [[AT-PLAN-001]], [[AT-RPT-001]], [[AT-SCN-008]] |
| [[RQ-SEC-001]] | セキュリティ要件 | [[RQ-RDR-017]], [[RQ-RDR-026]], [[RQ-RDR-027]], [[RQ-RDR-035]], [[RQ-RDR-039]] | - | [[BD-APP-API-005]], [[BD-DEV-ENV-001]], [[BD-DEV-ENV-002]], [[BD-INF-NET-001]], [[BD-INF-PLAT-001]], [[BD-INF-SEC-001]], [[BD-SYS-ADR-015]], [[BD-SYS-ADR-020]], [[BD-SYS-ADR-023]], [[BD-SYS-ADR-024]], [[BD-SYS-ADR-025]], [[BD-SYS-ARCH-006]], [[BD-SYS-SEC-001]], [[DD-APP-ERR-001]], [[DD-APP-LOG-001]], [[DD-APP-MOD-002]], [[DD-INF-NET-001]], [[DD-INF-SEC-002]], [[DD-INF-SEC-003]], [[DD-SYS-COST-001]], [[DD-SYS-SEC-001]] | [[AT-OPS-001]], [[AT-RPT-001]], [[AT-RUN-001]], [[UT-SEC-001]] |
| [[RQ-UX-001]] | ユーザー体験要件 | [[RQ-RDR-010]], [[RQ-RDR-017]], [[RQ-RDR-018]], [[RQ-RDR-032]] | - | [[BD-APP-UI-002]], [[BD-SYS-ADR-017]], [[BD-SYS-ADR-018]], [[BD-SYS-ADR-024]], [[BD-SYS-QUAL-001]], [[DD-APP-MOD-002]], [[DD-APP-UI-001]], [[DD-APP-UI-002]], [[DD-APP-UI-013]] | [[AT-RPT-001]], [[AT-SCN-002]] |
| [[RQ-UX-002]] | 非テキストコンテンツの代替とアクセシブルネーム | [[RQ-RDR-018]] | - | [[BD-APP-UI-002]], [[DD-APP-UI-015]], [[DD-APP-UI-016]] | [[AT-SCN-002]] |
| [[RQ-UX-003]] | マルチメディアの字幕・音声解説・文字起こし | [[RQ-RDR-010]], [[RQ-RDR-018]], [[RQ-RDR-023]] | - | [[BD-APP-UI-002]], [[DD-APP-UI-005]] | [[AT-GUIDE-001]] |
| [[RQ-UX-004]] | 色のみに依存しない表現とコントラスト | [[RQ-RDR-018]] | - | [[BD-APP-UI-002]] | [[AT-SCN-002]] |
| [[RQ-UX-005]] | リフロー・拡大・画面向きへの対応 | [[RQ-RDR-018]], [[RQ-RDR-032]] | - | [[BD-APP-UI-002]], [[BD-SYS-ADR-017]], [[BD-SYS-ADR-018]], [[DD-APP-UI-001]], [[DD-APP-UI-002]], [[DD-APP-UI-003]] | [[AT-SCN-002]] |
| [[RQ-UX-006]] | キーボード操作性とフォーカス順序 | [[RQ-RDR-018]] | - | [[BD-APP-UI-002]], [[DD-APP-UI-014]] | [[AT-SCN-002]] |
| [[RQ-UX-007]] | フォーカス可視化とフォーカスの非遮蔽 | [[RQ-RDR-018]] | - | [[BD-APP-UI-002]], [[DD-APP-UI-014]] | [[AT-SCN-002]] |
| [[RQ-UX-008]] | ポインター入力のターゲットサイズ | [[RQ-RDR-018]] | - | [[BD-APP-UI-002]] | [[AT-SCN-002]] |
| [[RQ-UX-009]] | ドラッグ操作の代替手段 | [[RQ-RDR-010]], [[RQ-RDR-018]] | - | [[BD-APP-UI-002]] | [[AT-SCN-002]] |
| [[RQ-UX-010]] | 複雑ジェスチャ・誤操作防止・端末動作への依存回避 | [[RQ-RDR-018]] | - | [[BD-APP-UI-002]] | [[AT-SCN-002]] |
| [[RQ-UX-011]] | ページ構造（タイトル・見出し・ランドマーク）とナビゲーション | [[RQ-RDR-018]] | - | [[BD-APP-UI-002]] | [[AT-SCN-001]] |
| [[RQ-UX-012]] | フォームのラベル・エラー提示・入力支援 | [[RQ-RDR-018]] | - | [[BD-APP-UI-002]], [[DD-APP-UI-012]] | [[AT-SCN-002]] |
| [[RQ-UX-013]] | 同一プロセス内の再入力（Redundant Entry）の最小化 | [[RQ-RDR-018]] | - | [[BD-APP-UI-002]] | [[AT-SCN-002]] |
| [[RQ-UX-014]] | アクセシブルな認証（Accessible Authentication） | [[RQ-RDR-018]], [[RQ-RDR-023]] | - | [[BD-SYS-SEC-001]] | [[AT-OPS-001]] |
| [[RQ-UX-015]] | ヘルプ手段の一貫性（Consistent Help） | [[RQ-RDR-018]] | - | [[BD-APP-UI-002]] | [[AT-GUIDE-001]], [[AT-OPS-001]] |
| [[RQ-UX-016]] | 時間制限とセッションタイムアウトの配慮 | [[RQ-RDR-010]], [[RQ-RDR-018]], [[RQ-RDR-023]] | - | [[BD-SYS-SEC-001]] | [[AT-OPS-001]] |
| [[RQ-UX-017]] | 状態変化の通知（Status Messages） | [[RQ-RDR-018]] | - | [[BD-APP-UI-004]], [[DD-APP-UI-015]], [[DD-APP-UI-016]], [[DD-APP-UI-017]], [[DD-APP-UI-018]] | [[AT-SCN-002]] |
| [[RQ-UX-018]] | 閃光・発作リスクの回避 | [[RQ-RDR-018]] | - | [[BD-APP-UI-002]] | [[AT-SCN-001]] |
| [[RQ-UX-019]] | 堅牢性（HTML/ARIA準拠）と支援技術互換 | [[RQ-RDR-018]] | - | [[BD-DEV-PIPE-001]] | [[AT-SCN-001]] |
| [[RQ-UX-020]] | ダウンロード資料・通知（メール等）のアクセシビリティ | [[RQ-RDR-018]], [[RQ-RDR-023]] | - | [[BD-APP-UI-002]] | [[AT-GUIDE-001]], [[AT-OPS-001]] |
| [[RQ-UX-021]] | クラウドCI/CDにおけるアクセシビリティ検査の自動化とゲート | [[RQ-RDR-018]], [[RQ-RDR-038]] | - | [[BD-DEV-PIPE-001]] | [[AT-REL-001]], [[AT-SCN-002]] |
| [[RQ-UX-022]] | サードパーティ/クラウドサービスのアクセシビリティ担保 | [[RQ-RDR-018]], [[RQ-RDR-023]] | - | [[BD-INF-SEC-001]], [[BD-SYS-SEC-001]] | [[AT-OPS-001]] |
| [[RQ-UX-023]] | アクセシビリティ不具合の受付と是正プロセス | [[RQ-RDR-010]], [[RQ-RDR-018]], [[RQ-RDR-023]] | - | [[BD-SYS-QUAL-001]] | [[AT-OPS-001]], [[AT-RUN-001]] |
| [[RQ-UX-024]] | 言語指定（Language of Page/Parts） | [[RQ-RDR-018]] | - | [[BD-APP-UI-002]] | [[AT-SCN-001]] |
<!-- END AUTO-GENERATED: REQUIREMENT_VIEW -->

## 変更履歴
- 2026-02-13: [[RQ-DEV-001]] のCDKオンリー受入基準（`cdk synth/diff/deploy`）を反映し、DevOps要求の追跡基準を更新 [[RQ-RDR-039]]
- 2026-02-13: [[RQ-UX-019]] / [[RQ-UX-021]] の検証リンクを追加し、設計-検証の断線を解消 [[RQ-RDR-018]]
- 2026-02-13: インフラ文書体系（INF章）を追跡対象へ追加 [[RQ-RDR-039]]
- 2026-02-13: 波形/[[RQ-GL-017|ワードクラウド]]生成要求（[[RQ-FR-022]], [[RQ-FR-023]]）の直接検証リンクを追加 [[RQ-RDR-038]]
- 2026-02-11: 廃止済み [[RQ-RDR-003]] の参照を要求別ビューから除外し、[[RQ-GL-005|タグ辞書]]系トレースを現行決定へ整理 [[RQ-RDR-034]]
- 2026-02-11: `task docs:trace` による要求別静的ビューの自動生成ブロックを追加 [[RQ-RDR-033]]
- 2026-02-11: Quartz前提の静的トレーサビリティ運用（Dataview非依存）へ更新 [[RQ-RDR-033]]
- 2026-02-10: 新規作成 [[RQ-RDR-033]]
