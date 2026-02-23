---
id: BD-INF-DEP-006
title: バックアップ・DR設計
doc_type: デプロイ設計
phase: BD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-02-12
updated: '2026-02-20'
up:
- '[[RQ-AV-001-01]]'
- '[[RQ-SC-001]]'
related:
- '[[BD-INF-DEP-001]]'
- '[[BD-INF-DEP-004]]'
- '[[BD-APP-DATA-001]]'
- '[[BD-INF-MON-001]]'
- '[[DD-SYS-AV-001]]'
- '[[DD-APP-DB-002]]'
- '[[AT-RUN-001]]'
tags:
- diopside
- BD
- DEP
- バックアップ
---


## 設計方針
- [[RQ-AV-001-01]] の[[RQ-AV-001-01|可用性要件]]（月次99.5%以上、MTTR 30分以内）を達成するためのバックアップ・リカバリ戦略を定義する。
- [[RQ-COST-001-01]] の月額3,000円以内の制約を考慮し、最小限のコストで必要十分なバックアップを実現する。

## 必須設計項目
- 重要コンポーネントごとのRTO/RPO。
- DR戦略（Backup/Pilot Light/Warm Standby/Multi-Site）の選択根拠。
- 復旧Runbookと演習頻度。
- クロスリージョン/クロスアカウント複製の採用可否。

## バックアップ対象

