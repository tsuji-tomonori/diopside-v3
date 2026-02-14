---
id: UT-IAC-001
title: IaC静的検証ケース
doc_type: 単体テストケース
phase: UT
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-14'
up:
- '[[UT-PLAN-001]]'
- '[[DD-INF-IAC-002]]'
related:
- '[[UT-STAT-001]]'
tags:
- diopside
- UT
- INF
---

## 目的
- IaCの構文/型/命名規約違反を静的検査で検出する。

## 手順
1. 対象環境（`dev/prod`）ごとに `lint -> test -> cdk synth -> cdk diff` を実行する。
2. 命名規則（`<domain>-<resource>-<env>`）違反、未使用変数、型不整合を抽出する。
3. 失敗時は違反IDと該当ファイルを記録し、修正後に同一環境で再実行する。

## 入力条件
- 対象: `infra/` 配下のIaC定義一式。
- 前提: CDK依存モジュール取得済み、`cdk.context.json` が最新。
- 除外: コメント変更のみの差分は検証対象外。

## 失敗時判定
- `cdk synth` 失敗は即NG（後続テスト実行禁止）。
- `lint` 警告は2件まで許容、3件以上はNG。
- 同一違反の再発（過去3回以内）は是正完了までマージ禁止。

## 期待結果
- 重大違反ゼロで完了する。

## 変更履歴
- 2026-02-14: 対象環境を `dev/prod` に統一
- 2026-02-13: CDKオンリー運用に合わせて検証手順を `lint/test/cdk synth/cdk diff` へ更新
- 2026-02-13: 入力条件、詳細手順、失敗時判定を追加
- 2026-02-13: 新規作成
