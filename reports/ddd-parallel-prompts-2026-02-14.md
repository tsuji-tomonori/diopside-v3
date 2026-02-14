# DDD全量対応 5並列実行プロンプト集（2026-02-14）

## 0. 使い方
- 本ファイルは、DDD全量対応を5並列で実行するための配布用プロンプト集。
- `Worker 1` 〜 `Worker 5` を同時起動し、最後に `Integrator` で統合検証する。
- 衝突回避のため、各ワーカーは「担当ファイル以外を編集しない」。
- 参照元:
  - `reports/ddd-review-report.html`
  - `reports/ddd-strategy-report.html`
  - `reports/ddd-execution-plan-2026-02-14.md`

---

## 共通前提（全ワーカー共通）
```text
あなたは diopside-v3 の文書改訂ワーカーです。
必ず以下を守ってください。

- 1トピック=1ファイル、ファイル名=ドキュメントID
- Frontmatter必須キー(id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags)を維持
- 意味変更時は version をPATCH更新、updatedを当日に更新
- 本文に「上位文書」「下位文書」セクションを作らない
- Mermaid以外の図を使わない
- 変更履歴には RDR/ADRリンクを入れる
- 既存の文体・用語規約に合わせる
- 担当外ファイルは編集しない
- 作業結果は「変更ファイル一覧」「実施内容」「未解決事項」を最後に報告
```

---

## Worker 1（DOM新設: S1-S4）
```text
[担当] ドメイン層新設（DOM文書作成）

目的:
DDD戦略レポートに基づき、DOM層を新規作成して5+1 BCとサブドメインを正式文書化する。

編集対象（この範囲のみ）:
- docs/0.ドメイン(DOM)/DOM-SUB-001.md
- docs/0.ドメイン(DOM)/DOM-CTX-001.md
- docs/0.ドメイン(DOM)/01.Ingestion(ING)/DOM-BC-001.md
- docs/0.ドメイン(DOM)/02.TagManagement(TAG)/DOM-BC-002.md
- docs/0.ドメイン(DOM)/03.Publishing(PUB)/DOM-BC-003.md
- docs/0.ドメイン(DOM)/04.Viewing(VIEW)/DOM-BC-004.md
- docs/0.ドメイン(DOM)/05.Administration(ADM)/DOM-BC-005.md
- docs/0.ドメイン(DOM)/06.Analytics(ANA)/DOM-BC-006.md

必須内容:
- DOM-SUB-001: Core/Supporting/Generic分類と理由
- DOM-CTX-001: BC間関係（ACL / Customer-Supplier / Published Language / Shared Kernel / OHS）
- DOM-BC-001〜006: 各BCの責務、主要用語(GL)、主要DM、主要FR、境界外との契約

参照元:
- reports/ddd-strategy-report.html
- reports/ddd-review-report.html
- reports/ddd-execution-plan-2026-02-14.md

完了条件:
- 8ファイルすべて作成
- Obsidianリンクで相互参照が張られている
- frontmatter必須キーが揃っている
```

---

## Worker 2（アーキ接続 + ADR: S5）
```text
[担当] BDアーキ反映とADR記録

目的:
DOM層の位置づけを既存アーキ文書に接続し、Published Languageを設計判断として正式化する。

編集対象（この範囲のみ）:
- docs/2.基本設計(BD)/01.全体構成(SYS)/11.アーキテクチャ概要(ARCH)/BD-SYS-ARCH-001.md
- docs/2.基本設計(BD)/01.全体構成(SYS)/12.設計判断(ADR)/BD-SYS-ADR-029.md （新規）

必須内容:
- BD-SYS-ARCH-001 に [[DOM-CTX-001]] 参照追加
- contracts/static-json/*.schema.json を Published Language として明記
- ADRで以下を記録:
  - なぜDOM層を追加したか
  - なぜディレクトリ再編ではなくメタデータ+DOM軸なのか
  - 境界契約を schema で管理する理由
  - 影響範囲とトレードオフ

完了条件:
- 既存ARCH文書と新規ADRがリンクで辿れる
- 変更履歴にADRリンクが反映される
```

---

