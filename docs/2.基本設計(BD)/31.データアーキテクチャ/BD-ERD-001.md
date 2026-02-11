---
id: BD-ERD-001
title: ER図（概要）
doc_type: ER図
phase: BD
version: 1.0.2
status: 下書き
owner: RQ-SH-001
created: 2026-01-31
updated: '2026-02-11'
up:
- '[[RQ-SC-001]]'
- '[[RQ-FR-001]]'
related:
- '[[BD-ARCH-001]]'
- '[[BD-ADR-021]]'
- '[[BD-DATA-001]]'
- '[[DD-DDL-001]]'
- '[[DD-DDL-005]]'
tags:
- diopside
- BD
- ERD
---

## 設計方針
- ERDはDB正本を中心に、収集実行、タグ管理、公開反映の関係を示す。
- 利用者向け配信成果物はDB派生であり、ERDでは正本データのみを扱う。

## 設計要点
- `videos` を中心に `channels`、`video_tags`、`tags` を関連付ける。
- `ingestion_runs` と `ingestion_events` で収集実行履歴を保持する。
- `publish_runs` と `publish_artifacts` で公開反映履歴を保持する。

## 図
```mermaid
erDiagram
  channels ||--o{ videos : has
  videos ||--o{ video_tags : tagged
  tags ||--o{ video_tags : maps
  tag_types ||--o{ tags : classifies

  ingestion_runs ||--o{ ingestion_events : records
  videos ||--o{ ingestion_events : targets

  publish_runs ||--o{ publish_artifacts : outputs
  ingestion_runs ||--o{ publish_runs : triggers

  channels {
    string channel_id PK
    string channel_name
    string channel_type
  }

  videos {
    string video_id PK
    string channel_id FK
    string title
    datetime published_at
    string source_type
    string update_type
  }

  tag_types {
    string tag_type_id PK
    string name
    int sort_order
  }

  tags {
    string tag_id PK
    string tag_type_id FK
    string tag_name
    boolean is_active
    datetime updated_at
  }

  video_tags {
    string video_id FK
    string tag_id FK
    string assigned_by
  }

  ingestion_runs {
    string run_id PK
    string mode
    string status
    datetime started_at
  }

  ingestion_events {
    string event_id PK
    string run_id FK
    string video_id FK
    string result
    string reason
  }

  publish_runs {
    string publish_run_id PK
    string source_run_id FK
    string status
    datetime started_at
    datetime published_at
  }

  publish_artifacts {
    string artifact_id PK
    string publish_run_id FK
    string artifact_type
    string artifact_path
    string checksum
  }
```

## 変更履歴
- 2026-02-11: DB正本と公開反映履歴を含むER図へ再構成 [[BD-ADR-021]]
- 2026-02-10: 新規作成 [[BD-ADR-001]]
