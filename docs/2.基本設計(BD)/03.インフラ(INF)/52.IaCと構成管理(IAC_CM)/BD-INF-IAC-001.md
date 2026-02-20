---
id: BD-INF-IAC-001
title: インフラ変更フロー
doc_type: インフラアーキテクチャ
phase: BD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-13
updated: '2026-02-20'
up:
- '[[BD-INF-PLAT-001]]'
related:
- '[[BD-INF-CM-001]]'
- '[[BD-INF-DEP-005]]'
- '[[DD-INF-IAC-002]]'
- '[[DD-INF-IAC-001]]'
- '[[IT-INF-ROLL-001]]'
- '[[BD-SYS-ADR-028]]'
- '[[BD-SYS-ADR-036]]'
tags:
- diopside
- BD
- INF
---

## 方針
- インフラ変更はCDK IaCのみで実施し、手動変更を禁止する。
- `cdk synth -> cdk diff -> review -> approve -> cdk deploy -> verify` を必須手順とする。

## フェーズ責務
| フェーズ | 正本文書 | 必須出力 | 不可事項 |
|---|---|---|---|
| synth | [[DD-INF-IAC-002]], [[DD-INF-IAC-003]] | 生成テンプレート、context値、生成ハッシュ | 本番反映 |
| diff | [[DD-INF-IAC-002]], [[DD-INF-IAC-001]] | 差分サマリ、影響リソース一覧、破壊的変更有無 | 差分未確認で次フェーズ進行 |
| review | [[BD-INF-CM-001]] | レビュー記録、承認者、却下理由 | 口頭承認のみ |
| approve | [[BD-INF-IAC-001]] | 承認チケットID、実行ウィンドウ、ロールバックID | 承認者と実行者の同一化 |
| deploy | [[DD-INF-IAC-001]] | 実行ログ、適用結果、失敗時証跡 | 承認なし本番反映 |
| verify | [[IT-INF-SMK-001]], [[IT-INF-ROLL-001]] | 到達性確認、監視確認、切戻し判断 | 検証省略で完了扱い |

## 承認条件
- 破壊的変更（`cdk diff` 上のリソース置換、削除、認証境界変更）は二重承認を必須とし、業務時間外適用を禁止する。
- 非破壊変更でも `IT-INF-SMK-001` の成功証跡がない場合は完了扱いにしない。

## ロールバック
- 破壊的変更は事前にロールバック手順を定義し、適用前に検証済みであることを必須化する。

## 変更履歴
- 2026-02-20: INF章再編に合わせてIaC章の正本位置を更新 [[BD-SYS-ADR-036]]
- 2026-02-13: CDK標準フロー（synth/diff/deploy）へ変更管理フェーズを再定義 [[BD-SYS-ADR-028]]
- 2026-02-13: 変更フローのフェーズ責務・承認条件・禁止事項を具体化 [[BD-SYS-ADR-028]]
- 2026-02-13: 新規作成（IaC変更フローと承認/ロールバック規約を追加） [[BD-SYS-ADR-028]]
