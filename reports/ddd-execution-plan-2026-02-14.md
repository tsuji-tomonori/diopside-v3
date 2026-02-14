# DDD全量対応 実行計画（2026-02-14）

## 1. 目的と前提
- 目的: DDD戦術レビュー（12指摘）とDDD戦略レポート（S1〜S8）を統合し、ドキュメント体系・用語・モデル・境界設計を全量改善する。
- 対象レポート:
  - `reports/ddd-review-report.html`
  - `reports/ddd-strategy-report.html`
- 完了定義（全量対応）:
  - 戦術指摘 #1〜#12 をすべて処理完了
  - 戦略アクション S1〜S8 をすべて処理完了
  - 変更文書の frontmatter（`updated`/`version`/`up`/`related`）が規約準拠
  - RQ変更に対応するRDR、BD/DD変更に対応するADRが同一変更で追跡可能
  - `reports/impact_check_YYYY-MM-DD.md` 更新完了
  - `task docs:guard`（必要に応じて `task docs:check`）成功

## 2. 実施方針
- ディレクトリ大規模再編は行わず、DOM層追加 + frontmatterメタデータ追加でDDD軸を直交導入する。
- 先に「境界定義（戦略）」を確定し、その後「用語・DM（戦術）」を整合させる。
- 変更は以下の単位で分割:
  1) 戦略基盤整備
  2) 戦術Critical/Major対応
  3) 戦術Minor + 運用品質向上

## 3. スコープ（全量）
- 戦略:
  - S1 `0.ドメイン(DOM)` 層作成
  - S2 `DOM-CTX-001` 作成（コンテキストマップ）
  - S3 `DOM-BC-001〜006` 作成（BC定義）
  - S4 `DOM-SUB-001` 作成（サブドメイン分類）
  - S5 `contracts/static-json/` を Published Language として公式化
  - S6 FR/DM/GL/UC等へ `bounded_context` / `subdomain` 追加
  - S7 CI検証にBC整合ルール追加
  - S8 ドメインイベントカタログ作成
- 戦術:
  - T1〜T11（レビュー #1〜#12 に対応、#5は戦略側S2/S3で吸収）

## 4. 実行フェーズ

## Phase 1（1〜2週間）: 戦略基盤 + Critical先行
### 4.1 ドメイン軸文書の新設（S1〜S4）
- 作成:
  - `docs/0.ドメイン(DOM)/DOM-SUB-001.md`
  - `docs/0.ドメイン(DOM)/DOM-CTX-001.md`
  - `docs/0.ドメイン(DOM)/01.Ingestion(ING)/DOM-BC-001.md`
  - `docs/0.ドメイン(DOM)/02.TagManagement(TAG)/DOM-BC-002.md`
  - `docs/0.ドメイン(DOM)/03.Publishing(PUB)/DOM-BC-003.md`
  - `docs/0.ドメイン(DOM)/04.Viewing(VIEW)/DOM-BC-004.md`
  - `docs/0.ドメイン(DOM)/05.Administration(ADM)/DOM-BC-005.md`
  - `docs/0.ドメイン(DOM)/06.Analytics(ANA)/DOM-BC-006.md`
- 受入基準:
  - 5+1 BC、関係パターン（ACL/Customer-Supplier/Published Language/Shared Kernel/OHS）を明示
  - 既存FR/DM/GL/BD/DDへの `[[ID]]` リンクが成立

### 4.2 戦術Critical対応（T1, T2の設計開始）
- T1 用語統一:
  - 「収集ジョブ」→「収集実行（ingestion_run）」へ統一方針確定
  - GL/DM/DB命名の対応表を作成し反映
- T2 集約ルート:
  - DMごとの集約境界・集約ルート定義方針を策定し、主要DMから反映開始
- 受入基準:
  - 主要不一致（job/run/runs）が消える
  - DMに集約観点が明示される

### 4.3 アーキ文書接続（S5）
- 更新:
  - `BD-SYS-ARCH-001` に `[[DOM-CTX-001]]` 参照追加
  - Published Languageとして `contracts/static-json/*.schema.json` の位置づけを明文化
- 受入基準:
  - BC境界と契約境界の文書追跡が可能

