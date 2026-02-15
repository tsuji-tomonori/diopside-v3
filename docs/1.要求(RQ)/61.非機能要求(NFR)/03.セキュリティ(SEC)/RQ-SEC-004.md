---
id: RQ-SEC-004
title: セキュリティヘッダー
doc_type: 非機能要求
phase: RQ
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-16
updated: '2026-02-16'
up:
- '[[RQ-SC-001]]'
related:
- '[[RQ-SEC-001]]'
- '[[RQ-SEC-002]]'
- '[[RQ-DEV-001]]'
tags:
- diopside
- RQ
- SEC
---


## SnowCard（日本語）
- 要求ID: RQ-SEC-004
- 種別: 非機能要求
- 優先度: MUST
- 要求: 本システムは、CloudFrontレスポンスヘッダーポリシーを通じて標準セキュリティヘッダーを全レスポンスに付与すること。
- 根拠: XSS・クリックジャッキング・MIMEスニッフィング等のクライアントサイド攻撃を緩和し、ブラウザのセキュリティ機能を有効活用するため。
- 受入基準:
  - `Content-Security-Policy` が設定され、インラインスクリプトの実行を制限する。
  - `X-Content-Type-Options: nosniff` が全レスポンスに付与される。
  - `X-Frame-Options: DENY` が全レスポンスに付与される。
  - `Strict-Transport-Security` が `max-age=63072000; includeSubDomains` 以上で設定される。
  - `Referrer-Policy: strict-origin-when-cross-origin` が設定される。
  - 上記ヘッダーはCloudFrontレスポンスヘッダーポリシーとしてCDKで管理される。
  - デプロイ後の応答ヘッダー検査で上記5種のヘッダーが全件存在する。
- 例外/エラー:
  - CSPポリシーにより正当なリソース読み込みが阻害された場合は、最小限のCSP緩和をADRに記録して適用する。
  - サードパーティ埋め込みが必要になった場合は、`X-Frame-Options` を `SAMEORIGIN` へ変更しADRに記録する。
- 依存・関連:
  - [[RQ-SEC-001]]
  - [[RQ-SEC-002]]

## 変更履歴
- 2026-02-16: 新規作成
