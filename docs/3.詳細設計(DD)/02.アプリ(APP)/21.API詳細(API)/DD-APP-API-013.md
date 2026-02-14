---
id: DD-APP-API-013
title: タグ管理API
doc_type: API詳細
phase: DD
version: 1.1.1
status: 下書き
owner: RQ-SH-001
created: 2026-02-11
updated: '2026-02-14'
up:
- '[[BD-APP-API-002]]'
- '[[RQ-FR-005]]'
- '[[RQ-FR-019]]'
related:
- '[[DD-APP-API-005]]'
- '[[RQ-UC-009]]'
- '[[RQ-RDR-036]]'
- '[[DD-APP-API-015]]'
- '[[DD-APP-UI-009]]'
- '[[UT-PLAN-001]]'
tags:
- diopside
- DD
- API
---

## 目的
- [[DD-APP-UI-009|UI-A04]] からの[[RQ-GL-005|タグ辞書]]更新と動画への手動タグ付けを、DB正本へ安全に反映する。
- [[DD-APP-UI-009|UI-A04]] で外部LLM（ChatGPT）向け入力生成と結果JSON取込を実行し、検証成功時のみタグ反映できるようにする。

## エンドポイント
- `POST /api/v1/admin/tags`
- `PATCH /api/v1/admin/tags/{tagId}`
- `PATCH /api/v1/admin/videos/{videoId}/tags`
- `POST /api/v1/admin/tagging/prompts`
- `POST /api/v1/admin/tagging/imports`

## リクエスト要約
- `POST /admin/tags`: `tag_name`, `tag_type_id`, `synonyms[]`, `is_active`
- `PATCH /admin/tags/{tagId}`: `tag_name?`, `synonyms?`, `is_active?`, `merged_into?`
- `PATCH /admin/videos/{videoId}/tags`: `set[]`, `unset[]`, `reason`
- `POST /admin/tagging/prompts`: `runId`, `videoIds[]`, `includeFields[]`
- `POST /admin/tagging/imports`: `schemaVersion`, `items[]`（`videoId`, `set[]`, `unset[]`, `reason`）

## 処理ロジック
### `POST /api/v1/admin/tags`
1. 認証と権限を検証する。
2. 文字種・長さ・禁止語を検証する。
3. slug重複をチェックし、重複時は拒否する。
4. tagsテーブルへINSERTし、監査ログへ記録する。

### `PATCH /api/v1/admin/tags/{tagId}`
1. `tagId` 存在と状態を確認する。
2. 変更フィールドを検証する。
3. 参照中タグの削除要求は `is_active=false` へ変換する。
4. 更新差分を保存し、`propagation_state=pending_publish` を設定する。

### `PATCH /api/v1/admin/videos/{videoId}/tags`
1. `videoId` と `set/unset` の対象タグ存在を確認する。
2. 競合検証（同一タグをset/unset同時指定禁止）を実施する。
3. video_tags を更新し、操作理由を監査ログへ記録する。
4. 成功時に最新タグ集合と `updatedAt` を返す。

### `POST /api/v1/admin/tagging/prompts`
1. `runId` と `videoIds` の整合を確認し、対象動画を収集結果から解決する。
2. 指定 `includeFields` に基づき、`videoId/title/description/existingTags/diffSummary` を整形する。
3. 管理画面がそのままコピーできる `promptText` を生成する。
4. 応答に `promptVersion`, `videoCount`, `generatedAt` を付与する。

### `POST /api/v1/admin/tagging/imports`
1. `schemaVersion` を検証し、未対応バージョンは拒否する。
2. `items[]` の必須キー・型・重複を検証する。
3. `videoId` と `tagId` の参照整合（存在/有効状態）を検証する。
4. 検証成功レコードのみ video_tags へ反映し、失敗レコードはエラー明細に積む。
5. `importRunId` と `appliedCount/rejectedCount/errors[]` を返す。
6. `appliedCount > 0` の場合は公開反映run起動導線として `publishScope=all` を返す。

## JSON契約（`POST /api/v1/admin/tagging/imports`）
```json
{
  "schemaVersion": "v1",
  "items": [
    {
      "videoId": "xxxxxxxxxxx",
      "set": ["tag-id-1", "tag-id-2"],
      "unset": ["tag-id-3"],
      "reason": "配信内容に基づく手動判断"
    }
  ]
}
```

## レスポンス要約（`POST /api/v1/admin/tagging/imports`）
- `importRunId`, `validatedCount`, `appliedCount`, `rejectedCount`
- `errors[]`: `index`, `code`, `message`, `field?`
- `nextAction`: `publish_required | no_change`

## エラーマッピング
| エラーコード | HTTPステータス | 意味 |
| --- | --- | --- |
| `INVALID_TAG_INPUT` | 400 | タグ作成/更新入力が必須項目・型・文字種制約を満たさない。 |
| `INVALID_TAG_OPERATION` | 400 | `set/unset` 同時指定など、許可されないタグ操作を検知した。 |
| `INVALID_IMPORT_SCHEMA` | 400 | `schemaVersion` が未対応で取込契約として受理できない。 |
| `INVALID_IMPORT_PAYLOAD` | 400 | 取込リクエスト全体の構造が契約に一致しない。 |
| `INVALID_IMPORT_ITEM` | 400 | `items[]` の個別要素が必須キー・型・重複制約を満たさない。 |
| `UNAUTHORIZED` | 401 | JWTが未指定または無効で管理APIを実行できない。 |
| `FORBIDDEN` | 403 | 認証は成立したが管理者権限が不足している。 |
| `TAG_NOT_FOUND` | 404 | 指定 `tagId` が存在せず更新対象を解決できない。 |
| `VIDEO_NOT_FOUND` | 404 | 指定 `videoId` が存在せず手動タグ付け対象を解決できない。 |
| `TAG_SLUG_CONFLICT` | 409 | 正規化後slugが既存タグと衝突した。 |
| `TAG_CONFLICT` | 409 | タグ更新時に同時更新競合や整合制約違反を検知した。 |
| `UNKNOWN_VIDEO_ID` | 422 | 取込データ内の `videoId` が業務データとして未登録。 |
| `UNKNOWN_TAG_ID` | 422 | 取込データ内の `tagId` が業務データとして未登録。 |
| `INACTIVE_TAG_ID` | 422 | 取込対象 `tagId` が無効化済みで付与対象にできない。 |

## 受入観点
- タグ作成/更新/無効化がDB正本へ反映されること。
- [[DD-APP-UI-009|UI-A04]] からの手動タグ付けが理由付きで記録されること。
- 提案入力APIで、管理者がそのままコピーできる入力テキストを取得できること。
- 取込APIで、検証成功レコードのみ反映し失敗レコードは明細で返却されること。
- 反映後に `nextAction=publish_required` を返し、`tag_master.json` と `archive_index.pN.json` 更新導線へ接続できること。

## 変更履歴
- 2026-02-14: 画面参照を [[DD-APP-UI-009|UI-A04]] へリンク化
- 2026-02-14: エラーマッピングを表形式へ統一し、各エラーコードの意味を明記
- 2026-02-11: LLM支援タグ運用の提案入力API/JSON取込APIと契約検証を追加
- 2026-02-11: 新規作成 [[BD-SYS-ADR-021]]
