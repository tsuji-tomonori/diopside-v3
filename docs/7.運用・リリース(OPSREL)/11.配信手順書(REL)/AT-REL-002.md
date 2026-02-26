---
id: AT-REL-002
title: 'OpenCode Issue Runner OAuthシークレット登録手順（Environment: opencode）'
doc_type: 配信手順書
phase: AT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-23
updated: '2026-02-23'
up:
- '[[DD-INF-DEP-001]]'
- '[[AT-REL-001]]'
related:
- '[[BD-DEV-PIPE-001]]'
- '[[DD-INF-SEC-002]]'
- '[[AT-RUN-001]]'
- '[[RQ-SEC-005-06]]'
- '[[RQ-RDR-050]]'
tags:
- diopside
- AT
- REL
---


## 目的
- `~/.opencode/auth/openai.json` を GitHub Environment `opencode` の Secret `OPENCODE_OPENAI_OAUTH_JSON_B64` として管理し、Issueラベル起動ワークフローでのみ復元できる状態を維持する。

## 前提条件
- `opencode-codex-issue.yml` が `environment: opencode` で動作する設計になっている。
- `~/.opencode/auth/openai.json` を取得済みで、内容の有効期限内である。
- 実施者が対象リポジトリの `Settings` 変更権限を持つ。

## Environment `opencode` の作成手順
1. GitHubリポジトリの `Settings -> Environments` で `opencode` を作成する。
2. 必要に応じて `Deployment branches` を `main` のみに制限する。
3. 必要に応じて `Required reviewers` を設定し、任意ユーザーの無承認実行を防止する。

## OAuthシークレット登録手順
1. ローカルで次のコマンドを実行して base64 文字列を作成する。

```bash
base64 -w 0 ~/.opencode/auth/openai.json
```

2. 出力文字列をクリップボードへ保持し、履歴や共有チャットに貼り付けない。
3. GitHubリポジトリの `Settings -> Environments -> opencode -> Secrets and variables -> Actions` を開く。
4. `New environment secret` を押し、以下で登録する。
   - Name: `OPENCODE_OPENAI_OAUTH_JSON_B64`
   - Secret: 手順1で生成した base64 文字列
5. 保存後、値がマスク表示されることを確認する。

## 更新・ローテーション手順
1. 新しい `~/.opencode/auth/openai.json` を取得する。
2. `base64 -w 0 ~/.opencode/auth/openai.json` で再エンコードする。
3. `Environment secret` の `OPENCODE_OPENAI_OAUTH_JSON_B64` を更新する。
4. 更新直後に Issueラベル起動を1回実行し、認証復元ステップの成功を確認する。

## 動作確認手順
1. 許可ユーザーが対象Issueへ `opencode/run` ラベルを付与する。
2. `Actions -> OpenCode Codex Issue Runner` の実行が `environment: opencode` で開始されることを確認する。
3. `Restore OpenAI OAuth token` ステップが成功し、`Cleanup OAuth token` が実行されることを確認する。
4. 失敗時は [[AT-RUN-001]] の「Issueラベル起動失敗」手順へエスカレーションする。

## 運用ガード
- Secret値は Environment `opencode` のみに保持し、Repository secretへ重複登録しない。
- `openai.json` の生ファイルをリポジトリへ保存しない。
- Secret更新後にジョブ失敗が継続する場合は、base64 化の対象ファイル誤りとJSON破損を優先確認する。

## 変更履歴
- 2026-02-23: 新規作成（OpenCode OAuthトークンをEnvironment Secretで管理する手順を分離） [[RQ-RDR-050]]
