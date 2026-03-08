---
id: BD-SYS-ADR-045
title: 管理画面入口を `/web/admin` 直指定に固定し公開UIから分離する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-03-08
updated: '2026-03-08'
up:
- '[[RQ-RDR-055]]'
related:
- '[[RQ-FR-025]]'
- '[[BD-APP-UI-001]]'
- '[[BD-INF-DEP-004]]'
- '[[DD-APP-UI-001]]'
- '[[AT-SCN-006]]'
tags:
- diopside
- BD
- ADR
---

## 決定事項
- 管理画面入口は `/web/admin` に固定し、公開UIは `/web/` 系の非adminパスで提供する。
- 画面種別の判定はUI内部のモード切替stateではなく `pathname` を正本にする。
- 公開UIヘッダや操作群には管理画面への遷移ボタン/リンクを配置しない。
- `/web/*` のSPA fallbackは `/web/admin` の直アクセスを含めて維持する。

## 理由
- 公開UIと管理UIを同一画面の切替で扱うと、運用UIの存在が公開導線へ露出しやすい。
- `pathname` を正本にすれば、CloudFrontのパス境界、Cognitoのリダイレクト先、UI描画条件を同じ入口で揃えられる。
- 予約URLを固定すると、運用手順書と受入シナリオで確認すべき入口を一意にできる。

## 影響
- [[BD-APP-UI-001]] に管理画面入口URLと公開UI無導線方針を追加する。
- [[BD-INF-DEP-004]] に `/web/admin` の予約URLとSPA fallback前提を追記する。
- [[DD-APP-UI-001]] に `pathname` ベースの描画切替と公開UI操作制約を追加する。
- Web実装は `App.tsx` の `viewMode` 切替を廃止し、URL判定で公開UI/管理UIを描画する。

## 却下した選択肢
- 同一画面で `公開UI` / `管理UI` ボタン切替を残す案: 公開導線へ管理機能が露出し、要求境界が曖昧になるため不採用。
- `#/admin` のハッシュルーティングで分離する案: CloudFrontの予約パスや運用手順と整合しにくいため不採用。
- `/api/v1/*` 保護のみでUI導線は残す案: 認可では防げても公開UI上の露出は残るため不採用。

## 変更履歴
- 2026-03-08: 新規作成（管理画面入口を `/web/admin` 直指定へ固定し、公開UIから分離する設計を決定） [[BD-SYS-ADR-045]]
