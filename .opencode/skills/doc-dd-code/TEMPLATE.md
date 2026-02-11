# Document Template

## 本文
- このテンプレートは diopside 向け文書の下書きです。
- Frontmatterは各文書IDに合わせて設定してください。

## 必須観点
- 要求・設計・テストの目的
- 防御的型付け（裸ID回避、判別可能union、センチネル値禁止、`boolean` 状態の意味付け）
- 境界検証（`unknown` 入力、decode/validate一元化、検証済み/未検証データの分離）
- 空配列前提の排除（`NonEmptyArray` 相当または事前検証）
- unsafe cast（`as any`）の局所化と例外記録
- リソース解放保証（`using` または `try/finally`）
- 受入条件または確認手順
- 依存/関連リンク（Obsidianリンク）

## 変更履歴
- YYYY-MM-DD: 変更要約
