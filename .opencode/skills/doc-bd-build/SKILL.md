---
name: doc-bd-build
description: BD-BUILD（ビルド設計）文書を追加・改訂する際に、TypeScript型安全を含むビルド失敗条件と品質ゲートをdiopside規約準拠で整備する
metadata:
  short-description: BD-BUILD 文書の更新ガイド
---

## 目的
- diopside（白雪 巴 公開YouTubeアーカイブ収集・蓄積・検索）の文書を、Obsidian運用規約に沿って更新する。

## このスキルを使う条件
- `BD-BUILD-*`（ビルド設計）文書を新規作成・更新する。
- `tsconfig` 厳格設定、lintゲート、CI失敗条件など「ビルドで何を落とすか」を受入可能な形で明文化する。

## このスキルを使わない条件
- アーキテクチャ全体の責務分割や構成決定を主対象にする場合（`BD-ARCH-*` / `BD-ADR-*` を使う）。
- 実装コード単位の詳細手順や関数設計を主対象にする場合（`DD-CODE-*` を使う）。

## 何を書くべきか
- 文書IDに対応する1トピックの内容。
- Frontmatter必須キー（id/title/doc_type/phase/version/status/owner/created/updated/up/related/tags）。
- 要求または設計の意図、受入条件、関連リンク。
- TypeScript型安全方針（`tsconfig` 基準、`any` 抑止、`unknown` 境界、lintゲート）。
- 防御的型付け方針（Brand/Opaque、判別可能union、`NonEmptyArray`、センチネル値禁止、`boolean` blindness回避、unsafe cast局所化）。
- CDKビルド方針（`cdk synth` 決定性、`cdk.context.json` 差分管理、`aws-cdk-lib`/`constructs` 整合、`cdk-nag` ゲート）。
- Next.js本番品質ゲート（`next build` + `next start`、Web Vitals、bundle analyzer、`next/image` / `<Script>` 運用）。
- Next.jsキャッシュ/再検証方針（`cache` / `revalidate` / `tags`、`revalidatePath` / `revalidateTag`）。
- `## 変更履歴` への当日追記。

## 何を書かないべきか
- 複数トピックの混在。
- 本文での上位/下位セクション（関係はfrontmatterのみ）。
- Mermaid以外の図表形式。

## Frontmatter運用
- `phase` は ID prefix と一致させる。
- `owner` は `RQ-SH-*` を使う。
- 意味変更時は `version` をPATCH更新する。
- `updated` は作業日へ更新する。

## 品質チェック
- `filename == id` を維持する。
- `up/related` のリンク先が存在することを確認する。
- TypeScript型安全を扱う場合、`strict`/`noUncheckedIndexedAccess`/`exactOptionalPropertyTypes`/`useUnknownInCatchVariables` の4設定を明記する。
- `@typescript-eslint/no-explicit-any` と `@typescript-eslint/consistent-type-imports` を受入条件へ含める。
- 外部入力境界を `unknown` で受け、絞り込み後に内部型へ変換する手順を記載する。
- センチネル値（`null`/`-1`/`NaN`）禁止と `Option/Result` 相当の分岐強制方針を受入条件に含める。
- `boolean` 状態を union/enum へ置換する方針、および `switch` + `never` 網羅性チェックを記載する。
- 非空前提処理の型化（`NonEmptyArray` 相当）または事前検証を品質ゲートに含める。
- `as any` など unsafe cast を層境界へ限定し、理由と除去計画の記録を受入条件に含める。
- 明示解放が必要な資源に `using` または `try/finally` を要求する。
- CDKを扱う場合、`synth` で外部副作用を発生させない原則、`cdk.context.json` のコミット運用、Construct/Stack内部での `process.env` 直参照禁止を記載する。
- CDK変更時の最低品質ゲート（`lint` / `test` / `cdk synth` / `cdk-nag`）を受入条件へ含める。
- Next.js を扱う場合、`next build` と `next start` を連続実行する本番相当ゲートを受入条件へ含める。
- Dynamic API 利用箇所（`cookies`/`headers`/`searchParams`）と、意図しない全体Dynamic Rendering化の回避方針を確認する。
- `next/image` の寸法指定、`<Script>` 利用、bundle analyzer 実行、`useReportWebVitals` 収集を品質チェックへ含める。
- 変更後に `python3 .opencode/skills/obsidian-doc-new/scripts/auto_link_glossary.py <対象Markdownパス>` を実行し、用語（`RQ-GL-*`）をObsidianリンクへ自動変換する。
- 変更後に `python3 .opencode/skills/obsidian-doc-check/scripts/validate_vault.py --docs-root docs --report reports/doc_check.md` を実行し `reports/doc_check.md` を更新する。

## 出力契約
- 出力は `BD-BUILD-*` 1ファイルのみを対象とし、1トピック原則を守る。
- Frontmatter必須キーを完備し、`phase: BD`・`owner: RQ-SH-*`・`updated` 当日を満たす。
- 本文は「ビルド方針/品質ゲート/受入基準」を含み、TypeScript型安全を扱う場合は `tsconfig` 4設定・`any` 抑止・`unknown` 境界の整合が取れている。
- 防御的型付けを扱う場合、Brand/Opaque、判別可能union、センチネル禁止、`NonEmptyArray` 相当、unsafe cast局所化、資源解放保証の整合が取れている。
- CDKを扱う場合は、決定性・依存整合・context固定・セキュリティゲートの整合が取れている。
- Next.jsを扱う場合は、App Router境界、キャッシュ再検証、本番品質ゲート、画像/スクリプト最適化の整合が取れている。
