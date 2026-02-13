# 影響確認レポート

- 日付: 2026-02-14
- 対象: 環境定義を `dev/prod` へ再統一する文書改訂
- 判定: 要求/設計/試験の環境語彙を2環境前提へ整合

## 実施内容
- 要求更新: `RQ-COST-001`, `RQ-RDR-027`
- 基本設計更新: `BD-INF-002`
- 詳細設計更新: `DD-NET-001`, `DD-COST-001`
- 単体テスト更新: `UT-IAC-001`, `UT-SEC-001`

## 影響確認
- 要求整合: `Environment` 列挙値を `Production` / `Development` へ更新し、運用環境方針と一致。
- 設計整合: 環境分割方針を `dev/prod` に統一し、ネットワーク実装値と昇格ルールを2環境へ再定義。
- テスト整合: IaC静的検証/セキュリティスキャンの対象環境を `dev/prod` に統一。

## 検証
- `task docs:guard` を実行し、対象7文書で `issues: 0` / `broken_links: 0` を確認。

## 実施内容（追加）
- 対象: UI詳細設計の画面/画面コンポーネント文書の全件整備と設計横断リンク化
- 詳細設計追加: `DD-UI-007`〜`DD-UI-018`
- 詳細設計更新: `DD-UI-001`〜`DD-UI-006`, `DD-COMP-001`, `DD-COMP-002`, `DD-ARCH-002`, `DD-ALG-001`, `DD-API-009`, `DD-API-013`, `DD-API-015`
- 基本設計更新: `BD-UI-001`〜`BD-UI-004`

## 影響確認（追加）
- 画面整合: `UI-U01`〜`UI-U03` と `UI-A01`〜`UI-A06` を各DD-UIへ1対1で対応付けた。
- コンポーネント整合: `SearchConditionPanel` / `ArchiveList` / `ArchiveDetailModal` / `HighlightWavePanel` / `WordCloudPanel` / `RunStatusScreen` を個別DD-UIとして追加した。
- 設計横断リンク: BD/UI, DD/UI, DD/COMP, DD/API, DD/ALGで画面ID・画面コンポーネント名を `[[DD-UI-*]]` へリンク化した。
