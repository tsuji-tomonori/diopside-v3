---
id: DD-CICD-INF-001
title: インフラCI/CD詳細
doc_type: インフラ詳細
phase: DD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-13'
up:
- '[[BD-INF-007]]'
- '[[RQ-DEV-001]]'
related:
- '[[BD-BUILD-001]]'
- '[[DD-IAC-001]]'
- '[[IT-INF-ROLL-001]]'
tags:
- diopside
- DD
- INF
---

## 詳細仕様
- パイプラインは `lint/validate -> policy -> cdk synth -> cdk diff -> approve -> cdk deploy -> smoke` の順で実行する。
- 破壊的差分は手動承認を必須とする。

## 破壊的差分の判定
- `cdk diff` 差分に `replace` / `delete` / `security boundary change` を含む場合は破壊的差分として扱う。
- 破壊的差分は「設計レビュー承認 + 運用承認」の二重承認を必須とし、承認者は実行者と兼任不可。
- `prod` 反映では `IT-INF-ROLL-001` の直近成功証跡がない場合、承認不可とする。

## artifact固定化
- `cdk synth` 生成物と `cdk diff` 出力はハッシュ付きartifactとして保存し、`approve` 後に再計算された差分が一致しない場合は実行を中止する。
- `cdk deploy` は承認済みartifact IDを入力値に取り、未承認artifactの利用を禁止する。

## 再実行条件
- `lint/validate/policy` 失敗: 修正後に先頭から再実行する。
- `cdk synth` / `cdk diff` 失敗: context/依存関係を確認して `cdk synth` から再実行する。
- `cdk deploy` 失敗: 自動ロールバック後、原因分類（設定/資格情報/依存障害）を記録して再実行可否を判定する。

## 失敗時運用
- `cdk deploy` 失敗時は自動でロールバック手順を起動し、失敗証跡を保管する。

## 変更履歴
- 2026-02-13: CDK標準パイプライン（synth/diff/deploy）へ更新
- 2026-02-13: 破壊的差分判定、承認条件、artifact固定化、再実行条件を追加
- 2026-02-13: 新規作成
