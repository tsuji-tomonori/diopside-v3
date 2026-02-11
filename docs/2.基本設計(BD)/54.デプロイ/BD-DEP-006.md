---
id: BD-DEP-006
title: バックエンド配備デプロイ設計
doc_type: デプロイ設計
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[RQ-FR-025]]'
- '[[BD-ADR-014]]'
related:
- '[[BD-DEP-004]]'
- '[[BD-API-004]]'
- '[[DD-DEP-004]]'
- '[[DD-API-010]]'
- '[[AT-REL-001]]'
- '[[AT-SCN-006]]'
tags:
- diopside
- BD
- DEP
---

## 目的
- `'/api/v1/*'` と `'/openapi/*'` の配備責務をフロント配信から分離し、認証境界を維持した運用を定義する。

## 適用範囲
- 対象経路: `'/api/v1/*'`, `'/openapi/*'`
- 対象成果物: API実行系、OpenAPI UI、OpenAPI JSON（`/openapi/v1/openapi.json`）
- 対象外: `'/web/*'`, `'/docs/*'`

## 配備設計
- API経路は `'/api/v1/*'` に固定し、OpenAPI仕様は `'/openapi/v1/openapi.json'` を正本とする。
- `'/api/*'` と `'/openapi/*'` は認証必須とし、未認証アクセスを拒否する。
- rewrite/fallbackは `'/api/*'` と `'/openapi/*'` に適用しない。

## キャッシュ設計
- `'/api/*'` はTTL 0で配信し、実行結果をキャッシュしない。
- `'/openapi/v1/openapi.json'` は短TTLで配信し、仕様更新を追従しやすくする。
- OpenAPI UI静的資産は長TTLで配信し、版更新時はファイル差し替えで反映する。

## 版整合設計
- API版とOpenAPI版は同一変更で更新し、`v1` 対応を維持する。
- 破壊的変更時は `v2` を新設し、互換期間を定義した上で `v1` を廃止する。

## 障害時観点
- 未認証拒否が崩れた場合は、認証設定を優先して閉塞復旧する。
- API応答がHTMLに置換された場合は、behavior優先順位とrewrite誤適用を確認する。
- 版不一致が発生した場合は、`/api/v1/*` と `/openapi/v1/openapi.json` の同時更新履歴を確認する。

## 変更履歴
- 2026-02-11: 新規作成 [[BD-ADR-014]]
