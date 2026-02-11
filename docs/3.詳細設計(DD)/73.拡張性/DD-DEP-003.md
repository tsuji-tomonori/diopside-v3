---
id: DD-DEP-003
title: フロントエンド配信デプロイ詳細
doc_type: デプロイ詳細
phase: DD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[BD-DEP-005]]'
- '[[BD-DEP-004]]'
related:
- '[[RQ-FR-025]]'
- '[[DD-DEP-002]]'
- '[[AT-REL-001]]'
- '[[AT-SCN-006]]'
tags:
- diopside
- DD
- DEP
---

## 目的
- `'/web/*'` のデプロイ詳細を定義し、画面配信の確認項目を固定する。

## デプロイ対象
- 経路: `'/web/*'`
- 成果物: SPA HTML、JS、CSS、画像
- 依存: CloudFront behavior（`'/web/*'`）、Static Origin

## 詳細手順
1. フロント成果物を静的配信領域の `web/` プレフィックスへ配置する。
2. behavior `'/web/*'` がStatic Originを参照することを確認する。
3. `'/web/*'` のFunction紐づけが `None` であることを確認する。
4. invalidationを `'/web/*'` に対して実行する。
5. `'/web/'` と `'/web/<deep-path>'` の表示確認を行う。

## 検証観点
- `'/web/'` で画面起動できること。
- `'/web/<deep-path>'` でSPA fallbackが機能し、404とならないこと。
- `'/web/*'` でAPI JSONやOpenAPI JSONが返らないこと。

## ロールバック観点
- `web/` プレフィックス配下の直前版へ切替できること。
- 切戻し後に `'/web/'` と `'/web/<deep-path>'` が復旧すること。

## 変更履歴
- 2026-02-11: 新規作成