## Worker 3（用語・DM Critical: T1/T2）
```text
[担当] 用語統一と集約ルート定義（Critical対応）

目的:
戦術レビューCriticalのうち、用語不一致(#1)と集約ルート未定義(#4)を解消する。

編集対象（この範囲のみ）:
- docs/1.要求(RQ)/21.用語(GL)/RQ-GL-002.md
- docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-001.md
- docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-002.md
- docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-003.md
- docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-004.md
- docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-005.md
- docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-006.md
- docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-007.md
- docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-008.md
- docs/1.要求(RQ)/22.ドメインモデル(DM)/RQ-DM-009.md

必須内容:
- GL-002 を「収集実行 (ingestion_run)」基準で整合
- DM群に「集約境界/集約ルート」を明記
- 最低4集約（動画、収集実行、タグ辞書、アーカイブ索引）を定義
- 既存文意を壊さず、用語の揺れ(job/run/runs)を減らす

完了条件:
- GL/DMの命名整合が説明可能
- 各DMに集約観点が追加されている
```

---

## Worker 4（FR/UCメタデータ展開 + バリデータ: S6/S7）
```text
[担当] DDDメタデータ導入（FR/UC）と検証ルール追加

目的:
bounded_context / subdomain を導入し、機械検証できる状態にする。

編集対象（この範囲のみ）:
- docs/1.要求(RQ)/51.機能要求(FR)/**/RQ-FR-*.md（全25件）
- docs/1.要求(RQ)/31.ユースケース(UC)/RQ-UC-*.md（全件）
- .opencode/skills/obsidian-doc-check/scripts/validate_vault.py

注意:
- DM/GLはWorker3と衝突するため今回は編集しない
- FR/UCのみを先行で付与

必須内容:
- frontmatterへ以下を追加
  - bounded_context: Ingestion|TagManagement|Publishing|Viewing|Administration|Analytics
  - subdomain: Core|Supporting|Generic
- validate_vault.py に許容値チェックを追加
- 値不正時のエラーメッセージを明確化

完了条件:
- FR/UCのメタデータ欠落ゼロ
- バリデータが新キーを検証可能
```

---

## Worker 5（追跡性・レポート更新）
```text
[担当] RDR/impact更新と全体トレーサビリティ補完

目的:
今回変更の意思決定と影響確認を文書化し、監査可能にする。

編集対象（この範囲のみ）:
- docs/1.要求(RQ)/41.要求決定記録(RDR)/RQ-RDR-040.md（新規）
- reports/impact_check_2026-02-14.md

必須内容:
- RQ-RDR-040:
  - DOM層導入理由
  - BC境界定義理由
  - 用語統一(ingestion_run)の判断根拠
  - 集約ルート明記の判断根拠
  - 関連文書リンク（DOM/GL/DM/BD-ARCH/ADR）
- impact_check:
  - 変更対象一覧
  - 影響範囲（RQ/BD/DD/UT/IT/AT）
  - 未対応項目（あれば）
  - 実行コマンド結果記録欄（docs:guard/docs:check）

完了条件:
- RDRとimpactレポートで判断経緯が追跡できる
- 関連リンクが切れていない
```

---

## Integrator（統合担当: マージ後最終整合）
```text
[担当] 5並列結果の統合・最終整合・完了判定

目的:
Worker 1〜5 の成果を統合し、規約準拠・リンク整合・検証通過まで完了させる。

実施内容:
1) 差分統合
- 競合があれば、DDD実行計画（reports/ddd-execution-plan-2026-02-14.md）を優先して解消
- worker間の用語差分（ingestion_job vs ingestion_run など）を最終統一

2) 文書整合チェック
- frontmatter必須キー欠落確認
- `updated` 日付と `version` PATCH更新の妥当性確認
- 変更履歴へのRDR/ADRリンク確認
- Obsidianリンク切れ確認

3) 追加補完
- 必要なら `reports/ddd-execution-plan-2026-02-14.md` の進捗チェックを更新
- 必要なら `reports/impact_check_2026-02-14.md` の実績欄を補完

4) 検証実行
- `task docs:guard` を実行
- 必要に応じて `task docs:check` を実行
- 失敗時は原因箇所を修正して再実行

5) 完了報告
- 変更ファイル一覧
- 指摘対応マッピング（S1〜S8、T1〜T11 の完了/未完了）
- 残課題（あれば）
- 実行コマンドと結果要約

完了条件:
- docs:guard 成功
- 重大なリンク不整合なし
- S1〜S8 / T1〜T11 の状態がレポートで追跡可能
```

---

## 補足（並列実行ルール）
- Worker 3 と Worker 4 は編集対象を分離済み（DM/GL と FR/UC）
- Worker 2 は `BD-SYS-ARCH-001.md` を専有するため他ワーカーは触らない
- Worker 5 は RDR/impact のみで他と競合しない
- Integrator が最後に 1回だけ検証コマンドを実行する
