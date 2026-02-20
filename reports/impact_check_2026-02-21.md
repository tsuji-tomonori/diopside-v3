## 実施内容（DD-INF章再編）
- 対象: `docs/3.詳細設計(DD)/03.インフラ(INF)` の章構成を、横断設計 + サービス別詳細 + 運用詳細へ再編。
- 新規追加:
  - `00.総論(OVR)/DD-INF-OVR-001`
  - `20.配信基盤(CF)/DD-INF-CF-001`, `DD-INF-CF-002`
  - `30.ストレージ(S3)/DD-INF-S3-001`
  - `40.API実行基盤(API)/DD-INF-LMB-001`, `DD-INF-DB-001`
  - `50.認証基盤(COG)/DD-INF-COG-001`
  - `70.統制と監査(GOV)/DD-INF-CFG-001`
- 既存文書の責務再定義:
  - `DD-INF-DEP-001/002/003` を「設定値正本」から「デプロイ適用条件・配備手順」へ限定。
  - `DD-INF-SEC-001` を `90.復旧(DR)` へ移設（ID維持）。
  - `DD-INF-SEC-002` を `70.統制と監査(GOV)` へ移設（ID維持）。

## 影響確認
- ObsidianリンクはID参照中心のため、移設した2文書（`DD-INF-SEC-001`, `DD-INF-SEC-002`）のリンク解決は維持される。
- CloudFront/S3/Lambda/Cognito/Config/DBの設定値正本が追加され、`BD-INF-PLAT-001` の「管理対象8サービス」とDD実装値の対応が追跡しやすくなる。
- `DD-INF-DEP-002` の内容重複を削減し、CloudFront仕様参照先を `DD-INF-CF-001/002` へ統一した。

## 検証
- `task docs:guard` でfrontmatter/リンク/章再編後の整合を確認する。
- 必要に応じて `task docs:check` を実行し、Vault全体整合を確認する。
