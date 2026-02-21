---
id: BD-SYS-ADR-037
title: docs PDF配布をArtifact/Releaseで二系統化し命名規則を統一する
doc_type: アーキテクチャ決定記録
phase: BD
version: 1.0.0
status: 下書き
owner: RQ-SH-001
created: 2026-02-21
updated: '2026-02-21'
up:
- '[[RQ-DEV-001]]'
- '[[RQ-FR-024]]'
related:
- '[[BD-INF-DEP-003]]'
- '[[DD-INF-DEP-001]]'
- '[[AT-REL-001]]'
tags:
- diopside
- BD
- ADR
---

## 決定事項
- docs PDF配布を「CI Artifact配布」と「Release Assets配布」の二系統で運用する。
- Release配布ファイル名は `diopside-docs-{branch}-{shortsha}.pdf` に統一する。
- Actions Artifact名は `diopside-docs-{branch}-{shortsha}.zip` とし、中身にPDF本体を格納する。
- `branch` はファイル名安全化のため、`/` と空白を `-` へ置換し、`A-Za-z0-9._-` 以外の文字を除去する。
- Release Assetsへの再添付時は `--clobber` で同名ファイルを上書きする。

## 理由
- Artifact名固定ではダウンロード先でディレクトリ名として扱われるケースがあり、PDF単体として利用しづらかった。
- Release画面から直接PDFを取得できる導線が必要だった。
- ブランチ名と短縮SHAを含む命名により、配布物の由来を即時に特定できる。

## 影響
- `docs-pdf.yml` は `task docs:pdf` 後に命名済みPDFを生成し、Artifact名を `.zip` にして配布種別を明確化する。
- `release-docs-pdf.yml` は Release `published` で命名済みPDFを生成し、Release Assetsへ添付する。
- `BD-INF-DEP-003` / `DD-INF-DEP-001` は運用仕様（配布経路、命名規則、上書き方針）を設計本文へ反映する。

## 却下した選択肢
- 常に固定名 `diopside-docs.pdf` で配布する案: 由来追跡が困難で、複数配布物の識別性が低いため不採用。
- Artifact配布のみでRelease添付を行わない案: [[RQ-SH-002|利用者]]導線がActions画面依存となり、配布先が分かりづらいため不採用。

## 変更履歴
- 2026-02-21: Actions Artifact名を `.zip` へ変更し、Release配布PDFとの識別性を向上 [[BD-SYS-ADR-037]]
- 2026-02-21: 新規作成（docs PDF配布経路の二系統化と命名規則を決定） [[BD-SYS-ADR-037]]
