## 実施内容（UI基本設計のコンポーネント分割）
- 対象: `docs/2.基本設計(BD)/03.アプリ(APP)/41.UI(UI)`。
- 変更内容:
  - 既存 `BD-APP-UI-001` から `BD-APP-UI-004` を更新し、コンポーネント設計参照を追加。
  - 新規 `BD-APP-UI-005` から `BD-APP-UI-016` を追加し、画面コンポーネントとUIプリミティブを分離。
  - 新規ADR `BD-SYS-ADR-041` を追加し、非機能UX起点の分割方針と色規約を決定。

## 影響確認
- 要求追跡:
  - UX要求 `RQ-UX-001-01`, `RQ-UX-013-01`, `RQ-UX-015-01`, `RQ-UX-017-01` を画面/通知部品に割当。
  - 色/コントラスト要求 `RQ-UX-004-01`, `RQ-UX-004-02`, `RQ-UX-004-03`, `RQ-UX-025-04`, `RQ-UX-025-06` を `BD-APP-UI-016` と各プリミティブへ割当。
- 設計整合:
  - 変更履歴に `[[BD-SYS-ADR-041]]` を追記し、BD設計変更の決定経路を維持。
  - 色トークンは `web/src/styles/global.css` の値を設計正本へ反映し、実装との差分起点を明示。

## 更新文書
- ADR: `BD-SYS-ADR-041`
- UI（更新）: `BD-APP-UI-001`, `BD-APP-UI-002`, `BD-APP-UI-003`, `BD-APP-UI-004`
- UI（新規）: `BD-APP-UI-005`, `BD-APP-UI-006`, `BD-APP-UI-007`, `BD-APP-UI-008`, `BD-APP-UI-009`, `BD-APP-UI-010`, `BD-APP-UI-011`, `BD-APP-UI-012`, `BD-APP-UI-013`, `BD-APP-UI-014`, `BD-APP-UI-015`, `BD-APP-UI-016`

## 検証
- `task docs:guard`
