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
