## 実施内容
- 対象: 初見読解時の矛盾解消（データ正本・API語彙・ヘルス経路）と読解導線の補強。
- 要求更新:
  - `RQ-RDR-046` を新規追加し、データ正本をRDBへ統一する判断を記録。
  - `RQ-SUS-001` / `RQ-AV-003` / `RQ-SEC-003` をRDB前提へ整合。
  - `RQ-OBY-002` のヘルスチェック経路を `/api/v1/ops/diagnostics/health` へ統一。
  - `RQ-DEV-001` を方式非依存の要件粒度へ整理。
  - `RQ-RDR-045` にRDB統一判断（`RQ-RDR-046`）への正本参照を追記。
- 設計更新:
  - `BD-SYS-ADR-034` を新規追加し、API契約語彙とヘルス経路の統一判断を記録。
  - `BD-SYS-ARCH-001` に上から読む前提の読解導線を追加。
  - `BD-APP-API-001` / `BD-APP-API-002` に `snake_case` 契約正本と語彙整合を追記。
  - `DD-APP-API-001` / `DD-APP-API-002` / `DD-APP-DB-010` / `DD-INF-DEP-003` を正本語彙へ整合。
  - `BD-INF-DEP-005` / `DD-INF-SEC-001` / `IT-INF-NET-001` / `IT-INF-SMK-001` のヘルス確認経路を統一。
  - `index.md` に推奨読書順（RQ -> BD -> DD）を追加。

## 影響確認
- データ正本: RQ/BD/DDでRDB前提へ統一し、DynamoDB単独前提の読解分岐を解消。
- API契約: `snake_case` と `run_kind` 3値の正本を固定し、BD/DDで一致。
- 運用経路: ヘルスチェックの参照経路を `/api/v1/ops/diagnostics/health` に一本化。
- 読解導線: `index.md` と `BD-SYS-ARCH-001` で論理設計/物理配置設計への到達順を明示。

## 検証
- `task docs:trace` を実行し、静的RTMビューを再生成する。
- `task docs:guard` を実行し、変更文書のリンク・frontmatter・参照整合を確認する。
