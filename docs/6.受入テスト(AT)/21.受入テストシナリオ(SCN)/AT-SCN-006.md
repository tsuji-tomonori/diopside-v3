---
id: AT-SCN-006
title: 単一CloudFrontパス分岐シナリオ
doc_type: 受入テストシナリオ
phase: AT
version: 1.0.3
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-03-08'
up:
- '[[BD-DEV-TEST-001]]'
- '[[IT-PLAN-001]]'
related:
- '[[AT-GO-001]]'
- '[[RQ-FR-025]]'
- '[[BD-SYS-ADR-021]]'
- '[[BD-SYS-ADR-045]]'
- '[[BD-INF-DEP-004]]'
- '[[BD-APP-API-004]]'
- '[[DD-INF-DEP-002]]'
- '[[DD-APP-API-010]]'
tags:
- diopside
- AT
- SCN
---

## シナリオ目的
- 単一CloudFront上で `/web` `/docs` `/openapi` `/api/v1` が競合なく分岐し、認証境界が成立することを確認する。

## 対象範囲
- 配信経路分岐、公開/保護経路の認証境界、rewrite非干渉、公開UI/管理UI入口境界、情報漏えい確認。
- 収集運用やタグ運用フローは本シナリオ対象外とする。

## 前提条件
- CloudFront behaviorが [[DD-INF-DEP-002]] の順序で適用されている。
- OpenAPI仕様は `/openapi/v1/openapi.json` に配置済み。
- 管理画面入口URLは `/web/admin` とする。

## 対応DD-API
- [[DD-APP-API-010]]（API経路バージョニング）

## 対応要求
- [[RQ-FR-025]]
- [[RQ-SEC-001-01]]
- [[RQ-DEV-001-01]]

## テストデータ
- `/web` 側で参照する `bootstrap.json` / `tag_master.json` / `archive_index.p0.json` を最新化して用意する。
- 認証あり/なしの2状態で同一経路を検証できるアカウント状態を用意する。

## 手順
1. `/` にアクセスし、`/web/` へ誘導されることを確認する。
2. `/web/` と `/web/<deep-path>` が表示でき、公開UIに管理画面への遷移ボタン/リンクが表示されないことを確認する。
3. `/web/admin` へ直アクセスし、管理画面認証または管理画面本体が表示されることを確認する。
4. `/docs/` と `/docs/<doc-path>` が表示できることを確認する。
5. `bootstrap.json` `tag_master.json` `archive_index.p0.json` が `Web App` から参照可能なことを確認する。
6. 未認証で `/openapi/` と `/api/v1/ops/diagnostics/health` へアクセスし、拒否されることを確認する。
7. 認証後に `/openapi/` へアクセスし、`/openapi/v1/openapi.json` が取得できることを確認する。
8. 認証後に `/api/v1/ops/diagnostics/health` へアクセスし、正常応答を確認する。
9. `/api/v1/*` へのアクセスでHTMLが返らないこと（rewrite非干渉）を確認する。
10. `/web/*` `/docs/*` 応答にDB接続情報など非公開情報が含まれないことを確認する。

## 期待結果
- 4経路が責務どおりに配信される。
- 管理画面は `/web/admin` 直指定でのみ到達し、公開UIには管理導線が露出しない。
- [[RQ-SH-002|利用者]]向け参照データ（静的JSON）が `Web App` から取得できる。
- 認証必須経路の未認証アクセスが拒否される。
- OpenAPI版とAPI版が `v1` で一致する。

## 記録
- 確認URL
- 認証状態
- HTTPステータス
- 応答種別（HTML/JSON）
- 情報漏えい有無（機密情報含有: Yes/No）
- 判定（Pass/Fail）

## 失敗時の切り分け導線
- 経路分岐不整合はCloudFront behavior設定と [[DD-INF-DEP-002]] 実装差分を確認する。
- 認証境界不整合は [[DD-APP-API-010]] とセキュリティ設計（[[DD-SYS-SEC-001]]）へ戻す。
- 情報漏えい検知時は直ちに [[AT-RUN-001]] へエスカレーションし、公開配信を停止判断する。

## 参照UT/IT（証拠リンク）
- [[UT-RPT-001]]
- [[IT-RST-001]]

## 変更履歴
- 2026-03-08: `/web/admin` 直アクセスと、公開UIに管理導線を置かない確認手順を追加 [[BD-SYS-ADR-045]]
- 2026-02-28: 共通テンプレ（対象範囲/対応DD-API/対応要求/テストデータ/記録/切り分け/参照UT-IT）へ章構成を統一
- 2026-02-11: web/data静的JSON確認と情報漏えい観点を追加 [[BD-SYS-ADR-021]]
- 2026-02-11: 新規作成