## Phase 2（2〜4週間）: 戦術Major一括対応 + メタデータ統合
### 4.4 frontmatter拡張（S6）
- 対象: FR/DM/GL/UC（必要に応じBD/DDも）
- 追加キー:
  - `bounded_context: Ingestion|TagManagement|Publishing|Viewing|Administration|Analytics`
  - `subdomain: Core|Supporting|Generic`
- 受入基準:
  - 対象文書でキー欠落なし
  - 値がBC定義と一致

### 4.5 CI検証拡張（S7）
- `validate_vault.py` 等の検証に以下を追加:
  - `bounded_context` の許容値チェック
  - `subdomain` の許容値チェック
  - DM文書とDOM-BC定義の整合チェック
- 受入基準:
  - docs CIで自動検知可能

### 4.6 戦術Major対応（T3〜T8）
- T3 タグ辞書/タグマスタ関係明示（GL-005/008）
- T4 archive_index英名統一（GL-009単数整合）
- T5 VO/Entity分類をDMに追加
- T6 ドメインイベント設計（IngestionCompleted等）
- T7 `RQ-DM-010`（配信反映実行）追加
- T8 `RQ-GL-019`（再確認/recheck）追加（必要なら `RQ-DM-011` 追加）
- 受入基準:
  - 主要ギャップ（戦術Major）が解消
  - BC文脈と矛盾しない

## Phase 3（1〜3ヶ月）: Minor解消 + 成熟化
### 4.7 戦術Minor対応（T9〜T11）
- T9 channel_type値の対応・統一方針確定
- T10 コード内ローカル概念の位置づけ整理（Viewingローカル用語）
- T11 DM命名統一（タイトルからステレオタイプ除去）
- 受入基準:
  - 用語追跡性が改善し、混乱余地が低減

### 4.8 戦略成熟化（S8）
- ドメインイベントカタログ文書を追加し、BC間イベント連鎖を明示
- Quartz等でBC別ナビゲーション導線を整備（必要時）
- 受入基準:
  - 非同期連携の責務境界が文書化される

## 5. タスク対応マトリクス（全量）
- Critical:
  - S1, S2, S3, T1, T2
- Major:
  - S4, S5, S6, S7, T3, T4, T5, T6, T7, T8
- Minor:
  - T9, T10, T11, S8

## 6. 依存関係
- S2/S3（BC定義）完了前に S6（メタデータ付与）を進めない
- T2（集約）とT6（イベント）は S2/S3 の境界定義を前提
- T7/T8 は Publishing BC定義（DOM-BC-003）確定後に着手

## 7. 変更管理ルール（diopside規約準拠）
- 1トピック1ファイル、ファイル名=ドキュメントID
- frontmatter必須キーを維持し、意味変更時は `version` PATCH更新
- 変更時 `updated` を当日に更新
- RQ変更時はRDR同時更新、BD/DD変更時はADR同時更新
- 変更履歴にRDR/ADRリンクを明記

## 8. 検証・完了手順
1. 影響確認更新: `reports/impact_check_YYYY-MM-DD.md`
2. 用語リンク補正/整合確認: `task docs:guard`
3. 必要に応じ全体確認: `task docs:check`
4. 差分レビュー: BC/GL/DM/FR/RDR/ADRの相互リンク確認
5. 完了判定: S1〜S8、T1〜T11 のチェックリスト全完了

## 9. リスクと対策
- リスク: 文書間リンクの欠落
  - 対策: Phaseごとに `task docs:guard` 実行
- リスク: 用語統一で既存文脈が崩れる
  - 対策: 旧称→新称マッピング表を一定期間併記
- リスク: 変更範囲過大
  - 対策: Phase単位でPR分割し、Critical優先で価値を先出し

## 10. 実行順（推奨）
1. S1→S2→S3→S4
2. S5→T1→T2
3. S6→S7
4. T3→T4→T5→T7→T8→T6
5. T9→T10→T11→S8
6. 影響確認・guard/check・最終レビュー

