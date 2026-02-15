# 影響確認レポート

- 日付: 2026-02-15
- 対象: ドメイン境界定義に対する設計レビュー指摘（分類定義・略語定義・日本語併記）の是正
- 判定: 指摘対象を `BD-SYS-DOM-001` に集約し、AnalyticsのCore化判断をADRで追跡可能化

## 実施内容
- 基本設計更新: `BD-SYS-DOM-001`
  - サブドメイン分類定義（Core/Supporting）を追加。
  - Analytics（分析）を `Supporting` から `Core` へ変更。
  - `BC6 Analytics（オプション）` を `BC6 Analytics` へ変更。
  - 境界契約パターン定義（ACL / Customer-Supplier / Published Language / Shared Kernel / OHS）を追加。
  - 境界契約マトリクスの上流/下流を日本語併記へ統一。
  - BC責務サマリに `BC = Bounded Context` 定義を追加し、`FR/DM/GL` 列見出しを日本語主体へ更新。
- 設計判断追加: `BD-SYS-ADR-032`
  - AnalyticsをCoreサブドメインとして扱う判断根拠、影響、却下案を記録。

## 影響確認
- 追跡整合: `BD-SYS-DOM-001` の変更履歴に `[[BD-SYS-ADR-032]]` を追記し、設計判断への追跡経路を確保。
- 表記整合: 英語略語のみで解釈が必要だった箇所を、定義文または日本語併記で解消。
- 分類整合: Analyticsの分類・投資優先度・コンテキスト一覧の運用位置づけを相互整合化。

## 検証
- `task docs:guard` を実行し、リンク/Frontmatter/用語整合を確認する。
- 必要に応じて `task docs:check` を実行し、全体整合（`issues`, `broken_links`, `nonlinked_doc_ids`）を確認する。
