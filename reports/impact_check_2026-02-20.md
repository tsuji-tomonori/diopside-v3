## 実施内容（INF章再編）
- 対象: `docs/2.基本設計(BD)/03.インフラ(INF)` の章構成をAWSリソース起点へ全面再編。
- 設計判断: [[BD-SYS-ADR-036]] を新規作成し、章再編方針と非互換（旧章スタブなし）を確定。
- 再配置:
  - `BD-INF-PLAT-001` を「章構成と全体構成」へ更新。
  - `BD-INF-ENV-001` / `BD-INF-NET-001` / `BD-INF-SEC-001` を新章へ移設・改訂。
  - `BD-INF-DEP-003/004/005/006` を CI/CD・エッジ・コンピュート・DR へ再定義。
  - `BD-INF-MON-003/004` を監査/運用ガバナンスへ再定義。
  - `BD-INF-CM-001` / `BD-INF-IAC-001` を IaC章へ移設。
  - `BD-INF-DEP-001` / `BD-INF-DEP-002` を旧章アーカイブへ移設。
- 新規追加:
  - [[BD-INF-WAF-001]]
  - [[BD-INF-KMS-001]]
  - [[BD-INF-AUD-001]]
  - [[BD-INF-OPS-001]]
- トレーサビリティ更新:
  - [[RQ-RTM-002]] の INF行を新タイトル/新章に更新し、新規4文書を追加。

## 影響確認（INF章再編）
- INF配下の章名・ディレクトリが変更されるため、ファイルパス参照は旧パス非互換。
- ObsidianリンクはID中心のため、既存リンク断は限定的（ID維持方針）。
- 新規ID4件はRTMに追加済み。要求->設計の参照導線を維持。

## 追記（テスト章再編）
- テスト章構成を再編し、UT/IT/ATの責務分離を維持したまま、運用Runbookと利用者ガイドを別章へ移設。
- 受入判定文書（[[AT-PLAN-001]]）に、運用Runbook参照方針と証跡集約方針を追加。
- UT/IT計画（[[UT-PLAN-001]] / [[IT-PLAN-001]]）にテスト設計観点（技法/契約境界/障害系）を追記。

## 変更ファイル（テスト章再編）
- 移設:
  - `docs/7.運用・リリース(OPS_REL)/11.配信手順書/AT-REL-001.md`
  - `docs/7.運用・リリース(OPS_REL)/21.障害対応手順書/AT-RUN-001.md`
  - `docs/8.ユーザーガイド(GUIDE)/11.ユーザーガイド/AT-GUIDE-001.md`
- 更新:
  - `docs/6.受入テスト(AT)/11.受入テスト計画/AT-PLAN-001.md`
  - `docs/4.単体テスト(UT)/11.単体テスト計画/UT-PLAN-001.md`
  - `docs/5.結合テスト(IT)/11.結合テスト計画/IT-PLAN-001.md`
  - `.opencode/skills/obsidian-doc-new/assets/doc_path_map.yaml`
  - `.opencode/skills/doc-at-run/SKILL.md`
  - `.opencode/skills/doc-at-guide/SKILL.md`
  - `README.md`

## 影響確認（テスト章再編）
- `AT-REL` / `AT-RUN` / `AT-GUIDE` はIDを維持したため、Obsidianリンク（`[[AT-REL-001]]` 等）のリンク先解決は維持される。
- 文書作成支援のパスマップ（`doc_path_map.yaml`）と関連スキル説明の保存先を新章構成へ同期済み。
- AT章は判定・証跡中心の構成に寄せ、運用手順の正本管理責務を分離。

## 検証
- `task docs:guard` を実行し、frontmatter/リンク/構造整合と移設後の参照整合を確認する。
- 必要に応じて `task docs:check` を実行し、全体整合を確認する。