### 配信データ（S3）
| 対象 | パス | バックアップ方式 | 保持期間 |
|------|------|-----------------|---------|
| [[RQ-GL-007|bootstrap]].json | `/web/bootstrap.json` | S3バージョニング | 30日 |
| [[RQ-GL-008|タグマスター]].json | `/web/tag_master.json` | S3バージョニング | 30日 |
| [[RQ-GL-009|アーカイブ索引]].pN.json | `/web/archive_index.p*.json` | S3バージョニング | 30日 |
| highlights/*.json | `/web/highlights/*.json` | S3バージョニング | 30日 |
| wordcloud/*.png | `/web/wordcloud/*.png` | S3バージョニング | 30日 |

### DB正本データ
| 対象 | 保持先 | バックアップ方式 | 保持期間 |
|------|--------|-----------------|---------|
| `channels` / `videos` / `tags` / `video_tags` | DB正本 | 日次スナップショット + Point-in-Time Recovery | 30日 |
| `ingestion_runs` / `ingestion_items` / `recheck_runs` / `publish_runs` | DB正本 | 日次スナップショット + Point-in-Time Recovery | 30日 |
| 監査・運用履歴テーブル | DB正本 | 日次スナップショット + Point-in-Time Recovery | 30日 |

### IaC設定（CDK）
| 対象 | リポジトリ | バックアップ方式 | 保持期間 |
|------|----------|-----------------|---------|
| CDKスタック定義 | `infra/` | Git履歴 | 永続 |
| cdk.context.json | `infra/cdk.context.json` | Git履歴 | 永続 |
| CloudFront設定 | CDK管理 | CDK再デプロイ | - |

### ドキュメント
| 対象 | リポジトリ | バックアップ方式 | 保持期間 |
|------|----------|-----------------|---------|
| docs/ | `docs/` | Git履歴 | 永続 |
| Quartzビルド成果物 | `/docs/*` (S3) | S3バージョニング | 30日 |

## RTO/RPO定義

| 障害種別 | RTO（目標復旧時間） | RPO（目標復旧時点） | 復旧方法 |
|---------|-------------------|-------------------|---------|
| 配信データ破損 | 15分 | 直前バージョン | S3バージョン復元 |
| DB正本の誤更新/破損 | 30分 | 直前5分以内 | DBスナップショット/PITR復旧 |
| CloudFront設定誤り | 30分 | 直前デプロイ | CDKロールバック |
| 全データ喪失（S3削除） | 60分 | 30日以内 | S3バージョン復元 + [[RQ-GL-011|再収集]] |
| リージョン障害 | 120分 | 直前バージョン | 手動復旧（単一リージョン前提） |

## バックアップ設定

### S3バージョニング
```yaml
# CDK設定例
bucket:
  versioned: true
  lifecycleRules:
    - id: cleanup-old-versions
      noncurrentVersionExpiration:
        noncurrentDays: 30
      abortIncompleteMultipartUploadAfter:
        days: 7
```

### バージョン管理ポリシー
- 現行バージョン: 常時保持
- 非現行バージョン: 30日後に自動削除
- 削除マーカー: 30日後に自動削除
- 不完全なマルチパートアップロード: 7日後に自動削除

## リカバリ手順

### 配信データ復元

#### 単一ファイル復元
```bash
# 1. バージョン一覧を取得
aws s3api list-object-versions \
  --bucket ${BUCKET_NAME} \
  --prefix web/bootstrap.json

# 2. 特定バージョンを復元（コピーで上書き）
aws s3api copy-object \
  --bucket ${BUCKET_NAME} \
  --copy-source "${BUCKET_NAME}/web/bootstrap.json?versionId=${VERSION_ID}" \
  --key web/bootstrap.json

# 3. CloudFrontキャッシュ無効化
aws cloudfront create-invalidation \
  --distribution-id ${DISTRIBUTION_ID} \
  --paths "/web/bootstrap.json"
```

#### 全配信データ復元
```bash
# 1. 復元対象日時のバージョンを特定
# 2. 各ファイルを順次復元
# 3. 整合性検証（diagnostics API）
# 4. CloudFrontキャッシュ無効化
```

### CDK設定ロールバック
```bash
# 1. 直前のコミットを特定
git log --oneline infra/

# 2. 直前コミットをチェックアウト
git checkout ${COMMIT_HASH} -- infra/

# 3. CDK再デプロイ
cd infra && npm run deploy

# 4. 動作確認
```

### DB正本の復元
```bash
# 1. 復元時点を特定（障害発生時刻の直前）
# 2. DBのPITRまたはスナップショット復元を実行
# 3. 運用APIの整合確認（run件数/最新状態）を実施
# 4. 必要に応じて配信反映runを再実行
```

### 障害時エスカレーション
1. **即時（0-5分）**: 障害検知と初期調査
2. **5-15分**: 復旧方法の決定と実行開始
3. **15-30分**: 復旧完了と動作確認
4. **30分超**: [[AT-RUN-001]] に従いインシデント記録

## 検証計画

### 定期検証
| 検証項目 | 頻度 | 方法 |
|---------|------|------|
| S3バージョン復元 | 月次 | 単一ファイル復元テスト |
| CDKロールバック | 四半期 | 設定変更→ロールバック |
| 全体復旧訓練 | 年次 | 全データ復元シミュレーション |

### 検証手順
1. テスト用ファイルを作成・更新
2. 意図的に破損または削除
3. バージョン復元を実行
4. 整合性を確認
5. 結果を記録

## 制約事項

### コスト制約
- S3バージョニングによる追加コスト: 約$0.5/月（推定）
- クロスリージョンレプリケーション: 採用しない（コスト超過リスク）
- DBバックアップは保持期間30日を上限とし、スナップショット世代を超過させない。

### 運用制約
- 単一運用者前提のため、24時間対応は不可
- 運用時間外（平日09:00-21:00 JST以外）の障害は翌営業日対応

## 関連ドキュメント
- [[BD-INF-DEP-001]]: [[BD-INF-DEP-001|デプロイ方式]]
- [[BD-INF-DEP-004]]: CDK + CloudFront統合デプロイ
- [[BD-INF-MON-001]]: [[BD-INF-MON-001|監視設計]]
- [[DD-SYS-AV-001]]: [[DD-SYS-AV-001|可用性詳細]]設計
- [[AT-RUN-001]]: 障害対応手順書

## 変更履歴
- 2026-02-20: 章再編に合わせてDR戦略選択と演習要件を追加 [[BD-SYS-ADR-036]]
- 2026-02-13: DB正本バックアップ（スナップショット/PITR）を追加し、ファイルベース前提の制約記述を削除 [[BD-SYS-ADR-021]]
- 2026-02-12: 新規作成（分析レポートに基づく追加）
