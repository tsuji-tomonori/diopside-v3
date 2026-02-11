---
id: BD-ADR-013
title: ドキュメント公開はQuartz成果物をCDK経由で配信する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[RQ-RDR-025]]'
related:
- '[[RQ-FR-024]]'
- '[[RQ-PC-005]]'
- '[[RQ-PC-009]]'
- '[[BD-DEP-003]]'
- '[[DD-DEP-001]]'
- '[[AT-REL-001]]'
tags:
- diopside
- BD
- ADR
---

## 決定事項
- ドキュメント公開は Quartz のビルド成果物（`quartz/public`）をCDKへ `siteAssetPath` contextで受け渡し、CloudFront + S3へ配備する。
- S3バケットは公開禁止（`BLOCK_ALL`）とし、CloudFront OAC経由のみで配信する。
- デプロイ時はCloudFront invalidation（`/*`）を実行し、反映遅延を抑制する。
- URLルーティングはCloudFront Functionで拡張子なしURLを `.html` へ補完し、`/` は公開トップへ固定リライトする。
- 実行入口はTaskへ集約し、公開運用は `task docs:deploy` を標準とする。
- CI/CDは品質ゲート（リンク整合）と配備ジョブを分離し、配備は手動実行またはmain反映時のみ実施する。

## 理由
- 静的公開に必要な責務（ビルド/配備/キャッシュ更新）を1つのデプロイ経路へ集約できる。
- `siteAssetPath` を明示することで、成果物の参照先を実行時に検証可能になり、誤配備を防げる。
- S3非公開 + OAC構成により、配信セキュリティを維持しながら運用負荷を抑えられる。

## 影響
- デプロイ設計: [[BD-DEP-003]] に公開フロー全体、実行チェーン、失敗時確認観点を追加する。
- 詳細設計: [[DD-DEP-001]] に `siteAssetPath` 解決、Function rewrite、invalidationの詳細を反映する。
- 受入運用: [[AT-REL-001]] / [[AT-RUN-001]] に手順と障害切り分けを反映する。
- 段階導入: docs公開（Phase 1）を先行し、単一CloudFront分岐（Phase 2）は [[BD-ADR-014]] / [[BD-DEP-004]] で拡張する。

## 却下した選択肢
- Quartz成果物を手動アップロードする運用: 再現性と監査性が低く、差分反映漏れのリスクが高いため不採用。
- invalidationを省略してTTL任せにする運用: 反映遅延が長期化し、公開確認手順が不安定になるため不採用。
- S3公開バケット運用: アクセス制御の一元化ができず、運用リスクが増えるため不採用。

## 変更履歴
- 2026-02-11: Task入口統一とCI/CD分離方針、段階導入（Phase 1/2）を追記
- 2026-02-11: 新規作成