## 11. 進捗チェックリスト（運用用）
- [ ] S1 `docs/0.ドメイン(DOM)/` を新設する
- [ ] S2 `DOM-CTX-001` を作成し、5+1 BCと関係パターンを定義する
- [ ] S3 `DOM-BC-001`〜`DOM-BC-006` を作成する
- [ ] S4 `DOM-SUB-001` を作成し、Core/Supporting/Genericを定義する
- [ ] S5 `contracts/static-json/*.schema.json` の Published Language 位置づけを文書化する
- [ ] T1 「収集ジョブ」→「収集実行（ingestion_run）」へ統一する（GL/DM/関連文書）
- [ ] T2 集約ルート定義をDMへ反映する
- [ ] Phase 1完了時点で `task docs:guard` を実行し、エラー0を確認する
- [ ] S6 `bounded_context` / `subdomain` をFR/DM/GL/UCへ展開する
- [ ] S7 検証ロジック（`validate_vault.py`）にDDDメタデータ検証を追加する
- [ ] T3〜T8（Major）を完了する
- [ ] T9〜T11 と S8（Minor/成熟化）を完了する
- [ ] `reports/impact_check_2026-02-14.md` を更新する
- [ ] 最終で `task docs:guard` と必要に応じて `task docs:check` を通す

## 12. Phase 1着手タスク分解（ファイル単位）

### 12.1 新規作成（S1〜S4）
- [ ] `docs/0.ドメイン(DOM)/DOM-SUB-001.md`
- [ ] `docs/0.ドメイン(DOM)/DOM-CTX-001.md`
- [ ] `docs/0.ドメイン(DOM)/01.Ingestion(ING)/DOM-BC-001.md`
- [ ] `docs/0.ドメイン(DOM)/02.TagManagement(TAG)/DOM-BC-002.md`
- [ ] `docs/0.ドメイン(DOM)/03.Publishing(PUB)/DOM-BC-003.md`
- [ ] `docs/0.ドメイン(DOM)/04.Viewing(VIEW)/DOM-BC-004.md`
- [ ] `docs/0.ドメイン(DOM)/05.Administration(ADM)/DOM-BC-005.md`
- [ ] `docs/0.ドメイン(DOM)/06.Analytics(ANA)/DOM-BC-006.md`

### 12.2 既存更新（S5 + T1 + T2）
- [ ] `docs/2.基本設計(BD)/01.全体構成(SYS)/11.アーキテクチャ概要(ARCH)/BD-SYS-ARCH-001.md`
  - `[[DOM-CTX-001]]` 参照追加
  - `contracts/static-json/*.schema.json` を Published Language として明記
- [ ] `docs/1.要求(RQ)/21.用語(GL)/RQ-GL-002.md`
  - 用語を「収集実行 (ingestion_run)」へ統一
- [ ] `docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-005.md`
  - GL-002と整合する名称・説明へ更新
- [ ] `docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-001.md`
- [ ] `docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-002.md`
- [ ] `docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-003.md`
- [ ] `docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-004.md`
- [ ] `docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-006.md`
- [ ] `docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-007.md`
- [ ] `docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-008.md`
- [ ] `docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-009.md`
  - 各DMに集約境界/集約ルートを追記（最低限: 動画集約、収集実行集約、タグ辞書集約、アーカイブ索引集約）

### 12.3 追跡性更新（同一変更で実施）
- [ ] `docs/1.要求(RQ)/41.要求決定記録(RDR)/RQ-RDR-040.md` を新規作成（採番は最終確認）
  - S1〜S5/T1/T2 の要求側意思決定を記録
- [ ] `docs/2.基本設計(BD)/01.全体構成(SYS)/12.設計判断(ADR)/BD-SYS-ADR-029.md` を新規作成（採番は最終確認）
  - BC境界・Published Language公式化・集約方針の設計判断を記録
- [ ] 変更したRQ/BD/DD文書の `## 変更履歴` に RDR/ADRリンクを追記

### 12.4 Phase 1完了時の検証と記録
- [ ] `reports/impact_check_2026-02-14.md` 更新
- [ ] `task docs:guard` 実行
- [ ] 必要に応じて `task docs:check` 実行
- [ ] 検証結果（成功/失敗、再実行有無）を本計画または impact_check に記録
