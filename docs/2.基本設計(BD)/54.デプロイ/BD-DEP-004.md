---
id: BD-DEP-004
title: 単一CloudFrontパス分岐デプロイ設計
doc_type: デプロイ設計
phase: BD
version: 1.0.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[RQ-FR-025]]'
- '[[BD-ADR-014]]'
related:
- '[[BD-DEP-003]]'
- '[[DD-DEP-002]]'
- '[[AT-REL-001]]'
- '[[AT-RUN-001]]'
tags:
- diopside
- BD
- DEP
---

## 目的
- 1つのCloudFront Distributionで、画面・ドキュメント・OpenAPI・APIを経路分離して配信する設計を定義する。

## 導入位置づけ
- 本設計は [[BD-DEP-003]] のPhase 2（拡張）で適用する。
- Phase 1（`/docs/*` 単独公開）の運用安定化完了を前提条件とする。

## パス予約
- `/web/*`: 画面配信（SPA）
- `/docs/*`: 文書配信（Quartz）
- `/openapi/*`: OpenAPI UI/仕様配信
- `/api/v1/*`: 業務API
- `/`: `/web/` へ誘導

## Behavior設計
| 優先 | Path Pattern | Origin | 認証 | rewrite/fallback |
|---|---|---|---|---|
| 1 | `/api/*` | API Origin | 必須 | 禁止 |
| 2 | `/openapi/*` | Static Origin | 必須 | 禁止 |
| 3 | `/docs/*` | Static Origin | 任意 | rewrite許可 |
| 4 | `/web/*` | Static Origin | アプリ制御 | SPA fallback許可 |
| 5 | `/*` | Redirect Handler | なし | `/web/` 誘導のみ |

## キャッシュ方針
- `/api/*`: TTL 0（キャッシュ無効）
- `/openapi/v1/openapi.json`: 短TTL
- `/openapi/*` 静的資産: 長TTL（ファイル名ハッシュ前提）
- `/docs/*`, `/web/*`:
  - HTML: 短TTL
  - JS/CSS/画像: 長TTL

## デプロイ方針
- 静的成果物はプレフィックス分離で配置する（例: `web/`, `docs/`, `openapi/`）。
- invalidationは経路別に実行する（`/web/*`, `/docs/*`, `/openapi/*`）。
- `/*` 全体invalidationは緊急時のみ許可する。

## 失敗時確認観点
- 経路競合: behavior順序、path pattern、default behaviorを確認する。
- rewrite誤適用: `/api/*` と `/openapi/*` にFunctionが紐づいていないことを確認する。
- 認証失敗: `/api/*` と `/openapi/*` の認証設定とヘッダ転送を確認する。

## 変更履歴
- 2026-02-11: Phase 2適用の位置づけと前提条件を追記
- 2026-02-11: 新規作成
