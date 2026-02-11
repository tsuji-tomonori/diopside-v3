# diopside ドキュメント運用（OpenCode向け）

このリポジトリは **diopside**（白雪 巴/Shirayuki Tomoe の公開YouTubeアーカイブ収集・蓄積・検索Webアプリ）の
ObsidianドキュメントVaultです。

## 0. 最重要ルール
- 1トピック=1ファイル
- ファイル名 = ドキュメントID
- 関係は Obsidianリンク（`[[ID]]`）で表現
- 図は Mermaid のみ
- `docs/**` に README.md / TEMPLATE.md を置かない
- 本文に「上位文書」「下位文書」セクションを作らない

## 1. Frontmatter必須キー
- `id` / `title` / `doc_type` / `phase`
- `version` / `status` / `owner`
- `created` / `updated`
- `up` / `related`
- `tags`

### 値の運用
- `phase`: `RQ/BD/DD/UT/IT/AT`
- `status`: `下書き` / `承認` / `廃止`
- `owner`: `RQ-SH-*` のみ
- 意味変更時は `version` を PATCH 更新
- 変更時は `updated` を当日へ更新

## 2. 要求記述規約
- FR/NFR は SnowCard（日本語）を基本とする
- 必須項目: 要求ID/種別/優先度/要求/根拠/受入基準/例外/依存・関連
- 優先度は RFC 2119（MUST/SHOULD/MAY）
- 要求追加・意味変更時は RDR を同一変更で更新
- RQ文書の `## 変更履歴` 各行には、関連RDRリンク（`[[RQ-RDR-xxx]]`）を含める

### FRディレクトリ編成規約（機能単位）
- `docs/1.要求(RQ)/51.機能要求(FR)` は実装工程単位ではなく、機能単位で編成する。
- 現行カテゴリは次を正本とする。
  - `01.管理画面(ADM)`
  - `02.検索・絞り込み・並び替え(SCH)`
  - `03.タグ管理(TAG)`
  - `04.一覧表示・段階ロード(LST)`
  - `05.詳細表示・外部遷移(DET)`
  - `06.コメント密度波形(HLW)`
  - `07.ワードクラウド(WCL)`
- 生成系/整備系の要求（例: 派生データ生成）は、実装都合で独立カテゴリ化せず、利用者機能に紐づくカテゴリへ配置する。
- 管理者操作に関する要求（収集起動/監視/再収集/公開運用/配信経路確認）は `01.管理画面(ADM)` に集約する。
- 新規FR追加時は「どの利用者機能を成立させる要求か」を基準に配置し、判断が分かれる場合は RDR に配置理由を記録する。

## 3. 設計記述規約
- 設計追加・意味変更時は ADR を同一変更で更新
- BD文書の `## 変更履歴` 各行には、関連ADRリンク（`[[BD-ADR-xxx]]`）を含める
- 要求起点の設計は `RDR -> ADR -> 設計本文` を辿れること

## 4. 収集対象の前提（diopside固有）
- 対象は **公開YouTubeアーカイブ** のみ
- 収集対象区分は次の2つ
  - 公式投稿動画（白雪 巴 公式チャンネル）
  - 出演動画（他チャンネル投稿を含む）
- 非公開/限定公開は対象外

## 5. 変更フロー
1. 対象文書を更新
2. `up/related` で影響範囲を確認し、必要文書を更新または確認記録化
3. `reports/impact_check_YYYY-MM-DD.md` を更新
4. `task docs:guard` を実行し、用語リンク補正と整合チェックを行う
5. 必要に応じて `task docs:check` を実行し、全体整合を確認する

## 6. スキル運用
- 文書種別ごとに対応 `doc-*` スキルを使用
- 規約変更時は `docops-orchestrator` / `obsidian-doc-*` / `skill-maintainer` を同時更新
- FR編成規約を変更する場合は、`doc-rq-fr` と関連スキル/エージェントへ同一変更で反映する

## 7. コミットメッセージ規約
- Conventional Commits（`type(scope): subject`）
- `subject` と本文は日本語

## 8. OpenCode向け運用メモ
- OpenCode の実行ルールは `AGENTS.md` を正本として扱う。
- a11y移植資産は `.opencode` 配下を使用する。
  - Agents: `.opencode/agents/*.md`
  - Skills: `.opencode/skills/<name>/SKILL.md`
  - Commands: `.opencode/commands/*.md`
- Agent Teams 相当の公式機能に依存せず、`@agent` 呼び出しと `/command` で役割分担する。
- docs運用タスクは `Taskfile.yaml` を標準入口とし、初回は `task precommit` でフックを有効化する。
