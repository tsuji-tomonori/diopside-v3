---
id: BD-DEP-005
title: フロントエンド配信デプロイ設計
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
- '[[DD-DEP-003]]'
- '[[AT-REL-001]]'
tags:
- diopside
- BD
- DEP
---

## 目的
- `'/web/*'` の配信責務を、ドキュメント配信・API配信から分離して定義する。

## 適用範囲
- 対象経路: `'/web/*'`
- 対象成果物: SPAのHTML/JS/CSS/画像アセット
- 対象外: `'/docs/*'`, `'/openapi/*'`, `'/api/v1/*'`

## 配信設計
- 画面の正規入口は `'/web/'` とし、`'/'` は `'/web/'` へ誘導する。
- `'/web/*'` はSPA fallbackを許可し、深いパス直叩きでも画面表示を継続する。
- rewriteは適用せず、`'/docs/*'` 向けFunctionとの混在を禁止する。

## キャッシュ設計
- HTMLは短TTLで配信し、更新反映の遅延を抑制する。
- ハッシュ付きJS/CSS/画像は長TTLで配信し、再配信コストを抑制する。
- invalidationは `'/web/*'` 単位で実行し、全体invalidationは緊急時のみ許可する。

## 障害時観点
- SPA fallback不整合時は、`'/web/<deep-path>'` の応答種別がHTMLであることを確認する。
- docs向けrewrite誤適用時は、`'/web/*'` にFunctionが紐づいていないことを確認する。
- 反映遅延時はCloudFront invalidation完了状態を確認し、必要時に再配備する。

## 変更履歴
- 2026-02-11: 新規作成 [[BD-ADR-014]]
