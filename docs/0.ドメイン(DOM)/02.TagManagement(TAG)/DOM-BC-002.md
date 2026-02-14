---
id: DOM-BC-002
title: BC定義 TagManagement
doc_type: 境界づけられたコンテキスト定義
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-14
updated: '2026-02-14'
up:
  - '[[DOM-CTX-001]]'
related:
  - '[[DOM-SUB-001]]'
  - '[[DOM-BC-001]]'
  - '[[DOM-BC-003]]'
  - '[[DOM-BC-005]]'
tags:
  - diopside
  - DOM
  - BC
  - TAG
---

## サブドメイン
- Core

## 責務
- [[RQ-GL-013|タグ種別]]・[[RQ-GL-005|タグ辞書]]の管理。
- 動画へのタグ割当とタグマスタ公開の整合維持。

## 主要用語（GL）
- [[RQ-GL-005]] [[RQ-GL-005|タグ辞書]]
- [[RQ-GL-008]] [[RQ-GL-008|tag_master]]
- [[RQ-GL-013]] [[RQ-GL-013|タグ種別]]

## 主要ドメインモデル（DM）
- [[RQ-DM-003]] タグエンティティ
- [[RQ-DM-004]] [[RQ-GL-013|タグ種別]]エンティティ

## 主要機能要求（FR）
- [[RQ-FR-005]]

## 境界外との契約
- Ingestion（[[DOM-BC-001]]）とは `videos/channels` を Shared Kernel として共有する。
- Publishing（[[DOM-BC-003]]）へ `tag_types/tags/video_tags` を Customer-Supplier で供給する。
- Administration（[[DOM-BC-005]]）から OHS コマンドを受け付ける。

## 変更履歴
- 2026-02-14: 新規作成（TagManagement BC の責務・GL/DM/FR・境界契約を定義） [[BD-SYS-ADR-029]]
