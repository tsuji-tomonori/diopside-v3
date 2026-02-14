---
id: UT-POL-001
title: Policy as Code検証ケース
doc_type: 単体テストケース
phase: UT
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[UT-PLAN-001]]'
- '[[DD-INF-SEC-002]]'
related:
- '[[DD-INF-IAC-002]]'
tags:
- diopside
- UT
- INF
---

## 目的
- 公開設定禁止、過剰権限禁止などのポリシー違反を事前に検出する。

## 入力条件
- 対象ポリシー: IAM、S3、CloudFront、KMS、Secrets。
- 判定レベル: `high` 以上を品質ゲート対象とする。
- 例外申請はチケットID必須で、期限付き（最大7日）とする。

## 手順
1. Policy as Codeルールセットを最新化して検証を実行する。
2. `public`, `wildcard privilege`, `unencrypted storage` の違反を優先抽出する。
3. 例外対象は有効期限と回避策を照合し、未設定ならNGとする。

## 失敗時判定
- `high` 以上の違反が1件でもあればNG。
- 期限切れ例外が1件でもあればNG。
- 例外が3件を超える場合は運用レビュー完了までマージ禁止。

## 期待結果
- 高リスク違反（public, wildcard privilege）が0件である。

## 変更履歴
- 2026-02-13: 入力条件、検証手順、失敗時判定を追加
- 2026-02-13: 新規作成
