---
id: AT-SCN-007
title: 配信前後再確認と手動タグ運用シナリオ
doc_type: 受入テストシナリオ
phase: AT
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-11'
up:
- '[[BD-DEV-TEST-001]]'
- '[[IT-PLAN-001]]'
related:
- '[[AT-GO-001]]'
- '[[RQ-FR-019]]'
- '[[RQ-UC-009]]'
- '[[DD-APP-UI-006]]'
- '[[DD-APP-API-005]]'
- '[[DD-APP-API-012]]'
- '[[DD-APP-API-013]]'
- '[[DD-APP-API-015]]'
tags:
- diopside
- AT
- SCN
---

## シナリオ目的
- 配信前後再確認、手動タグ付け、公開反映までの運用フローが受入手順として実行可能であることを確認する。

## 対応DD-API
- [[DD-APP-API-005]]（[[RQ-GL-005|タグ辞書]]API/公開反映起動）
- [[DD-APP-API-012]]（[[DD-APP-API-012|配信前後再確認API]]）
- [[DD-APP-API-013]]（[[DD-APP-API-013|タグ管理API]]）
- [[DD-APP-API-015]]（[[DD-APP-API-015|配信反映ジョブ状態API]]）

## 前提条件
- [[RQ-SH-001|管理者]]が管理画面（UI-A04）にアクセスできる。
- 対象動画に配信前メタデータ記録が存在し、配信後再確認を実行できる。
- 手動タグ付けに利用する提案JSONの入力元（外部LLM）が利用可能である。

## 手順
1. 管理画面から `POST /api/v1/ops/rechecks` を実行し、配信後再確認 run を起動する。
2. `GET /api/v1/ops/rechecks/{recheckRunId}` をポーリングし、`diffSummary` と `items[]` の状態を確認する。
3. 管理画面で `POST /api/v1/admin/tagging/prompts` を実行し、提案入力テキストを取得して外部LLMへ入力する。
4. 外部LLMの結果JSONを管理画面へアップロードし、`POST /api/v1/admin/tagging/imports` の検証結果を確認する。
5. 検証成功時のみ反映を確定し、`appliedCount/rejectedCount/errors[]` を記録する。
6. `nextAction=publish_required` の場合は公開反映を実行し、`GET /api/v1/admin/publish/{publishRunId}` で完了まで監視する。
7. `succeeded` 時は `tag_master.json` と `archive_index.pN.json` の更新を確認し、`failed/rolled_back` 時は旧公開版維持と再試行判断を記録する。

## シーケンス図
```mermaid
sequenceDiagram
  autonumber
  actor Admin as 管理者(RQ-SH-001)
  participant UI as 運用ステータス画面(UI-A04)
  participant Recheck as 再確認API(DD-APP-API-012)
  participant Tagging as タグ管理API(DD-APP-API-013)
  participant PublishKick as 公開反映起動API(DD-APP-API-005)
  participant PublishStatus as 配信反映状態API(DD-APP-API-015)
  participant DB as DB正本
  participant Static as 公開成果物(tag_master/archive_index)

  Admin->>UI: 対象動画を選択して再確認実行
  UI->>Recheck: POST /api/v1/ops/rechecks
  Recheck-->>UI: recheckRunId(queued)
  loop 完了まで監視
    UI->>Recheck: GET /api/v1/ops/rechecks/{recheckRunId}
    Recheck-->>UI: status + diffSummary + items[]
  end
  UI-->>Admin: 差分判定結果を表示

  Admin->>UI: 提案入力を生成
  UI->>Tagging: POST /api/v1/admin/tagging/prompts
  Tagging-->>UI: promptText + videoCount
  UI-->>Admin: コピペ用入力を表示

  Admin->>UI: 提案結果JSONをアップロード
  UI->>Tagging: POST /api/v1/admin/tagging/imports
  alt JSON検証成功
    Tagging->>DB: video_tags更新 + 監査ログ記録
    Tagging-->>UI: appliedCount/rejectedCount + nextAction
    UI-->>Admin: 反映結果と公開反映導線を表示
  else JSON検証失敗
    Tagging-->>UI: errors[]
    UI-->>Admin: 反映不可を表示
  end

  alt nextAction=publish_required
    Admin->>UI: 公開反映を実行
    UI->>PublishKick: POST /api/v1/admin/publish/tag-master
    PublishKick-->>UI: publishRunId(queued)
    loop 完了まで監視
      UI->>PublishStatus: GET /api/v1/admin/publish/{publishRunId}
      PublishStatus-->>UI: queued/running/succeeded|failed|rolled_back
    end
    alt succeeded
      PublishStatus->>Static: tag_master.json / archive_index.pN.json 更新
      UI-->>Admin: 公開反映完了
    else failed or rolled_back
      UI-->>Admin: 旧公開版維持 + 再試行判断
    end
  else nextAction=no_change
    UI-->>Admin: 公開反映不要
  end
```

## 期待結果
- 配信後再確認の差分あり/差分なし/失敗/対象外が区別して記録される。
- 配信結果タグ付けは自動実行されず、[[RQ-SH-001|管理者]]の確定操作時のみ反映される。
- JSON検証失敗時は反映が拒否され、エラー明細を再入力に利用できる。
- 反映後の公開反映で `tag_master.json` と `archive_index.pN.json` の更新可否が追跡できる。

## 判定基準対応
- 機能判定: [[RQ-FR-019]]（配信前後再確認と手動タグ運用）がPass。
- 運用判定: 公開反映失敗時に旧公開版維持と再試行判断が記録できる。
- データ判定: JSON検証失敗レコードがDBへ誤反映されない。

## 記録項目
- `recheckRunId` / `publishRunId`
- `diffSummary.changedCount/unchangedCount/failedCount`
- `validatedCount/appliedCount/rejectedCount`
- `nextAction` と公開反映の最終状態
- エラーコードとエラー明細
- 対応DD-API（[[DD-APP-API-005]], [[DD-APP-API-012]], [[DD-APP-API-013]], [[DD-APP-API-015]]）
- 判定（Pass/Fail）

## 変更履歴
- 2026-02-11: 新規作成
