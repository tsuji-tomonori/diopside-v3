## 実施内容（追加1）
- 対象: 用語正本と記載範囲の是正（追加レビュー指摘対応）。
- 要求更新:
  - `RQ-GL-008`: 正式名称を「タグマスター」に統一し、`tag_master` を別名へ整理。
  - `RQ-GL-009`: 正式名称を「アーカイブ索引」に統一し、`archive_index` を別名へ整理。
  - `RQ-GL-012`: 用語定義を削除（リリース管理語彙は用語集対象外）。
  - `RQ-RDR-043`: 用語統制の追記を更新。
  - `RQ-RDR-044`: 用語正本統一とリリース管理語彙分離の決定を新規追加。
- 設計更新:
  - `BD-SYS-DOM-001`: ドメイン境界からリリース管理語彙を除外。

## 影響確認（追加1）
- 用語統制: 正式名称（日本語）と別名（技術識別子）の関係を `RQ-GL-008` / `RQ-GL-009` で明確化。
- 記載範囲: リリース管理語彙を用語集から分離し、参照先を `AT-GO-001` に統一。
- 境界整合: ドメイン境界文書では業務ドメイン責務のみを保持し、運用判定責務を除外。

## 検証（追加1）
- `task docs:guard` を実行し、リンク・frontmatter・相互参照整合を確認する。
- 必要に応じて `task docs:check` を実行し、全体整合（`issues`, `broken_links`, `nonlinked_doc_ids`）を確認する。

## 実施内容（追加2）
- 対象: 非番号の中間ディレクトリによる過剰階層を解消。
- パス修正:
  - `docs/2.基本設計(BD)/03.インフラ(INF)/11.環境/アカウント/ネットワーク(ENV_NET)/BD-INF-ENV-001.md` -> `docs/2.基本設計(BD)/03.インフラ(INF)/11.環境/BD-INF-ENV-001.md`
  - `docs/2.基本設計(BD)/03.インフラ(INF)/11.環境/アカウント/ネットワーク(ENV_NET)/BD-INF-NET-001.md` -> `docs/2.基本設計(BD)/03.インフラ(INF)/11.環境/BD-INF-NET-001.md`
  - `docs/2.基本設計(BD)/03.インフラ(INF)/22.IaC/構成管理(IAC_CM)/BD-INF-CM-001.md` -> `docs/2.基本設計(BD)/03.インフラ(INF)/22.IaC/BD-INF-CM-001.md`
  - `docs/2.基本設計(BD)/03.インフラ(INF)/22.IaC/構成管理(IAC_CM)/BD-INF-IAC-001.md` -> `docs/2.基本設計(BD)/03.インフラ(INF)/22.IaC/BD-INF-IAC-001.md`
  - `docs/3.詳細設計(DD)/02.アプリ(APP)/41.ログ/エラー(LOG_ERR)/DD-APP-ERR-001.md` -> `docs/3.詳細設計(DD)/02.アプリ(APP)/41.ログ/DD-APP-ERR-001.md`
  - `docs/3.詳細設計(DD)/02.アプリ(APP)/41.ログ/エラー(LOG_ERR)/DD-APP-LOG-001.md` -> `docs/3.詳細設計(DD)/02.アプリ(APP)/41.ログ/DD-APP-LOG-001.md`
- 連携更新:
  - `.opencode/skills/obsidian-doc-new/assets/doc_path_map.yaml` の `BD-INF-CM` / `BD-INF-ENV` / `BD-INF-IAC` / `BD-INF-NET` / `DD-APP-ERR` / `DD-APP-LOG` を新パスへ更新。

## 影響確認（追加2）
- 既存文書の `[[ID]]` 参照はID解決のため本文更新は不要。
- 文書生成・配置ルールは `doc_path_map.yaml` を新ディレクトリ構造へ同期済み。

## 検証（追加2）
- `task docs:guard` を実行し、過剰階層解消後のリンク・frontmatter整合を確認する。
